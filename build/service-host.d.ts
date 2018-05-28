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
export declare class InMemoryWatcherHost implements ts.WatchCompilerHostOfFilesAndCompilerOptions<ts.EmitAndSemanticDiagnosticsBuilderProgram> {
    createProgram: ts.CreateProgram<ts.EmitAndSemanticDiagnosticsBuilderProgram>;
    private fs;
    options: ts.CompilerOptions;
    constructor(createProgram: ts.CreateProgram<ts.EmitAndSemanticDiagnosticsBuilderProgram>, fs: VirtualFileSystem, options: ts.CompilerOptions);
    rootFiles: string[];
    afterProgramCreate(program: ts.EmitAndSemanticDiagnosticsBuilderProgram): void;
    onWatchStatusChange(diagnostic: ts.Diagnostic, newLine: string, options: ts.CompilerOptions): void;
    useCaseSensitiveFileNames(): boolean;
    getNewLine(): string;
    getCurrentDirectory(): string;
    getDefaultLibFileName(options: ts.CompilerOptions): string;
    fileExists(path: string): boolean;
    readFile(path: string, encoding?: string): string;
    getDirectories(directoryName: string): string[];
    writeFile(path: string, data: string): void;
    watchFile(path: string, callback: ts.FileWatcherCallback, pollingInterval?: number): ts.FileWatcher;
    watchDirectory(path: string, callback: ts.DirectoryWatcherCallback, recursive?: boolean): ts.FileWatcher;
}
