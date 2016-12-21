'use strict';
var posixPath = require('./posix-path');
var Promise = promisePolyfill();
/**
 * Resolve any installed ES6 compatible promise
 * @return {Promise} Promise
 */
function promisePolyfill() {
	var p;
	var error;
	try {
		p = require('any-promise');
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
		args[0] = posixPath(args[0]) || args[0];
		if(args.length > 1 && typeof args[args.length - 1] === 'function') {
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
		if (typeof module[fnName] !== 'function') {
			continue;
		}
		if (typeof module[fnName + 'Sync'] === 'function' || /^function(?:\s\w+)?\s*\([^()]+?\bcallback\s*\)\s*\{/.test(module[fnName].toString())) {
			fixSyncFn(module, fnName);
		}
	}
	return module;
}

module.exports = promisify(require('fs-extra'));