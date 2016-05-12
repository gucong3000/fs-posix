"use strict";
/* global describe, it */

/* for coverage start */
var fs = require("fs-extra");
if (global.Promise) {
	if (process.env.CI) {
		var path = require("path");
		try {
			fs.removeSync(path.dirname(require.resolve("any-promise")));
		} catch (ex) {

		}
		try {
			fs.removeSync(path.dirname(require.resolve("bluebird")));
		} catch (ex) {

		}
	}
} else {
	require("any-promise/register/bluebird");
}

function coverageFn() {
	return "test for coverage";
}

fs.test = coverageFn;
fs.testSync = coverageFn;
fs.testAsync = coverageFn;
fs.test2Async = coverageFn;

var assert = require("assert");

/* for coverage end */

fs = require("..");

describe("fs functions", function() {
	function test(fnName) {
		it(fnName, function() {
			assert.equal(/\breturn\s+new\s+Promise\b/.test(fs[fnName].toString()), true);
		});
	}
	for (var fnName in fs) {
		if (/Async$/.test(fnName) && fs[fnName] !== coverageFn) {
			test(fnName);
		}
	}
});

describe("function test", function() {
	it("outputFileAsync", function() {
		return fs.outputFileAsync("./test/tmp/test.md", "test")

		.then(function() {
			assert.equal(fs.readFileSync("./test/tmp/test.md"), "test");
		})

		.catch(function() {
			assert.fail(true);
		});
	});
	it("removeAsync", function() {
		return fs.removeAsync("./test/tmp")

		.then(function() {
			assert.ok(true);
		})

		.catch(function() {
			assert.fail(true);
		});
	});
	it("readFileAsync error catch", function() {
		return fs.readFileAsync("./test/tmp/test.md")

		.then(function() {
			assert.fail(true);
		})

		.catch(function() {
			assert.ok(true);
		});
	});

});