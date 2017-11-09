import { expect } from "chai";
import { VirtualFileSystem } from "./virtual-fs";
// tslint:disable:no-unused-expression

describe("virtual-fs => ", () => {

	let vfs: VirtualFileSystem;

	it("the constructor should not explode", () => {
		vfs = new VirtualFileSystem();
	});

	const dummyFile = "DUMMY";
	const dummyFileName = "dummy.txt";
	it("a file should exist after writing", () => {
		expect(vfs.fileExists(dummyFileName)).to.be.false;
		vfs.writeFile(dummyFileName, dummyFile);
		expect(vfs.fileExists(dummyFileName)).to.be.true;
	});

	it("readFile should return the correct file contents", () => {
		expect(vfs.readFile(dummyFileName)).to.equal(dummyFile);
	});

	it("readFile should throw when the file doesn't exist", () => {
		expect(() => vfs.readFile("does-not-exist.txt")).to.throw();
	});

	it("writeFile should throw when overwriting files without the parameter set to true", () => {
		expect(() => vfs.writeFile(dummyFileName, "SHOULD NOT BE HERE")).to.throw();
		expect(vfs.readFile(dummyFileName)).to.equal(dummyFile);
	});

	it("writeFile should correctly overwrite existing files if asked to", () => {
		expect(() => vfs.writeFile(dummyFileName, "NEW TEXT", true)).to.not.throw();
		expect(vfs.readFile(dummyFileName)).to.equal("NEW TEXT");
	});

	it("a file should no longer exist after deleting it", () => {
		expect(vfs.fileExists(dummyFileName)).to.be.true;
		vfs.deleteFile(dummyFileName);
		expect(vfs.fileExists(dummyFileName)).to.be.false;
	});

	it("deleteFile should silently return when the file doesn't exist", () => {
		expect(() => vfs.deleteFile("does-not-exist.txt")).to.not.throw();
	});

});
