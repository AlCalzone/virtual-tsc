"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var debugPackage = require("debug");
var debug = debugPackage("virtual-tsc");
var VirtualFileSystem = (function () {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlydHVhbC1mcy5qcyIsInNvdXJjZVJvb3QiOiJEOi92aXJ0dWFsLXRzYy9zcmMvIiwic291cmNlcyI6WyJ2aXJ0dWFsLWZzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0NBQXNDO0FBQ3RDLElBQU0sS0FBSyxHQUFHLFlBQVksQ0FBQyxhQUFhLENBQUMsQ0FBQztBQU8xQztJQUFBO1FBa0ZTLFVBQUssR0FBK0IsRUFBRSxDQUFDO0lBRWhELENBQUM7SUFsRkE7Ozs7O09BS0c7SUFDSSxxQ0FBUyxHQUFoQixVQUFpQixRQUFnQixFQUFFLE9BQWUsRUFBRSxTQUEwQjtRQUExQiwwQkFBQSxFQUFBLGlCQUEwQjtRQUM3RSxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM3QyxNQUFNLElBQUksS0FBSyxDQUFDLGNBQVksUUFBUSxzRUFBbUUsQ0FBQyxDQUFDO1FBQzFHLENBQUM7UUFFRCxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDL0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsR0FBRztnQkFDdEIsT0FBTyxFQUFFLENBQUM7Z0JBQ1YsT0FBTyxTQUFBO2FBQ1AsQ0FBQztRQUNILENBQUM7UUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLEtBQUssT0FBTyxDQUFDLENBQUMsQ0FBQztZQUNyRCxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxHQUFHO2dCQUN0QixPQUFPLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQztnQkFDekMsT0FBTyxTQUFBO2FBQ1AsQ0FBQztRQUNILENBQUM7SUFDRixDQUFDO0lBRUQ7OztPQUdHO0lBQ0ksc0NBQVUsR0FBakIsVUFBa0IsUUFBZ0I7UUFDakMsTUFBTSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQy9CLENBQUM7SUFFRDs7O09BR0c7SUFDSSxzQ0FBVSxHQUFqQixVQUFrQixRQUFnQjtRQUNqQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQUMsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzVELENBQUM7SUFFRDs7O09BR0c7SUFDSSxvQ0FBUSxHQUFmLFVBQWdCLFFBQWdCO1FBQy9CLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDaEMsTUFBTSxJQUFJLEtBQUssQ0FBQyxjQUFZLFFBQVEsbUJBQWdCLENBQUMsQ0FBQztRQUN2RCxDQUFDO1FBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDO0lBQ3JDLENBQUM7SUFFRDs7O09BR0c7SUFDSSwwQ0FBYyxHQUFyQixVQUFzQixRQUFnQjtRQUNyQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2hDLE1BQU0sSUFBSSxLQUFLLENBQUMsY0FBWSxRQUFRLG1CQUFnQixDQUFDLENBQUM7UUFDdkQsQ0FBQztRQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQztJQUNyQyxDQUFDO0lBRUQ7O09BRUc7SUFDSSx3Q0FBWSxHQUFuQjtRQUNDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNoQyxDQUFDO0lBRU0sMENBQWMsR0FBckIsVUFBc0IsSUFBWTtRQUNqQyxLQUFLLENBQUMsdUJBQXFCLElBQUksTUFBRyxDQUFDLENBQUM7UUFDcEMsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ2hDLEtBQUssQ0FBQyxrQ0FBZ0MsS0FBTyxDQUFDLENBQUM7UUFDL0MsS0FBSyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFsQixDQUFrQixDQUFDLENBQUM7UUFDOUMsS0FBSyxDQUFDLGtDQUFnQyxLQUFPLENBQUMsQ0FBQztRQUMvQyxLQUFLLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQXZDLENBQXVDLENBQUMsQ0FBQztRQUNoRSxLQUFLLENBQUMsa0NBQWdDLEtBQU8sQ0FBQyxDQUFDO1FBQy9DLE1BQU0sQ0FBQyxLQUFLLENBQUM7SUFDZCxDQUFDO0lBSUYsd0JBQUM7QUFBRCxDQUFDLEFBcEZELElBb0ZDO0FBcEZZLDhDQUFpQiJ9