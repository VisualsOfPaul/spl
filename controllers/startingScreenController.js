// IMPORTS
const STARTINGSCREEN = require("../data/startingScreen");

// FUNCTIONS
async function toggle() {
	STARTINGSCREEN.visible = !STARTINGSCREEN.visible;

	return STARTINGSCREEN;
}

// EXPORTS
module.exports = {
	toggle,
};
