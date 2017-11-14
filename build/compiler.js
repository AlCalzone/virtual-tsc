"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
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
function compile(script, compilerOptions, declarations) {
    if (declarations === void 0) { declarations = {}; }
    var sourceLines = script.split("\n");
    // set default compiler options
    compilerOptions = compilerOptions || {};
    if (compilerOptions.noEmitOnError == null)
        compilerOptions.noEmitOnError = true;
    compilerOptions.moduleResolution = ts.ModuleResolutionKind.NodeJs;
    // provide the source file in the virtual fs
    var fs = new virtual_fs_1.VirtualFileSystem();
    fs.writeFile(SCRIPT_FILENAME, script);
    // provide all ambient declaration files
    for (var _i = 0, _a = Object.keys(declarations); _i < _a.length; _i++) {
        var ambientFile = _a[_i];
        if (!/\.d\.ts$/.test(ambientFile))
            throw new Error("Declarations must be .d.ts-files");
        fs.writeFile(ambientFile, declarations[ambientFile], true);
    }
    // create the virtual host
    var host = new host_1.InMemoryHost(fs, compilerOptions);
    // create the compiler and provide nodejs typings
    var allFiles = [
        "@types/node/index.d.ts"
    ].concat(Object.keys(declarations), [
        SCRIPT_FILENAME,
    ]);
    var program = ts.createProgram(allFiles, compilerOptions, host);
    // compile the script
    var emitResult = program.emit();
    // diagnose the compilation result
    var rawDiagnostics = compilerOptions.noEmitOnError ? emitResult.diagnostics : ts.getPreEmitDiagnostics(program);
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
        && compilerOptions.noEmitOnError);
    var result;
    if (!hasError)
        result = fs.readFile(SCRIPT_FILENAME.replace(/ts.?$/, "js"));
    return {
        success: !hasError,
        diagnostics: diagnostics,
        result: result,
    };
}
exports.compile = compile;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZXIuanMiLCJzb3VyY2VSb290IjoiQzovVXNlcnMvRG9taW5pYy9Eb2N1bWVudHMvVmlzdWFsIFN0dWRpbyAyMDE3L1JlcG9zaXRvcmllcy92aXJ0dWFsLXRzYy9zcmMvIiwic291cmNlcyI6WyJjb21waWxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLCtCQUFpQztBQUNqQywrQkFBc0M7QUFDdEMsK0JBQWlFO0FBQ2pFLDJDQUFpRDtBQUVqRCxJQUFNLGVBQWUsR0FBVyxvQkFBb0IsQ0FBQztBQUVyRCxzQkFBNkIsTUFBYyxFQUFFLGVBQW9DLEVBQUUsWUFBK0M7SUFBL0MsNkJBQUEsRUFBQSxpQkFBK0M7SUFDakksTUFBTSxDQUFDLElBQUksT0FBTyxDQUFnQixVQUFDLEdBQUcsRUFBRSxHQUFHO1FBQzFDLFlBQVksQ0FBQztZQUNaLElBQUksQ0FBQztnQkFDSixJQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLGVBQWUsRUFBRSxZQUFZLENBQUMsQ0FBQztnQkFDM0QsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ1YsQ0FBQztZQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ1osR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ1IsQ0FBQztRQUNGLENBQUMsQ0FBQyxDQUFDO0lBQ0osQ0FBQyxDQUFDLENBQUM7QUFDSixDQUFDO0FBWEQsb0NBV0M7QUFFRCxpQkFBd0IsTUFBYyxFQUFFLGVBQW9DLEVBQUUsWUFBK0M7SUFBL0MsNkJBQUEsRUFBQSxpQkFBK0M7SUFDNUgsSUFBTSxXQUFXLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUV2QywrQkFBK0I7SUFDL0IsZUFBZSxHQUFHLGVBQWUsSUFBSSxFQUFFLENBQUM7SUFDeEMsRUFBRSxDQUFDLENBQUMsZUFBZSxDQUFDLGFBQWEsSUFBSSxJQUFJLENBQUM7UUFBQyxlQUFlLENBQUMsYUFBYSxHQUFH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