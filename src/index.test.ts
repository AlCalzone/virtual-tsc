import { expect } from "chai";
import * as ts from "typescript";
import { compile, CompileResult } from "./";
import { Server } from "./server";

// tslint:disable:no-unused-expression
// tslint:disable:no-eval

const options = {
	noEmitOnError: false,
	target: ts.ScriptTarget.ES2015,
	// lib: ["lib.es2015.d.ts"],
};

describe.only("compiler API repro => ", function() {

	this.timeout(30000);

	it("noEmitOnError = false", () => {
		const tsserver = new Server(options);
		let result: CompileResult;
		for (let i = 0; i < 5; i++) {
			result = tsserver.compile("index.ts",
				`const buf = Buffer.alloc(${i} + 1);
console.log(buf.length)`,
			);

			expect(result.success).to.be.true;
			expect(result.declarations).to.equal("declare const buf: Buffer;\r\n");
		}
	});

	it("noEmitOnError = true", () => {
		const tsserver = new Server(Object.assign({}, options, {noEmitOnError: true}));
		let result: CompileResult;
		for (let i = 0; i < 5; i++) {
			result = tsserver.compile("index.ts",
				`const buf = Buffer.alloc(${i} + 1);
console.log(buf.length)`,
			);

			expect(result.success).to.be.true;
			expect(result.declarations).to.equal("declare const buf: Buffer;\r\n");
		}
	});
});
