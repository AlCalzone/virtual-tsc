import * as ts from "typescript";
import * as util from "util";
import { InMemoryHost } from "./host";
import { VirtualFileSystem } from "./virtual-fs";

const script = `const x: number | string = 1;
const y: number = 2;
console.log(x+y);
`;
const sourceLines = script.split("\n");

const fs = new VirtualFileSystem();
fs.provideFile("index.ts", script);

const host = new InMemoryHost(fs);

const program = ts.createProgram(["index.ts"], {
	noEmitOnError: true,
}, host);

const emitResult = program.emit();

interface Diagnostic {
	type: "error" | "warning" | "message";
	lineNr: number;
	charNr: number;
	sourceLine: string;
	description: string;
	annotatedSource: string;
}

function repeatString(str: string, count: number): string {
	if (str.repeat != null) return str.repeat(count);
	let ret = "";
	for (let i = 0; i < count; i++) ret += str;
	return ret;
}

const allDiagnostics = emitResult.diagnostics
	.map(diagnostic => {
		const { line: lineNr, character: charNr } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
		const description = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
		const type = ts.DiagnosticCategory[diagnostic.category].toLowerCase() as "error" | "warning" | "message";
		const sourceLine = sourceLines[lineNr];
		const annotatedSource = `${sourceLine}
${repeatString(" ", charNr)}^
${type.toUpperCase()}: ${description}`;
		return {
			type,
			lineNr: lineNr + 1,
			charNr: charNr + 1,
			sourceLine,
			description,
			annotatedSource,
		} as Diagnostic;
	});

allDiagnostics.forEach(d => console.log(d.annotatedSource));

const hasError = !allDiagnostics.every(d => d.type !== "error") || emitResult.emitSkipped;

const exitCode = emitResult.emitSkipped ? 1 : 0;

if (!hasError) {
	console.log("=== COMPILATION SUCCESSFUL ===");
	console.log(fs.readFile("index.js"));
}

console.log(`Process exiting with code '${exitCode}'.`);
process.exit(exitCode);
