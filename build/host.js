"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var debugPackage = require("debug");
var nodePath = require("path");
var ts = require("typescript");
var debug = debugPackage("virtual-tsc");
// reference: https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API#customizing-module-resolution
/**
 * Implementation of CompilerHost that works with in-memory-only source files
 */
var InMemoryHost = /** @class */ (function () {
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
            fileName = this.resolveTypings(fileName);
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
    InMemoryHost.prototype.resolveTypings = function (typings) {
        if (!startsWith(typings, "@types") || nodePath.isAbsolute(typings)) {
            // this is an absolute path
            typings = typings.substr(typings.indexOf("@types"));
        }
        debug("resolveTypings(" + typings + ")");
        var pathParts = __dirname.split(nodePath.sep);
        // start with / on linux
        if (startsWith(__dirname, nodePath.sep))
            pathParts.unshift(nodePath.sep);
        // try all dirs up to the root
        for (var i = 0; i < pathParts.length; i++) {
            var path = nodePath.join.apply(nodePath, (pathParts.slice(0, pathParts.length - i)).concat(["node_modules", typings]));
            debug(" => trying " + path);
            if (ts.sys.fileExists(path)) {
                debug(" => success");
                return path;
            }
        }
        debug(" => no success");
        return null;
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
function startsWith(str, match) {
    return (str.length >= match.length &&
        str.substr(0, match.length) === match);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9zdC5qcyIsInNvdXJjZVJvb3QiOiJDOi9Vc2Vycy9Eb21pbmljL0RvY3VtZW50cy9WaXN1YWwgU3R1ZGlvIDIwMTcvUmVwb3NpdG9yaWVzL3ZpcnR1YWwtdHNjL3NyYy8iLCJzb3VyY2VzIjpbImhvc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxvQ0FBc0M7QUFDdEMsK0JBQWlDO0FBQ2pDLCtCQUFpQztBQUdqQyxJQUFNLEtBQUssR0FBRyxZQUFZLENBQUMsYUFBYSxDQUFDLENBQUM7QUFFMUMsK0dBQStHO0FBRS9HOztHQUVHO0FBQ0g7SUFFQyxzQkFDUyxFQUFxQixFQUNyQixPQUEyQjtRQUQzQixPQUFFLEdBQUYsRUFBRSxDQUFtQjtRQUNyQixZQUFPLEdBQVAsT0FBTyxDQUFvQjtJQUdwQyxDQUFDO0lBRU0sb0NBQWEsR0FBcEIsVUFBcUIsUUFBZ0IsRUFBRSxlQUFnQyxFQUFFLE9BQW1DO1FBQzNHLElBQUksV0FBbUIsQ0FBQztRQUN4QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbEMsS0FBSyxDQUFDLDhCQUEyQixRQUFRLG9CQUFjLGVBQWUsaUNBQThCLENBQUMsQ0FBQztZQUN0RyxXQUFXLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDMUMsQ0FBQztRQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzdDLHFCQUFxQjtZQUNyQixJQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQ3pGLEtBQUssQ0FBQyw4QkFBMkIsUUFBUSxpQ0FBMkIsT0FBUyxD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