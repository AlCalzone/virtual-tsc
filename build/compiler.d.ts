import * as ts from "typescript";
export interface Diagnostic {
    type: "error" | "warning" | "message";
    lineNr: number;
    charNr: number;
    sourceLine: string;
    description: string;
    annotatedSource: string;
}
export interface CompileResult {
    success: boolean;
    diagnostics: Diagnostic[];
    result?: string;
}
export declare function compileAsync(script: string, compilerOptions?: ts.CompilerOptions, declarations?: {
    [filename: string]: string;
}): Promise<CompileResult>;
export declare function compile(script: string, compilerOptions?: ts.CompilerOptions, declarations?: {
    [filename: string]: string;
}): CompileResult;
