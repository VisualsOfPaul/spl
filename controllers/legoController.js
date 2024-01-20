// IMPORTS
const FS = require("fs");
const LEGOBUILDS = require("../data/legoBuilds");

// FUNCTIONS
async function getImages() {
	let images = [];

	FS.readdirSync("./public/assets/lego-builds").forEach((file) => {
		images.push(file);
	});

	return images;
}

async function toggle(index) {
	LEGOBUILDS.forEach((build) => {
		if (build.index !== index) build.visible = false;
	});

	const build = LEGOBUILDS.find((build) => {
		return build.index === index;
	});

	build.visible = !build.visible;

	return LEGOBUILDS;
}

// EXPORTS
module.exports = {
	getImages,
	toggle,
};
