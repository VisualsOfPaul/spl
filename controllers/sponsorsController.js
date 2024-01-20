// IMPORTS
const SPONSORS = require("../data/sponsors");

// FUNCTIONS
async function toggle() {
	SPONSORS.visible = !SPONSORS.visible;

	return SPONSORS;
}

async function getVisibility() {
	return SPONSORS.visible;
}

// EXPORTS
module.exports = {
	toggle,
	getVisibility,
};
