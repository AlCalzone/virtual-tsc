import { log } from "./logger";
import type { VirtualFileSystem } from "./virtual-fs";
import type { CompilerOptions as tsCompilerOptions, LanguageServiceHost as tsLanguageServiceHost, IScriptSnapshot as tsIScriptSnapshot } from "typescript";
import { getTypeScript } from "./util";

// https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API#incremental-build-support-using-the-language-services

/**
 * Implementation of LanguageServiceHost that works with in-memory-only source files
 */
export class InMemoryServiceHost implements tsLanguageServiceHost {

	private ts: typeof import("typescript");

	constructor(
		private fs: VirtualFileSystem,
		private options: tsCompilerOptions,
	) {
		this.ts = getTypeScript();
	}

	public getCompilationSettings(): tsCompilerOptions {
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

	public getScriptSnapshot(fileName: string): tsIScriptSnapshot {
		if (!this.fs.fileExists(fileName)) return undefined;
		return this.ts.ScriptSnapshot.fromString(this.fs.readFile(fileName));
	}

	public getCurrentDirectory(): string {
		return "";
		// return CWD;
		// return this.ts.sys.getCurrentDirectory();
	}

	public getDefaultLibFileName(options: tsCompilerOptions): string {
		options = options || this.options;
		log("host", `getDefaultLibFileName(${JSON.stringify(options, null, 4)})`, "debug");
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
		log("host", `readFile(${path})`, "debug");
		if (this.fs.fileExists(path)) {
			return this.fs.readFile(path);
		} else if (path.indexOf("node_modules") > -1) {
			return this.ts.sys.readFile(path);
		}
	}
	public fileExists(path: string): boolean {
		log("host", `fileExists(${path})`, "debug");
		let ret: boolean;
		if (this.fs.fileExists(path)) {
			ret = true;
		} else if (path.indexOf("node_modules") > -1) {
			ret = this.ts.sys.fileExists(path);
		}
		log("host", `fileExists(${path}) => ${ret}`, "debug");
		return ret;
	}

	public readDirectory(path: string, extensions?: ReadonlyArray<string>, exclude?: ReadonlyArray<string>, include?: ReadonlyArray<string>, depth?: number): string[] {
		log("host", `readDirectory(
	${path},
	${extensions ? JSON.stringify(extensions) : "null"},
	${exclude ? JSON.stringify(exclude) : "null"},
	${include ? JSON.stringify(include) : "null"},
	${depth},
`, "debug");
		return this.ts.sys.readDirectory(path, extensions, exclude, include, depth);
	}

	public getDirectories(directoryName: string): string[] {
		log("host", `getDirectories(${directoryName})`, "debug");

		// typings should be loaded from the virtual fs or we get problems
		if (directoryName.indexOf("node_modules/@types") > -1) {
			return [];
		}

		try {
			return this.ts.sys.getDirectories(directoryName);
		} catch (e) {
			return [];
		}
}

// 	public resolveModuleNames(moduleNames: string[], containingFile: string, reusedNames?: string[]): ts.ResolvedModule[] {
// 		log(`resolveModuleNames(
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
// 		log(`resolveTypeReferenceDirectives(
// 	${JSON.stringify(typeDirectiveNames)},
// 	${containingFile}
// ) => ${JSON.stringify(ret)}`);

// 		return ret.map(f => ({
// 			primary: true,
// 			resolvedFileName: f,
// 		}));
// 	}

}
