import { expect } from "chai";
import { VirtualFileSystem } from "./virtual-fs";
// tslint:disable:no-unused-expression

describe("virtual-fs => dummy test", () => {

	it("should not explode", () => {
		const vfs = new VirtualFileSystem();
		expect(null).to.be.null;
	});

});
