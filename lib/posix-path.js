'use strict';
var path;
var etcPath;
var osHomedir = require('os-homedir');
var gitPath;
function win32(file) {
	if(typeof file !== 'string') {
		return;
	}
	if(/^~/.test(file)) {
		// 处理linux风格的home路径
		file = path.join(osHomedir(), file.slice(1));
	} else if('/etc/protocols' === file) {
		file = path.join(etcPath, 'protocol');
	} else if(/^\/etc\/(hosts|networks|services)$/.test(file)) {
		file = path.join(etcPath, RegExp.$1);
	} else if(gitPath && /^\//.test(file)) {
		// 处理linux风格的绝对路径
		file = path.join(gitPath, file.slice(1));
	}
	return file;
}

function posix(file) {
	if(typeof file !== 'string') {
		return;
	}
	if(/^~/.test(file)) {
		// 处理linux风格的home路径
		file = path.join(osHomedir(), file.slice(1));
	}
	return file;
}

if(process.platform === 'win32') {
	path = require('path').win32;
	etcPath = path.join(process.env.windir, 'System32/drivers/etc');
	try {
		gitPath = require('git-win');
	} catch(ex) {
		//
	}
	module.exports = win32;
} else {
	path = require('path').posix;
	module.exports = posix;
}
