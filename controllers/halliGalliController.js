// IMPORTS
const HALLIGALLI = require("../data/halliGalli");
const FS = require("fs");

// FUNCTIONS
async function getHalliGalli() {
	let HALLIGALLI = [];

	FS.readdirSync("./public/assets/halli-galli").forEach((file) => {
		HALLIGALLI.push({
			file: file,
		});
	});

	return await HALLIGALLI;
}

async function toggle() {
	HALLIGALLI.visible = !HALLIGALLI.visible;

	return await HALLIGALLI;
}

// EXPORTS
module.exports = {
	getHalliGalli,
	toggle,
};
