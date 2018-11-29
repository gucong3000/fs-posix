"use strict";
const cp = require("child_process");
let driverPrefix = cp.spawnSync("wslpath", ["C:/"], {
	encoding: "utf8",
}).stdout;
if (driverPrefix) {
	driverPrefix = driverPrefix.replace(/\/c\/\s*$/i, "/");
} else {
	driverPrefix = "/mnt/";
}

function getCurrDriver () {
	const driver = process.cwd();
	if (driver.length > driverPrefix.length && driver.startsWith(driverPrefix)) {
		const suffix = driver[driverPrefix.length + 1];
		if (!suffix || suffix === "/") {
			return driver[driverPrefix.length];
		}
	}
}

function wslpath (file) {
	let driver = /^[A-Z]:+(?=\\|\/)/i.exec(file);
	if (driver) {
		file = file.slice(driver[0].length);
		driver = driver[0][0];
	} else if (file[0] === "\\") {
		driver = getCurrDriver();
		if (!driver) {
			return;
		}
	} else {
		return;
	}

	return driverPrefix + driver.toLowerCase() + file.replace(/[\\/]+/g, "/").replace(/\/+$/, "");
}

module.exports = wslpath;
