import * as debugPackage from "debug";
import * as nodePath from "path";
import * as ts from "typescript";
import { VirtualFileSystem } from "./virtual-fs";
import { resolveTypings } from "./util";

const debug = debugPackage("virtual-tsc");

// https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API#incremental-build-support-using-the-language-services

const CWD = "__VIRTUAL__";

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
		return CWD;
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
		if (nodePath.isAbsolute(path)) {
			return ts.sys.readFile(path, encoding);
		} else {
			return this.fs.readFile(path);
		}
	}
	public fileExists(path: string): boolean {
		let ret: boolean;
		if (nodePath.isAbsolute(path)) {
			ret = ts.sys.fileExists(path);
		}  else {
			ret = this.fs.fileExists(path);
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
		// don't expose any typings but node
		if (directoryName.indexOf("node_modules/@types") > -1) {
			return ["node"];
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
