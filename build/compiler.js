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
    if (compilerOptions.noEmitOnError == null)
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
    const rawDiagnostics = compilerOptions.noEmitOnError ? emitResult.diagnostics : ts.getPreEmitDiagnostics(program);
    const diagnostics = rawDiagnostics.map(diagnostic => {
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
    const hasError = ((!diagnostics.every(d => d.type !== "error") || emitResult.emitSkipped)
        && compilerOptions.noEmitOnError);
    let result;
    if (!hasError)
        result = fs.readFile(SCRIPT_FILENAME.replace(/ts.?$/, "js"));
    return {
        success: !hasError,
        diagnostics: diagnostics,
        result: result,
    };
}
exports.compile = compile;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZXIuanMiLCJzb3VyY2VSb290IjoiRDovdmlydHVhbC10c2Mvc3JjLyIsInNvdXJjZXMiOlsiY29tcGlsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxpQ0FBaUM7QUFFakMsaUNBQXNDO0FBQ3RDLDZDQUFpRDtBQUVqRCxNQUFNLGVBQWUsR0FBVyxvQkFBb0IsQ0FBQztBQVdyRCxzQkFBc0IsR0FBVyxFQUFFLEtBQWE7SUFDL0MsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUM7UUFBQyxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNqRCxJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUM7SUFDYixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssRUFBRSxDQUFDLEVBQUU7UUFBRSxHQUFHLElBQUksR0FBRyxDQUFDO0lBQzNDLE1BQU0sQ0FBQyxHQUFHLENBQUM7QUFDWixDQUFDO0FBUUQsaUJBQXdCLE1BQWMsRUFBRSxlQUFvQyxFQUFFLGVBQTZDLEVBQUU7SUFDNUgsTUFBTSxXQUFXLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUV2QywrQkFBK0I7SUFDL0IsZUFBZSxHQUFHLGVBQWUsSUFBSSxFQUFFLENBQUM7SUFDeEMsRUFBRSxDQUFDLENBQUMsZUFBZSxDQUFDLGFBQWEsSUFBSSxJQUFJLENBQUM7UUFBQyxlQUFlLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztJQUNoRixlQUFlLENBQUMsZ0JBQWdCLEdBQUcsRUFBRSxDQUFDLG9CQUFvQixDQUFDLE1BQU0sQ0FBQztJQUVsRSw0Q0FBNEM7SUFDNUMsTUFBTSxFQUFFLEdBQUcsSUFBSSw4QkFBaUIsRUFBRSxDQUFDO0lBQ25DLEVBQUUsQ0FBQyxTQUFTLENBQUMsZUFBZSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ3RDLHdDQUF3QztJQUN4QyxHQUFHLENBQUMsQ0FBQyxNQUFNLFdBQVcsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyRCxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7WUFBQyxNQUFNLElBQUksS0FBSyxDQUFDLGtDQUFrQyxDQUFDLENBQUM7UUFDdkYsRUFBRSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEVBQUUsWUFBWSxDQUFDLFdBQVcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzVELENBQUM7SUFFRCwwQkFBMEI7SUFDMUIsTUFBTSxJQUFJLEdBQUcsSUFBSSxtQkFBWSxDQUFDLEVBQUUsRUFBRSxlQUFlLENBQUMsQ0FBQztJQUNuRCxpREFBaUQ7SUFDakQsTUFBTSxRQUFRLEdBQUc7UUFDaEIscUNBQXFDO1FBQ3JDLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUM7UUFDNUIsZUFBZTtLQUNmLENBQUM7SUFDRixNQUFNLE9BQU8sR0FBRyxFQUFFLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRSxlQUFlLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFFbEUscUJBQXFCO0lBQ3JCLE1BQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUVsQyxrQ0FBa0M7SUFDbEMsTUFBTSxjQUFjLEdBQUcsZUFBZSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLHFCQUFxQixDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ2xILE1BQU0sV0FBVyxHQUFHLGNBQWMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEVBQUU7UUFDbkQsTUFBTSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsNkJBQTZCLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzVHLE1BQU0sV0FBVyxHQUFHLEVBQUUsQ0FBQyw0QkFBNEIsQ0FBQyxVQUFVLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ2xGLE1BQU0sSUFBSSxHQUFHLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsV0FBVyxFQUFxQyxDQUFDO1FBQ3pHLE1BQU0sVUFBVSxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN2QyxNQUFNLGVBQWUsR0FBRyxHQUFHLFVBQVU7RUFDckMsWUFBWSxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUM7RUFDekIsSUFBSSxDQUFDLFdBQVcsRUFBRSxLQUFLLFdBQVcsRUFBRSxDQUFDO1FBQ3JDLE1BQU0sQ0FBQztZQUNOLElBQUk7WUFDSixNQUFNLEVBQUUsTUFBTSxHQUFHLENBQUM7WUFDbEIsTUFBTSxFQUFFLE1BQU0sR0FBRyxDQUFDO1lBQ2xCLFVBQVU7WUFDVixXQUFXO1lBQ1gsZUFBZTtTQUNELENBQUM7SUFDakIsQ0FBQyxDQUFDLENBQUM7SUFFSCxNQUFNLFFBQVEsR0FBRyxDQUNoQixDQUFDLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssT0FBTyxDQUFDLElBQUksVUFBVSxDQUFDLFdBQVcsQ0FBQztXQUNwRSxlQUFlLENBQUMsYUFBYSxDQUNoQyxDQUFDO0lBQ0YsSUFBSSxNQUFjLENBQUM7SUFDbkIsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUM7UUFBQyxNQUFNLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBRTVFLE1BQU0sQ0FBQztRQUNOLE9BQU8sRUFBRSxDQUFDLFFBQVE7UUFDbEIsV0FBVyxFQUFFLFdBQVc7UUFDeEIsTUFBTSxFQUFFLE1BQU07S0FDZCxDQUFDO0FBQ0gsQ0FBQztBQTlERCwwQkE4REMifQ==