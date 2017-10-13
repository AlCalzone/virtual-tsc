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
        "node_modules/@types/node/index.d.ts"
    ].concat(Object.keys(declarations), [
        SCRIPT_FILENAME,
    ]);
    var program = ts.createProgram(allFiles, compilerOptions, host);
    // compile the script
    var emitResult = program.emit();
    // diagnose the compilation result
    var rawDiagnostics = compilerOptions.noEmitOnError ? emitResult.diagnostics : ts.getPreEmitDiagnostics(program);
    var diagnostics = rawDiagnostics.map(function (diagnostic) {
        var _a = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start), lineNr = _a.line, charNr = _a.character;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZXIuanMiLCJzb3VyY2VSb290IjoiRDovdmlydHVhbC10c2Mvc3JjLyIsInNvdXJjZXMiOlsiY29tcGlsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwrQkFBaUM7QUFFakMsK0JBQXNDO0FBQ3RDLDJDQUFpRDtBQUVqRCxJQUFNLGVBQWUsR0FBVyxvQkFBb0IsQ0FBQztBQVdyRCxzQkFBc0IsR0FBVyxFQUFFLEtBQWE7SUFDL0Msc0JBQXNCO0lBQ3RCLEVBQUUsQ0FBQyxDQUFFLEdBQVcsQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDO1FBQUMsTUFBTSxDQUFFLEdBQVcsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDbkUsc0JBQXNCO0lBQ3RCLElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQztJQUNiLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxFQUFFLENBQUMsRUFBRTtRQUFFLEdBQUcsSUFBSSxHQUFHLENBQUM7SUFDM0MsTUFBTSxDQUFDLEdBQUcsQ0FBQztBQUNaLENBQUM7QUFRRCxpQkFBd0IsTUFBYyxFQUFFLGVBQW9DLEVBQUUsWUFBK0M7SUFBL0MsNkJBQUEsRUFBQSxpQkFBK0M7SUFDNUgsSUFBTSxXQUFXLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUV2QywrQkFBK0I7SUFDL0IsZUFBZSxHQUFHLGVBQWUsSUFBSSxFQUFFLENBQUM7SUFDeEMsRUFBRSxDQUFDLENBQUMsZUFBZSxDQUFDLGFBQWEsSUFBSSxJQUFJLENBQUM7UUFBQyxlQUFlLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztJQUNoRixlQUFlLENBQUMsZ0JBQWdCLEdBQUcsRUFBRSxDQUFDLG9CQUFvQixDQUFDLE1BQU0sQ0FBQztJQUVsRSw0Q0FBNEM7SUFDNUMsSUFBTSxFQUFFLEdBQUcsSUFBSSw4QkFBaUIsRUFBRSxDQUFDO0lBQ25DLEVBQUUsQ0FBQyxT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