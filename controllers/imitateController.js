// IMPORTS
const IMITATE = require("../data/imitate");

// FUNCTIONS
async function getImitate() {
	return await IMITATE;
}

async function toggle(visibleIndex) {
	if (!IMITATE[visibleIndex].visible) {
		IMITATE.forEach((imitate, index) => {
			imitate.visible = visibleIndex === index;
		});
	} else {
		IMITATE[visibleIndex].visible = false;
	}

	return await IMITATE;
}

// EXPORTS
module.exports = {
	getImitate,
	toggle,
};
