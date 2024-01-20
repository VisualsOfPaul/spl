// IMPORTS
const DATA = require("../data/countLetters");

// FUNCTIONS
async function getData() {
	return DATA;
}

async function toggleWord(wordIndex) {
	DATA.forEach((entry, index) => {
		if (wordIndex !== index) {
			entry.visible = false;
		}

		entry.solutionVisible = false;
	});

	DATA[wordIndex].visible = !DATA[wordIndex].visible;

	return await DATA;
}

async function showSolution(index) {
	DATA[index].solutionVisible = !DATA[index].solutionVisible;

	return await DATA;
}

// EXPORTS
module.exports = {
	getData,
	toggleWord,
	showSolution,
};
