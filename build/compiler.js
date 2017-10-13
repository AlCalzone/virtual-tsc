"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var host_1 = require("./host");
var virtual_fs_1 = require("./virtual-fs");
var SCRIPT_FILENAME = "__virtual-tsc__.ts";
function repeatString(str, count) {
    // newer node versions
    if (str.repeat != null)
        return str.repeat(count);
    // older node versions
    var ret = "";
    for (var i = 0; i < count; i++)
        ret += str;
    return ret;
}
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
        var annotatedSource = sourceLine + "\n" + repeatString(" ", charNr) + "^\n" + type.toUpperCase() + ": " + description;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZXIuanMiLCJzb3VyY2VSb290IjoiQzovVXNlcnMvRG9taW5pYy9Eb2N1bWVudHMvVmlzdWFsIFN0dWRpbyAyMDE3L1JlcG9zaXRvcmllcy92aXJ0dWFsLXRzYy9zcmMvIiwic291cmNlcyI6WyJjb21waWxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLCtCQUFpQztBQUVqQywrQkFBc0M7QUFDdEMsMkNBQWlEO0FBRWpELElBQU0sZUFBZSxHQUFXLG9CQUFvQixDQUFDO0FBV3JELHNCQUFzQixHQUFXLEVBQUUsS0FBYTtJQUMvQyxzQkFBc0I7SUFDdEIsRUFBRSxDQUFDLENBQUUsR0FBVyxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUM7UUFBQyxNQUFNLENBQUUsR0FBVyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNuRSxzQkFBc0I7SUFDdEIsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDO0lBQ2IsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLEVBQUUsQ0FBQyxFQUFFO1FBQUUsR0FBRyxJQUFJLEdBQUcsQ0FBQztJQUMzQyxNQUFNLENBQUMsR0FBRyxDQUFDO0FBQ1osQ0FBQztBQVFELHNCQUE2QixNQUFjLEVBQUUsZUFBb0MsRUFBRSxZQUErQztJQUEvQyw2QkFBQSxFQUFBLGlCQUErQztJQUNqSSxNQUFNLENBQUMsSUFBSSxPQUFPLENBQWdCLFVBQUMsR0FBRyxFQUFFLEdBQUc7UUFDMUMsWUFBWSxDQUFDO1lBQ1osSUFBSSxDQUFDO2dCQUNKLElBQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsZUFBZSxFQUFFLFlBQVksQ0FBQyxDQUFDO2dCQUMzRCxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDVixDQUFDO1lBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDWixHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDUixD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