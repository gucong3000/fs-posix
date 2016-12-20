"use strict";
var gitPath;
var path = require("path").win32;
var osHomedir = require("os-homedir");
try {
	gitPath = require("git-win");
} catch(ex) {
	//
}
/**
 * Resolve any installed ES6 compatible promise
 * @return {Promise} Promise
 */
function promisePolyfill() {
	var p;
	var error;
	try {
		p = require("any-promise");
	} catch (ex) {
		error = ex;
	}
	p = p || global.Promise;
	if (p) {
		return p;
	} else {
		throw error;
	}
}

/**
 * promisify a methods
 *
 * @param {Object} module       fs module (or any other fs-like module)
 * @param {String} fnName       name of method that use callback
 * @param {String} fnNameAsync  name of new method that promisify
 */
function fixSyncFn(module, fnName) {
	var originalFn = module[fnName];
	module[fnName] = function() {
		var args = [].slice.call(arguments, 0);
		if(args[0] && process.platform === "win32") {
			if(/^~\//.test(args[0])) {
				// 处理linux风格的home路径
				args[0] = path.join(osHomedir(), args[0].slice(2));
			} else if(gitPath && /^\//.test(args[0])) {
				// 处理linux风格的绝对路径
				args[0] = path.join(gitPath, args[0].slice(1));
			}
		}
		if(args.length > 1 && typeof args[args.length - 1] === "function") {
			return originalFn.apply(module, args);
		}
		return new Promise(function(resolve, reject) {
			args.push(function(err, data) {
				if (err) {
					reject(err);
				} else {
					resolve(data);
				}
			});
			originalFn.apply(module, args);
		});
	};
}

/**
 * promisify a module
 * @param  {Object} module  fs module (or any other fs-like module)
 * @return {Object}	module  fs module (or any other fs-like module)
 */
function promisify(module) {
	for (var fnName in module) {
		if (/Sync$/.test(fnName)) {
			continue;
		}
		if (typeof module[fnName] !== "function") {
			continue;
		}
		if (typeof module[fnName + "Sync"] === "function" || /^function(?:\s\w+)?\s*\([^()]+?\bcallback\s*\)\s*\{/.test(module[fnName].toString())) {
			fixSyncFn(module, fnName);
		}
	}
	return module;
}

var Promise = promisePolyfill();
module.exports = promisify(require("fs-extra"));