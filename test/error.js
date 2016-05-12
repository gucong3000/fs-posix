"use strict";
/* global describe, it */
var assert = require("assert");
describe("error test", function() {
	if (global.Promise) {
		it("has Promise", function() {
			assert.ok(Promise);
		});
	} else {
		it("error catch", function() {
			var fs = require("fs");
			var path = require("path");
			var promisePath = path.dirname(require.resolve("any-promise"));
			var bluebirdPath = path.dirname(require.resolve("bluebird"));
			var promisePathBak = promisePath + "_bak";
			var bluebirdPathBak = bluebirdPath + "_bak";

			fs.renameSync(promisePath, promisePathBak);
			fs.renameSync(bluebirdPath, bluebirdPathBak);
			try {
				require("..");
			} catch (ex) {
				fs.renameSync(promisePathBak, promisePath);
				fs.renameSync(bluebirdPathBak, bluebirdPath);
				assert.ok(ex);
			}
		});
	}
});