// IMPORTS
const WINNER = require("../data/winner");

// FUNCTIONS

async function toggle(data) {
	WINNER.visible = !WINNER.visible;
	WINNER.course = Number(data);
	return WINNER;
}

// EXPORTS
module.exports = {
	toggle,
};
