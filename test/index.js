'use strict';
/* global describe, it */

/* for coverage start */
var fs = require('fs');
if (global.Promise) {
	if (process.env.CI) {
		var path = require('path');
		try {
			fs.removeSync(path.dirname(require.resolve('any-promise')));
		} catch (ex) {
			//
		}
	}
} else {
	require('any-promise/register/bluebird');
}

var assert = require('assert');

/* for coverage end */

require('../lib/polyfill');


describe('POSIX', function() {
	it('/etc/profile', function() {
		return fs.readFile('/etc/profile')

		.then(function(contents) {
			assert.ok(contents.toString());
		});
	});

	it('/etc/hosts', function() {
		return fs.readFile('/etc/hosts')

		.then(function(contents) {
			assert.ok(contents.toString());
		});
	});
});

describe('function test', function() {
	it('fs.outputFile', function() {
		return fs.outputFile('./test/tmp/test.md', 'test')

		.then(function() {
			assert.equal(fs.readFileSync('./test/tmp/test.md'), 'test');
		})

		.catch(function() {
			assert.fail(true);
		});
	});
	it('fs.remove', function() {
		return fs.remove('./test/tmp')

		.then(function() {
			assert.ok(true);
		})

		.catch(function() {
			assert.fail(true);
		});
	});
	it('fs.readFile error catch', function() {
		return fs.readFile('./test/tmp/test.md')

		.then(function() {
			assert.fail(true);
		})

		.catch(function() {
			assert.ok(true);
		});
	});
});
