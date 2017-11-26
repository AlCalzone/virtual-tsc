import * as nodePath from "path";
import * as ts from "typescript";
import { log } from "./logger";
import { resolveTypings } from "./util";
import { VirtualFileSystem } from "./virtual-fs";

// reference: https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API#customizing-module-resolution

/**
 * Implementation of CompilerHost that works with in-memory-only source files
 */
export class InMemoryHost implements ts.CompilerHost {

	constructor(
		private fs: VirtualFileSystem,
		private options: ts.CompilerOptions,
	) {

	}

	public getSourceFile(fileName: string, languageVersion: ts.ScriptTarget, onError?: (message: string) => void): ts.SourceFile {
		let fileContent: string;
		if (this.fs.fileExists(fileName)) {
			log(`getSourceFile(fileName="${fileName}", version=${languageVersion}) => returning provided file`, "debug");
			fileContent = this.fs.readFile(fileName);
		} else if (/^lib\..*?d\.ts$/.test(fileName)) {
			// resolving lib file
			const libPath = nodePath.join(nodePath.dirname(require.resolve("typescript")), fileName);
			log(`getSourceFile(fileName="${fileName}") => resolved lib file ${libPath}`, "debug");
			fileContent = ts.sys.readFile(libPath);
			if (fileContent != null) this.fs.writeFile(fileName, fileContent, true);
		} else if (/\@types\/.+$/.test(fileName)) {
			// resolving a specific node module
			log(`getSourceFile(fileName="${fileName}") => resolving typings`, "debug");
			fileName = resolveTypings(fileName);
			fileContent = ts.sys.readFile(fileName);
			if (fileContent != null) this.fs.writeFile(fileName, fileContent, true);
		}
		if (fileContent != null) {
			log("file content is not null", "debug");
			return ts.createSourceFile(fileName, this.fs.readFile(fileName), languageVersion);
		} else {
			log("file content is null", "debug");
		}
	}

	public getDefaultLibFileName(options: ts.CompilerOptions): string {
		options = options || this.options;
		log(`getDefaultLibFileName(${JSON.stringify(options, null, 4)})`, "debug");
		return "lib.d.ts";
	}

	public writeFile(path: string, content: string) {
		log(`writeFile(path="${path}")`, "debug");
		this.fs.writeFile(path, content, true);
	}

	public getCurrentDirectory(): string {
		const ret = ts.sys.getCurrentDirectory();
		log(`getCurrentDirectory() => ${ret}`, "debug");
		return ret;
	}

	public getDirectories(path: string): string[] {
		log(`getDirectories(${path})`, "debug");
		throw new Error("Method not implemented.");
	}

	public getCanonicalFileName(fileName: string): string {
		log(`getCanonicalFileName(${fileName})`, "debug");
		return ts.sys.useCaseSensitiveFileNames ? fileName : fileName.toLowerCase();
	}

	public useCaseSensitiveFileNames(): boolean {
		log(`useCaseSensitiveFileNames()`, "debug");
		return ts.sys.useCaseSensitiveFileNames;
	}
	public getNewLine(): string {
		log(`getNewLine()`, "debug");
		return ts.sys.newLine;
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
