"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class VirtualFileSystem {
    constructor() {
        this.files = {};
    }
    provideFile(filename, content, override = false) {
        if (this.fileExists(filename) && !override) {
            throw new Error(`The file ${filename} already exists. Set override to true if you want to override it`);
        }
        this.files[filename] = content;
    }
    fileExists(filename) {
        return filename in this.files;
    }
    deleteFile(filename) {
        if (this.fileExists(filename))
            delete this.files[filename];
    }
    readFile(filename) {
        if (!this.fileExists(filename)) {
            throw new Error(`The file ${filename} doesn't exist`);
        }
        return this.files[filename];
    }
}
exports.VirtualFileSystem = VirtualFileSystem;
//# sourceMappingURL=virtual-fs.js.map