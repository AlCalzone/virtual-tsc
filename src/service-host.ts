import * as debugPackage from "debug";
import * as nodePath from "path";
import * as ts from "typescript";
import { VirtualFileSystem } from "./virtual-fs";

const debug = debugPackage("virtual-tsc");

// https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API#incremental-build-support-using-the-language-services

/**
 * Implementation of LanguageServiceHost that works with in-memory-only source files
 */
export class InMemoryServiceHost implements ts.LanguageServiceHost {

	constructor(
		private fs: VirtualFileSystem,
		private options: ts.CompilerOptions,
	) {

	}

	public getCompilationSettings(): ts.CompilerOptions {
		return this.options;
	}

	public getScriptFileNames(): string[] {
		return this.fs.getFilenames()
			.filter(f => f.endsWith(".ts") && !f.endsWith(".d.ts"))
		;
	}

	public getScriptVersion(fileName: string): string {
		return this.fs.getFileVersion(fileName).toString();
	}

	public getScriptSnapshot(fileName: string): ts.IScriptSnapshot {
		if (!this.fs.fileExists(fileName)) return undefined;
		return ts.ScriptSnapshot.fromString(this.fs.readFile(fileName));
	}

	public getCurrentDirectory(): string {
		const ret = ts.sys.getCurrentDirectory();
		debug(`getCurrentDirectory() => ${ret}`);
		return ret;
	}

	public getDefaultLibFileName(options: ts.CompilerOptions): string {
		options = options || this.options;
		debug(`getDefaultLibFileName(${JSON.stringify(options, null, 4)})`);
		return "lib.d.ts";
	}
	// log?(s: string): void {
	// 	throw new Error("Method not implemented.");
	// }
	// trace?(s: string): void {
	// 	throw new Error("Method not implemented.");
	// }
	// error?(s: string): void {
	// 	throw new Error("Method not implemented.");
	// }

	public readFile(path: string, encoding?: string): string {
		debug(`readFile(${path})`);
		return this.fs.readFile(path);
	}
	public fileExists(path: string): boolean {
		debug(`fileExists(${path})`);
		return this.fs.fileExists(path);
	}

	// resolveModuleNames?(moduleNames: string[], containingFile: string, reusedNames?: string[]): ts.ResolvedModule[] {
	// 	throw new Error("Method not implemented.");
	// }

}
