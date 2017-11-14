"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var debugPackage = require("debug");
var ts = require("typescript");
var debug = debugPackage("virtual-tsc");
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
        debug("getDefaultLibFileName(" + JSON.stringify(options, null, 4) + ")");
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
        debug("readFile(" + path + ")");
        if (this.fs.fileExists(path)) {
            return this.fs.readFile(path);
        }
        else if (path.indexOf("node_modules") > -1) {
            return ts.sys.readFile(path);
        }
    };
    InMemoryServiceHost.prototype.fileExists = function (path) {
        debug("fileExists(" + path + ")");
        var ret;
        if (this.fs.fileExists(path)) {
            ret = true;
        }
        else if (path.indexOf("node_modules") > -1) {
            ret = ts.sys.fileExists(path);
        }
        debug("fileExists(" + path + ") => " + ret);
        return ret;
    };
    InMemoryServiceHost.prototype.readDirectory = function (path, extensions, exclude, include, depth) {
        debug("readDirectory(\n\t" + path + ",\n\t" + (extensions ? JSON.stringify(extensions) : "null") + ",\n\t" + (exclude ? JSON.stringify(exclude) : "null") + ",\n\t" + (include ? JSON.stringify(include) : "null") + ",\n\t" + depth + ",\n");
        return ts.sys.readDirectory(path, extensions, exclude, include, depth);
    };
    InMemoryServiceHost.prototype.getDirectories = function (directoryName) {
        debug("getDirectories(" + directoryName + ")");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmljZS1ob3N0LmpzIiwic291cmNlUm9vdCI6IkM6L1VzZXJzL0RvbWluaWMvRG9jdW1lbnRzL1Zpc3VhbCBTdHVkaW8gMjAxNy9SZXBvc2l0b3JpZXMvdmlydHVhbC10c2Mvc3JjLyIsInNvdXJjZXMiOlsic2VydmljZS1ob3N0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0NBQXNDO0FBRXRDLCtCQUFpQztBQUdqQyxJQUFNLEtBQUssR0FBRyxZQUFZLENBQUMsYUFBYSxDQUFDLENBQUM7QUFFMUMsNEhBQTRIO0FBRTVIOztHQUVHO0FBQ0g7SUFFQyw2QkFDUyxFQUFxQixFQUNyQixPQUEyQjtRQUQzQixPQUFFLEdBQUYsRUFBRSxDQUFtQjtRQUNyQixZQUFPLEdBQVAsT0FBTyxDQUFvQjtJQUdwQyxDQUFDO0lBRU0sb0RBQXNCLEdBQTdCO1FBQ0MsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7SUFDckIsQ0FBQztJQUVNLGdEQUFrQixHQUF6QjtRQUNDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRTthQUNaLFlBQVksRUFBRTthQUNkLE1BQU0sQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQWpCLENBQWlCLENBQUMsNkJBQTZCLENBQUMsQ0FDN0Q7SUFDRixDQUFDO0lBRU0sOENBQWdCLEdBQXZCLFVBQXdCLFFBQWdCO1FBQ3ZDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUNwRCxDQUFDO0lBRU0sK0NBQWlCLEdBQXhCLFVBQXlCLFFBQWdCO1FBQ3hDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7WUFBQyxNQUFNLENBQUMsU0FBUyxDQUFDO1FBQ3BELE1BQU0sQ0FBQyxFQUFFLENBQUMsY0FBYyxDQUFDLFVBQVUs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