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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZXIuanMiLCJzb3VyY2VSb290IjoiRDovdmlydHVhbC10c2Mvc3JjLyIsInNvdXJjZXMiOlsiY29tcGlsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwrQkFBaUM7QUFDakMsK0JBQXNDO0FBQ3RDLCtCQUFpRTtBQUNqRSwyQ0FBaUQ7QUFFakQsSUFBTSxlQUFlLEdBQVcsb0JBQW9CLENBQUM7QUFFckQsc0JBQTZCLE1BQWMsRUFBRSxlQUFvQyxFQUFFLFlBQStDO0lBQS9DLDZCQUFBLEVBQUEsaUJBQStDO0lBQ2pJLE1BQU0sQ0FBQyxJQUFJLE9BQU8sQ0FBZ0IsVUFBQyxHQUFHLEVBQUUsR0FBRztRQUMxQyxZQUFZLENBQUM7WUFDWixJQUFJLENBQUM7Z0JBQ0osSUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxlQUFlLEVBQUUsWUFBWSxDQUFDLENBQUM7Z0JBQzNELEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNWLENBQUM7WUFBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNaLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNSLENBQUM7UUFDRixDQUFDLENBQUMsQ0FBQztJQUNKLENBQUMsQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQVhELG9DQVdDO0FBRUQsaUJBQXdCLE1BQWMsRUFBRSxlQUFvQyxFQUFFLFlBQStDO0lBQS9DLDZCQUFBLEVBQUEsaUJBQStDO0lBQzVILElBQU0sV0FBVyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7SUFFdkMsK0JBQStCO0lBQy9CLGVBQWUsR0FBRyxlQUFlLElBQUksRUFBRSxDQUFDO0lBQ3hDLEVBQUUsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxhQUFhLElBQUksSUFBSSxDQUFDO1FBQUMsZUFBZSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7SUFDaEYsZUFBZSxDQUFDLGdCQUFnQixHQUFHLEVBQUUsQ0FBQyxvQkFBb0Is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