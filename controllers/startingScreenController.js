// IMPORTS
const STARTINGSCREEN = require("../data/startingScreen");

// FUNCTIONS
async function toggle() {
	STARTINGSCREEN.visible = !STARTINGSCREEN.visible;

	return STARTINGSCREEN;
}

async function get() {
	return STARTINGSCREEN;
}

async function getVisibility() {
	return STARTINGSCREEN.visible;
}

// EXPORTS
module.exports = {
	toggle,
	getVisibility,
	get
};
