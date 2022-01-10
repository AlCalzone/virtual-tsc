# virtual-tsc

Provides means to compile TypeScript code to JavaScript in memory. 
Requires `typescript` >= v2.0 and `@types/node` as peer dependencies, where `@types/node` should match your NodeJS runtime.

## Usage

```TS
import { compile } from "virtual-tsc";
import * as ts from "typescript";
const result: CompileResult = compile(sourceCode: string, compilerOptions?: ts.CompilerOptions, declarations?);
```
where `CompileResult` looks as follows:
```TS
export interface CompileResult {
    success: boolean;
    diagnostics: Diagnostic[];
    result?: string;
    declarations?: string;
}

export interface Diagnostic {
    type: "error" | "warning" | "message";
    lineNr: number;
    charNr: number;
    sourceLine: string;
    description: string;
    annotatedSource: string;
}
```

## Ambient declarations
`declarations` is an object of the type:
```JS
{
    "filename1.d.ts": "file contents 1",
    // ...
}
```
and is used to specify ambient declarations. Filenames must end in `.d.ts`. For instance you can declare a function `log` that exists in the global scope by providing a file like the following:
```TS
import * as fs from "fs"; // dummy import
declare global {
    function log(text: string);
}
```
To support augmentation of the global scope (like in the above file), you must force TypeScript to treat the file as a module. This can be done by a dummy import of a core NodeJS module.

## Faster compilation with the Language Service API
As of version 0.3.0, this library supports incremental compilation with the TypeScript Language Service API. In simple tests, compile times for recurring compilations could be **reduced by at least 99%**. The usage changes slightly:
```TS
import { Server as TSServer } from "virtual-tsc";

// Create a new instance of the compiler with optional compiler options
const tsserver = new TSServer(options?: ts.CompilerOptions);

// optionally provide ambient declarations
tsserver.provideAmbientDeclarations(declarations);

// compile whenever the source file changes:
const result = tsserver.compile(
	filename /* string */,
	source /* string */
);
```
By providing a filename for the source, it is possible to compile multiple scripts on one instance of the compiler.

## Error-tolerant compilation

By specifying `noEmitOnError: false` on the `compilerOptions` object, you can get a compiled result even if there were build errors. For example, the code
```TS
const test: string = 1
```
then compiles to the valid JavaScript
```JS
var test = 1
```
but you get the additional error message
```JS
const test: string = 1
      ^
ERROR: Type '1' is not assignable to type 'string'.
```

## Changelog
<!--
	Placeholder for the next version (at the beginning of the line):
	### __WORK IN PROGRESS__
-->
### 0.6.2 (2022-01-10)
* (AlCalzone) Replaced corrupted `colors` dependency with `picocolors`

### 0.6.1 (2020-07-05)
* (AlCalzone) Allow `package.json` as ambient declarations, use "" as the current directory

### 0.6.0 (2020-06-09)
* (AlCalzone) Expose `setTypeScriptResolveOptions` to set the options for resolving TypeScript and its lib files.

### 0.5.0 (2020-01-28)
* (AlCalzone) Passing `false` as the 2nd parameter to the Server constructor disables logging.

### 0.4.6 (2018-08-03)
* (AlCalzone) Allow TypeScript v3+ as a peer dependency

### 0.4.5 (2018-05-30)
* (AlCalzone) Fixed performance issues when `declaration` and `noEmitOnError` are both `true`

### 0.4.1 (2018-05-23)
* (AlCalzone) Allow emitting only declaration files

### 0.4.0 (2018-05-23)
* (AlCalzone) Emit declaration files (*.d.ts), enabled by default

### 0.3.4 (2017-11-26)
* (AlCalzone) Added a custom logger output

### 0.3.3 (2017-11-14)
* (AlCalzone) Fixed lib resolution for the LanguageServiceAPI

### 0.3.2 (2017-11-09)
* (AlCalzone) Use the LanguageServiceAPI to speed up multiple compilations

### 0.2.3 (2017-10-13)
* (AlCalzone) Fixed module resolution on Linux
* (AlCalzone) Added async compile method

### 0.2.2 (2017-10-13)
* (AlCalzone) support NodeJS 4

### 0.2.1 (2017-10-13)
* (AlCalzone) support output of builds with errors

### 0.2.0 (2017-10-13)
* (AlCalzone) support ambient declarations

### 0.1.0 (2017-10-13)
* (AlCalzone) initial release. 

## License
The MIT License (MIT)

Copyright (c) 2017 AlCalzone <d.griesel@gmx.net>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
