import * as ts from "typescript";
import { CompileResult } from "./util";
export declare function compileAsync(script: string, compilerOptions?: ts.CompilerOptions, declarations?: {
    [filename: string]: string;
}): Promise<CompileResult>;
export declare function compile(script: string, compilerOptions?: ts.CompilerOptions, ambientDeclarations?: {
    [filename: string]: string;
}): CompileResult;
