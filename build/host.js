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
