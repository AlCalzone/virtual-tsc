# virtual-tsc

Provides means to compile TypeScript code to JavaScript in memory. 
Requires `typescript` >= v2.0 and `@types/node` as peer dependencies, where `@types/node` should match your NodeJS runtime.

## Usage

```
import { compile } from "virtual-tsc";
import * as ts from "typescript";
const result: CompileResult = compile(sourceCode: string, compilerOptions?: ts.CompilerOptions, declarations?);
```
where `CompileResult` looks as follows:
```
export interface CompileResult {
	success: boolean;
	diagnostics: Diagnostic[];
	result?: string;
}

export interface Diagnostic {
	type: "error" | "warning" | "message";
	lineNr: number;
	charNr: number;
	sourceLine: string;
	description: string;
	annotatedSource: string;
}

## Ambient declarations

```
`declarations` is an object of the type:
```
{
	"filename1.d.ts": "file contents 1",
	// ...
}
```
and is used to specify ambient declarations. Filenames must end in `.d.ts`. For instance you can declare a function log that exists in the global scope by providing a file like the following:
```
import * as fs from "fs"; // dummy import
declare global {
	function log(text: string);
}
```
To support augmentation of the global scope (like in the above file), you must force TypeScript to treat the file as a module. This can be done by a dummy import of a core NodeJS module.

## Error-tolerant compilation

By specifying `noEmitOnError: false` on the `compilerOptions` object, you can get a compiled result even if there were build errors. For example, the code
```
const test: string = 1
```
then compiles to the valid JavaScript
```
var test = 1
```
but you get the additional error message
```
const test: string = 1
      ^
ERROR: Type '1' is not assignable to type 'string'.
```

## Changelog

#### 0.3.0 (2017-11-XX)
* (AlCalzone) Use the LanguageServiceAPI to speed up multiple compilations

#### 0.2.3 (2017-10-13)
* (AlCalzone) Fixed module resolution on Linux
* (AlCalzone) Added async compile method

#### 0.2.2 (2017-10-13)
* (AlCalzone) support NodeJS 4

#### 0.2.1 (2017-10-13)
* (AlCalzone) support output of builds with errors

#### 0.2.0 (2017-10-13)
* (AlCalzone) support ambient declarations

#### 0.1.0 (2017-10-13)
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
