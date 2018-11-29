"use strict";
require("../src");
const assert = require("assert");
const path = require("path");
const os = require("os");
const fs = require("fs-extra");
const isWin32 = process.platform === "win32";
const isWSL = process.platform === "linux" && /\bMicrosoft\b/.test(os.release());
const gitWin = (isWin32 || isWSL) && require("git-win");

describe("POSIX", () => {
	let env;
	before(() => {
		env = process.env;
	});
	afterEach(() => {
		process.env = env;
	});

	[
		"/etc/hosts",
		"/etc/networks",
		"/etc/services",
		"/etc/protocols",
		"/etc/nanorc",
		"/etc/profile",
	].forEach(file => {
		it(file, async () => {
			assert.ok(fs.readFileSync(file));
			assert.ok(await fs.readFile(file));
			assert.ok(fs.statSync(file).isFile());
			assert.ok((await fs.stat(file)).isFile());
			let realPath;
			switch (process.platform) {
				case "win32": {
					realPath = gitWin.toWin32(file);
					break;
				}
				case "darwin": {
					realPath = "/private" + file;
					break;
				}
				default: {
					realPath = file;
				}
			}
			assert.strictEqual(fs.realpathSync(file), realPath);
			assert.strictEqual(await fs.realpath(file), realPath);
			assert.strictEqual(path.resolve(file), isWin32 ? realPath : file);
			assert.strictEqual(path.resolve("x:/", file), isWin32 ? realPath : file);
		});
	});

	[
		["~", os.homedir()],
		["/tmp", process.platform === "darwin" ? "/private/tmp" : os.tmpdir()],
	].forEach(([dir, realPath]) => {
		it(dir, async () => {
			assert.ok(fs.statSync(dir).isDirectory());
			assert.ok((await fs.stat(dir)).isDirectory());
			assert.ok(Array.isArray(fs.readdirSync(dir)));
			assert.ok(Array.isArray(await fs.readdir(dir)));
			assert.strictEqual(fs.realpathSync(dir), realPath);
			assert.strictEqual(await fs.realpath(dir), realPath);
			process.env = {};
			assert.strictEqual(fs.realpathSync(dir), realPath);
			assert.strictEqual(await fs.realpath(dir), realPath);
		});
	});
});

if (isWin32 || isWSL) {
	describe("WIN32 path", () => {
		[
			"C:\\Windows",
			"C:/Windows",
			"C:/Windows/",
			"C:\\Users",
			"C:/Users/",
			"C:/Users",
			"C:\\",
			"C:/",
		].forEach((dir) => {
			it(dir, async () => {
				assert.ok(fs.statSync(dir).isDirectory());
				assert.ok((await fs.stat(dir)).isDirectory());
				assert.ok(Array.isArray(fs.readdirSync(dir)));
				assert.ok(Array.isArray(await fs.readdir(dir)));
				let realPath = path.win32.resolve(dir);
				if (isWSL) {
					realPath = path.posix.resolve("/mnt", realPath[0].toLowerCase(), realPath.slice(3).replace(/\\/g, "/"));
				}
				assert.strictEqual(fs.realpathSync(dir), realPath);
				assert.strictEqual(await fs.realpath(dir), realPath);
				assert.strictEqual(path.resolve(dir), realPath);
			});
		});
		it("\\", () => {
			if (isWin32) {
				assert.ok(/^[A-Z]:\\$/i.test(fs.realpathSync("\\")));
			} else {
				assert.ok(/^\/mnt\/[a-z]$/.test(fs.realpathSync("\\")));
			}
		});
	});
}

describe("path.resolve", () => {
	it("/not_exist", () => {
		if (isWin32) {
			assert.strictEqual(path.resolve("/not_exist"), path.join(gitWin.root, "not_exist"));
		} else {
			assert.strictEqual(path.resolve("/not_exist"), "/not_exist");
		}
	});

	it("C:, /not_exist", () => {
		if (isWin32) {
			assert.strictEqual(path.resolve("c:", "/not_exist"), "c:\\not_exist");
		} else {
			assert.strictEqual(path.resolve("c:", "/not_exist"), "/not_exist");
		}
	});

	it("C:, /etc", () => {
		if (isWin32) {
			assert.strictEqual(path.resolve("c:", "/etc"), path.join(gitWin.root, "etc"));
		} else {
			assert.strictEqual(path.resolve("c:", "/etc"), "/etc");
		}
	});

	it("C:, /tmp", () => {
		if (isWin32) {
			assert.strictEqual(path.resolve("c:", "/tmp"), os.tmpdir());
		} else {
			assert.strictEqual(path.resolve("c:", "/tmp"), "/tmp");
		}
	});

	it("X:\\not_exist", () => {
		if (isWin32) {
			assert.strictEqual(path.resolve("X:\\not_exist"), "X:\\not_exist");
		} else if (isWSL) {
			assert.strictEqual(path.resolve("X:\\not_exist"), "/mnt/x/not_exist");
		} else {
			assert.strictEqual(path.resolve("X:\\not_exist"), path.join(process.cwd(), "X:\\not_exist"));
		}
	});

	it("C:\\Windows", () => {
		if (isWin32) {
			assert.strictEqual(path.resolve("C:\\Windows"), "C:\\Windows");
		} else if (isWSL) {
			assert.strictEqual(path.resolve("C:\\Windows"), "/mnt/c/Windows");
		} else {
			assert.strictEqual(path.resolve("X:\\not_exist"), path.join(process.cwd(), "X:\\not_exist"));
		}
	});
});

describe("path-posix", () => {
	const pathPosix = require("../src/path-posix");
	[
		"%test%/test",
		"./~/test",
	].forEach((strPath) => {
		it(strPath, async () => {
			assert.strictEqual(path.resolve(pathPosix(strPath)), path.resolve(strPath));
		});
	});
});

describe("wslpath", () => {
	let cwd;
	let wslpath;

	before(() => {
		wslpath = require("../src/wslpath");
		cwd = process.cwd;
	});

	afterEach(() => {
		process.cwd = cwd;
	});

	it("cwd: /tmp", () => {
		process.cwd = () => "/tmp";
		assert.strictEqual(wslpath("\\Windows"), undefined);
		if (!isWin32) {
			assert.strictEqual(path.resolve("\\Windows"), "/tmp/\\Windows");
		}
	});

	it("cwd: /mnt/sd_card", () => {
		process.cwd = () => "/mnt/sd_card";
		assert.strictEqual(wslpath("\\Windows"), undefined);
		if (!isWin32) {
			assert.strictEqual(path.resolve("\\Windows"), "/mnt/sd_card/\\Windows");
		}
	});

	it("cwd: /mnt/x", () => {
		process.cwd = () => "/mnt/x";
		assert.strictEqual(wslpath("\\Windows"), "/mnt/x/Windows");
		if (isWSL) {
			assert.strictEqual(path.resolve("\\Windows"), "/mnt/x/Windows");
		}
	});

	it("cwd: /mnt/x/test", () => {
		process.cwd = () => "/mnt/x/test";
		assert.strictEqual(wslpath("\\Windows"), "/mnt/x/Windows");
		if (isWSL) {
			assert.strictEqual(path.resolve("\\Windows"), "/mnt/x/Windows");
		}
	});
});

describe("function test", () => {
	it("fs.outputFile", async () => {
		await fs.outputFile("./test/tmp/test.md", "test");
		assert.strictEqual(fs.readFileSync("./test/tmp/test.md", "utf8"), "test");
	});

	it("fs.remove", async () => {
		await fs.remove("./test/tmp");
		assert.ok(!fs.existsSync("./test/tmp"));
	});

	it("fs.readFile error catch", async () => {
		try {
			await fs.readFile("./test/tmp/test.md");
			assert.fail(true);
		} catch (ex) {
			assert.ok(ex);
		}
	});
});
