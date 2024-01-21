// IMPORTS
const FS = require("fs");
const REMEMBERIMAGE = require("../data/rememberImage");

// FUNCTIONS
async function getImages() {
	let images = [];

	FS.readdirSync("./public/assets/remember-image").forEach((file, index) => {
		images.push({
			file: file,
			question: REMEMBERIMAGE[index].question,
		});
	});

	return images;
}

async function toggle(index) {
	REMEMBERIMAGE[index].visible = !REMEMBERIMAGE[index].visible;

	return REMEMBERIMAGE;
}

// EXPORTS
module.exports = {
	getImages,
	toggle,
};
