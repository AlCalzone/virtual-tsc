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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlydHVhbC1mcy5qcyIsInNvdXJjZVJvb3QiOiJEOi92aXJ0dWFsLXRzYy9zcmMvIiwic291cmNlcyI6WyJ2aXJ0dWFsLWZzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7SUFBQTtRQXlCUyxVQUFLLEdBQWlDLEVBQUUsQ0FBQztJQUVsRCxDQUFDO0lBekJPLFdBQVcsQ0FBQyxRQUFnQixFQUFFLE9BQWUsRUFBRSxXQUFvQixLQUFLO1FBQzlFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQzVDLE1BQU0sSUFBSSxLQUFLLENBQUMsWUFBWSxRQUFRLGtFQUFrRSxDQUFDLENBQUM7UUFDekcsQ0FBQztRQUVELElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUcsT0FBTyxDQUFDO0lBQ2hDLENBQUM7SUFFTSxVQUFVLENBQUMsUUFBZ0I7UUFDakMsTUFBTSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQy9CLENBQUM7SUFFTSxVQUFVLENBQUMsUUFBZ0I7UUFDakMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUFDLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUM1RCxDQUFDO0lBRU0sUUFBUSxDQUFDLFFBQWdCO1FBQy9CLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDaEMsTUFBTSxJQUFJLEtBQUssQ0FBQyxZQUFZLFFBQVEsZ0JBQWdCLENBQUMsQ0FBQztRQUN2RCxDQUFDO1FBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDN0IsQ0FBQztDQUlEO0FBM0JELDhDQTJCQyJ9