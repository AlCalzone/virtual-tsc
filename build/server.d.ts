import { LoggerFunction } from "./logger";
import { CompileResult } from "./util";
import type { CompilerOptions as tsCompilerOptions } from "typescript";
export declare class Server {
    private options?;
    private service;
    private fs;
    private host;
    private ts;
    constructor(options?: tsCompilerOptions, customLogger?: LoggerFunction | false);
    provideAmbientDeclarations(declarations?: {
        [filename: string]: string;
    }): void;
    compile(filename: string, scriptContent: string): CompileResult;
}
