"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var service_host_1 = require("./service-host");
var util_1 = require("./util");
var virtual_fs_1 = require("./virtual-fs");
var Server = (function () {
    function Server(options) {
        this.options = options;
        // set default compiler options
        this.options = this.options || {};
        if (this.options.noEmitOnError == null)
            this.options.noEmitOnError = true;
        this.options.moduleResolution = ts.ModuleResolutionKind.NodeJs;
        // set up the build pipeline
        this.fs = new virtual_fs_1.VirtualFileSystem();
        this.host = new service_host_1.InMemoryServiceHost(this.fs, this.options);
        this.service = ts.createLanguageService(this.host, ts.createDocumentRegistry());
        // provide the most basic typings
        var basicTypings = [
            "@types/node/index.d.ts",
            "@types/node/inspector.d.ts",
        ];
        for (var _i = 0, basicTypings_1 = basicTypings; _i < basicTypings_1.length; _i++) {
            var typings = basicTypings_1[_i];
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
        var emitResult = this.service.getEmitOutput(filename);
        var rawDiagnostics = this.service.getCompilerOptionsDiagnostics()
            .concat(this.service.getSyntacticDiagnostics(filename))
            .concat(this.service.getSemanticDiagnostics(filename));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVyLmpzIiwic291cmNlUm9vdCI6IkQ6L3ZpcnR1YWwtdHNjL3NyYy8iLCJzb3VyY2VzIjpbInNlcnZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLCtCQUFpQztBQUNqQywrQ0FBcUQ7QUFDckQsK0JBQWlGO0FBQ2pGLDJDQUFpRDtBQUVqRDtJQU1DLGdCQUFvQixPQUE0QjtRQUE1QixZQUFPLEdBQVAsT0FBTyxDQUFxQjtRQUMvQywrQkFBK0I7UUFDL0IsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQztRQUNsQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsSUFBSSxJQUFJLENBQUM7WUFBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7UUFDMUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsR0FBRyxFQUFFLENBQUMsb0JBQW9CLENBQUMsTUFBTSxDQUFDO1FBRS9ELDRCQUE0QjtRQUM1QixJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksOEJBQWlCLEVBQUUsQ0FBQztRQUNsQyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksa0NBQW1CLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDM0QsSUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsc0JBQXNCLEVBQUUsQ0FBQyxDQUFDO1FBRWhGLGlDQUFpQztRQUNqQyxJQUFNLFlBQVksR0FBRztZQUNwQix3QkFBd0I7WUFDeEIsNEJBQTRCO1NBQzVCLENBQUM7UUFDRixHQUFHLENBQUMsQ0FBa0IsVUFBWSxFQUFaLDZCQUFZLEVBQVosMEJBQVksRUFBWixJQUFZO1lBQTdCLElBQU0sT0FBTyxxQkFBQTtZQUNqQixtQ0FBbUM7WUFDbkMsSUFBTSxJQUFJLEdBQUcscUJB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