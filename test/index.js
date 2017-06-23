'use strict'
/* global describe, it */

var fs = require('fs')
var assert = require('assert')

require('../lib/patch')

describe('POSIX', function () {
  it('/etc/profile', function () {
    return fs.readFile('/etc/profile')
      .then(function (contents) {
        assert.ok(contents.toString())
      })
  })

  it('/etc/hosts', function () {
    return fs.readFile('/etc/hosts')
      .then(function (contents) {
        assert.ok(contents.toString())
      })
  })
  it('~', function () {
    return fs.readdir('~')
      .then(function (files) {
        assert.ok(Array.isArray(files))
      })
  })
})

describe('function test', function () {
  it('fs.outputFile', function () {
    return fs.outputFile('./test/tmp/test.md', 'test')
      .then(function () {
        assert.equal(fs.readFileSync('./test/tmp/test.md'), 'test')
      })
      .catch(function () {
        assert.fail(true)
      })
  })
  it('fs.remove', function () {
    return fs.remove('./test/tmp')
      .then(function () {
        assert.ok(true)
      })
      .catch(function () {
        assert.fail(true)
      })
  })
  it('fs.readFile error catch', function () {
    return fs.readFile('./test/tmp/test.md')
      .then(function () {
        assert.fail(true)
      })
      .catch(function () {
        assert.ok(true)
      })
  })
})
