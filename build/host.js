"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const debugPackage = require("debug");
const path = require("path");
const ts = require("typescript");
const debug = debugPackage("virtual-tsc");
// see https://github.com/Microsoft/TypeScript/issues/13629 for an implementation
// also: https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API#customizing-module-resolution
/**
 * Implementation of CompilerHost that works with in-memory-only source files
 */
class InMemoryHost {
    constructor(fs) {
        this.fs = fs;
    }
    getSourceFile(fileName, languageVersion, onError) {
        let fileContent;
        if (this.fs.fileExists(fileName)) {
            debug(`getSourceFile(fileName="${fileName}", version=${languageVersion}) => returning provided file`);
            fileContent = this.fs.readFile(fileName);
        }
        else if (/^lib\..*?d\.ts$/.test(fileName)) {
            // resolving lib file
            const libPath = path.join(path.dirname(require.resolve("typescript")), fileName);
            debug(`getSourceFile(fileName="${fileName}") => resolved lib file ${libPath}`);
            fileContent = ts.sys.readFile(libPath);
            if (fileContent != null)
                this.fs.provideFile(fileName, fileContent, true);
        }
        if (fileContent != null) {
            debug("file content is not null");
            return ts.createSourceFile(fileName, this.fs.readFile(fileName), languageVersion);
        }
        else {
            debug("file content is null");
        }
    }
    getDefaultLibFileName(options) {
        debug(`getDefaultLibFileName(${JSON.stringify(options, null, 4)})`);
        return "lib.d.ts";
    }
    writeFile(path, content) {
        debug(`writeFile(path="${path}")`);
        this.fs.provideFile(path, content, true);
    }
    getCurrentDirectory() {
        const ret = ts.sys.getCurrentDirectory();
        debug(`getCurrentDirectory() => ${ret}`);
        return ret;
    }
    getDirectories(path) {
        debug(`getDirectories(${path})`);
        throw new Error("Method not implemented.");
    }
    getCanonicalFileName(fileName) {
        debug(`getCanonicalFileName(${fileName})`);
        return ts.sys.useCaseSensitiveFileNames ? fileName : fileName.toLowerCase();
    }
    useCaseSensitiveFileNames() {
        debug(`useCaseSensitiveFileNames()`);
        return ts.sys.useCaseSensitiveFileNames;
    }
    getNewLine() {
        debug(`getNewLine()`);
        return ts.sys.newLine;
    }
    // public resolveModuleNames?(moduleNames: string[], containingFile: string): ts.ResolvedModule[] {
    // 	throw new Error("Method not implemented.");
    // }
    fileExists(fileName) {
        debug(`fileExists(${fileName})`);
        return this.fs.fileExists(fileName);
    }
    readFile(fileName) {
        debug(`readFile(${fileName})`);
        return this.fs.readFile(fileName);
    }
}
exports.InMemoryHost = InMemoryHost;
//# sourceMappingURL=host.js.map