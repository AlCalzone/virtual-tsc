import * as ts from "typescript";
import { CompileResult } from "./util";
export declare class Server {
    private options;
    private service;
    private fs;
    private host;
    constructor(options?: ts.CompilerOptions);
    provideAmbientDeclarations(declarations?: {
        [filename: string]: string;
    }): void;
    compile(filename: string, scriptContent: string): CompileResult;
}
