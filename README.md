# virtual-tsc

Provides means to compile TypeScript code to JavaScript in memory. 
Requires `typescript` >= v2.0 and `@types/node` as peer dependencies, where `@types/node` should match your NodeJS runtime.

Usage:
```
import { compile } from "virtual-tsc";
import * as ts from "typescript";
const result: CompileResult = compile(sourceCode: string, compilerOptions: ts.CompilerOptions);
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
```

## Changelog

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
