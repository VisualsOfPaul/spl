// IMPORTS
const SPONSORS = require("../data/sponsors");

// FUNCTIONS
async function toggle() {
	SPONSORS.visible = !SPONSORS.visible;

	return SPONSORS;
}

// EXPORTS
module.exports = {
	toggle,
};
