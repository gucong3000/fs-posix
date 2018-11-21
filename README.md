fs-posix
=====

[![NPM version](https://img.shields.io/npm/v/fs-posix.svg?style=flat-square)](https://www.npmjs.com/package/fs-posix)
[![Travis](https://img.shields.io/travis/gucong3000/fs-posix.svg?&label=Linux)](https://travis-ci.org/gucong3000/fs-posix)
[![AppVeyor](https://img.shields.io/appveyor/ci/gucong3000/fs-posix.svg?&label=Windows)](https://ci.appveyor.com/project/gucong3000/fs-posix)
[![Codecov](https://img.shields.io/codecov/c/github/gucong3000/fs-posix.svg)](https://codecov.io/gh/gucong3000/fs-posix)
[![David](https://img.shields.io/david/gucong3000/fs-posix.svg)](https://david-dm.org/gucong3000/fs-posix)

Node file system library and fs-extra module promisified

## Why

- Support [POSIX](https://en.wikipedia.org/wiki/POSIX) style path cross platform.
- Support Windows style path for [WSL](https://docs.microsoft.com/windows/wsl).
- Support Promise syntax or async function.
- All original `fs` and `fs-extra` methods are included.


## Install

```bash
npm install --save fs-posix
```

## Usage

```js
require('fs-posix/lib/patch');
const fs = require('fs');
fs.readFile('/etc/hosts', 'utf8').then(console.log);
```

Note that `fs-extra` depends on `graceful-fs`, so you will get the benefits of both libraries.

## Methods

- [copy](https://github.com/jprichardson/node-fs-extra/#copy)
- [copySync](https://github.com/jprichardson/node-fs-extra/#copy)
- [emptyDir](https://github.com/jprichardson/node-fs-extra/#emptydirdir-callback)
- [emptyDirSync](https://github.com/jprichardson/node-fs-extra/#emptydirdir-callback)
- [ensureFile](https://github.com/jprichardson/node-fs-extra/#ensurefilefile-callback)
- [ensureFileSync](https://github.com/jprichardson/node-fs-extra/#ensurefilefile-callback)
- [ensureDir](https://github.com/jprichardson/node-fs-extra/#ensuredirdir-callback)
- [ensureDirSync](https://github.com/jprichardson/node-fs-extra/#ensuredirdir-callback)
- [ensureLink](https://github.com/jprichardson/node-fs-extra/#ensurelinksrcpath-dstpath-callback)
- [ensureLinkSync](https://github.com/jprichardson/node-fs-extra/#ensurelinksrcpath-dstpath-callback)
- [ensureSymlink](https://github.com/jprichardson/node-fs-extra/#ensuresymlinksrcpath-dstpath-type-callback)
- [ensureSymlinkSync](https://github.com/jprichardson/node-fs-extra/#ensuresymlinksrcpath-dstpath-type-callback)
- [mkdirs](https://github.com/jprichardson/node-fs-extra/#mkdirsdir-callback)
- [mkdirsSync](https://github.com/jprichardson/node-fs-extra/#mkdirsdir-callback)
- [move](https://github.com/jprichardson/node-fs-extra/#movesrc-dest-options-callback)
- [outputFile](https://github.com/jprichardson/node-fs-extra/#outputfilefile-data-options-callback)
- [outputFileSync](https://github.com/jprichardson/node-fs-extra/#outputfilefile-data-options-callback)
- [outputJson](https://github.com/jprichardson/node-fs-extra/#outputjsonfile-data-options-callback)
- [outputJsonSync](https://github.com/jprichardson/node-fs-extra/#outputjsonfile-data-options-callback)
- [readJson](https://github.com/jprichardson/node-fs-extra/#readjsonfile-options-callback)
- [readJsonSync](https://github.com/jprichardson/node-fs-extra/#readjsonfile-options-callback)
- [remove](https://github.com/jprichardson/node-fs-extra/#removedir-callback)
- [removeSync](https://github.com/jprichardson/node-fs-extra/#removedir-callback)
- [walk](https://github.com/jprichardson/node-fs-extra/#walk)
- [walkSync](https://github.com/jprichardson/node-fs-extra/#walksyncdir)
- [writeJson](https://github.com/jprichardson/node-fs-extra/#writejsonfile-object-options-callback)
- [writeJsonSync](https://github.com/jprichardson/node-fs-extra/#writejsonfile-object-options-callback)
