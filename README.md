fs-extra-async
=====

[![NPM version](https://img.shields.io/npm/v/fs-extra-async.svg?style=flat-square)](https://www.npmjs.com/package/fs-extra-async)
[![Travis](https://img.shields.io/travis/gucong3000/fs-extra-async.svg?&label=Linux)](https://travis-ci.org/gucong3000/fs-extra-async)
[![AppVeyor](https://img.shields.io/appveyor/ci/gucong3000/fs-extra-async.svg?&label=Windows)](https://ci.appveyor.com/project/gucong3000/fs-extra-async)
[![Coverage Status](https://img.shields.io/coveralls/gucong3000/fs-extra-async.svg)](https://coveralls.io/r/gucong3000/fs-extra-async)

Node file system library and fs-extra module promisified

## Why

- Support [POSIX](https://en.wikipedia.org/wiki/POSIX) file path cross platform.
- Support Promise syntax or async function.
- Support node native syntax.
- All original `fs` and `fs-extra` methods are included.


## Install

```bash
npm install --save fs-extra-async
```

## Usage

```js
require('fs-extra-async/lib/patch');
var fs = require('fs');
fs.readFile('README.md', 'utf8').then(data => console.log(data));
```

Detects a `Promise` implementation using [any-promise][any-promise]. If you have a preferred implementation, or are working in an environment without a global implementation, you must explicitly register a `Promise` implementation and it will be used. See [any-promise][any-promise] for details.

Note that `fs-extra` depends on `graceful-fs`, so you will get the benefits of both libraries.

[any-promise]: https://github.com/kevinbeaty/any-promise

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
