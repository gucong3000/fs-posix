"use strict";
const os = require("os");
let gitWin;

const envFailback = {
	HOME: os.homedir(),
};

function win32 (file) {
	return gitWin.toWin32(file).replace(/%(.+?)%/g, (s, key) => (
		process.env[key] || envFailback[key]
	));
}

function posix (file) {
	return file.replace(/^~(?=[/\\]|$)/, () => process.env.HOME || envFailback.HOME);
}

if (process.platform === "win32") {
	gitWin = require("git-win");
	envFailback.windir = [
		process.env.windir,
		process.env.SystemRoot,
		"C:\\Windows",
	].find(Boolean);
	module.exports = win32;
} else {
	module.exports = posix;
}
