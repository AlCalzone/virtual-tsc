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
        this.options.moduleResolution = ts.ModuleResolutionKind.NodeJs;
        // set up the build pipeline
        this.fs = new virtual_fs_1.VirtualFileSystem();
        this.host = new service_host_1.InMemoryServiceHost(this.fs, this.options);
        this.service = ts.createLanguageService(this.host, ts.createDocumentRegistry());
        // provide the requested lib files
        if (!options.noLib) {
            var libFiles = options.lib || [this.host.getDefaultLibFileName(options)];
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
        var hasError = ((!diagnostics.every(function (d) { return d.type !== "error"; }) || emitResult.emitSkipped)
            && this.options.noEmitOnError);
        var result;
        if (!hasError)
            result = emitResult.outputFiles[0].text;
        return {
            success: !hasError,
            diagnostics: diagnostics,
            result: result,
        };
    };
    return Server;
}());
exports.Server = Server;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVyLmpzIiwic291cmNlUm9vdCI6IkM6L1VzZXJzL0RvbWluaWMvRG9jdW1lbnRzL1Zpc3VhbCBTdHVkaW8gMjAxNy9SZXBvc2l0b3JpZXMvdmlydHVhbC10c2Mvc3JjLyIsInNvdXJjZXMiOlsic2VydmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsK0JBQWlDO0FBQ2pDLG1DQUFnRTtBQUNoRSwrQ0FBcUQ7QUFDckQsK0JBQTZGO0FBQzdGLDJDQUFpRDtBQUVqRDtJQU1DLGdCQUNTLE9BQTRCLEVBQ3BDLFlBQTZCO1FBRHJCLFlBQU8sR0FBUCxPQUFPLENBQXFCO1FBSXBDLEVBQUUsQ0FBQyxDQUFDLFlBQVksSUFBSSxJQUFJLENBQUM7WUFBQyx3QkFBZSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBRXhELCtCQUErQjtRQUMvQixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDO1FBQ2xDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxJQUFJLElBQUksQ0FBQztZQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztRQUMxRSxJQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFnQixHQUFHLEVBQUUsQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLENBQUM7UUFFL0QsNEJBQTRCO1FBQzVCLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSw4QkFBaUIsRUFBRSxDQUFDO1FBQ2xDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxrQ0FBbUIsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMzRCxJQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxzQkFBc0IsRUFBRSxDQUFDLENBQUM7UUFFaEYsa0NBQWtDO1FBQ2xDLEVBQUUsQ0FBQyxDQUFDLENB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