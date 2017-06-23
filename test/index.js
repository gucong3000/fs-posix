'use strict'
/* global describe, it */

var fs = require('fs')
var assert = require('assert')

require('../lib/patch')

describe('POSIX', () => {
  it('/etc/profile', async () => {
    const contents = await fs.readFile('/etc/profile')
    assert.ok(contents.toString())
  })

  it('/etc/hosts', async () => {
    const contents = await fs.readFile('/etc/hosts')
    assert.ok(contents.toString())
  })

  it('~', async () => {
    const files = await fs.readdir('~')
    assert.ok(Array.isArray(files))
  })
})

describe('function test', () => {
  it('fs.outputFile', async () => {
    await fs.outputFile('./test/tmp/test.md', 'test')
    assert.equal(fs.readFileSync('./test/tmp/test.md'), 'test')
  })
  it('fs.remove', async () => {
    await fs.remove('./test/tmp')
    assert.ok(!fs.existsSync('./test/tmp'))
  })
  it('fs.readFile error catch', async () => {
    try {
      await fs.readFile('./test/tmp/test.md')
      assert.fail(true)
    } catch (ex) {
      assert.ok(ex)
    }
  })
})
// fs.mkdtemp(prefix[, options], callback)
