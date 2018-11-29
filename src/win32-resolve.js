"use strict";
const gitWin = require("git-win");
const path = require("path");
const rawResolve = path.resolve;

function isAbsolute (file) {
	return (
		file === "/" ||
		/^\/+(?:boot|dev|etc|home|init|lib\d*|media|mingw\d+|mnt|opt|proc|root|run|s?bin|snap|srv|sys|tmp|usr|var)(?=\/|$)/.test(file)
	);
}

function resolve () {
	const args = arguments;
	for (let i = args.length - 1; i >= 0; i--) {
		if (typeof args[i] !== "string" || args[i].indexOf("\\") >= 0) {
			break;
		} else if (path.posix.isAbsolute(args[i])) {
			const absPath = Array.prototype.slice.call(args, i).join("/");
			if (!i || isAbsolute(absPath)) {
				return gitWin.toWin32(absPath);
			}
			break;
		}
	}
	return rawResolve.apply(path, args);
};

path.resolve = resolve;
