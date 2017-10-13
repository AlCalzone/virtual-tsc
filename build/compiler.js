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
function compile(script, compilerOptions, declarations = {}) {
    const sourceLines = script.split("\n");
    // set default compiler options
    compilerOptions = compilerOptions || {};
    compilerOptions.noEmitOnError = true;
    compilerOptions.moduleResolution = ts.ModuleResolutionKind.NodeJs;
    // provide the source file in the virtual fs
    const fs = new virtual_fs_1.VirtualFileSystem();
    fs.writeFile(SCRIPT_FILENAME, script);
    // provide all ambient declaration files
    for (const ambientFile of Object.keys(declarations)) {
        if (!/\.d\.ts$/.test(ambientFile))
            throw new Error("Declarations must be .d.ts-files");
        fs.writeFile(ambientFile, declarations[ambientFile], true);
    }
    // create the virtual host
    const host = new host_1.InMemoryHost(fs, compilerOptions);
    // create the compiler and provide nodejs typings
    const allFiles = [
        "node_modules/@types/node/index.d.ts",
        ...Object.keys(declarations),
        SCRIPT_FILENAME,
    ];
    const program = ts.createProgram(allFiles, compilerOptions, host);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZXIuanMiLCJzb3VyY2VSb290IjoiRDovdmlydHVhbC10c2Mvc3JjLyIsInNvdXJjZXMiOlsiY29tcGlsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxpQ0FBaUM7QUFFakMsaUNBQXNDO0FBQ3RDLDZDQUFpRDtBQUVqRCxNQUFNLGVBQWUsR0FBVyxvQkFBb0IsQ0FBQztBQVdyRCxzQkFBc0IsR0FBVyxFQUFFLEtBQWE7SUFDL0MsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUM7UUFBQyxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNqRCxJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUM7SUFDYixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssRUFBRSxDQUFDLEVBQUU7UUFBRSxHQUFHLElBQUksR0FBRyxDQUFDO0lBQzNDLE1BQU0sQ0FBQyxHQUFHLENBQUM7QUFDWixDQUFDO0FBUUQsaUJBQXdCLE1BQWMsRUFBRSxlQUFvQyxFQUFFLGVBQTZDLEVBQUU7SUFDNUgsTUFBTSxXQUFXLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUV2QywrQkFBK0I7SUFDL0IsZUFBZSxHQUFHLGVBQWUsSUFBSSxFQUFFLENBQUM7SUFDeEMsZUFBZSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7SUFDckMsZUFBZSxDQUFDLGdCQUFnQixHQUFHLEVBQUUsQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLENBQUM7SUFFbEUsNENBQTRDO0lBQzVDLE1BQU0sRUFBRSxHQUFHLElBQUksOEJBQWlCLEVBQUUsQ0FBQztJQUNuQyxFQUFFLENBQUMsU0FBUyxDQUFDLGVBQWUsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUN0Qyx3Q0FBd0M7SUFDeEMsR0FBRyxDQUFDLENBQUMsTUFBTSxXQUFXLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckQsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFDO1FBQ3ZGLEVBQUUsQ0FBQyxTQUFTLENBQUMsV0FBVyxFQUFFLFlBQVksQ0FBQyxXQUFXLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUM1RCxDQUFDO0lBRUQsMEJBQTBCO0lBQzFCLE1BQU0sSUFBSSxHQUFHLElBQUksbUJBQVksQ0FBQyxFQUFFLEVBQUUsZUFBZSxDQUFDLENBQUM7SUFDbkQsaURBQWlEO0lBQ2pELE1BQU0sUUFBUSxHQUFHO1FBQ2hCLHFDQUFxQztRQUNyQyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDO1FBQzVCLGVBQWU7S0FDZixDQUFDO0lBQ0YsTUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUUsZUFBZSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBRWxFLHFCQUFxQjtJQUNyQixNQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7SUFFbEMsa0NBQWtDO0lBQ2xDLE1BQU0sY0FBYyxHQUFHLFVBQVUsQ0FBQyxXQUFXO1NBQzVDLEdBQUcsQ0FBQyxVQUFVLENBQUMsRUFBRTtRQUNqQixNQUFNLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyw2QkFBNkIsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDNUcsTUFBTSxXQUFXLEdBQUcsRUFBRSxDQUFDLDRCQUE0QixDQUFDLFVBQVUsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDbEYsTUFBTSxJQUFJLEdBQUcsRUFBRSxDQUFDLGtCQUFrQixDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxXQUFXLEVBQXFDLENBQUM7UUFDekcsTUFBTSxVQUFVLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3ZDLE1BQU0sZUFBZSxHQUFHLEdBQUcsVUFBVTtFQUNyQyxZQUFZLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQztFQUN6QixJQUFJLENBQUMsV0FBVyxFQUFFLEtBQUssV0FBVyxFQUFFLENBQUM7UUFDckMsTUFBTSxDQUFDO1lBQ04sSUFBSTtZQUNKLE1BQU0sRUFBRSxNQUFNLEdBQUcsQ0FBQztZQUNsQixNQUFNLEVBQUUsTUFBTSxHQUFHLENBQUM7WUFDbEIsVUFBVTtZQUNWLFdBQVc7WUFDWCxlQUFlO1NBQ0QsQ0FBQztJQUNqQixDQUFDLENBQUMsQ0FBQztJQUVILE1BQU0sUUFBUSxHQUFHLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssT0FBTyxDQUFDLElBQUksVUFBVSxDQUFDLFdBQVcsQ0FBQztJQUMxRixJQUFJLE1BQWMsQ0FBQztJQUNuQixFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQztRQUFDLE1BQU0sR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7SUFFNUUsTUFBTSxDQUFDO1FBQ04sT0FBTyxFQUFFLENBQUMsUUFBUTtRQUNsQixXQUFXLEVBQUUsY0FBYztRQUMzQixNQUFNLEVBQUUsTUFBTTtLQUNkLENBQUM7QUFDSCxDQUFDO0FBM0RELDBCQTJEQyJ9