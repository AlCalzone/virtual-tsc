"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryHost = void 0;
var nodePath = __importStar(require("path"));
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
        this.ts = util_1.getTypeScript();
    }
    InMemoryHost.prototype.getSourceFile = function (fileName, languageVersion, onError) {
        var fileContent;
        if (this.fs.fileExists(fileName)) {
            logger_1.log("getSourceFile(fileName=\"" + fileName + "\", version=" + languageVersion + ") => returning provided file", "debug");
            fileContent = this.fs.readFile(fileName);
        }
        else if (/^lib\..*?d\.ts$/.test(fileName)) {
            // resolving lib file
            var libPath = nodePath.join(nodePath.dirname(require.resolve("typescript", util_1.getTypeScriptResolveOptions())), fileName);
            logger_1.log("getSourceFile(fileName=\"" + fileName + "\") => resolved lib file " + libPath, "debug");
            fileContent = this.ts.sys.readFile(libPath);
            if (fileContent != null)
                this.fs.writeFile(fileName, fileContent, true);
        }
        else if (/\@types\/.+$/.test(fileName)) {
            // resolving a specific node module
            logger_1.log("getSourceFile(fileName=\"" + fileName + "\") => resolving typings", "debug");
            fileName = util_1.resolveTypings(fileName);
            fileContent = this.ts.sys.readFile(fileName);
            if (fileContent != null)
                this.fs.writeFile(fileName, fileContent, true);
        }
        if (fileContent != null) {
            logger_1.log("file content is not null", "debug");
            return this.ts.createSourceFile(fileName, this.fs.readFile(fileName), languageVersion);
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
        var ret = this.ts.sys.getCurrentDirectory();
        logger_1.log("getCurrentDirectory() => " + ret, "debug");
        return ret;
    };
    InMemoryHost.prototype.getDirectories = function (path) {
        logger_1.log("getDirectories(" + path + ")", "debug");
        throw new Error("Method not implemented.");
    };
    InMemoryHost.prototype.getCanonicalFileName = function (fileName) {
        logger_1.log("getCanonicalFileName(" + fileName + ")", "debug");
        return this.ts.sys.useCaseSensitiveFileNames ? fileName : fileName.toLowerCase();
    };
    InMemoryHost.prototype.useCaseSensitiveFileNames = function () {
        logger_1.log("useCaseSensitiveFileNames()", "debug");
        return this.ts.sys.useCaseSensitiveFileNames;
    };
    InMemoryHost.prototype.getNewLine = function () {
        logger_1.log("getNewLine()", "debug");
        return this.ts.sys.newLine;
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
