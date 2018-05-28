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
	noEmitOnError: false,
	// change this to "es6" if we're dropping support for NodeJS 4.x
	target: ts.ScriptTarget.ES2015,
	// we need this for the native promise support in NodeJS 4.x
	lib: ["lib.es2015.d.ts"],
};

describe.only("compiler API repro => ", function() {

	this.timeout(30000);

	it("noEmitOnError = false", () => {
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

	it("noEmitOnError = true", () => {
		const tsserver = new Server(Object.assign({}, options, {noEmitOnError: true}));
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
