const { Server } = require("../");
const ts = require("typescript");

const sourceCode = `
function foo() { }
if ( 
	;
foo();
function bar() {return "foo"}
`

/** @type {ts.CompilerOptions} */
const compilerOptions = {
	emitDeclarationOnly: true,
	noEmitOnError: false,
	noImplicitAny: false,
	strict: false,
	//emitDeclarationOnly: true,
	// allowJs: true,
	// checkJs: true,
	// allowNonTsExtensions: true,
};

const compiler = new Server(compilerOptions);

const result = compiler.compile("foo.ts", sourceCode);

console.dir(result);
//console.log(result.result.toString());
//console.log();
//console.log(result.declarations.toString());

