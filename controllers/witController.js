// IMPORTS
const FS = require("fs");

// FUNCTIONS
async function getImages() {
	let images = [];

	FS.readdirSync("./static/assets/where-is-this").forEach((file) => {
		images.push(file);
	});

	return images;
}

// EXPORTS
module.exports = {
	getImages,
};
