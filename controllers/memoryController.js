// IMPORTS
const MEMORY = require("../data/memory");

// FUNCTIONS
async function getMemory() {
	return MEMORY;
}

async function toggle() {
	MEMORY.visible = !MEMORY.visible;

	return MEMORY;
}

// EXPORTS
module.exports = {
	getMemory,
	toggle,
};
