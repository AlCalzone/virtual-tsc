export class VirtualFileSystem {

	public provideFile(filename: string, content: string, override: boolean = false): void {
		if (this.fileExists(filename) && !override) {
			throw new Error(`The file ${filename} already exists. Set override to true if you want to override it`);
		}

		this.files[filename] = content;
	}

	public fileExists(filename: string): boolean {
		return filename in this.files;
	}

	public deleteFile(filename: string): void {
		if (this.fileExists(filename)) delete this.files[filename];
	}

	public readFile(filename: string): string {
		if (!this.fileExists(filename)) {
			throw new Error(`The file ${filename} doesn't exist`);
		}
		return this.files[filename];
	}

	private files: {[filename: string]: string} = {};

}
