"use strict";
const assert = require("assert");
const path = require("path");
const os = require("os");
const fs = require("fs");
let gitWin;
try {
	gitWin = require("git-win");
} catch (ex) {
	//
}

require("../lib/patch");

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
			assert.ok(await fs.readFile(file));
			assert.ok(await fs.readFileSync(file));
			assert.ok((await fs.stat(file)).isFile());
			assert.ok(fs.statSync(file).isFile());
			const realPath = process.platform === "win32"
				? path.join(drivers, file === "/etc/protocols" ? "etc/protocol" : file)
				: file;
			assert.strictEqual(await fs.realpath(file), realPath);
			assert.strictEqual(fs.realpathSync(file), realPath);
			process.env = {};
			assert.strictEqual(await fs.realpath(file), realPath);
			assert.strictEqual(fs.realpathSync(file), realPath);
		});
	});

	[
		"/etc/profile",
		"/etc/fstab",
	].forEach(file => {
		it(file, async () => {
			assert.ok(await fs.readFile(file));
			assert.ok(await fs.readFileSync(file));
			assert.ok((await fs.stat(file)).isFile());
			assert.ok(fs.statSync(file).isFile());
			const realPath = process.platform === "win32"
				? path.join(gitWin.root, file)
				: file;
			assert.strictEqual(await fs.realpath(file), realPath);
			assert.strictEqual(fs.realpathSync(file), realPath);
		});
	});

	[
		["~", os.homedir()],
		["/tmp", os.tmpdir()],
	].forEach(([dir, realPath]) => {
		it(dir, async () => {
			assert.ok((await fs.stat(dir)).isDirectory());
			assert.ok(fs.statSync(dir).isDirectory());
			assert.ok(Array.isArray(await fs.readdir(dir)));
			assert.ok(Array.isArray(fs.readdirSync(dir)));
			assert.strictEqual(await fs.realpath(dir), realPath);
			assert.strictEqual(fs.realpathSync(dir), realPath);
			process.env = {};
			assert.strictEqual(await fs.realpath(dir), realPath);
			assert.strictEqual(fs.realpathSync(dir), realPath);
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
				assert.ok((await fs.stat(dir)).isDirectory());
				assert.ok(fs.statSync(dir).isDirectory());
				assert.ok(Array.isArray(await fs.readdir(dir)));
				assert.ok(Array.isArray(fs.readdirSync(dir)));
				let realPath = path.win32.resolve(dir);
				if (process.platform !== "win32") {
					realPath = path.posix.resolve("/mnt", realPath[0].toLowerCase(), realPath.slice(3).replace(/\\/g, "/"));
				}
				assert.strictEqual(await fs.realpath(dir), realPath);
				assert.strictEqual(fs.realpathSync(dir), realPath);
			});
		});
	});
}

describe("path-posix", () => {
	const pathPosix = require("../lib/path-posix");
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
