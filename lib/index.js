"use strict";
const pathPosix = require("./path-posix");
const fs = require("fs-extra");

const fnArgNum = {
	rename: 2,
	copy: 2,
	move: 2,
	link: 2,
	symlink: 2,
	ensureLink: 2,
	ensureSymlink: 2,
};

function argPosix (name) {
	const max = fnArgNum[name.replace(/Sync$/, "")] || 1;
	return (arg, index) => {
		return index < max && arg && typeof arg === "string" ? pathPosix(arg) : arg;
	};
}

/**
 * posix a methods
 * @param {Object} module  fs module (or any other fs-like module)
 * @param {String} fn      method that need patch
 * @returns {Function}     function that patched
 */
function fixFn (fs, name) {
	if (typeof name !== "string" || typeof fs[name] !== "function" || typeof fs[/Sync$/.test(name) ? name.slice(0, -4) : name + "Sync"] !== "function") {
		return fs[name];
	}

	const argFixer = argPosix(name);
	return function () {
		return fs[name].apply(this, Array.from(arguments).map(argFixer));
	};
}

module.exports = new Proxy(fs, {
	get: fixFn,
});
