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

		this.files[filename] = content;
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
		return this.files[filename];
	}

	private files: {[filename: string]: string} = {};

}
