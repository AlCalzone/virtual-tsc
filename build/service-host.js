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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmljZS1ob3N0LmpzIiwic291cmNlUm9vdCI6IkM6L1VzZXJzL0RvbWluaWMvRG9jdW1lbnRzL1Zpc3VhbCBTdHVkaW8gMjAxNy9SZXBvc2l0b3JpZXMvdmlydHVhbC10c2Mvc3JjLyIsInNvdXJjZXMiOlsic2VydmljZS1ob3N0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsK0JBQWlDO0FBQ2pDLG1DQUErQjtBQUcvQiw0SEFBNEg7QUFFNUg7O0dBRUc7QUFDSDtJQUVDLDZCQUNTLEVBQXFCLEVBQ3JCLE9BQTJCO1FBRDNCLE9BQUUsR0FBRixFQUFFLENBQW1CO1FBQ3JCLFlBQU8sR0FBUCxPQUFPLENBQW9CO0lBR3BDLENBQUM7SUFFTSxvREFBc0IsR0FBN0I7UUFDQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztJQUNyQixDQUFDO0lBRU0sZ0RBQWtCLEdBQXpCO1FBQ0MsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFO2FBQ1osWUFBWSxFQUFFO2FBQ2QsTUFBTSxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBakIsQ0FBaUIsQ0FBQyw2QkFBNkIsQ0FBQyxDQUM3RDtJQUNGLENBQUM7SUFFTSw4Q0FBZ0IsR0FBdkIsVUFBd0IsUUFBZ0I7UUFDdkMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ3BELENBQUM7SUFFTSwrQ0FBaUIsR0FBeEIsVUFBeUIsUUFBZ0I7UUFDeEMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUM7UUFDcEQsTUFBTSxDQUFDLEVBQUUsQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxD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