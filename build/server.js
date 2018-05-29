"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var nodePath = require("path");
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
        // TODO: We would like this to be true, but there's a bit performance hit
        /* if (this.options.noEmitOnError == null) */ this.options.noEmitOnError = false;
        // emit declarations if possible
        if (this.options.declaration == null)
            this.options.declaration = true;
        this.options.moduleResolution = ts.ModuleResolutionKind.NodeJs;
        // set up the build pipeline
        this.fs = new virtual_fs_1.VirtualFileSystem();
        this.host = new service_host_1.InMemoryServiceHost(this.fs, this.options);
        this.service = ts.createLanguageService(this.host, ts.createDocumentRegistry());
        // provide the requested lib files
        if (!options.noLib) {
            var libFiles = util_1.enumLibFiles();
            for (var _i = 0, libFiles_1 = libFiles; _i < libFiles_1.length; _i++) {
                var file = libFiles_1[_i];
                var fileContent = ts.sys.readFile(file);
                if (fileContent != null)
                    this.fs.writeFile(nodePath.basename(file), fileContent, true);
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
        var rawDiagnostics = [];
        rawDiagnostics.push.apply(rawDiagnostics, this.service.getSyntacticDiagnostics(filename));
        rawDiagnostics.push.apply(rawDiagnostics, this.service.getSemanticDiagnostics(filename));
        var emitResult = this.service.getEmitOutput(filename);
        rawDiagnostics.push.apply(rawDiagnostics, this.service.getCompilerOptionsDiagnostics());
        var diagnostics = rawDiagnostics.map(function (diagnostic) {
            var lineNr = 0;
            var charNr = 0;
            if (diagnostic.file != null) {
                var _a = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start), line = _a.line, character = _a.character;
                _b = [line, character], lineNr = _b[0], charNr = _b[1];
            }
            var description = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
            var type = ts.DiagnosticCategory[diagnostic.category].toLowerCase();
            var sourceLine = sourceLines[lineNr];
            var annotatedSource = sourceLine + "\n" + util_1.repeatString(" ", charNr) + "^\n" + type.toUpperCase() + ": " + description;
            return {
                type: type,
                lineNr: lineNr + 1,
                charNr: charNr + 1,
                sourceLine: sourceLine,
                description: description,
                annotatedSource: annotatedSource,
            };
            var _b;
        });
        var hasError = ((!diagnostics.every(function (d) { return d.type !== "error"; }) ||
            (emitResult.emitSkipped && !this.options.emitDeclarationOnly))
            && this.options.noEmitOnError);
        var result;
        var declarations;
        if (!hasError) {
            var resultFile = emitResult.outputFiles.find(function (f) { return f.name.endsWith(".js"); });
            if (resultFile != null)
                result = resultFile.text;
            var declarationFile = emitResult.outputFiles.find(function (f) { return f.name.endsWith(".d.ts"); });
            if (declarationFile != null)
                declarations = declarationFile.text;
        }
        return {
            success: !hasError,
            diagnostics: diagnostics,
            result: result,
            declarations: declarations,
        };
    };
    return Server;
}());
exports.Server = Server;
