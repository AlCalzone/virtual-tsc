import { assert, expect } from "chai";
import { compile, CompileResult, Diagnostic } from "./";
// tslint:disable:no-unused-expression
// tslint:disable:no-eval

describe("compiler => ", () => {

	it("it should not explode", () => {
		const result = compile("");
		expect(result.success).to.be.true;
		expect(result.diagnostics).to.be.empty;
		expect(result.result).to.equal("");
	});

	it("some basic stuff should work", () => {
		const ts = `let ret: number = 0;
for (const x of [1,2,3,4,5]) ret += x;
ret;`;
		const result = compile(ts);
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
		result = compile(`log("this succeeds");`, null, {"global.d.ts": ambient});
		expect(result.success).to.be.true;

	});

	it("it should force ambient declarations to be .d.ts files", () => {
		expect(() => compile("", null, {"global.ts": ""})).to.throw();
	});

});
