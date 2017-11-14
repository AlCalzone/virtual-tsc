import * as debugPackage from "debug";
import * as nodePath from "path";
import * as ts from "typescript";

const debug = debugPackage("virtual-tsc");

export interface Diagnostic {
	type: "error" | "warning" | "message";
	lineNr: number;
	charNr: number;
	sourceLine: string;
	description: string;
	annotatedSource: string;
}

export function repeatString(str: string, count: number): string {
	// newer node versions
	if ((str as any).repeat != null) return (str as any).repeat(count);
	// older node versions
	let ret = "";
	for (let i = 0; i < count; i++) ret += str;
	return ret;
}

export interface CompileResult {
	success: boolean;
	diagnostics: Diagnostic[];
	result?: string;
}

export function startsWith(str: string, match: string): boolean {
	return (
		str.length >= match.length &&
		str.substr(0, match.length) === match
	);
}

export function resolveTypings(typings: string): string {
	if (!startsWith(typings, "@types") || nodePath.isAbsolute(typings)) {
		// this is an absolute path
		typings = typings.substr(typings.indexOf("@types"));
	}
	debug(`resolveTypings(${typings})`);
	const pathParts = __dirname.split(nodePath.sep);
	// start with / on linux
	if (startsWith(__dirname, nodePath.sep)) pathParts.unshift(nodePath.sep);
	// try all dirs up to the root
	for (let i = 0; i < pathParts.length; i++) {
		const path = nodePath.join(...(pathParts.slice(0, pathParts.length - i)), "node_modules", typings);
		debug(` => trying ${path}`);
		if (ts.sys.fileExists(path)) {
			debug(" => success");
			return path;
		}
	}
	debug(" => no success");
	return null;
}

export function resolveLib(libFile: string): string {
	debug(`resolving lib file ${libFile}`);
	// resolving lib file
	const libPath = nodePath.join(nodePath.dirname(require.resolve("typescript")), libFile);
	debug(`libPath = ${libPath}`);
	if (ts.sys.fileExists(libPath)) return libPath;
}
