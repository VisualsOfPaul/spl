// IMPORTS
const FS = require("fs");
const WHEREISTHIS = require("../data/wit");

// FUNCTIONS
async function getImages() {
	let images = [];

	FS.readdirSync("./public/assets/where-is-this").forEach((file, index) => {
		images.push({
			file: file,
			correctAnswer: WHEREISTHIS[index].correctAnswer,
		});
	});

	return images;
}

async function toggle(index) {
	WHEREISTHIS.forEach((image) => {
		if (image.index !== index) image.visible = false;
	});

	WHEREISTHIS[index].visible = !WHEREISTHIS[index].visible;

	return await WHEREISTHIS;
}

async function toggleAnswer(index) {
	WHEREISTHIS[index].answerVisible = !WHEREISTHIS[index].answerVisible;

	return await WHEREISTHIS;
}

// EXPORTS
module.exports = {
	getImages,
	toggle,
	toggleAnswer,
};
