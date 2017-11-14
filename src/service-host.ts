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
		return this.fs
			.getFilenames()
			.filter(f => f.endsWith(".ts") /* && !f.endsWith(".d.ts") */)
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
		// return CWD;
		return ts.sys.getCurrentDirectory();
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
		if (this.fs.fileExists(path)) {
			return this.fs.readFile(path);
		} else if (path.indexOf("node_modules") > -1) {
			return ts.sys.readFile(path);
		}
	}
	public fileExists(path: string): boolean {
		debug(`fileExists(${path})`);
		let ret: boolean;
		if (this.fs.fileExists(path)) {
			ret = true;
		} else if (path.indexOf("node_modules") > -1) {
			ret = ts.sys.fileExists(path);
		}
		debug(`fileExists(${path}) => ${ret}`);
		return ret;
	}

	public readDirectory(path: string, extensions?: ReadonlyArray<string>, exclude?: ReadonlyArray<string>, include?: ReadonlyArray<string>, depth?: number): string[] {
		debug(`readDirectory(
	${path},
	${extensions ? JSON.stringify(extensions) : "null"},
	${exclude ? JSON.stringify(exclude) : "null"},
	${include ? JSON.stringify(include) : "null"},
	${depth},
`);
		return ts.sys.readDirectory(path, extensions, exclude, include, depth);
	}

	public getDirectories(directoryName: string): string[] {
		debug(`getDirectories(${directoryName})`);

		// typings should be loaded from the virtual fs or we get problems
		if (directoryName.indexOf("node_modules/@types") > -1) {
			return [];
		}

		try {
			return ts.sys.getDirectories(directoryName);
		} catch (e) {
			return [];
		}
}

// 	public resolveModuleNames(moduleNames: string[], containingFile: string, reusedNames?: string[]): ts.ResolvedModule[] {
// 		debug(`resolveModuleNames(
// 	${JSON.stringify(moduleNames)},
// 	${containingFile},
// 	${reusedNames ? JSON.stringify(reusedNames) : "null"}
// `);
// 		throw new Error("Method not implemented.");
// 	}

// 	public resolveTypeReferenceDirectives?(typeDirectiveNames: string[], containingFile: string): ts.ResolvedTypeReferenceDirective[] {
// 		const ret = typeDirectiveNames.map(
// 			t => resolveTypings(`@types/${t}/index.d.ts`),
// 		);
// 		debug(`resolveTypeReferenceDirectives(
// 	${JSON.stringify(typeDirectiveNames)},
// 	${containingFile}
// ) => ${JSON.stringify(ret)}`);

// 		return ret.map(f => ({
// 			primary: true,
// 			resolvedFileName: f,
// 		}));
// 	}

}
