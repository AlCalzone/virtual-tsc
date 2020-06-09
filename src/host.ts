import * as nodePath from "path";
import type { CompilerHost as tsCompilerHost, CompilerOptions as tsCompilerOptions, ScriptTarget as tsScriptTarget, SourceFile as tsSourceFile } from "typescript";
import { log } from "./logger";
import { resolveTypings, getTypeScript, getTypeScriptResolveOptions } from "./util";
import type { VirtualFileSystem } from "./virtual-fs";

// reference: https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API#customizing-module-resolution

/**
 * Implementation of CompilerHost that works with in-memory-only source files
 */
export class InMemoryHost implements tsCompilerHost {

	constructor(
		private fs: VirtualFileSystem,
		private options: tsCompilerOptions,
	) {
		this.ts = getTypeScript();
	}

	private ts: typeof import("typescript");

	public getSourceFile(fileName: string, languageVersion: tsScriptTarget, onError?: (message: string) => void): tsSourceFile {
		let fileContent: string;
		if (this.fs.fileExists(fileName)) {
			log(`getSourceFile(fileName="${fileName}", version=${languageVersion}) => returning provided file`, "debug");
			fileContent = this.fs.readFile(fileName);
		} else if (/^lib\..*?d\.ts$/.test(fileName)) {
			// resolving lib file
			const libPath = nodePath.join(nodePath.dirname(require.resolve("typescript", getTypeScriptResolveOptions())), fileName);
			log(`getSourceFile(fileName="${fileName}") => resolved lib file ${libPath}`, "debug");
			fileContent = this.ts.sys.readFile(libPath);
			if (fileContent != null) this.fs.writeFile(fileName, fileContent, true);
		} else if (/\@types\/.+$/.test(fileName)) {
			// resolving a specific node module
			log(`getSourceFile(fileName="${fileName}") => resolving typings`, "debug");
			fileName = resolveTypings(fileName);
			fileContent = this.ts.sys.readFile(fileName);
			if (fileContent != null) this.fs.writeFile(fileName, fileContent, true);
		}
		if (fileContent != null) {
			log("file content is not null", "debug");
			return this.ts.createSourceFile(fileName, this.fs.readFile(fileName), languageVersion);
		} else {
			log("file content is null", "debug");
		}
	}

	public getDefaultLibFileName(options: tsCompilerOptions): string {
		options = options || this.options;
		log(`getDefaultLibFileName(${JSON.stringify(options, null, 4)})`, "debug");
		return "lib.d.ts";
	}

	public writeFile(path: string, content: string) {
		log(`writeFile(path="${path}")`, "debug");
		this.fs.writeFile(path, content, true);
	}

	public getCurrentDirectory(): string {
		const ret = this.ts.sys.getCurrentDirectory();
		log(`getCurrentDirectory() => ${ret}`, "debug");
		return ret;
	}

	public getDirectories(path: string): string[] {
		log(`getDirectories(${path})`, "debug");
		throw new Error("Method not implemented.");
	}

	public getCanonicalFileName(fileName: string): string {
		log(`getCanonicalFileName(${fileName})`, "debug");
		return this.ts.sys.useCaseSensitiveFileNames ? fileName : fileName.toLowerCase();
	}

	public useCaseSensitiveFileNames(): boolean {
		log(`useCaseSensitiveFileNames()`, "debug");
		return this.ts.sys.useCaseSensitiveFileNames;
	}
	public getNewLine(): string {
		log(`getNewLine()`, "debug");
		return this.ts.sys.newLine;
	}

	// public resolveModuleNames?(moduleNames: string[], containingFile: string): ts.ResolvedModule[] {
	// 	log(`resolveModuleNames(${moduleNames})`);
	// 	return moduleNames.map(moduleName => {
	// 		{ // try to use standard resolution
	// 			const result = ts.resolveModuleName(
	// 				moduleName, containingFile,
	// 				this.options,
	// 				{
	// 					fileExists: this.fileExists.bind(this),
	// 					readFile: this.readFile.bind(this),
	// 				},
	// 			);
	// 			if (result.resolvedModule) return result.resolvedModule;
	// 		}

	// 		try { // fall back to NodeJS resolution
	// 			const fileName = require.resolve(moduleName);
	// 			if (fileName === moduleName) return; // internal module
	// 			log(`resolved ${moduleName} => ${fileName}`);
	// 			return {
	// 				resolvedFileName: fileName,
	// 			} as ts.ResolvedModule;
	// 		} catch (e) {
	// 			/* Not found */
	// 		}
	// 	});
	// }

	public fileExists(fileName: string): boolean {
		log(`fileExists(${fileName})`, "debug");
		return this.fs.fileExists(fileName);
	}
	public readFile(fileName: string): string {
		log(`readFile(${fileName})`, "debug");
		return this.fs.readFile(fileName);
	}

}
