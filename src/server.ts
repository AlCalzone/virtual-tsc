import * as nodePath from "path";
import { log, LoggerFunction, setCustomLogger } from "./logger";
import { InMemoryServiceHost } from "./service-host";
import { CompileResult, Diagnostic, enumLibFiles, repeatString, resolveLib, resolveTypings, getTypeScript } from "./util";
import { VirtualFileSystem } from "./virtual-fs";
import type { LanguageService as tsLanguageService, CompilerOptions as tsCompilerOptions, Diagnostic as tsDiagnostic } from "typescript";

export class Server {

	private service: tsLanguageService;
	private fs: VirtualFileSystem;
	private host: InMemoryServiceHost;
	private ts: typeof import("typescript");

	constructor(
		private options?: tsCompilerOptions,
		customLogger?: LoggerFunction | false,
	) {
		this.ts = getTypeScript();

		if (customLogger != null) setCustomLogger(customLogger);

		// set default compiler options
		this.options = this.options || {};
		this.options.moduleResolution = this.ts.ModuleResolutionKind.NodeJs;
		// Don't emit faulty code (by default)
		if (this.options.noEmitOnError == null) this.options.noEmitOnError = true;
		// emit declarations if possible
		if (this.options.declaration == null) this.options.declaration = true;

		// According to https://github.com/Microsoft/TypeScript/issues/24444#issuecomment-392970120
		// combining noEmitOnError=true and declaration=true massively increases the work done
		// by the compiler. To work around it, we call the compiler with noEmitOnError=false
		// and use the actual value to determine if we continue with the emit
		const internalOptions = Object.assign({}, this.options, {
			noEmitOnError: false,
		} as tsCompilerOptions);

		// set up the build pipeline
		this.fs = new VirtualFileSystem();
		this.host = new InMemoryServiceHost(this.fs, internalOptions);
		this.service = this.ts.createLanguageService(this.host, this.ts.createDocumentRegistry());

		// provide the requested lib files
		if (!options.noLib) {
			const libFiles = enumLibFiles();
			for (const file of libFiles) {
				const fileContent = this.ts.sys.readFile(file);
				if (fileContent != null) this.fs.writeFile(nodePath.basename(file), fileContent, true);
			}
		}

		// provide the most basic typings
		const basicTypings = [
			"@types/node/index.d.ts",
			"@types/node/inspector.d.ts",
		];
		for (const typings of basicTypings) {
			// resolving a specific node module
			const path = resolveTypings(typings);
			const fileContent = this.ts.sys.readFile(path);
			if (fileContent != null) this.fs.writeFile(typings, fileContent, true);
		}
	}

	public provideAmbientDeclarations(declarations: { [filename: string]: string } = {}) {
		// provide all ambient declaration files
		for (const ambientFile of Object.keys(declarations)) {
			if (!ambientFile.endsWith(".d.ts") && !ambientFile.endsWith("package.json")) {
				throw new Error("Declarations must be .d.ts or package.json files");
			}
			this.fs.writeFile(ambientFile, declarations[ambientFile], true);
		}
	}

	public compile(filename: string, scriptContent: string): CompileResult {
		const sourceLines = scriptContent.split("\n");
		this.fs.writeFile(filename, scriptContent, true);

		const rawDiagnostics: tsDiagnostic[] = [];
		rawDiagnostics.push(...this.service.getSyntacticDiagnostics(filename));
		rawDiagnostics.push(...this.service.getSemanticDiagnostics(filename));

		const emitResult = this.service.getEmitOutput(filename);

		rawDiagnostics.push(...this.service.getCompilerOptionsDiagnostics());

		const diagnostics = rawDiagnostics.map(diagnostic => {
			let lineNr = 0;
			let charNr = 0;
			if (diagnostic.file != null) {
				const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
				[lineNr, charNr] = [line, character];
			}
			const description = this.ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
			const type = this.ts.DiagnosticCategory[diagnostic.category].toLowerCase() as "error" | "warning" | "message";
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
				|| (emitResult.emitSkipped && !this.options.emitDeclarationOnly)
			)
			&& this.options.noEmitOnError
		);
		let result: string;
		let declarations: string;
		if (!hasError) {
			const resultFile = emitResult.outputFiles.find(f => f.name.endsWith(".js"));
			if (resultFile != null) result = resultFile.text;
			const declarationFile = emitResult.outputFiles.find(f => f.name.endsWith(".d.ts"));
			if (declarationFile != null) declarations = declarationFile.text;
		}

		return {
			success: !hasError,
			diagnostics,
			result,
			declarations,
		};
	}
}
