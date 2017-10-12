"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const host_1 = require("./host");
const virtual_fs_1 = require("./virtual-fs");
const SCRIPT_FILENAME = "__virtual-tsc__.ts";
function repeatString(str, count) {
    if (str.repeat != null)
        return str.repeat(count);
    let ret = "";
    for (let i = 0; i < count; i++)
        ret += str;
    return ret;
}
function compile(script, compilerOptions) {
    const sourceLines = script.split("\n");
    // set default compiler options
    compilerOptions = compilerOptions || {};
    compilerOptions.noEmitOnError = true;
    compilerOptions.moduleResolution = ts.ModuleResolutionKind.NodeJs;
    // provide the source file in the virtual fs
    const fs = new virtual_fs_1.VirtualFileSystem();
    fs.provideFile(SCRIPT_FILENAME, script);
    // create the virtual host
    const host = new host_1.InMemoryHost(fs, compilerOptions);
    // create the compiler and provide nodejs typings
    const program = ts.createProgram(["node_modules/@types/node/index.d.ts", SCRIPT_FILENAME], compilerOptions, host);
    // compile the script
    const emitResult = program.emit();
    // diagnose the compilation result
    const allDiagnostics = emitResult.diagnostics
        .map(diagnostic => {
        const { line: lineNr, character: charNr } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
        const description = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
        const type = ts.DiagnosticCategory[diagnostic.category].toLowerCase();
        const sourceLine = sourceLines[lineNr];
        const annotatedSource = `${sourceLine}
${repeatString(" ", charNr)}^
${type.toUpperCase()}: ${description}`;
        return {
            type,
            lineNr: lineNr + 1,
            charNr: charNr + 1,
            sourceLine,
            description,
            annotatedSource,
        };
    });
    const hasError = !allDiagnostics.every(d => d.type !== "error") || emitResult.emitSkipped;
    let result;
    if (!hasError)
        result = fs.readFile(SCRIPT_FILENAME.replace(/ts.?$/, "js"));
    return {
        success: !hasError,
        diagnostics: allDiagnostics,
        result: result,
    };
}
exports.compile = compile;
//# sourceMappingURL=compiler.js.map