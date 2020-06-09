import { CompileResult } from "./util";
import type { CompilerOptions as tsCompilerOptions } from "typescript";
export declare function compileAsync(script: string, compilerOptions?: tsCompilerOptions, declarations?: {
    [filename: string]: string;
}): Promise<CompileResult>;
export declare function compile(script: string, compilerOptions?: tsCompilerOptions, ambientDeclarations?: {
    [filename: string]: string;
}): CompileResult;
