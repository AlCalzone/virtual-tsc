import * as debugPackage from "debug";
const debug = debugPackage("virtual-tsc");

interface File {
	content: string;
	version: number;
}

export class VirtualFileSystem {

	/**
	 * Writes a file in the virtual FS
	 * @param filename The path this file should be stored as
	 * @param content The contents of the file
	 * @param overwrite If existing files should be overwritten
	 */
	public writeFile(filename: string, content: string, overwrite: boolean = false): void {
		if (!overwrite && this.fileExists(filename)) {
			throw new Error(`The file ${filename} already exists. Set overwrite to true if you want to override it`);
		}

		if (!(filename in this.files)) {
			this.files[filename] = {
				version: 1,
				content,
			};
		} else if (this.files[filename].content !== content) {
			this.files[filename] = {
				version: this.files[filename].version + 1,
				content,
			};
		}
	}

	/**
	 * Checks if a file exists in the virtual FS
	 * @param filename The path of the file to look for
	 */
	public fileExists(filename: string): boolean {
		return filename in this.files;
	}

	/**
	 * Deletes a file in the virtual FS. If the file doesn't exist, nothing happens.
	 * @param filename The path of the file to look for
	 */
	public deleteFile(filename: string): void {
		if (this.fileExists(filename)) delete this.files[filename];
	}

	/**
	 * Reads a file's contents from the virtual FS
	 * @param filename The path of the file to look for
	 */
	public readFile(filename: string): string {
		if (!this.fileExists(filename)) {
			throw new Error(`The file ${filename} doesn't exist`);
		}
		return this.files[filename].content;
	}

	/**
	 * Returns the revision number of a file in the virtual FS
	 * @param filename The path of the file to look for
	 */
	public getFileVersion(filename: string): number {
		if (!this.fileExists(filename)) {
			throw new Error(`The file ${filename} doesn't exist`);
		}
		return this.files[filename].version;
	}

	/**
	 * Returns the file names of all files in the virtual fs
	 */
	public getFilenames(): string[] {
		return Object.keys(this.files);
	}

	public getDirectories(root: string): string[] {
		debug(`fs.getDirectories(${root})`);
		let paths = this.getFilenames();
		debug(`fs.getDirectories => paths = ${paths}`);
		paths = paths.filter(p => p.startsWith(root));
		debug(`fs.getDirectories => paths = ${paths}`);
		paths = paths.map(p => p.substr(root.length + 1).split("/")[0]);
		debug(`fs.getDirectories => paths = ${paths}`);
		return paths;
	}

	private files: {[filename: string]: File} = {};

}
