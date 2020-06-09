"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VirtualFileSystem = void 0;
var logger_1 = require("./logger");
var VirtualFileSystem = /** @class */ (function () {
    function VirtualFileSystem() {
        this.files = {};
    }
    /**
     * Writes a file in the virtual FS
     * @param filename The path this file should be stored as
     * @param content The contents of the file
     * @param overwrite If existing files should be overwritten
     */
    VirtualFileSystem.prototype.writeFile = function (filename, content, overwrite) {
        if (overwrite === void 0) { overwrite = false; }
        logger_1.log("vfs", "writeFile(filename: \"" + filename + "\", content: length " + (content ? content.length : 0) + ", overwrite: " + overwrite, "debug");
        var exists = this.fileExists(filename, true);
        if (!overwrite && exists) {
            throw new Error("The file " + filename + " already exists. Set overwrite to true if you want to override it");
        }
        if (!exists) {
            logger_1.log("vfs", "  creating new file with version 1", "debug");
            this.files[filename] = {
                version: 1,
                content: content,
            };
        }
        else if (this.files[filename].content !== content) {
            this.files[filename] = {
                version: this.files[filename].version + 1,
                content: content,
            };
            logger_1.log("vfs", "  updating file => version " + this.files[filename].version, "debug");
        }
    };
    /**
     * Checks if a file exists in the virtual FS
     * @param filename The path of the file to look for
     */
    VirtualFileSystem.prototype.fileExists = function (filename, suppressLog) {
        if (suppressLog === void 0) { suppressLog = false; }
        var ret = filename in this.files;
        if (!suppressLog)
            logger_1.log("vfs", "fileExists(\"" + filename + "\") => " + ret, "debug");
        return ret;
    };
    /**
     * Deletes a file in the virtual FS. If the file doesn't exist, nothing happens.
     * @param filename The path of the file to look for
     */
    VirtualFileSystem.prototype.deleteFile = function (filename) {
        logger_1.log("vfs", "deleteFile(\"" + filename + "\")", "debug");
        if (this.fileExists(filename, true))
            delete this.files[filename];
    };
    /**
     * Reads a file's contents from the virtual FS
     * @param filename The path of the file to look for
     */
    VirtualFileSystem.prototype.readFile = function (filename) {
        if (!this.fileExists(filename, true)) {
            throw new Error("The file " + filename + " doesn't exist");
        }
        var ret = this.files[filename].content;
        logger_1.log("vfs", "readFile(\"" + filename + "\") => length " + (ret ? ret.length : 0), "debug");
        return ret;
    };
    /**
     * Returns the revision number of a file in the virtual FS
     * @param filename The path of the file to look for
     */
    VirtualFileSystem.prototype.getFileVersion = function (filename) {
        if (!this.fileExists(filename, true)) {
            throw new Error("The file " + filename + " doesn't exist");
        }
        var ret = this.files[filename].version;
        logger_1.log("vfs", "getFileVersion(\"" + filename + "\") => " + ret, "debug");
        return ret;
    };
    /**
     * Returns the file names of all files in the virtual fs
     */
    VirtualFileSystem.prototype.getFilenames = function () {
        logger_1.log("vfs", "getFilenames()", "debug");
        return Object.keys(this.files);
    };
    VirtualFileSystem.prototype.getDirectories = function (root) {
        logger_1.log("vfs", "fs.getDirectories(" + root + ")", "debug");
        var paths = this.getFilenames();
        logger_1.log("vfs", "fs.getDirectories => paths = " + paths, "debug");
        paths = paths.filter(function (p) { return p.startsWith(root); });
        logger_1.log("vfs", "fs.getDirectories => paths = " + paths, "debug");
        paths = paths.map(function (p) { return p.substr(root.length + 1).split("/")[0]; });
        logger_1.log("vfs", "fs.getDirectories => paths = " + paths, "debug");
        return paths;
    };
    return VirtualFileSystem;
}());
exports.VirtualFileSystem = VirtualFileSystem;
