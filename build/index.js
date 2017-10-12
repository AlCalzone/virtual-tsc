"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const host_1 = require("./host");
const virtual_fs_1 = require("./virtual-fs");
const script = `const x: number | string = 1;
const y: number = 2;
console.log(x+y);
`;
const sourceLines = script.split("\n");
const fs = new virtual_fs_1.VirtualFileSystem();
fs.provideFile("index.ts", script);
const host = new host_1.InMemoryHost(fs);
const program = ts.createProgram(["index.ts"], {
    noEmitOnError: true,
}, host);
const emitResult = program.emit();
function repeatString(str, count) {
    if (str.repeat != null)
        return str.repeat(count);
    let ret = "";
    for (let i = 0; i < count; i++)
        ret += str;
    return ret;
}
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
allDiagnostics.forEach(d => console.log(d.annotatedSource));
const hasError = !allDiagnostics.every(d => d.type !== "error") || emitResult.emitSkipped;
const exitCode = emitResult.emitSkipped ? 1 : 0;
if (!hasError) {
    console.log("=== COMPILATION SUCCESSFUL ===");
    console.log(fs.readFile("index.js"));
}
console.log(`Process exiting with code '${exitCode}'.`);
process.exit(exitCode);
//# sourceMappingURL=index.js.map