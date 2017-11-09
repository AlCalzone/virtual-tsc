"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var debugPackage = require("debug");
var nodePath = require("path");
var ts = require("typescript");
var debug = debugPackage("virtual-tsc");
// https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API#incremental-build-support-using-the-language-services
/**
 * Implementation of LanguageServiceHost that works with in-memory-only source files
 */
var InMemoryServiceHost = (function () {
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
        else if (/lib\..*?d\.ts/.test(path)) {
            var libFile = /lib\..*?d\.ts/.exec(path)[0];
            // resolving lib file
            var libPath = nodePath.join(nodePath.dirname(require.resolve("typescript")), libFile);
            var fileContent = ts.sys.readFile(libPath);
            if (fileContent != null) {
                this.fs.writeFile(libFile, fileContent, true);
                ret = true;
            }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmljZS1ob3N0LmpzIiwic291cmNlUm9vdCI6IkQ6L3ZpcnR1YWwtdHNjL3NyYy8iLCJzb3VyY2VzIjpbInNlcnZpY2UtaG9zdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9DQUFzQztBQUN0QywrQkFBaUM7QUFDakMsK0JBQWlDO0FBR2pDLElBQU0sS0FBSyxHQUFHLFlBQVksQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUUxQyw0SEFBNEg7QUFFNUg7O0dBRUc7QUFDSDtJQUVDLDZCQUNTLEVBQXFCLEVBQ3JCLE9BQTJCO1FBRDNCLE9BQUUsR0FBRixFQUFFLENBQW1CO1FBQ3JCLFlBQU8sR0FBUCxPQUFPLENBQW9CO0lBR3BDLENBQUM7SUFFTSxvREFBc0IsR0FBN0I7UUFDQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztJQUNyQixDQUFDO0lBRU0sZ0RBQWtCLEdBQXpCO1FBQ0MsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFO2FBQ1osWUFBWSxFQUFFO2FBQ2QsTUFBTSxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBakIsQ0FBaUIsQ0FBQyw2QkFBNkIsQ0FBQyxDQUM3RDtJQUNGLENBQUM7SUFFTSw4Q0FBZ0IsR0FBdkIsVUFBd0IsUUFBZ0I7UUFDdkMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ3BELENBQUM7SUFFTSwrQ0FBaUIsR0FBeEIsVUFBeUIsUUFBZ0I7UUFDeEMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUM7UUFDcEQsTUFBTSxDQUFDLEVBQUUsQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FB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