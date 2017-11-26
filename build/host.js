"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var nodePath = require("path");
var ts = require("typescript");
var logger_1 = require("./logger");
var util_1 = require("./util");
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
            logger_1.log("getSourceFile(fileName=\"" + fileName + "\", version=" + languageVersion + ") => returning provided file", "debug");
            fileContent = this.fs.readFile(fileName);
        }
        else if (/^lib\..*?d\.ts$/.test(fileName)) {
            // resolving lib file
            var libPath = nodePath.join(nodePath.dirname(require.resolve("typescript")), fileName);
            logger_1.log("getSourceFile(fileName=\"" + fileName + "\") => resolved lib file " + libPath, "debug");
            fileContent = ts.sys.readFile(libPath);
            if (fileContent != null)
                this.fs.writeFile(fileName, fileContent, true);
        }
        else if (/\@types\/.+$/.test(fileName)) {
            // resolving a specific node module
            logger_1.log("getSourceFile(fileName=\"" + fileName + "\") => resolving typings", "debug");
            fileName = util_1.resolveTypings(fileName);
            fileContent = ts.sys.readFile(fileName);
            if (fileContent != null)
                this.fs.writeFile(fileName, fileContent, true);
        }
        if (fileContent != null) {
            logger_1.log("file content is not null", "debug");
            return ts.createSourceFile(fileName, this.fs.readFile(fileName), languageVersion);
        }
        else {
            logger_1.log("file content is null", "debug");
        }
    };
    InMemoryHost.prototype.getDefaultLibFileName = function (options) {
        options = options || this.options;
        logger_1.log("getDefaultLibFileName(" + JSON.stringify(options, null, 4) + ")", "debug");
        return "lib.d.ts";
    };
    InMemoryHost.prototype.writeFile = function (path, content) {
        logger_1.log("writeFile(path=\"" + path + "\")", "debug");
        this.fs.writeFile(path, content, true);
    };
    InMemoryHost.prototype.getCurrentDirectory = function () {
        var ret = ts.sys.getCurrentDirectory();
        logger_1.log("getCurrentDirectory() => " + ret, "debug");
        return ret;
    };
    InMemoryHost.prototype.getDirectories = function (path) {
        logger_1.log("getDirectories(" + path + ")", "debug");
        throw new Error("Method not implemented.");
    };
    InMemoryHost.prototype.getCanonicalFileName = function (fileName) {
        logger_1.log("getCanonicalFileName(" + fileName + ")", "debug");
        return ts.sys.useCaseSensitiveFileNames ? fileName : fileName.toLowerCase();
    };
    InMemoryHost.prototype.useCaseSensitiveFileNames = function () {
        logger_1.log("useCaseSensitiveFileNames()", "debug");
        return ts.sys.useCaseSensitiveFileNames;
    };
    InMemoryHost.prototype.getNewLine = function () {
        logger_1.log("getNewLine()", "debug");
        return ts.sys.newLine;
    };
    // public resolveModuleNames?(moduleNames: string[], containingFile: string): ts.ResolvedModule[] {
    // 	log(`resolveModuleNames(${moduleNames})`);
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
    // 			log(`resolved ${moduleName} => ${fileName}`);
    // 			return {
    // 				resolvedFileName: fileName,
    // 			} as ts.ResolvedModule;
    // 		} catch (e) {
    // 			/* Not found */
    // 		}
    // 	});
    // }
    InMemoryHost.prototype.fileExists = function (fileName) {
        logger_1.log("fileExists(" + fileName + ")", "debug");
        return this.fs.fileExists(fileName);
    };
    InMemoryHost.prototype.readFile = function (fileName) {
        logger_1.log("readFile(" + fileName + ")", "debug");
        return this.fs.readFile(fileName);
    };
    return InMemoryHost;
}());
exports.InMemoryHost = InMemoryHost;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9zdC5qcyIsInNvdXJjZVJvb3QiOiJDOi9Vc2Vycy9Eb21pbmljL0RvY3VtZW50cy9WaXN1YWwgU3R1ZGlvIDIwMTcvUmVwb3NpdG9yaWVzL3ZpcnR1YWwtdHNjL3NyYy8iLCJzb3VyY2VzIjpbImhvc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwrQkFBaUM7QUFDakMsK0JBQWlDO0FBQ2pDLG1DQUErQjtBQUMvQiwrQkFBd0M7QUFHeEMsK0dBQStHO0FBRS9HOztHQUVHO0FBQ0g7SUFFQyxzQkFDUyxFQUFxQixFQUNyQixPQUEyQjtRQUQzQixPQUFFLEdBQUYsRUFBRSxDQUFtQjtRQUNyQixZQUFPLEdBQVAsT0FBTyxDQUFvQjtJQUdwQyxDQUFDO0lBRU0sb0NBQWEsR0FBcEIsVUFBcUIsUUFBZ0IsRUFBRSxlQUFnQyxFQUFFLE9BQW1DO1FBQzNHLElBQUksV0FBbUIsQ0FBQztRQUN4QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbEMsWUFBRyxDQUFDLDhCQUEyQixRQUFRLG9CQUFjLGVBQWUsaUNBQThCLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDN0csV0FBVyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzFDLENBQUM7UUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM3QyxxQkFBcUI7WUFDckIsSUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUN6RixZQUFHLENBQUMsOEJBQTJCLFFBQVEsaUNBQTJCLE9BQVMsRUFBRSxPQUFPLENBQUMsQ0FBQztZQUN0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