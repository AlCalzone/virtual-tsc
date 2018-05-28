"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var logger_1 = require("./logger");
var service_host_1 = require("./service-host");
var util_1 = require("./util");
var virtual_fs_1 = require("./virtual-fs");
var Server = /** @class */ (function () {
    function Server(options, customLogger) {
        this.options = options;
        if (customLogger != null)
            logger_1.setCustomLogger(customLogger);
        // set default compiler options
        this.options = this.options || {};
        if (this.options.noEmitOnError == null)
            this.options.noEmitOnError = true;
        // emit declarations if possible
        if (this.options.declaration == null)
            this.options.declaration = true;
        this.options.moduleResolution = ts.ModuleResolutionKind.NodeJs;
        // set up the build pipeline
        this.fs = new virtual_fs_1.VirtualFileSystem();
        var createProgram = ts.createEmitAndSemanticDiagnosticsBuilderProgram;
        // this.host = new InMemoryServiceHost(this.fs, this.options);
        this.host = new service_host_1.InMemoryWatcherHost(createProgram, this.fs, this.options);
        // this.service = ts.createLanguageService(this.host, ts.createDocumentRegistry());
        // provide the requested lib files
        if (!options.noLib) {
            // const libFiles = options.lib || [this.host.getDefaultLibFileName(options)];
            var libFiles = util_1.enumLibFiles();
            for (var _i = 0, libFiles_1 = libFiles; _i < libFiles_1.length; _i++) {
                var file = libFiles_1[_i];
                var path = util_1.resolveLib(file);
                if (path == null)
                    continue;
                var fileContent = ts.sys.readFile(path);
                if (fileContent != null)
                    this.fs.writeFile(file, fileContent, true);
            }
        }
        // provide the most basic typings
        var basicTypings = [
            "@types/node/index.d.ts",
            "@types/node/inspector.d.ts",
        ];
        for (var _a = 0, basicTypings_1 = basicTypings; _a < basicTypings_1.length; _a++) {
            var typings = basicTypings_1[_a];
            // resolving a specific node module
            var path = util_1.resolveTypings(typings);
            var fileContent = ts.sys.readFile(path);
            if (fileContent != null)
                this.fs.writeFile(typings, fileContent, true);
        }
    }
    Server.prototype.provideAmbientDeclarations = function (declarations) {
        if (declarations === void 0) { declarations = {}; }
        // provide all ambient declaration files
        for (var _i = 0, _a = Object.keys(declarations); _i < _a.length; _i++) {
            var ambientFile = _a[_i];
            if (!/\.d\.ts$/.test(ambientFile))
                throw new Error("Declarations must be .d.ts-files");
            this.fs.writeFile(ambientFile, declarations[ambientFile], true);
        }
    };
    Server.prototype.compile = function (filename, scriptContent) {
        var sourceLines = scriptContent.split("\n");
        this.fs.writeFile(filename, scriptContent, true);
        ts.createWatchProgram(this.host);
        return undefined;
        // 		const rawDiagnostics: ts.Diagnostic[] = [];
        // 		rawDiagnostics.push(...this.service.getSyntacticDiagnostics(filename));
        // 		rawDiagnostics.push(...this.service.getSemanticDiagnostics(filename));
        // 		const emitResult = this.service.getEmitOutput(filename);
        // 		rawDiagnostics.push(...this.service.getCompilerOptionsDiagnostics());
        // 		const diagnostics = rawDiagnostics.map(diagnostic => {
        // 			let lineNr = 0;
        // 			let charNr = 0;
        // 			if (diagnostic.file != null) {
        // 				const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
        // 				[lineNr, charNr] = [line, character];
        // 			}
        // 			const description = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
        // 			const type = ts.DiagnosticCategory[diagnostic.category].toLowerCase() as "error" | "warning" | "message";
        // 			const sourceLine = sourceLines[lineNr];
        // 			const annotatedSource = `${sourceLine}
        // ${repeatString(" ", charNr)}^
        // ${type.toUpperCase()}: ${description}`;
        // 			return {
        // 				type,
        // 				lineNr: lineNr + 1,
        // 				charNr: charNr + 1,
        // 				sourceLine,
        // 				description,
        // 				annotatedSource,
        // 			} as Diagnostic;
        // 		});
        // 		const hasError = (
        // 			(
        // 				!diagnostics.every(d => d.type !== "error") ||
        // 				(emitResult.emitSkipped && !this.options.emitDeclarationOnly)
        // 			)
        // 			&& this.options.noEmitOnError
        // 		);
        // 		let result: string;
        // 		let declarations: string;
        // 		if (!hasError) {
        // 			const resultFile = emitResult.outputFiles.find(f => f.name.endsWith(".js"));
        // 			if (resultFile != null) result = resultFile.text;
        // 			const declarationFile = emitResult.outputFiles.find(f => f.name.endsWith(".d.ts"));
        // 			if (declarationFile != null) declarations = declarationFile.text;
        // 		}
        // 		return {
        // 			success: !hasError,
        // 			diagnostics,
        // 			result,
        // 			declarations,
        // 		};
    };
    return Server;
}());
exports.Server = Server;
