"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
        this.files[filename] = content;
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
        return this.files[filename];
    };
    return VirtualFileSystem;
}());
exports.VirtualFileSystem = VirtualFileSystem;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlydHVhbC1mcy5qcyIsInNvdXJjZVJvb3QiOiJEOi92aXJ0dWFsLXRzYy9zcmMvIiwic291cmNlcyI6WyJ2aXJ0dWFsLWZzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7SUFBQTtRQTJDUyxVQUFLLEdBQWlDLEVBQUUsQ0FBQztJQUVsRCxDQUFDO0lBM0NBOzs7OztPQUtHO0lBQ0kscUNBQVMsR0FBaEIsVUFBaUIsUUFBZ0IsRUFBRSxPQUFlLEVBQUUsU0FBMEI7UUFBMUIsMEJBQUEsRUFBQSxpQkFBMEI7UUFDN0UsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDN0MsTUFBTSxJQUFJLEtBQUssQ0FBQyxjQUFZLFFBQVEsc0VBQW1FLENBQUMsQ0FBQztRQUMxRyxDQUFDO1FBRUQsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsR0FBRyxPQUFPLENBQUM7SUFDaEMsQ0FBQztJQUVEOzs7T0FHRztJQUNJLHNDQUFVLEdBQWpCLFVBQWtCLFFBQWdCO1FBQ2pDLE1BQU0sQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQztJQUMvQixDQUFDO0lBRUQ7OztPQUdHO0lBQ0ksc0NBQVUsR0FBakIsVUFBa0IsUUFBZ0I7UUFDakMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUFDLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUM1RCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0ksb0NBQVEsR0FBZixVQUFnQixRQUFnQjtRQUMvQixFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2hDLE1BQU0sSUFBSSxLQUFLLENBQUMsY0FBWSxRQUFRLG1CQUFnQixDQUFDLENBQUM7UUFDdkQsQ0FBQztRQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFJRix3QkFBQztBQUFELENBQUMsQUE3Q0QsSUE2Q0M7QUE3Q1ksOENBQWlCIn0=