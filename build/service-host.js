"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var logger_1 = require("./logger");
// https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API#incremental-build-support-using-the-language-services
/**
 * Implementation of LanguageServiceHost that works with in-memory-only source files
 */
var InMemoryServiceHost = /** @class */ (function () {
    function InMemoryServiceHost(fs, options) {
        this.fs = fs;
        this.options = options;
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
        return ts.ScriptSnapshot.fromString(this.fs.readFile(fileName));
    };
    InMemoryServiceHost.prototype.getCurrentDirectory = function () {
        // return CWD;
        return ts.sys.getCurrentDirectory();
    };
    InMemoryServiceHost.prototype.getDefaultLibFileName = function (options) {
        options = options || this.options;
        logger_1.log("getDefaultLibFileName(" + JSON.stringify(options, null, 4) + ")", "debug");
        return "lib.d.ts";
    };
    InMemoryServiceHost.prototype.readFile = function (path, encoding) {
        logger_1.log("readFile(" + path + ")", "debug");
        if (this.fs.fileExists(path)) {
            return this.fs.readFile(path);
        }
        else if (path.indexOf("node_modules") > -1) {
            return ts.sys.readFile(path);
        }
    };
    InMemoryServiceHost.prototype.fileExists = function (path) {
        logger_1.log("fileExists(" + path + ")", "debug");
        var ret;
        if (this.fs.fileExists(path)) {
            ret = true;
        }
        else if (path.indexOf("node_modules") > -1) {
            ret = ts.sys.fileExists(path);
        }
        logger_1.log("fileExists(" + path + ") => " + ret, "debug");
        return ret;
    };
    InMemoryServiceHost.prototype.readDirectory = function (path, extensions, exclude, include, depth) {
        logger_1.log("readDirectory(\n\t" + path + ",\n\t" + (extensions ? JSON.stringify(extensions) : "null") + ",\n\t" + (exclude ? JSON.stringify(exclude) : "null") + ",\n\t" + (include ? JSON.stringify(include) : "null") + ",\n\t" + depth + ",\n", "debug");
        return ts.sys.readDirectory(path, extensions, exclude, include, depth);
    };
    InMemoryServiceHost.prototype.getDirectories = function (directoryName) {
        logger_1.log("getDirectories(" + directoryName + ")", "debug");
        // typings should be loaded from the virtual fs or we get problems
        if (directoryName.indexOf("node_modules/@types") > -1) {
            return [];
        }
        try {
            return ts.sys.getDirectories(directoryName);
        }
        catch (e) {
            return [];
        }
    };
    return InMemoryServiceHost;
}());
exports.InMemoryServiceHost = InMemoryServiceHost;
// tslint:disable-next-line:max-classes-per-file
var InMemoryWatcherHost = /** @class */ (function () {
    function InMemoryWatcherHost(createProgram, fs, options) {
        this.createProgram = createProgram;
        this.fs = fs;
        this.options = options;
    }
    InMemoryWatcherHost.prototype.afterProgramCreate = function (program) {
        logger_1.log("host", "afterProgramCreate()", "debug");
        // throw new Error("afterProgramCreate not implemented.");
    };
    InMemoryWatcherHost.prototype.onWatchStatusChange = function (diagnostic, newLine, options) {
        logger_1.log("host", "onWatchStatusChange()", "debug");
        // throw new Error("Method not implemented.");
    };
    InMemoryWatcherHost.prototype.useCaseSensitiveFileNames = function () {
        return ts.sys.useCaseSensitiveFileNames;
    };
    InMemoryWatcherHost.prototype.getNewLine = function () {
        return ts.sys.newLine;
    };
    InMemoryWatcherHost.prototype.getCurrentDirectory = function () {
        // return CWD;
        return ts.sys.getCurrentDirectory();
    };
    InMemoryWatcherHost.prototype.getDefaultLibFileName = function (options) {
        logger_1.log("getDefaultLibFileName(" + JSON.stringify(options, null, 4) + ")", "debug");
        return "lib.d.ts";
    };
    InMemoryWatcherHost.prototype.fileExists = function (path) {
        logger_1.log("fileExists(" + path + ")", "debug");
        var ret;
        if (this.fs.fileExists(path)) {
            ret = true;
        }
        else if (path.indexOf("node_modules") > -1) {
            ret = ts.sys.fileExists(path);
        }
        logger_1.log("fileExists(" + path + ") => " + ret, "debug");
        return ret;
    };
    InMemoryWatcherHost.prototype.readFile = function (path, encoding) {
        logger_1.log("readFile(" + path + ")", "debug");
        if (this.fs.fileExists(path)) {
            return this.fs.readFile(path);
        }
        else if (path.indexOf("node_modules") > -1) {
            return ts.sys.readFile(path);
        }
    };
    InMemoryWatcherHost.prototype.getDirectories = function (directoryName) {
        logger_1.log("getDirectories(" + directoryName + ")", "debug");
        // typings should be loaded from the virtual fs or we get problems
        if (directoryName.indexOf("node_modules/@types") > -1) {
            return [];
        }
        try {
            return ts.sys.getDirectories(directoryName);
        }
        catch (e) {
            return [];
        }
    };
    InMemoryWatcherHost.prototype.writeFile = function (path, data) {
        this.fs.writeFile(path, data, true);
    };
    InMemoryWatcherHost.prototype.watchFile = function (path, callback, pollingInterval) {
        logger_1.log("host", "watchFile(path: " + path + ", ...)", "debug");
        // throw new Error("Method not implemented.");
        return {
            close: function () { return void 0; },
        };
    };
    InMemoryWatcherHost.prototype.watchDirectory = function (path, callback, recursive) {
        logger_1.log("host", "watchDirectory(path: " + path + ", , recursive: " + recursive + "...)", "debug");
        // throw new Error("Method not implemented.");
        return {
            close: function () { return void 0; },
        };
    };
    return InMemoryWatcherHost;
}());
exports.InMemoryWatcherHost = InMemoryWatcherHost;
