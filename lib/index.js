'use strict'
var posixPath = require('./posix-path')
var fs = require('fs-extra')
/**
 * posix a methods
 * @param {Object} module  fs module (or any other fs-like module)
 * @param {String} fn      method that need patch
 * @returns {Function}     function that patched
 */
function fixFn (module, fn) {
  if (typeof fn !== 'function') {
    return
  }
  return function () {
    var args = Array.from(arguments)
    args[0] = posixPath(args[0]) || args[0]
    return fn.apply(this, args)
  }
}

module.exports = new Proxy(fs, {
  get: function (fs, name) {
    return fixFn(fs, fs[name]) || fs[name]
  }
})
