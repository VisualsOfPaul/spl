// IMPORTS
const MEMORY = require("../data/memory");

// FUNCTIONS
async function getMemory() {
	return MEMORY;
}

// EXPORTS
module.exports = {
	getMemory,
};
