// IMPORTS
const OUTRO = require("../data/outro");

// FUNCTIONS
async function getOutro() {
	return await OUTRO;
}

async function toggle() {
	OUTRO.visible = !OUTRO.visible;

	return await OUTRO;
}

// EXPORTS
module.exports = {
	getOutro,
	toggle,
};
