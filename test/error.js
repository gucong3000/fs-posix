"use strict";
/* global describe, it */
var assert = require("assert");
describe("error test", function() {
	it("error catch", function() {
		var fs = require("fs");
		var path = require("path");
		var promisePath;
		try {
			promisePath = path.dirname(require.resolve("any-promise"));
		} catch (ex) {
			promisePath = "./node_modules/any-promise";
		}
		var bluebirdPath;
		try {
			bluebirdPath = path.dirname(require.resolve("bluebird"));
		} catch (ex) {
			bluebirdPath = "./node_modules/bluebird";
		}
		var promisePathBak = promisePath + "_bak";
		var bluebirdPathBak = bluebirdPath + "_bak";
		var globalPromise = global.Promise;
		var error;
		global.Promise = null;
		try{
			fs.renameSync(promisePath, promisePathBak);
		} catch(ex){
			
		}
		try{
			fs.renameSync(bluebirdPath, bluebirdPathBak);
		} catch(ex){
			
		}

		try {
			require("..");
		} catch (ex) {
			error = ex;
		}
		try{
			fs.renameSync(promisePathBak, promisePath);
		} catch(ex){
			
		}
		try{
			fs.renameSync(bluebirdPathBak, bluebirdPath);
		} catch(ex){
			
		}
		global.Promise = globalPromise;
		assert.ok(error || globalPromise);
	});
});