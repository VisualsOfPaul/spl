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

async function get() {
	return TIMER;
}

// EXPORTS
module.exports = {
	toggle,
	getVisibility,
	get
};
