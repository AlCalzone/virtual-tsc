"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var debugPackage = require("debug");
var nodePath = require("path");
var ts = require("typescript");
var util_1 = require("./util");
var debug = debugPackage("virtual-tsc");
// reference: https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API#customizing-module-resolution
/**
 * Implementation of CompilerHost that works with in-memory-only source files
 */
var InMemoryHost = (function () {
    function InMemoryHost(fs, options) {
        this.fs = fs;
        this.options = options;
    }
    InMemoryHost.prototype.getSourceFile = function (fileName, languageVersion, onError) {
        var fileContent;
        if (this.fs.fileExists(fileName)) {
            debug("getSourceFile(fileName=\"" + fileName + "\", version=" + languageVersion + ") => returning provided file");
            fileContent = this.fs.readFile(fileName);
        }
        else if (/^lib\..*?d\.ts$/.test(fileName)) {
            // resolving lib file
            var libPath = nodePath.join(nodePath.dirname(require.resolve("typescript")), fileName);
            debug("getSourceFile(fileName=\"" + fileName + "\") => resolved lib file " + libPath);
            fileContent = ts.sys.readFile(libPath);
            if (fileContent != null)
                this.fs.writeFile(fileName, fileContent, true);
        }
        else if (/\@types\/.+$/.test(fileName)) {
            // resolving a specific node module
            debug("getSourceFile(fileName=\"" + fileName + "\") => resolving typings");
            fileName = util_1.resolveTypings(fileName);
            fileContent = ts.sys.readFile(fileName);
            if (fileContent != null)
                this.fs.writeFile(fileName, fileContent, true);
        }
        if (fileContent != null) {
            debug("file content is not null");
            return ts.createSourceFile(fileName, this.fs.readFile(fileName), languageVersion);
        }
        else {
            debug("file content is null");
        }
    };
    InMemoryHost.prototype.getDefaultLibFileName = function (options) {
        options = options || this.options;
        debug("getDefaultLibFileName(" + JSON.stringify(options, null, 4) + ")");
        return "lib.d.ts";
    };
    InMemoryHost.prototype.writeFile = function (path, content) {
        debug("writeFile(path=\"" + path + "\")");
        this.fs.writeFile(path, content, true);
    };
    InMemoryHost.prototype.getCurrentDirectory = function () {
        var ret = ts.sys.getCurrentDirectory();
        debug("getCurrentDirectory() => " + ret);
        return ret;
    };
    InMemoryHost.prototype.getDirectories = function (path) {
        debug("getDirectories(" + path + ")");
        throw new Error("Method not implemented.");
    };
    InMemoryHost.prototype.getCanonicalFileName = function (fileName) {
        debug("getCanonicalFileName(" + fileName + ")");
        return ts.sys.useCaseSensitiveFileNames ? fileName : fileName.toLowerCase();
    };
    InMemoryHost.prototype.useCaseSensitiveFileNames = function () {
        debug("useCaseSensitiveFileNames()");
        return ts.sys.useCaseSensitiveFileNames;
    };
    InMemoryHost.prototype.getNewLine = function () {
        debug("getNewLine()");
        return ts.sys.newLine;
    };
    // public resolveModuleNames?(moduleNames: string[], containingFile: string): ts.ResolvedModule[] {
    // 	debug(`resolveModuleNames(${moduleNames})`);
    // 	return moduleNames.map(moduleName => {
    // 		{ // try to use standard resolution
    // 			const result = ts.resolveModuleName(
    // 				moduleName, containingFile,
    // 				this.options,
    // 				{
    // 					fileExists: this.fileExists.bind(this),
    // 					readFile: this.readFile.bind(this),
    // 				},
    // 			);
    // 			if (result.resolvedModule) return result.resolvedModule;
    // 		}
    // 		try { // fall back to NodeJS resolution
    // 			const fileName = require.resolve(moduleName);
    // 			if (fileName === moduleName) return; // internal module
    // 			debug(`resolved ${moduleName} => ${fileName}`);
    // 			return {
    // 				resolvedFileName: fileName,
    // 			} as ts.ResolvedModule;
    // 		} catch (e) {
    // 			/* Not found */
    // 		}
    // 	});
    // }
    InMemoryHost.prototype.fileExists = function (fileName) {
        debug("fileExists(" + fileName + ")");
        return this.fs.fileExists(fileName);
    };
    InMemoryHost.prototype.readFile = function (fileName) {
        debug("readFile(" + fileName + ")");
        return this.fs.readFile(fileName);
    };
    return InMemoryHost;
}());
exports.InMemoryHost = InMemoryHost;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9zdC5qcyIsInNvdXJjZVJvb3QiOiJEOi92aXJ0dWFsLXRzYy9zcmMvIiwic291cmNlcyI6WyJob3N0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0NBQXNDO0FBQ3RDLCtCQUFpQztBQUNqQywrQkFBaUM7QUFFakMsK0JBQXdDO0FBRXhDLElBQU0sS0FBSyxHQUFHLFlBQVksQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUUxQywrR0FBK0c7QUFFL0c7O0dBRUc7QUFDSDtJQUVDLHNCQUNTLEVBQXFCLEVBQ3JCLE9BQTJCO1FBRDNCLE9BQUUsR0FBRixFQUFFLENBQW1CO1FBQ3JCLFlBQU8sR0FBUCxPQUFPLENBQW9CO0lBR3BDLENBQUM7SUFFTSxvQ0FBYSxHQUFwQixVQUFxQixRQUFnQixFQUFFLGVBQWdDLEVBQUUsT0FBbUM7UUFDM0csSUFBSSxXQUFtQixDQUFDO1FBQ3hCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNsQyxLQUFLLENBQUMsOEJBQTJCLFFBQVEsb0JBQWMsZUFBZSxpQ0FBOEIsQ0FBQyxDQUFDO1lBQ3RHLFdBQVcsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMxQyxDQUFDO1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDN0MscUJBQXFCO1lBQ3JCLElBQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDekYsS0FBSyxDQUFDLDhCQUEyQixRQUFRLGlDQUEyQixPQUFTLENBQUMsQ0FBQztZQUMvRSxXQUFXLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FB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