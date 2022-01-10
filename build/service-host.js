"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryServiceHost = void 0;
var logger_1 = require("./logger");
var util_1 = require("./util");
// https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API#incremental-build-support-using-the-language-services
/**
 * Implementation of LanguageServiceHost that works with in-memory-only source files
 */
var InMemoryServiceHost = /** @class */ (function () {
    function InMemoryServiceHost(fs, options) {
        this.fs = fs;
        this.options = options;
        this.ts = util_1.getTypeScript();
    }
    InMemoryServiceHost.prototype.getCompilationSettings = function () {
        return this.options;
    };
    InMemoryServiceHost.prototype.getScriptFileNames = function () {
        return this.fs
            .getFilenames()
            .filter(function (f) { return f.endsWith(".ts"); } /* && !f.endsWith(".d.ts") */);
    };
    InMemoryServiceHost.prototype.getScriptVersion = function (fileName) {
        return this.fs.getFileVersion(fileName).toString();
    };
    InMemoryServiceHost.prototype.getScriptSnapshot = function (fileName) {
        if (!this.fs.fileExists(fileName))
            return undefined;
        return this.ts.ScriptSnapshot.fromString(this.fs.readFile(fileName));
    };
    InMemoryServiceHost.prototype.getCurrentDirectory = function () {
        return "";
        // return CWD;
        // return this.ts.sys.getCurrentDirectory();
    };
    InMemoryServiceHost.prototype.getDefaultLibFileName = function (options) {
        options = options || this.options;
        logger_1.log("host", "getDefaultLibFileName(" + JSON.stringify(options, null, 4) + ")", "debug");
        return "lib.d.ts";
    };
    // log?(s: string): void {
    // 	throw new Error("Method not implemented.");
    // }
    // trace?(s: string): void {
    // 	throw new Error("Method not implemented.");
    // }
    // error?(s: string): void {
    // 	throw new Error("Method not implemented.");
    // }
    InMemoryServiceHost.prototype.readFile = function (path, encoding) {
        logger_1.log("host", "readFile(" + path + ")", "debug");
        if (this.fs.fileExists(path)) {
            return this.fs.readFile(path);
        }
        else if (path.indexOf("node_modules") > -1) {
            return this.ts.sys.readFile(path);
        }
    };
    InMemoryServiceHost.prototype.fileExists = function (path) {
        logger_1.log("host", "fileExists(" + path + ")", "debug");
        var ret;
        if (this.fs.fileExists(path)) {
            ret = true;
        }
        else if (path.indexOf("node_modules") > -1) {
            ret = this.ts.sys.fileExists(path);
        }
        logger_1.log("host", "fileExists(" + path + ") => " + ret, "debug");
        return ret;
    };
    InMemoryServiceHost.prototype.readDirectory = function (path, extensions, exclude, include, depth) {
        logger_1.log("host", "readDirectory(\n\t" + path + ",\n\t" + (extensions ? JSON.stringify(extensions) : "null") + ",\n\t" + (exclude ? JSON.stringify(exclude) : "null") + ",\n\t" + (include ? JSON.stringify(include) : "null") + ",\n\t" + depth + ",\n", "debug");
        return this.ts.sys.readDirectory(path, extensions, exclude, include, depth);
    };
    InMemoryServiceHost.prototype.getDirectories = function (directoryName) {
        logger_1.log("host", "getDirectories(" + directoryName + ")", "debug");
        // typings should be loaded from the virtual fs or we get problems
        if (directoryName.indexOf("node_modules/@types") > -1) {
            return [];
        }
        try {
            return this.ts.sys.getDirectories(directoryName);
        }
        catch (e) {
            return [];
        }
    };
    return InMemoryServiceHost;
}());
exports.InMemoryServiceHost = InMemoryServiceHost;
