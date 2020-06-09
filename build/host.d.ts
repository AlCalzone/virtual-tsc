import type { CompilerHost as tsCompilerHost, CompilerOptions as tsCompilerOptions, ScriptTarget as tsScriptTarget, SourceFile as tsSourceFile } from "typescript";
import type { VirtualFileSystem } from "./virtual-fs";
/**
 * Implementation of CompilerHost that works with in-memory-only source files
 */
export declare class InMemoryHost implements tsCompilerHost {
    private fs;
    private options;
    constructor(fs: VirtualFileSystem, options: tsCompilerOptions);
    private ts;
    getSourceFile(fileName: string, languageVersion: tsScriptTarget, onError?: (message: string) => void): tsSourceFile;
    getDefaultLibFileName(options: tsCompilerOptions): string;
    writeFile(path: string, content: string): void;
    getCurrentDirectory(): string;
    getDirectories(path: string): string[];
    getCanonicalFileName(fileName: string): string;
    useCaseSensitiveFileNames(): boolean;
    getNewLine(): string;
    fileExists(fileName: string): boolean;
    readFile(fileName: string): string;
}
