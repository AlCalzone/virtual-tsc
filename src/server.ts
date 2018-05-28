import * as nodePath from "path";
import * as ts from "typescript";
import { log, LoggerFunction, setCustomLogger } from "./logger";
import { InMemoryServiceHost } from "./service-host";
import { CompileResult, Diagnostic, enumLibFiles, repeatString, resolveLib, resolveTypings } from "./util";
import { VirtualFileSystem } from "./virtual-fs";

export class Server {

	private service: ts.LanguageService;
	private fs: VirtualFileSystem;
	private host: InMemoryServiceHost;

	constructor(
		private options?: ts.CompilerOptions,
		customLogger?: LoggerFunction,
	) {

		if (customLogger != null) setCustomLogger(customLogger);

		// set default compiler options
		this.options = this.options || {};
		// TODO: We would like this to be true, but there's a bit performance hit
		/* if (this.options.noEmitOnError == null) */ this.options.noEmitOnError = false;
		// emit declarations if possible
		if (this.options.declaration == null) this.options.declaration = true;
		this.options.moduleResolution = ts.ModuleResolutionKind.NodeJs;

		// set up the build pipeline
		this.fs = new VirtualFileSystem();
		this.host = new InMemoryServiceHost(this.fs, this.options);
		this.service = ts.createLanguageService(this.host, ts.createDocumentRegistry());

		// provide the requested lib files
		if (!options.noLib) {
			const libFiles = enumLibFiles();
			for (const file of libFiles) {
				const fileContent = ts.sys.readFile(file);
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
			const fileContent = ts.sys.readFile(path);
			if (fileContent != null) this.fs.writeFile(typings, fileContent, true);
		}
	}

	public provideAmbientDeclarations(declarations: { [filename: string]: string } = {}) {
		// provide all ambient declaration files
		for (const ambientFile of Object.keys(declarations)) {
			if (!/\.d\.ts$/.test(ambientFile)) throw new Error("Declarations must be .d.ts-files");
			this.fs.writeFile(ambientFile, declarations[ambientFile], true);
		}
	}

	public compile(filename: string, scriptContent: string): CompileResult {
		const sourceLines = scriptContent.split("\n");
		this.fs.writeFile(filename, scriptContent, true);

		const rawDiagnostics: ts.Diagnostic[] = [];
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
				!diagnostics.every(d => d.type !== "error") ||
				(emitResult.emitSkipped && !this.options.emitDeclarationOnly)
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
