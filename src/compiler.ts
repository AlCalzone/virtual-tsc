import * as ts from "typescript";
import * as util from "util";
import { InMemoryHost } from "./host";
import { VirtualFileSystem } from "./virtual-fs";

const SCRIPT_FILENAME: string = "__virtual-tsc__.ts";

export interface Diagnostic {
	type: "error" | "warning" | "message";
	lineNr: number;
	charNr: number;
	sourceLine: string;
	description: string;
	annotatedSource: string;
}

function repeatString(str: string, count: number): string {
	if (str.repeat != null) return str.repeat(count);
	let ret = "";
	for (let i = 0; i < count; i++) ret += str;
	return ret;
}

export interface CompileResult {
	success: boolean;
	diagnostics: Diagnostic[];
	result?: string;
}

export function compile(script: string, compilerOptions?: ts.CompilerOptions, declarations: {[filename: string]: string} = {}): CompileResult {
	const sourceLines = script.split("\n");

	// set default compiler options
	compilerOptions = compilerOptions || {};
	compilerOptions.noEmitOnError = true;
	compilerOptions.moduleResolution = ts.ModuleResolutionKind.NodeJs;

	// provide the source file in the virtual fs
	const fs = new VirtualFileSystem();
	fs.writeFile(SCRIPT_FILENAME, script);
	// provide all ambient declaration files
	for (const ambientFile of Object.keys(declarations)) {
		if (!/\.d\.ts$/.test(ambientFile)) throw new Error("Declarations must be .d.ts-files");
		fs.writeFile(ambientFile, declarations[ambientFile], true);
	}

	// create the virtual host
	const host = new InMemoryHost(fs, compilerOptions);
	// create the compiler and provide nodejs typings
	const allFiles = [
		"node_modules/@types/node/index.d.ts",
		...Object.keys(declarations),
		SCRIPT_FILENAME,
	];
	const program = ts.createProgram(allFiles, compilerOptions, host);

	// compile the script
	const emitResult = program.emit();

	// diagnose the compilation result
	const allDiagnostics = emitResult.diagnostics
	.map(diagnostic => {
		const { line: lineNr, character: charNr } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
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

	const hasError = !allDiagnostics.every(d => d.type !== "error") || emitResult.emitSkipped;
	let result: string;
	if (!hasError) result = fs.readFile(SCRIPT_FILENAME.replace(/ts.?$/, "js"));

	return {
		success: !hasError,
		diagnostics: allDiagnostics,
		result: result,
	};
}
