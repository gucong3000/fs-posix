'use strict'
var pathPosix = require('./path-posix')
var fs = require('fs-extra')

const fnArgNum = {
  rename: 2,
  copy: 2,
  move: 2,
  link: 2,
  symlink: 2,
  ensureLink: 2,
  ensureSymlink: 2
}

function argPosix (name) {
  var max = fnArgNum[name.replace(/Sync$/, '')] || 1
  return (arg, index) => {
    return index < max ? pathPosix(arg) : arg
  }
}

/**
 * posix a methods
 * @param {Object} module  fs module (or any other fs-like module)
 * @param {String} fn      method that need patch
 * @returns {Function}     function that patched
 */
function fixFn (fs, name) {
  if (!/Sync$/.test(name) && !fs[name + 'Sync']) {
    return
  }
  const fn = fs[name]
  if (typeof fn !== 'function') {
    return
  }

  const argFixer = argPosix(name)

  return function () {
    return fn.apply(this, Array.from(arguments).map(argFixer))
  }
}

module.exports = new Proxy(fs, {
  get: function (fs, name) {
    return fixFn(fs, name) || fs[name]
  }
})
