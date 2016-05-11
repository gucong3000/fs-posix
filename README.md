fs-extra-async
=====

[![Build Status](https://travis-ci.org/gucong3000/fs-extra-async.svg?branch=master)](https://travis-ci.org/gucong3000/fs-extra-async) [![NPM version](https://img.shields.io/npm/v/fs-extra-async.svg?style=flat-square)](https://www.npmjs.com/package/fs-extra-async)

Node file system library and fs-extra module promisified

## Usage

This module is a drop-in replacement for the [native node file system module](http://nodejs.org/api/fs.html) and the augmented [fs-extra](https://www.npmjs.org/package/fs-extra) module.

Additionally, it creates promisified versions of all `fs`'s and `fs-extra`'s async methods, using [any-promise][any-promise]. These methods are named the same as the original `fs`/`fs-extra` methods with `'Async'` added to the end of the method names.

So instead of:

```js
var fs = require('fs');
fs.readFile(path, function(err, data) {
	console.log(data);
});
```

You can now:

```js
var fs = require('fs-extra-async');
fs.readFileAsync(path).then(function(data) {
	console.log(data);
});
```

With ES2017, this will allow you to use async functions:

```js
import fs from 'fs-extra-async';
(async function fn(args){
	var data = await fs.readJsonAsync('data.json');
	await fs.outputFileAsync('/tmp/markdown/readme.md', data.readme.markdown);
	await fs.outputFileAsync('/tmp/markdown/doc.md', data.doc.markdown);
	await require('open')('/tmp/markdown/readme.md');
	await fs.removeAsync('/tmp/markdown');
})();
```

All original `fs` and `fs-extra` methods are included unmodified.

Detects a `Promise` implementation using [any-promise][any-promise]. If you have a preferred implementation, or are working in an environment without a global implementation, you must explicitly register a `Promise` implementation and it will be used. See [any-promise][any-promise] for details.

Note that `fs-extra` depends on `graceful-fs`, so you will get the benefits of both libraries.

[any-promise]: https://github.com/kevinbeaty/any-promise
