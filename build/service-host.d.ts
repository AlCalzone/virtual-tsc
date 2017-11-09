import * as ts from "typescript";
import { VirtualFileSystem } from "./virtual-fs";
/**
 * Implementation of LanguageServiceHost that works with in-memory-only source files
 */
export declare class InMemoryServiceHost implements ts.LanguageServiceHost {
    private fs;
    private options;
    constructor(fs: VirtualFileSystem, options: ts.CompilerOptions);
    getCompilationSettings(): ts.CompilerOptions;
    getScriptFileNames(): string[];
    getScriptVersion(fileName: string): string;
    getScriptSnapshot(fileName: string): ts.IScriptSnapshot;
    getCurrentDirectory(): string;
    getDefaultLibFileName(options: ts.CompilerOptions): string;
    readFile(path: string, encoding?: string): string;
    fileExists(path: string): boolean;
    readDirectory(path: string, extensions?: ReadonlyArray<string>, exclude?: ReadonlyArray<string>, include?: ReadonlyArray<string>, depth?: number): string[];
    getDirectories(directoryName: string): string[];
}
