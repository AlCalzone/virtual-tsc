import * as ts from "typescript";

// see https://github.com/Microsoft/TypeScript/issues/13629 for an implementation
// also: https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API#customizing-module-resolution

/**
 * Implementation of CompilerHost that works with in-memory-only source files
 */
export class InMemoryHost implements ts.CompilerHost {

	public getSourceFile(fileName: string, languageVersion: ts.ScriptTarget, onError?: (message: string) => void): ts.SourceFile {
		throw new Error("Method not implemented.");
	}
	public getSourceFileByPath?(fileName: string, path: ts.Path, languageVersion: ts.ScriptTarget, onError?: (message: string) => void): ts.SourceFile {
		throw new Error("Method not implemented.");
	}
	public getCancellationToken?(): ts.CancellationToken {
		throw new Error("Method not implemented.");
	}
	public getDefaultLibFileName(options: ts.CompilerOptions): string {
		throw new Error("Method not implemented.");
	}
	public getDefaultLibLocation?(): string {
		throw new Error("Method not implemented.");
	}
	public writeFile: ts.WriteFileCallback;
	public getCurrentDirectory(): string {
		throw new Error("Method not implemented.");
	}
	public getDirectories(path: string): string[] {
		throw new Error("Method not implemented.");
	}
	public getCanonicalFileName(fileName: string): string {
		throw new Error("Method not implemented.");
	}
	public useCaseSensitiveFileNames(): boolean {
		throw new Error("Method not implemented.");
	}
	public getNewLine(): string {
		throw new Error("Method not implemented.");
	}
	public resolveModuleNames?(moduleNames: string[], containingFile: string): ts.ResolvedModule[] {
		throw new Error("Method not implemented.");
	}
	public resolveTypeReferenceDirectives?(typeReferenceDirectiveNames: string[], containingFile: string): ts.ResolvedTypeReferenceDirective[] {
		throw new Error("Method not implemented.");
	}
	public getEnvironmentVariable?(name: string): string {
		throw new Error("Method not implemented.");
	}
	public fileExists(fileName: string): boolean {
		throw new Error("Method not implemented.");
	}
	public readFile(fileName: string): string {
		throw new Error("Method not implemented.");
	}
	public trace?(s: string): void {
		throw new Error("Method not implemented.");
	}
	public directoryExists?(directoryName: string): boolean {
		throw new Error("Method not implemented.");
	}
	public realpath?(path: string): string {
		throw new Error("Method not implemented.");
	}

}
