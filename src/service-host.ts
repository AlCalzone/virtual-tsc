import * as nodePath from "path";
import * as ts from "typescript";
import { log } from "./logger";
import { VirtualFileSystem } from "./virtual-fs";

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
		log(`getDefaultLibFileName(${JSON.stringify(options, null, 4)})`, "debug");
		return "lib.d.ts";
	}

	public readFile(path: string, encoding?: string): string {
		log(`readFile(${path})`, "debug");
		if (this.fs.fileExists(path)) {
			return this.fs.readFile(path);
		} else if (path.indexOf("node_modules") > -1) {
			return ts.sys.readFile(path);
		}
	}
	public fileExists(path: string): boolean {
		log(`fileExists(${path})`, "debug");
		let ret: boolean;
		if (this.fs.fileExists(path)) {
			ret = true;
		} else if (path.indexOf("node_modules") > -1) {
			ret = ts.sys.fileExists(path);
		}
		log(`fileExists(${path}) => ${ret}`, "debug");
		return ret;
	}

	public readDirectory(path: string, extensions?: ReadonlyArray<string>, exclude?: ReadonlyArray<string>, include?: ReadonlyArray<string>, depth?: number): string[] {
		log(`readDirectory(
	${path},
	${extensions ? JSON.stringify(extensions) : "null"},
	${exclude ? JSON.stringify(exclude) : "null"},
	${include ? JSON.stringify(include) : "null"},
	${depth},
`, "debug");
		return ts.sys.readDirectory(path, extensions, exclude, include, depth);
	}

	public getDirectories(directoryName: string): string[] {
		log(`getDirectories(${directoryName})`, "debug");

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

}

// tslint:disable-next-line:max-classes-per-file
export class InMemoryWatcherHost implements ts.WatchCompilerHostOfFilesAndCompilerOptions<ts.EmitAndSemanticDiagnosticsBuilderProgram> {

	constructor(
		public createProgram: ts.CreateProgram<ts.EmitAndSemanticDiagnosticsBuilderProgram>,
		private fs: VirtualFileSystem,
		public options: ts.CompilerOptions,
	) {
	}

	public rootFiles: string[];

	public afterProgramCreate(program: ts.EmitAndSemanticDiagnosticsBuilderProgram): void {
		log("host", `afterProgramCreate()`, "debug");
		// throw new Error("afterProgramCreate not implemented.");
	}
	public onWatchStatusChange(diagnostic: ts.Diagnostic, newLine: string, options: ts.CompilerOptions): void {
		log("host", `onWatchStatusChange()`, "debug");
		// throw new Error("Method not implemented.");
	}
	public useCaseSensitiveFileNames(): boolean {
		return ts.sys.useCaseSensitiveFileNames;
	}
	public getNewLine(): string {
		return ts.sys.newLine;
	}
	public getCurrentDirectory(): string {
		// return CWD;
		return ts.sys.getCurrentDirectory();
	}
	public getDefaultLibFileName(options: ts.CompilerOptions): string {
		log(`getDefaultLibFileName(${JSON.stringify(options, null, 4)})`, "debug");
		return "lib.d.ts";
	}

	public fileExists(path: string): boolean {
		log(`fileExists(${path})`, "debug");
		let ret: boolean;
		if (this.fs.fileExists(path)) {
			ret = true;
		} else if (path.indexOf("node_modules") > -1) {
			ret = ts.sys.fileExists(path);
		}
		log(`fileExists(${path}) => ${ret}`, "debug");
		return ret;
	}
	public readFile(path: string, encoding?: string): string {
		log(`readFile(${path})`, "debug");
		if (this.fs.fileExists(path)) {
			return this.fs.readFile(path);
		} else if (path.indexOf("node_modules") > -1) {
			return ts.sys.readFile(path);
		}
	}

	public getDirectories(directoryName: string): string[] {
		log(`getDirectories(${directoryName})`, "debug");

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

	public writeFile(path: string, data: string) {
		this.fs.writeFile(path, data, true);
	}

	public watchFile(path: string, callback: ts.FileWatcherCallback, pollingInterval?: number): ts.FileWatcher {
		log("host", `watchFile(path: ${path}, ...)`, "debug");
		// throw new Error("Method not implemented.");
		return {
			close: () => void 0,
		};
	}
	public watchDirectory(path: string, callback: ts.DirectoryWatcherCallback, recursive?: boolean): ts.FileWatcher {
		log("host", `watchDirectory(path: ${path}, , recursive: ${recursive}...)`, "debug");
		// throw new Error("Method not implemented.");
		return {
			close: () => void 0,
		};
	}

}
