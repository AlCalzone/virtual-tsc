import * as debugPackage from "debug";
import * as nodePath from "path";
import * as ts from "typescript";
import { VirtualFileSystem } from "./virtual-fs";

const debug = debugPackage("virtual-tsc");

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
			debug(`getSourceFile(fileName="${fileName}", version=${languageVersion}) => returning provided file`);
			fileContent = this.fs.readFile(fileName);
		} else if (/^lib\..*?d\.ts$/.test(fileName)) {
			// resolving lib file
			const libPath = nodePath.join(nodePath.dirname(require.resolve("typescript")), fileName);
			debug(`getSourceFile(fileName="${fileName}") => resolved lib file ${libPath}`);
			fileContent = ts.sys.readFile(libPath);
			if (fileContent != null) this.fs.provideFile(fileName, fileContent, true);
		} else /* if (/node_modules.*?(ts|js|tsx|jsx)$/.test(fileName)) */ {
			// resolving a specific node module
			debug(`getSourceFile(fileName="${fileName}") => resolving typings`);
			fileContent = ts.sys.readFile(fileName);
			if (fileContent != null) this.fs.provideFile(fileName, fileContent, true);
		}
		if (fileContent != null) {
			debug("file content is not null");
			return ts.createSourceFile(fileName, this.fs.readFile(fileName), languageVersion);
		} else {
			debug("file content is null");
		}
	}

	public getDefaultLibFileName(options: ts.CompilerOptions): string {
		options = options || this.options;
		debug(`getDefaultLibFileName(${JSON.stringify(options, null, 4)})`);
		return "lib.d.ts";
	}

	public writeFile(path: string, content: string) {
		debug(`writeFile(path="${path}")`);
		this.fs.provideFile(path, content, true);
	}

	public getCurrentDirectory(): string {
		const ret = ts.sys.getCurrentDirectory();
		debug(`getCurrentDirectory() => ${ret}`);
		return ret;
	}

	public getDirectories(path: string): string[] {
		debug(`getDirectories(${path})`);
		throw new Error("Method not implemented.");
	}

	public getCanonicalFileName(fileName: string): string {
		debug(`getCanonicalFileName(${fileName})`);
		return ts.sys.useCaseSensitiveFileNames ? fileName : fileName.toLowerCase();
	}

	public useCaseSensitiveFileNames(): boolean {
		debug(`useCaseSensitiveFileNames()`);
		return ts.sys.useCaseSensitiveFileNames;
	}
	public getNewLine(): string {
		debug(`getNewLine()`);
		return ts.sys.newLine;
	}

	public resolveModuleNames?(moduleNames: string[], containingFile: string): ts.ResolvedModule[] {
		debug(`resolveModuleNames(${moduleNames})`);
		return moduleNames.map(moduleName => {
			{ // try to use standard resolution
				const result = ts.resolveModuleName(
					moduleName, containingFile,
					this.options,
					{
						fileExists: this.fileExists.bind(this),
						readFile: this.readFile.bind(this),
					},
				);
				if (result.resolvedModule) return result.resolvedModule;
			}

			try { // fall back to NodeJS resolution
				const fileName = require.resolve(moduleName);
				if (fileName === moduleName) return; // internal module
				debug(`resolved ${moduleName} => ${fileName}`);
				return {
					resolvedFileName: fileName,
				} as ts.ResolvedModule;
			} catch (e) {
				/* Not found */
			}
		});
	}

	public fileExists(fileName: string): boolean {
		debug(`fileExists(${fileName})`);
		return this.fs.fileExists(fileName);
	}
	public readFile(fileName: string): string {
		debug(`readFile(${fileName})`);
		return this.fs.readFile(fileName);
	}

}
