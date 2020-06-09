import type { VirtualFileSystem } from "./virtual-fs";
import type { CompilerOptions as tsCompilerOptions, LanguageServiceHost as tsLanguageServiceHost, IScriptSnapshot as tsIScriptSnapshot } from "typescript";
/**
 * Implementation of LanguageServiceHost that works with in-memory-only source files
 */
export declare class InMemoryServiceHost implements tsLanguageServiceHost {
    private fs;
    private options;
    private ts;
    constructor(fs: VirtualFileSystem, options: tsCompilerOptions);
    getCompilationSettings(): tsCompilerOptions;
    getScriptFileNames(): string[];
    getScriptVersion(fileName: string): string;
    getScriptSnapshot(fileName: string): tsIScriptSnapshot;
    getCurrentDirectory(): string;
    getDefaultLibFileName(options: tsCompilerOptions): string;
    readFile(path: string, encoding?: string): string;
    fileExists(path: string): boolean;
    readDirectory(path: string, extensions?: ReadonlyArray<string>, exclude?: ReadonlyArray<string>, include?: ReadonlyArray<string>, depth?: number): string[];
    getDirectories(directoryName: string): string[];
}
