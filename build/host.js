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
        else {
            // resolving a specific node module
            debug("getSourceFile(fileName=\"" + fileName + "\") => resolving typings");
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
    InMemoryHost.prototype.resolveModuleNames = function (moduleNames, containingFile) {
        var _this = this;
        debug("resolveModuleNames(" + moduleNames + ")");
        return moduleNames.map(function (moduleName) {
            {
                var result = ts.resolveModuleName(moduleName, containingFile, _this.options, {
                    fileExists: _this.fileExists.bind(_this),
                    readFile: _this.readFile.bind(_this),
                });
                if (result.resolvedModule)
                    return result.resolvedModule;
            }
            try {
                var fileName = require.resolve(moduleName);
                if (fileName === moduleName)
                    return; // internal module
                debug("resolved " + moduleName + " => " + fileName);
                return {
                    resolvedFileName: fileName,
                };
            }
            catch (e) {
                /* Not found */
            }
        });
    };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9zdC5qcyIsInNvdXJjZVJvb3QiOiJEOi92aXJ0dWFsLXRzYy9zcmMvIiwic291cmNlcyI6WyJob3N0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0NBQXNDO0FBQ3RDLCtCQUFpQztBQUNqQywrQkFBaUM7QUFHakMsSUFBTSxLQUFLLEdBQUcsWUFBWSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBRTFDLCtHQUErRztBQUUvRzs7R0FFRztBQUNIO0lBRUMsc0JBQ1MsRUFBcUIsRUFDckIsT0FBMkI7UUFEM0IsT0FBRSxHQUFGLEVBQUUsQ0FBbUI7UUFDckIsWUFBTyxHQUFQLE9BQU8sQ0FBb0I7SUFHcEMsQ0FBQztJQUVNLG9DQUFhLEdBQXBCLFVBQXFCLFFBQWdCLEVBQUUsZUFBZ0MsRUFBRSxPQUFtQztRQUMzRyxJQUFJLFdBQW1CLENBQUM7UUFDeEIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2xDLEtBQUssQ0FBQyw4QkFBMkIsUUFBUSxvQkFBYyxlQUFlLGlDQUE4QixDQUFDLENBQUM7WUFDdEcsV0FBVyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzFDLENBQUM7UUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM3QyxxQkFBcUI7WUFDckIsSUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUN6RixLQUFLLENBQUMsOEJBQTJCLFFBQVEsaUNBQTJCLE9BQVMsQ0FBQyxDQUFDO1lBQy9FLFdBQVcsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxP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