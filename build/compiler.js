"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compile = exports.compileAsync = void 0;
var host_1 = require("./host");
var util_1 = require("./util");
var virtual_fs_1 = require("./virtual-fs");
var SCRIPT_FILENAME = "__virtual-tsc__.ts";
function compileAsync(script, compilerOptions, declarations) {
    if (declarations === void 0) { declarations = {}; }
    return new Promise(function (res, rej) {
        setImmediate(function () {
            try {
                var ret = compile(script, compilerOptions, declarations);
                res(ret);
            }
            catch (e) {
                rej(e);
            }
        });
    });
}
exports.compileAsync = compileAsync;
function compile(script, compilerOptions, ambientDeclarations) {
    if (ambientDeclarations === void 0) { ambientDeclarations = {}; }
    var ts = util_1.getTypeScript();
    var sourceLines = script.split("\n");
    // set default compiler options
    compilerOptions = compilerOptions || {};
    compilerOptions.moduleResolution = ts.ModuleResolutionKind.NodeJs;
    // Don't emit faulty code (by default)
    if (compilerOptions.noEmitOnError == null)
        compilerOptions.noEmitOnError = true;
    // emit declarations if possible
    if (compilerOptions.declaration == null)
        compilerOptions.declaration = true;
    // According to https://github.com/Microsoft/TypeScript/issues/24444#issuecomment-392970120
    // combining noEmitOnError=true and declaration=true massively increases the work done
    // by the compiler. To work around it, we call the compiler with noEmitOnError=false
    // and use the actual value to determine if we continue with the emit
    var internalOptions = Object.assign({}, compilerOptions, {
        noEmitOnError: false,
    });
    // provide the source file in the virtual fs
    var fs = new virtual_fs_1.VirtualFileSystem();
    fs.writeFile(SCRIPT_FILENAME, script);
    // provide all ambient declaration files
    for (var _i = 0, _a = Object.keys(ambientDeclarations); _i < _a.length; _i++) {
        var ambientFile = _a[_i];
        if (!/\.d\.ts$/.test(ambientFile))
            throw new Error("Declarations must be .d.ts-files");
        fs.writeFile(ambientFile, ambientDeclarations[ambientFile], true);
    }
    // create the virtual host
    var host = new host_1.InMemoryHost(fs, internalOptions);
    // create the compiler and provide nodejs typings
    var allFiles = __spreadArrays([
        "@types/node/index.d.ts"
    ], Object.keys(ambientDeclarations), [
        SCRIPT_FILENAME,
    ]);
    var program = ts.createProgram(allFiles, internalOptions, host);
    // compile the script
    var emitResult = program.emit();
    // diagnose the compilation result
    var rawDiagnostics = internalOptions.noEmitOnError ? emitResult.diagnostics : ts.getPreEmitDiagnostics(program);
    var diagnostics = rawDiagnostics.map(function (diagnostic) {
        var _a;
        var lineNr = 0;
        var charNr = 0;
        if (diagnostic.file != null) {
            var _b = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start), line = _b.line, character = _b.character;
            _a = [line, character], lineNr = _a[0], charNr = _a[1];
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
    });
    var hasError = ((diagnostics.find(function (d) { return d.type === "error"; }) != null
        || (emitResult.emitSkipped && !compilerOptions.emitDeclarationOnly))
        && compilerOptions.noEmitOnError);
    var result;
    var resultFilename = SCRIPT_FILENAME.replace(/ts$/, "js");
    var declarations;
    var declarationsFilename = SCRIPT_FILENAME.replace(/ts$/, "d.ts");
    if (!hasError && fs.fileExists(resultFilename))
        result = fs.readFile(resultFilename);
    if (!hasError && fs.fileExists(declarationsFilename))
        declarations = fs.readFile(declarationsFilename);
    return {
        success: !hasError,
        diagnostics: diagnostics,
        result: result,
        declarations: declarations,
    };
}
exports.compile = compile;
