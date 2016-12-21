var fs = require('fs');
var fsExtra = require('./index.js');
for(var key in fsExtra) {
	if(typeof module[key] !== 'function' && fsExtra[key] !== fs[key]) {
		fs[key] = fsExtra[key];
	}
}
module.exports = fsExtra;
