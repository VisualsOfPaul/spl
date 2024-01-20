// IMPORTS
const TIMER = require("../data/timer");

// FUNCTIONS
async function toggle() {
	TIMER.visible = !TIMER.visible;
	return TIMER;
}

async function getVisibility() {
	return TIMER.visible;
}

// EXPORTS
module.exports = {
	toggle,
	getVisibility,
};
