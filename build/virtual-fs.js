"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var debugPackage = require("debug");
var debug = debugPackage("virtual-tsc");
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
        debug("fs.getDirectories(" + root + ")");
        var paths = this.getFilenames();
        debug("fs.getDirectories => paths = " + paths);
        paths = paths.filter(function (p) { return p.startsWith(root); });
        debug("fs.getDirectories => paths = " + paths);
        paths = paths.map(function (p) { return p.substr(root.length + 1).split("/")[0]; });
        debug("fs.getDirectories => paths = " + paths);
        return paths;
    };
    return VirtualFileSystem;
}());
exports.VirtualFileSystem = VirtualFileSystem;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlydHVhbC1mcy5qcyIsInNvdXJjZVJvb3QiOiJDOi9Vc2Vycy9Eb21pbmljL0RvY3VtZW50cy9WaXN1YWwgU3R1ZGlvIDIwMTcvUmVwb3NpdG9yaWVzL3ZpcnR1YWwtdHNjL3NyYy8iLCJzb3VyY2VzIjpbInZpcnR1YWwtZnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxvQ0FBc0M7QUFDdEMsSUFBTSxLQUFLLEdBQUcsWUFBWSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBTzFDO0lBQUE7UUFrRlMsVUFBSyxHQUErQixFQUFFLENBQUM7SUFFaEQsQ0FBQztJQWxGQTs7Ozs7T0FLRztJQUNJLHFDQUFTLEdBQWhCLFVBQWlCLFFBQWdCLEVBQUUsT0FBZSxFQUFFLFNBQTBCO1FBQTFCLDBCQUFBLEVBQUEsaUJBQTBCO1FBQzdFLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzdDLE1BQU0sSUFBSSxLQUFLLENBQUMsY0FBWSxRQUFRLHNFQUFtRSxDQUFDLENBQUM7UUFDMUcsQ0FBQztRQUVELEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMvQixJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxHQUFHO2dCQUN0QixPQUFPLEVBQUUsQ0FBQztnQkFDVixPQUFPLFNBQUE7YUFDUCxDQUFDO1FBQ0gsQ0FBQztRQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ3JELElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUc7Z0JBQ3RCLE9BQU8sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDO2dCQUN6QyxPQUFPLFNBQUE7YUFDUCxDQUFDO1FBQ0gsQ0FBQztJQUNGLENBQUM7SUFFRDs7O09BR0c7SUFDSSxzQ0FBVSxHQUFqQixVQUFrQixRQUFnQjtRQUNqQyxNQUFNLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDL0IsQ0FBQztJQUVEOzs7T0FHRztJQUNJLHNDQUFVLEdBQWpCLFVBQWtCLFFBQWdCO1FBQ2pDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7WUFBQyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDNUQsQ0FBQztJQUVEOzs7T0FHRztJQUNJLG9DQUFRLEdBQWYsVUFBZ0IsUUFBZ0I7UUFDL0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNoQyxNQUFNLElBQUksS0FBSyxDQUFDLGNBQVksUUFBUSxtQkFBZ0IsQ0FBQyxDQUFDO1FBQ3ZELENBQUM7UUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUM7SUFDckMsQ0FBQztJQUVEOzs7T0FHRztJQUNJLDBDQUFjLEdBQXJCLFVBQXNCLFFBQWdCO1FBQ3JDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDaEMsTUFBTSxJQUFJLEtBQUssQ0FBQyxjQUFZLFFBQVEsbUJBQWdCLENBQUMsQ0FBQztRQUN2RCxDQUFDO1FBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDO0lBQ3JDLENBQUM7SUFFRDs7T0FFRztJQUNJLHdDQUFZLEdBQW5CO1FBQ0MsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2hDLENBQUM7SUFFTSwwQ0FBYyxHQUFyQixVQUFzQixJQUFZO1FBQ2pDLEtBQUssQ0FBQyx1QkFBcUIsSUFBSSxNQUFHLENBQUMsQ0FBQztRQUNwQyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDaEMsS0FBSyxDQUFDLGtDQUFnQyxLQUFPLENBQUMsQ0FBQztRQUMvQyxLQUFLLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQWxCLENBQWtCLENBQUMsQ0FBQztRQUM5QyxLQUFLLENBQUMsa0NBQWdDLEtBQU8sQ0FBQyxDQUFDO1FBQy9DLEtBQUssR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBdkMsQ0FBdUMsQ0FBQyxDQUFDO1FBQ2hFLEtBQUssQ0FBQyxrQ0FBZ0MsS0FBTyxDQUFDLENBQUM7UUFDL0MsTUFBTSxDQUFDLEtBQUssQ0FBQztJQUNkLENBQUM7SUFJRix3QkFBQztBQUFELENBQUMsQUFwRkQsSUFvRkM7QUFwRlksOENBQWlCIn0=