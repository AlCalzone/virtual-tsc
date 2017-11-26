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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlydHVhbC1mcy5qcyIsInNvdXJjZVJvb3QiOiJDOi9Vc2Vycy9Eb21pbmljL0RvY3VtZW50cy9WaXN1YWwgU3R1ZGlvIDIwMTcvUmVwb3NpdG9yaWVzL3ZpcnR1YWwtdHNjL3NyYy8iLCJzb3VyY2VzIjpbInZpcnR1YWwtZnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtQ0FBK0I7QUFPL0I7SUFBQTtRQWtGUyxVQUFLLEdBQStCLEVBQUUsQ0FBQztJQUVoRCxDQUFDO0lBbEZBOzs7OztPQUtHO0lBQ0kscUNBQVMsR0FBaEIsVUFBaUIsUUFBZ0IsRUFBRSxPQUFlLEVBQUUsU0FBMEI7UUFBMUIsMEJBQUEsRUFBQSxpQkFBMEI7UUFDN0UsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDN0MsTUFBTSxJQUFJLEtBQUssQ0FBQyxjQUFZLFFBQVEsc0VBQW1FLENBQUMsQ0FBQztRQUMxRyxDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQy9CLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUc7Z0JBQ3RCLE9BQU8sRUFBRSxDQUFDO2dCQUNWLE9BQU8sU0FBQTthQUNQLENBQUM7UUFDSCxDQUFDO1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDckQsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsR0FBRztnQkFDdEIsT0FBTyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxHQUFHLENBQUM7Z0JBQ3pDLE9BQU8sU0FBQTthQUNQLENBQUM7UUFDSCxDQUFDO0lBQ0YsQ0FBQztJQUVEOzs7T0FHRztJQUNJLHNDQUFVLEdBQWpCLFVBQWtCLFFBQWdCO1FBQ2pDLE1BQU0sQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQztJQUMvQixDQUFDO0lBRUQ7OztPQUdHO0lBQ0ksc0NBQVUsR0FBakIsVUFBa0IsUUFBZ0I7UUFDakMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUFDLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUM1RCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0ksb0NBQVEsR0FBZixVQUFnQixRQUFnQjtRQUMvQixFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2hDLE1BQU0sSUFBSSxLQUFLLENBQUMsY0FBWSxRQUFRLG1CQUFnQixDQUFDLENBQUM7UUFDdkQsQ0FBQztRQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQztJQUNyQyxDQUFDO0lBRUQ7OztPQUdHO0lBQ0ksMENBQWMsR0FBckIsVUFBc0IsUUFBZ0I7UUFDckMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNoQyxNQUFNLElBQUksS0FBSyxDQUFDLGNBQVksUUFBUSxtQkFBZ0IsQ0FBQyxDQUFDO1FBQ3ZELENBQUM7UUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUM7SUFDckMsQ0FBQztJQUVEOztPQUVHO0lBQ0ksd0NBQVksR0FBbkI7UUFDQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQUVNLDBDQUFjLEdBQXJCLFVBQXNCLElBQVk7UUFDakMsWUFBRyxDQUFDLHVCQUFxQixJQUFJLE1BQUcsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUMzQyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDaEMsWUFBRyxDQUFDLGtDQUFnQyxLQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDdEQsS0FBSyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFsQixDQUFrQixDQUFDLENBQUM7UUFDOUMsWUFBRyxDQUFDLGtDQUFnQyxLQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDdEQsS0FBSyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUF2QyxDQUF1QyxDQUFDLENBQUM7UUFDaEUsWUFBRyxDQUFDLGtDQUFnQyxLQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDdEQsTUFBTSxDQUFDLEtBQUssQ0FBQztJQUNkLENBQUM7SUFJRix3QkFBQztBQUFELENBQUMsQUFwRkQsSUFvRkM7QUFwRlksOENBQWlCIn0=