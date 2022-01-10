"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
var nodePath = __importStar(require("path"));
var logger_1 = require("./logger");
var service_host_1 = require("./service-host");
var util_1 = require("./util");
var virtual_fs_1 = require("./virtual-fs");
var Server = /** @class */ (function () {
    function Server(options, customLogger) {
        this.options = options;
        this.ts = util_1.getTypeScript();
        if (customLogger != null)
            logger_1.setCustomLogger(customLogger);
        // set default compiler options
        this.options = this.options || {};
        this.options.moduleResolution = this.ts.ModuleResolutionKind.NodeJs;
        // Don't emit faulty code (by default)
        if (this.options.noEmitOnError == null)
            this.options.noEmitOnError = true;
        // emit declarations if possible
        if (this.options.declaration == null)
            this.options.declaration = true;
        // According to https://github.com/Microsoft/TypeScript/issues/24444#issuecomment-392970120
        // combining noEmitOnError=true and declaration=true massively increases the work done
        // by the compiler. To work around it, we call the compiler with noEmitOnError=false
        // and use the actual value to determine if we continue with the emit
        var internalOptions = Object.assign({}, this.options, {
            noEmitOnError: false,
        });
        // set up the build pipeline
        this.fs = new virtual_fs_1.VirtualFileSystem();
        this.host = new service_host_1.InMemoryServiceHost(this.fs, internalOptions);
        this.service = this.ts.createLanguageService(this.host, this.ts.createDocumentRegistry());
        // provide the requested lib files
        if (!options.noLib) {
            var libFiles = util_1.enumLibFiles();
            for (var _i = 0, libFiles_1 = libFiles; _i < libFiles_1.length; _i++) {
                var file = libFiles_1[_i];
                var fileContent = this.ts.sys.readFile(file);
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
            var fileContent = this.ts.sys.readFile(path);
            if (fileContent != null)
                this.fs.writeFile(typings, fileContent, true);
        }
    }
    Server.prototype.provideAmbientDeclarations = function (declarations) {
        if (declarations === void 0) { declarations = {}; }
        // provide all ambient declaration files
        for (var _i = 0, _a = Object.keys(declarations); _i < _a.length; _i++) {
            var ambientFile = _a[_i];
            if (!ambientFile.endsWith(".d.ts") && !ambientFile.endsWith("package.json")) {
                throw new Error("Declarations must be .d.ts or package.json files");
            }
            this.fs.writeFile(ambientFile, declarations[ambientFile], true);
        }
    };
    Server.prototype.compile = function (filename, scriptContent) {
        var _this = this;
        var sourceLines = scriptContent.split("\n");
        this.fs.writeFile(filename, scriptContent, true);
        var rawDiagnostics = [];
        rawDiagnostics.push.apply(rawDiagnostics, this.service.getSyntacticDiagnostics(filename));
        rawDiagnostics.push.apply(rawDiagnostics, this.service.getSemanticDiagnostics(filename));
        var emitResult = this.service.getEmitOutput(filename);
        rawDiagnostics.push.apply(rawDiagnostics, this.service.getCompilerOptionsDiagnostics());
        var diagnostics = rawDiagnostics.map(function (diagnostic) {
            var _a;
            var lineNr = 0;
            var charNr = 0;
            if (diagnostic.file != null) {
                var _b = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start), line = _b.line, character = _b.character;
                _a = [line, character], lineNr = _a[0], charNr = _a[1];
            }
            var description = _this.ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
            var type = _this.ts.DiagnosticCategory[diagnostic.category].toLowerCase();
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
        });
        var hasError = ((diagnostics.find(function (d) { return d.type === "error"; }) != null
            || (emitResult.emitSkipped && !this.options.emitDeclarationOnly))
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
