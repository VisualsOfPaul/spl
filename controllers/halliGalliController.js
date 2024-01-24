// IMPORTS
const HALLIGALLI = require("../data/halliGalli");
const FS = require("fs");

// FUNCTIONS
async function getHalliGalli() {
	let HALLIGALLI = [];

	FS.readdirSync("./public/assets/halli-galli").forEach((file) => {
		HALLIGALLI.push({
			file: file,
			visible: false,
		});
	});

	return await HALLIGALLI;
}

async function toggle(visibleIndex) {
	if (!HALLIGALLI[visibleIndex].visible) {
		HALLIGALLI.forEach((card, index) => {
			card.visible = visibleIndex === index;
		});
	} else {
		HALLIGALLI[visibleIndex].visible = false;
	}

	return await HALLIGALLI;
}

// EXPORTS
module.exports = {
	getHalliGalli,
	toggle,
};
