"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const debugPackage = require("debug");
const nodePath = require("path");
const ts = require("typescript");
const debug = debugPackage("virtual-tsc");
// see https://github.com/Microsoft/TypeScript/issues/13629 for an implementation
// also: https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API#customizing-module-resolution
const NODEJS_MODULES = [
    "fs", "path",
];
/**
 * Implementation of CompilerHost that works with in-memory-only source files
 */
class InMemoryHost {
    constructor(fs, options) {
        this.fs = fs;
        this.options = options;
    }
    getSourceFile(fileName, languageVersion, onError) {
        let fileContent;
        if (this.fs.fileExists(fileName)) {
            debug(`getSourceFile(fileName="${fileName}", version=${languageVersion}) => returning provided file`);
            fileContent = this.fs.readFile(fileName);
        }
        else if (/^lib\..*?d\.ts$/.test(fileName)) {
            // resolving lib file
            const libPath = nodePath.join(nodePath.dirname(require.resolve("typescript")), fileName);
            debug(`getSourceFile(fileName="${fileName}") => resolved lib file ${libPath}`);
            fileContent = ts.sys.readFile(libPath);
            if (fileContent != null)
                this.fs.provideFile(fileName, fileContent, true);
        }
        else {
            // resolving a specific node module
            debug(`getSourceFile(fileName="${fileName}") => resolving typings`);
            fileContent = ts.sys.readFile(fileName);
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
        options = options || this.options;
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
    resolveModuleNames(moduleNames, containingFile) {
        debug(`resolveModuleNames(${moduleNames})`);
        return moduleNames.map(moduleName => {
            {
                const result = ts.resolveModuleName(moduleName, containingFile, this.options, {
                    fileExists: this.fileExists.bind(this),
                    readFile: this.readFile.bind(this),
                });
                if (result.resolvedModule)
                    return result.resolvedModule;
            }
            try {
                const fileName = require.resolve(moduleName);
                if (fileName === moduleName)
                    return; // internal module
                debug(`resolved ${moduleName} => ${fileName}`);
                return {
                    resolvedFileName: fileName,
                };
            }
            catch (_a) {
                /* Not found */
            }
        });
    }
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