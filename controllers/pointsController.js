// IMPORTS
const CURRENTPOINTS = require("../data/currentPoints");
const POINTS = require("../data/points");

// FUNCTIONS
async function getTeams() {
	return await POINTS.teams;
}

async function toggle() {
	CURRENTPOINTS.visible = !CURRENTPOINTS.visible;
	return CURRENTPOINTS;
}

async function updateTeamName(index, name) {
	CURRENTPOINTS.teams[index].name = name;

	CURRENTPOINTS.teams[index].points = POINTS.teams.find(
		(team) => team.name === name
	).points;
	return CURRENTPOINTS;
}

async function updateTeamPoints(index, operation) {
	const teamName = CURRENTPOINTS.teams[index].name;

	const teamInPoints = POINTS.teams.find((team) => team.name === teamName);
	const teamInCurrentPoints = CURRENTPOINTS.teams.find(
		(team) => team.name === teamName
	);

	if (teamInPoints && teamInCurrentPoints) {
		teamInPoints.points =
			operation === "add" ? teamInPoints.points + 1 : teamInPoints.points - 1;

		// Update current points
		teamInCurrentPoints.points = teamInPoints.points;
	} else {
		console.error(
			`Team "${teamName}" not found in either POINTS or CURRENTPOINTS.`
		);
	}

	return CURRENTPOINTS;
}

async function getCurrentPoints() {
	return CURRENTPOINTS;
}

async function getTotalPoints() {
	return POINTS;
}

async function getVisibility() {
	return CURRENTPOINTS.visible;
}

async function resetPoints() {
	CURRENTPOINTS.teams.forEach((team) => {
		team.name = "-";
		team.points = 0;
	});

	POINTS.teams.forEach((team) => {
		team.points = 0;
	});

	return CURRENTPOINTS;
}

async function updateTotalPoints(points) {
	points.forEach((point, index) => {
		POINTS.teams[index].points = point;
	});

	return POINTS;
}

async function toggleTotal() {
	POINTS.visible = !POINTS.visible;
	return POINTS;
}

async function resetTotalPoints() {
	POINTS.teams.forEach((team) => {
		team.points = 0;
	});

	return POINTS;
}


// EXPORTS
module.exports = {
	getTeams,
	toggle,
	updateTeamName,
	updateTeamPoints,
	getCurrentPoints,
	getVisibility,
	resetPoints,
	updateTotalPoints,
	toggleTotal,
	resetTotalPoints,
	getTotalPoints
};
