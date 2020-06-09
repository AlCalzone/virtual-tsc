import { InMemoryHost } from "./host";
import { CompileResult, Diagnostic, repeatString, getTypeScript } from "./util";
import { VirtualFileSystem } from "./virtual-fs";
import type { CompilerOptions as tsCompilerOptions } from "typescript";

const SCRIPT_FILENAME: string = "__virtual-tsc__.ts";

export function compileAsync(
	script: string,
	compilerOptions?: tsCompilerOptions,
	declarations: {[filename: string]: string} = {},
): Promise<CompileResult> {
	return new Promise<CompileResult>((res, rej) => {
		setImmediate(() => {
			try {
				const ret = compile(script, compilerOptions, declarations);
				res(ret);
			} catch (e) {
				rej(e);
			}
		});
	});
}

export function compile(
	script: string, 
	compilerOptions?: tsCompilerOptions, 
	ambientDeclarations: {[filename: string]: string} = {},
): CompileResult {
	const ts = getTypeScript();
	const sourceLines = script.split("\n");

	// set default compiler options
	compilerOptions = compilerOptions || {};
	compilerOptions.moduleResolution = ts.ModuleResolutionKind.NodeJs;
	// Don't emit faulty code (by default)
	if (compilerOptions.noEmitOnError == null) compilerOptions.noEmitOnError = true;
	// emit declarations if possible
	if (compilerOptions.declaration == null) compilerOptions.declaration = true;

	// According to https://github.com/Microsoft/TypeScript/issues/24444#issuecomment-392970120
	// combining noEmitOnError=true and declaration=true massively increases the work done
	// by the compiler. To work around it, we call the compiler with noEmitOnError=false
	// and use the actual value to determine if we continue with the emit
	const internalOptions = Object.assign({}, compilerOptions, {
		noEmitOnError: false,
	} as tsCompilerOptions);

	// provide the source file in the virtual fs
	const fs = new VirtualFileSystem();
	fs.writeFile(SCRIPT_FILENAME, script);
	// provide all ambient declaration files
	for (const ambientFile of Object.keys(ambientDeclarations)) {
		if (!/\.d\.ts$/.test(ambientFile)) throw new Error("Declarations must be .d.ts-files");
		fs.writeFile(ambientFile, ambientDeclarations[ambientFile], true);
	}

	// create the virtual host
	const host = new InMemoryHost(fs, internalOptions);
	// create the compiler and provide nodejs typings
	const allFiles = [
		"@types/node/index.d.ts",
		...Object.keys(ambientDeclarations),
		SCRIPT_FILENAME,
	];
	const program = ts.createProgram(allFiles, internalOptions, host);

	// compile the script
	const emitResult = program.emit();

	// diagnose the compilation result
	const rawDiagnostics = internalOptions.noEmitOnError ? emitResult.diagnostics : ts.getPreEmitDiagnostics(program);
	const diagnostics = rawDiagnostics.map(diagnostic => {
		let lineNr = 0;
		let charNr = 0;
		if (diagnostic.file != null) {
			const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
			[lineNr, charNr] = [line, character];
		}
		const description = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
		const type = ts.DiagnosticCategory[diagnostic.category].toLowerCase() as "error" | "warning" | "message";
		const sourceLine = sourceLines[lineNr];
		const annotatedSource = `${sourceLine}
${repeatString(" ", charNr)}^
${type.toUpperCase()}: ${description}`;
		return {
			type,
			lineNr: lineNr + 1,
			charNr: charNr + 1,
			sourceLine,
			description,
			annotatedSource,
		} as Diagnostic;
	});

	const hasError = (
		(
			diagnostics.find(d => d.type === "error") != null
			|| (emitResult.emitSkipped && !compilerOptions.emitDeclarationOnly)
		)
		&& compilerOptions.noEmitOnError
	);
	let result: string;
	const resultFilename = SCRIPT_FILENAME.replace(/ts$/, "js");
	let declarations: string;
	const declarationsFilename = SCRIPT_FILENAME.replace(/ts$/, "d.ts");
	if (!hasError && fs.fileExists(resultFilename)) result = fs.readFile(resultFilename);
	if (!hasError && fs.fileExists(declarationsFilename)) declarations = fs.readFile(declarationsFilename);

	return {
		success: !hasError,
		diagnostics,
		result,
		declarations,
	};
}
