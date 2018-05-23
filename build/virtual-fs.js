"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
        if (!overwrite && this.fileExists(filename)) {
            throw new Error("The file " + filename + " already exists. Set overwrite to true if you want to override it");
        }
        if (!(filename in this.files)) {
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
        }
    };
    /**
     * Checks if a file exists in the virtual FS
     * @param filename The path of the file to look for
     */
    VirtualFileSystem.prototype.fileExists = function (filename) {
        return filename in this.files;
    };
    /**
     * Deletes a file in the virtual FS. If the file doesn't exist, nothing happens.
     * @param filename The path of the file to look for
     */
    VirtualFileSystem.prototype.deleteFile = function (filename) {
        if (this.fileExists(filename))
            delete this.files[filename];
    };
    /**
     * Reads a file's contents from the virtual FS
     * @param filename The path of the file to look for
     */
    VirtualFileSystem.prototype.readFile = function (filename) {
        if (!this.fileExists(filename)) {
            throw new Error("The file " + filename + " doesn't exist");
        }
        return this.files[filename].content;
    };
    /**
     * Returns the revision number of a file in the virtual FS
     * @param filename The path of the file to look for
     */
    VirtualFileSystem.prototype.getFileVersion = function (filename) {
        if (!this.fileExists(filename)) {
            throw new Error("The file " + filename + " doesn't exist");
        }
        return this.files[filename].version;
    };
    /**
     * Returns the file names of all files in the virtual fs
     */
    VirtualFileSystem.prototype.getFilenames = function () {
        return Object.keys(this.files);
    };
    VirtualFileSystem.prototype.getDirectories = function (root) {
        logger_1.log("fs.getDirectories(" + root + ")", "debug");
        var paths = this.getFilenames();
        logger_1.log("fs.getDirectories => paths = " + paths, "debug");
        paths = paths.filter(function (p) { return p.startsWith(root); });
        logger_1.log("fs.getDirectories => paths = " + paths, "debug");
        paths = paths.map(function (p) { return p.substr(root.length + 1).split("/")[0]; });
        logger_1.log("fs.getDirectories => paths = " + paths, "debug");
        return paths;
    };
    return VirtualFileSystem;
}());
exports.VirtualFileSystem = VirtualFileSystem;
