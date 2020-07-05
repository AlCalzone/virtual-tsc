import { expect } from "chai";
import * as fs from "fs";
import * as ts from "typescript";
import { compile, CompileResult } from "./";
import { log } from "./logger";
import { Server } from "./server";

// tslint:disable:no-unused-expression
// tslint:disable:no-eval

const options = {
	target: ts.ScriptTarget.ES2015,
};

describe("compiler => ", function () {
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
});

describe("performance check =>", function () {
	this.timeout(30000);

	it("compiler", () => {
		const ambient = fs.readFileSync("./test/ioBroker.d.ts", "utf8");
		let result: CompileResult;
		for (let i = 0; i < 5; i++) {
			result = compile(
				`const buf = Buffer.alloc(${i} + 1);
console.log(buf.length)`,
				null, { "global.d.ts": ambient },
			);
			expect(result.success).to.be.true;
			// call durations: ~1200..900 ms
		}
	});

	it("service host", () => {
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
			// call durations: ~1200, then ~100..200 ms for the following calls
		}
	});
});

describe("error detection =>", function () {
	this.timeout(30000);

	const noEmitOnErrorOptions: ts.CompilerOptions = {
		declaration: true,
		target: ts.ScriptTarget.ES2015,
		noEmitOnError: true,
	};
	const emitOnErrorOptions: ts.CompilerOptions = {
		declaration: true,
		target: ts.ScriptTarget.ES2015,
		noEmitOnError: false,
	};

	const noEmitOnErrorServer = new Server(noEmitOnErrorOptions);
	const emitOnErrorServer = new Server(emitOnErrorOptions);
	const ambient = fs.readFileSync("./test/ioBroker.d.ts", "utf8");
	noEmitOnErrorServer.provideAmbientDeclarations({ "global.d.ts": ambient });
	emitOnErrorServer.provideAmbientDeclarations({ "global.d.ts": ambient });

	let resultNoEmitOnError: CompileResult;
	let resultEmitOnError: CompileResult;

	describe("syntax errors => ", () => {
		it("should be detected, regardless of the noEmitOnError setting", () => {
			const codeWithSyntaxError = `const buf = Buffer.alloc(1 +);
console.log(buf.length)`;

			resultEmitOnError = emitOnErrorServer.compile("index.ts", codeWithSyntaxError);
			expect(resultEmitOnError.success).to.be.true;
			expect(resultEmitOnError.diagnostics).to.have.length.of.at.least(1);

			resultNoEmitOnError = noEmitOnErrorServer.compile("index.ts", codeWithSyntaxError);
			expect(resultNoEmitOnError.success).to.be.false;
		});

		it("when noEmitOnError == false, code should still be emitted", () => {
			expect(resultEmitOnError.result)
				.to.exist
				.and.to.equal("const buf = Buffer.alloc(1 + );\r\nconsole.log(buf.length);\r\n")
				;
			expect(resultEmitOnError.declarations)
				.to.exist
				.and.to.equal("declare const buf: Buffer;\r\n")
				;
		});

		it("when noEmitOnError == true, code should NOT be emitted", () => {
			expect(resultNoEmitOnError.result).to.be.undefined;
			expect(resultNoEmitOnError.declarations).to.be.undefined;
		});
	});

	describe("semantic errors => ", () => {
		it("should be detected, regardless of the noEmitOnError setting", () => {
			const codeWithSyntaxError = `let buf: Buffer = "foo"`;

			resultEmitOnError = emitOnErrorServer.compile("index.ts", codeWithSyntaxError);
			expect(resultEmitOnError.success).to.be.true;
			expect(resultEmitOnError.diagnostics).to.have.length.of.at.least(1);

			resultNoEmitOnError = noEmitOnErrorServer.compile("index.ts", codeWithSyntaxError);
			expect(resultNoEmitOnError.success).to.be.false;
		});

		it("when noEmitOnError == false, code should still be emitted", () => {
			expect(resultEmitOnError.result)
				.to.exist
				.and.to.equal("let buf = \"foo\";\r\n")
				;
			expect(resultEmitOnError.declarations)
				.to.exist
				.and.to.equal("declare let buf: Buffer;\r\n")
				;
		});

		it("when noEmitOnError == true, code should NOT be emitted", () => {
			expect(resultNoEmitOnError.result).to.be.undefined;
			expect(resultNoEmitOnError.declarations).to.be.undefined;
		});
	});

});
