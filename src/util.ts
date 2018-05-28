import * as nodeFS from "fs";
import * as nodePath from "path";
import * as ts from "typescript";
import { log } from "./logger";
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
	declarations?: string;
}

export function startsWith(str: string, match: string): boolean {
	return (
		str.length >= match.length &&
		str.substr(0, match.length) === match
	);
}

export function endsWith(str: string, match: string): boolean {
	return (
		str.length >= match.length &&
		str.substr(-match.length) === match
	);
}

export function resolveTypings(typings: string): string {
	if (!startsWith(typings, "@types") || nodePath.isAbsolute(typings)) {
		// this is an absolute path
		typings = typings.substr(typings.indexOf("@types"));
	}
	log(`resolveTypings(${typings})`, "debug");
	if (!endsWith(typings, ".d.ts")) {
		typings = nodePath.join(typings, "index.d.ts");
	}
	try {
		const ret = require.resolve(typings);
		log(" => " + ret, "debug");
		return ret;
	} catch (e) {
		log(" => no success: " + e, "debug");
		return null;
	}
}

export function resolveLib(libFile: string): string {
	log(`resolving lib file ${libFile}`, "debug");
	const libPath = require.resolve(`typescript/lib/${libFile}`);
	log(`libPath = ${libPath}`, "debug");
	if (ts.sys.fileExists(libPath)) return libPath;
}

export function enumLibFiles(): string[] {
	log("util", "enumLibFiles() =>", "debug");
	const tsPath = require.resolve("typescript");
	const libFiles = nodeFS.readdirSync(nodePath.dirname(tsPath))
		.filter(name => /^lib(\.[\w\d]+)*?\.d\.ts$/.test(name))
		.map(file => nodePath.join(nodePath.dirname(tsPath), file))
		;
	for (const file of libFiles) {
		log("util", "  " + file, "debug");
	}
	return libFiles;
}
