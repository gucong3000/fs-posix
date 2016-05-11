"use strict";

/**
 * Resolve any installed ES6 compatible promise
 * @return {Promise} Promise
 */
function promisePolyfill() {
	try {
		return require("any-promise");
	}catch(ex){
		return global.Promise;
	}
}

/**
 * promisify a methods
 * @param {Object} fs          fs module (or any other fs-like module)
 * @param {String} fnName      name of method that use callback
 * @param {String} fnNameAsync name of new method that promisify
 */
function addAsyncFn(module, fnName, fnNameAsync) {
	module[fnNameAsync] = function() {
		var args = [].slice.call(arguments, 0);
		return new Promise((resolve, reject) => {
			args.push((err, data) => {
				if (err) {
					reject(err);
				} else {
					resolve(data);
				}
			});
			module[fnName].apply(module, args);
		});
	};
}

/**
 * promisify a module
 * @param  {Object} module
 * @return {Object}	module
 */
function promisify(module) {
	for (var fnName in module) {
		if (/Sync$/.test(fnName)) {
			continue;
		}
		if (/Async$/.test(fnName)) {
			continue;
		}
		if (typeof module[fnName] !== "function") {
			continue;
		}
		var fnNameAsync = fnName + "Async";
		if (fnNameAsync in module) {
			continue;
		}
		if (typeof module[fnName + "Sync"] === "function" || /^function(?:\s\w+)?\s*\([^()]+?\bcallback\s*\)\s*\{/.test(module[fnName].toString())) {
			addAsyncFn(module, fnName, fnNameAsync);
		}
	}
	return module;
}

var Promise = promisePolyfill();
if(!Promise){
	console.error("Promise not fund!\tSee: https://github.com/kevinbeaty/any-promise");
}
module.exports = promisify(require("fs-extra"));

