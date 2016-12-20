fs-extra-async
=====

[![NPM version](https://img.shields.io/npm/v/fs-extra-async.svg?style=flat-square)](https://www.npmjs.com/package/fs-extra-async)
[![Travis](https://img.shields.io/travis/gucong3000/fs-extra-async.svg?&label=Linux)](https://travis-ci.org/gucong3000/postcss-pie)
[![AppVeyor](https://img.shields.io/appveyor/ci/gucong3000/postcss-pie.svg?&label=Windows)](https://ci.appveyor.com/project/gucong3000/postcss-pie)
[![Coverage Status](https://img.shields.io/coveralls/gucong3000/postcss-pie.svg)](https://coveralls.io/r/gucong3000/postcss-pie)
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
require('fs-extra-async/lib/polyfill');
var fs = require('fs');
fs.readFile("/etc/profile").then(function(data) {
	console.log(data.toString());
});
```

Detects a `Promise` implementation using [any-promise][any-promise]. If you have a preferred implementation, or are working in an environment without a global implementation, you must explicitly register a `Promise` implementation and it will be used. See [any-promise][any-promise] for details.

Note that `fs-extra` depends on `graceful-fs`, so you will get the benefits of both libraries.

[any-promise]: https://github.com/kevinbeaty/any-promise
