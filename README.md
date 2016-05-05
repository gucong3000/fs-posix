# fs-extra-promise.js

# Node file system library and fs-extra module promisified

API is stable. No tests at present but it seems to work fine!

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
var fs = require('fs-extra-promise');
fs.readFileAsync(path).then(function(data) {
	console.log(data);
});
```

All original `fs` and `fs-extra` methods are included unmodified.

Detects a `Promise` implementation using [any-promise][any-promise]. If you have a preferred implementation, or are working in an environment without a global implementation, you must explicitly register a `Promise` implementation and it will be used. See [any-promise][any-promise] for details.

Note that `fs-extra` depends on `graceful-fs`, so you will get the benefits of both libraries.

[any-promise]: https://github.com/kevinbeaty/any-promise
[1]: https://nodejs.org/api/fs.html
[2]: https://www.npmjs.org/package/fs-extra
[3]: 
[4]: https://github.com/normalize/mz
[5]: https://github.com/thenables/thenify-all