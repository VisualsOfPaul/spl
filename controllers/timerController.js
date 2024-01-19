// IMPORTS
const TIMER = require("../data/timer");

// FUNCTIONS
async function toggle() {
	TIMER.visible = !TIMER.visible;
	return TIMER;
}

// EXPORTS
module.exports = {
	toggle,
};
