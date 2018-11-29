"use strict";
const pathPosix = require("./path-posix");
const path = require("path");
const fs = require("fs");

function fixArgs (args) {
	if (args[0] && typeof args[0] === "string") {
		args[0] = pathPosix(args[0]);
	}
	return args;
}

function fix (obj, fnName) {
	const fn = obj[fnName];
	if (fn && typeof fn === "function") {
		obj[fnName] = Object.assign(
			Object.defineProperty(
				function () {
					return fn.apply(this, fixArgs(arguments));
				},
				"name",
				{
					value: fn.name,
				}
			),
			fn
		);
	}
}
// eslint-disable-next-line node/no-deprecated-api
const makeLong = path.toNamespacedPath && (path.toNamespacedPath === path._makeLong);
fix(fs.realpathSync, "native");
fix(fs.realpath, "native");
fix(fs, "realpathSync");
fix(fs, "realpath");
fix(path, "toNamespacedPath");
if (makeLong) {
	// eslint-disable-next-line node/no-deprecated-api
	path._makeLong = path.toNamespacedPath;
} else {
	fix(path, "_makeLong");
}
fix(process, "chdir");
module.exports = fs;
