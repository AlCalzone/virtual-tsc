"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class VirtualFileSystem {
    constructor() {
        this.files = {};
    }
    /**
     * Writes a file in the virtual FS
     * @param filename The path this file should be stored as
     * @param content The contents of the file
     * @param overwrite If existing files should be overwritten
     */
    writeFile(filename, content, overwrite = false) {
        if (!overwrite && this.fileExists(filename)) {
            throw new Error(`The file ${filename} already exists. Set overwrite to true if you want to override it`);
        }
        this.files[filename] = content;
    }
    /**
     * Checks if a file exists in the virtual FS
     * @param filename The path of the file to look for
     */
    fileExists(filename) {
        return filename in this.files;
    }
    /**
     * Deletes a file in the virtual FS. If the file doesn't exist, nothing happens.
     * @param filename The path of the file to look for
     */
    deleteFile(filename) {
        if (this.fileExists(filename))
            delete this.files[filename];
    }
    /**
     * Reads a file's contents from the virtual FS
     * @param filename The path of the file to look for
     */
    readFile(filename) {
        if (!this.fileExists(filename)) {
            throw new Error(`The file ${filename} doesn't exist`);
        }
        return this.files[filename];
    }
}
exports.VirtualFileSystem = VirtualFileSystem;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlydHVhbC1mcy5qcyIsInNvdXJjZVJvb3QiOiJEOi92aXJ0dWFsLXRzYy9zcmMvIiwic291cmNlcyI6WyJ2aXJ0dWFsLWZzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7SUFBQTtRQTJDUyxVQUFLLEdBQWlDLEVBQUUsQ0FBQztJQUVsRCxDQUFDO0lBM0NBOzs7OztPQUtHO0lBQ0ksU0FBUyxDQUFDLFFBQWdCLEVBQUUsT0FBZSxFQUFFLFlBQXFCLEtBQUs7UUFDN0UsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDN0MsTUFBTSxJQUFJLEtBQUssQ0FBQyxZQUFZLFFBQVEsbUVBQW1FLENBQUMsQ0FBQztRQUMxRyxDQUFDO1FBRUQsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsR0FBRyxPQUFPLENBQUM7SUFDaEMsQ0FBQztJQUVEOzs7T0FHRztJQUNJLFVBQVUsQ0FBQyxRQUFnQjtRQUNqQyxNQUFNLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDL0IsQ0FBQztJQUVEOzs7T0FHRztJQUNJLFVBQVUsQ0FBQyxRQUFnQjtRQUNqQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQUMsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzVELENBQUM7SUFFRDs7O09BR0c7SUFDSSxRQUFRLENBQUMsUUFBZ0I7UUFDL0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNoQyxNQUFNLElBQUksS0FBSyxDQUFDLFlBQVksUUFBUSxnQkFBZ0IsQ0FBQyxDQUFDO1FBQ3ZELENBQUM7UUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUM3QixDQUFDO0NBSUQ7QUE3Q0QsOENBNkNDIn0=