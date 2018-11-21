"use strict";
const cp = require("child_process");
const path = require("path");
const os = require("os");
const cache = {};
let gitWin;

function homePath (file) {
	if (/^(?:~|%HOME%|\$\{HOME\})(?=[/\\]|$)/.test(file)) {
		file = file.slice(RegExp.lastMatch.length);
		return path.join(process.env.HOME || os.homedir(), file);
	}
}

function win32 (file) {
	return cache[file] || homePath(file) || gitWin.toWin32(file);
}

function posix (file) {
	return homePath(file) || file;
}

/* istanbul ignore next */
function wsl (file) {
	if (!path.posix.isAbsolute(file) && path.win32.isAbsolute(file)) {
		if (!(file in cache)) {
			let realPath;
			try {
				realPath = cp.spawnSync("wslpath", [file], {
					encoding: "utf8",
				}).stdout.trim();
			} catch (ex) {
				//
			}
			cache[file] = realPath || file;
		}
		file = cache[file];
	} else {
		file = posix(file);
	}
	return file;
}

if (process.platform === "win32") {
	module.exports = win32;
	const etcPath = path.join(process.env.windir || process.env.SystemRoot || "C:/Windows", "System32/drivers/etc");
	[
		"hosts",
		"networks",
		"services",
	].forEach(file => {
		cache["/etc/" + file] = path.join(etcPath, file);
	});
	cache["/etc/protocols"] = path.join(etcPath, "protocol");
	gitWin = require("git-win");
} else {
	/* istanbul ignore if */
	if (process.platform === "linux" && /\bMicrosoft\b/.test(os.release())) {
		module.exports = wsl;
	} else {
		module.exports = posix;
	}
}
