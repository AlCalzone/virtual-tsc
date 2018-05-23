const { compile } = require("../");
const ts = require("typescript");

const sourceCode = `
function foo(): void { }
`

/** @type {ts.CompilerOptions} */
const compilerOptions = {
	declaration: true,
};

const result = compile(
	sourceCode, 
	compilerOptions, 
);

console.log(result.result.toString());
console.log();
console.log(result.declarations.toString());

