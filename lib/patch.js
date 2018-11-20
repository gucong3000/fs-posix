"use strict";
const fs = require("fs");
const fsExtra = require("./index");
for (const key in fsExtra) {
	if (typeof fsExtra[key] === "function" && fsExtra[key] !== fs[key]) {
		fs[key] = fsExtra[key];
	}
}
module.exports = fs;
