"use strict";
const cp = require("child_process");
const path = require("path");
const os = require("os");
const cache = {};
let toNamespacedPath;
let gitWin;

function win32 (file) {
	return path.posix.isAbsolute(file) ? gitWin.toWin32(file) : posix(file);
}

function posix (file) {
	if (/^~(?=\/|$)/.test(file)) {
		file = path.join(process.env.HOME || os.homedir(), file.slice(1));
	}
	return file;
}

/* istanbul ignore next */
function wsl (file) {
	if (!path.posix.isAbsolute(file) && path.win32.isAbsolute(file)) {
		file = wslpath(file) || file;
	} else {
		file = posix(file);
	}
	return file;
}

/* istanbul ignore next */
function wslpath (file) {
	let key = toNamespacedPath(file).toLowerCase();
	if (!key.startsWith("\\\\?\\")) {
		key = process.cwd() + key;
	}
	if (key in cache) {
		return cache[key];
	}
	let realPath;
	try {
		realPath = cp.spawnSync("wslpath", [file], {
			encoding: "utf8",
		}).stdout.trim();
	} catch (ex) {
		//
	}
	cache[key] = realPath;
	return realPath;
}

if (process.platform === "win32") {
	module.exports = win32;
	gitWin = require("git-win");
} else {
	/* istanbul ignore if */
	if (process.platform === "linux" && /\bMicrosoft\b/.test(os.release())) {
		toNamespacedPath = path.win32.toNamespacedPath || path.win32._makeLong;
		module.exports = wsl;
	} else {
		module.exports = posix;
	}
}
