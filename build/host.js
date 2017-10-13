"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const debugPackage = require("debug");
const nodePath = require("path");
const ts = require("typescript");
const debug = debugPackage("virtual-tsc");
// reference: https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API#customizing-module-resolution
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
            catch (e) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9zdC5qcyIsInNvdXJjZVJvb3QiOiJEOi92aXJ0dWFsLXRzYy9zcmMvIiwic291cmNlcyI6WyJob3N0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQXNDO0FBQ3RDLGlDQUFpQztBQUNqQyxpQ0FBaUM7QUFHakMsTUFBTSxLQUFLLEdBQUcsWUFBWSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBRTFDLCtHQUErRztBQUUvRzs7R0FFRztBQUNIO0lBRUMsWUFDUyxFQUFxQixFQUNyQixPQUEyQjtRQUQzQixPQUFFLEdBQUYsRUFBRSxDQUFtQjtRQUNyQixZQUFPLEdBQVAsT0FBTyxDQUFvQjtJQUdwQyxDQUFDO0lBRU0sYUFBYSxDQUFDLFFBQWdCLEVBQUUsZUFBZ0MsRUFBRSxPQUFtQztRQUMzRyxJQUFJLFdBQW1CLENBQUM7UUFDeEIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2xDLEtBQUssQ0FBQywyQkFBMkIsUUFBUSxjQUFjLGVBQWUsOEJBQThCLENBQUMsQ0FBQztZQUN0RyxXQUFXLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDMUMsQ0FBQztRQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzdDLHFCQUFxQjtZQUNyQixNQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQ3pGLEtBQUssQ0FBQywyQkFBMkIsUUFBUSwyQkFBMkIsT0FBTyxFQUFFLENBQUMsQ0FBQztZQUMvRSxXQUFXLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsT0FBTyxD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