"use strict";
const wslpath = require("./wslpath");
const path = require("path");
const rawResolve = path.resolve;

function resolve () {
	const args = arguments;
	for (let i = args.length - 1; i >= 0; i--) {
		if (typeof args[i] !== "string" || path.posix.isAbsolute(args[i])) {
			break;
		} else if (path.win32.isAbsolute(args[i])) {
			const absPath = wslpath(Array.prototype.slice.call(args, i).join("\\"));
			if (absPath) {
				return absPath;
			}
			break;
		}
	}
	return rawResolve.apply(path, args);
};
path.resolve = resolve;
