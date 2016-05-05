"use strict";

/**
 * Resolve any installed ES6 compatible promise
 * @return {Promise} Promise
 */
function promisePolyfill() {
	return global.Promise || require("any-promise");
}

// 
/**
 * promisify a methods
 * @param {Object} fs          fs module (or any other fs-like module)
 * @param {String} fnName      name of method that use callback
 * @param {String} fnNameAsync name of new method that promisify
 */
function addAsyncFn(fs, fnName, fnNameAsync) {
	fs[fnNameAsync] = function() {
		var args = [].slice.call(arguments, 0);
		var Promise = promisePolyfill();
		return new Promise((resolve, reject) => {
			args.push((err, data) => {
				if (err) {
					reject(err);
				} else {
					resolve(data);
				}
			});
			fs[fnName].apply(fs, args);
		});
	};
}

/**
 * patch fs module
 * @param  {Object} fs	fs module (or any other fs-like module)
 * @return {Object}		fs module
 */
function makeFs(fs) {
	for (var fnName in fs) {
		if (/Sync$/i.test(fnName)) {
			continue;
		}
		if (/Async$/i.test(fnName)) {
			continue;
		}
		if (typeof fs[fnName] !== "function") {
			continue;
		}
		if (fnName !== "move" && typeof fs[fnName + "Sync"] !== "function") {
			continue;
		}
		var fnNameAsync = fnName + "Async";
		if (fnNameAsync in fs) {
			continue;
		}
		addAsyncFn(fs, fnName, fnNameAsync);
	}
	return fs;
}

module.exports = makeFs(require("fs-extra"));