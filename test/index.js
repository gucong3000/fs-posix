"use strict";
require("../src");
const assert = require("assert");
const path = require("path");
const os = require("os");
const fs = require("fs-extra");

let gitWin;
try {
	gitWin = require("git-win");
} catch (ex) {
	//
}

describe("POSIX", () => {
	let env;
	before(() => {
		env = process.env;
	});
	afterEach(() => {
		process.env = env;
	});

	const drivers = path.join(
		process.env.windir || process.env.SystemRoot || "C:/Windows",
		"System32/drivers"
	);

	[
		"/etc/hosts",
		"/etc/networks",
		"/etc/services",
		"/etc/protocols",
	].forEach(file => {
		it(file, async () => {
			assert.ok(fs.readFileSync(file));
			assert.ok(await fs.readFile(file));
			assert.ok(fs.statSync(file).isFile());
			assert.ok((await fs.stat(file)).isFile());
			let realPath;
			switch (process.platform) {
				case "win32": {
					realPath = path.join(drivers, file === "/etc/protocols" ? "etc/protocol" : file);
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
			process.env = {};
			assert.strictEqual(fs.realpathSync(file), realPath);
			assert.strictEqual(await fs.realpath(file), realPath);
		});
	});
	[
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
					realPath = path.join(gitWin.root, file);
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

if (process.platform === "win32" || /\bMicrosoft\b/.test(os.release())) {
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
				if (process.platform !== "win32") {
					realPath = path.posix.resolve("/mnt", realPath[0].toLowerCase(), realPath.slice(3).replace(/\\/g, "/"));
				}
				assert.strictEqual(fs.realpathSync(dir), realPath);
				assert.strictEqual(await fs.realpath(dir), realPath);
			});
		});
		it("\\", () => {
			if (process.platform === "win32") {
				assert.ok(/^[A-Z]:\\$/i.test(fs.realpathSync("\\")));
			} else {
				assert.ok(/^\/mnt\/[a-z]$/.test(fs.realpathSync("\\")));
			}
		});
	});
}

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
