import * as ts from "typescript";
import { VirtualFileSystem } from "./virtual-fs";
/**
 * Implementation of CompilerHost that works with in-memory-only source files
 */
export declare class InMemoryHost implements ts.CompilerHost {
    private fs;
    private options;
    constructor(fs: VirtualFileSystem, options: ts.CompilerOptions);
    getSourceFile(fileName: string, languageVersion: ts.ScriptTarget, onError?: (message: string) => void): ts.SourceFile;
    private resolveTypings(typings);
    getDefaultLibFileName(options: ts.CompilerOptions): string;
    writeFile(path: string, content: string): void;
    getCurrentDirectory(): string;
    getDirectories(path: string): string[];
    getCanonicalFileName(fileName: string): string;
    useCaseSensitiveFileNames(): boolean;
    getNewLine(): string;
    fileExists(fileName: string): boolean;
    readFile(fileName: string): string;
}
