import { expect } from "chai";
import * as fs from "fs";
import * as ts from "typescript";
import { compile, CompileResult } from "./";
import { log } from "./logger";
import { Server } from "./server";

// tslint:disable:no-unused-expression
// tslint:disable:no-eval

const options = {
	// for now allow failed compilation
	// remove this line when we have an ambient declaration
	// for the script adapter
	// noEmitOnError: false,
	// change this to "es6" if we're dropping support for NodeJS 4.x
	target: ts.ScriptTarget.ES2015,
	// we need this for the native promise support in NodeJS 4.x
	lib: ["lib.es2015.d.ts"],
	watch: true,
};

describe("compiler => ", function() {

	this.timeout(30000);

	it("it should not explode", () => {
		const result = compile("", options);
		expect(result.success).to.be.true;
		expect(result.diagnostics).to.be.empty;
		expect(result.result).to.equal("");
	});

	it("some basic stuff should work", () => {
		const source = `let ret: number = 0;
for (const x of [1,2,3,4,5]) ret += x;
ret;`;
		const result = compile(source);
		expect(result.success).to.be.true;
		expect(result.diagnostics).to.be.empty;
		expect(eval(result.result)).to.equal(15);
	});

	it("it should report an error on type mismatch", () => {
		const result = compile(`const x: number = "1";`);
		expect(result.success).to.be.false;
		expect(result.diagnostics).to.have.length(1);
		expect(result.diagnostics[0].type).to.equal("error");
		expect(result.result).to.be.undefined;
	});

	it("it should report syntax errors", () => {
		const result = compile(`const x: number = ;`);
		expect(result.success).to.be.false;
		expect(result.diagnostics).to.have.length(1);
		expect(result.diagnostics[0].type).to.equal("error");
		expect(result.result).to.be.undefined;
	});

	it("it should detect functions in ambient declarations", () => {

		const ambient = `import * as fs from "fs"; // dummy import
declare global {
	function log(text: string);
}`;
		let result = compile(`log("this fails");`);
		expect(result.success).to.be.false;
		result = compile(`log("this succeeds");`, null, { "global.d.ts": ambient });
		expect(result.success).to.be.true;

	});

	it("it should force ambient declarations to be .d.ts files", () => {
		expect(() => compile("", null, { "global.ts": "" })).to.throw();
	});

	describe("performance check =>", () => {
		it("compile()", function() {
			this.timeout(10000);
			const ambient = fs.readFileSync("./test/ioBroker.d.ts", "utf8");
			let result: CompileResult;
			for (let i = 0; i < 5; i++) {
				result = compile(
					`const buf = Buffer.alloc(${i} + 1);
console.log(buf.length)`,
					null, { "global.d.ts": ambient },
				);
				expect(result.success).to.be.true;
				// about 700ms per call
			}
		});

		it.only("service host", () => {
			const tsserver = new Server(options);
			const ambient = fs.readFileSync("./test/ioBroker.d.ts", "utf8");
			tsserver.provideAmbientDeclarations({ "global.d.ts": ambient });
			let result: CompileResult;
			for (let i = 0; i < 5; i++) {
				log("starting compilation", "info");
				result = tsserver.compile("index.ts",
					`const buf = Buffer.alloc(${i} + 1);
console.log(buf.length)`,
				);
				log("compilation done!", "info");
				expect(result.success).to.be.true;
				expect(result.declarations).to.equal("declare const buf: Buffer;\r\n");
				// about 4ms per call (after the 1st one)
			}
		});
	});

});
