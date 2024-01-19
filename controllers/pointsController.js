// IMPORTS
const CURRENTPOINTS = require("../data/currentPoints");
const POINTS = require("../data/points");

// FUNCTIONS
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

async function getVisibility() {
	return CURRENTPOINTS.visible;
}

// !!! Soll es für die Spiele selber eigene Punkte geben?

// !!! Soll die Funktion auch die Gesamtpunktzahl zurücksetzen?

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

// EXPORTS
module.exports = {
	toggle,
	updateTeamName,
	updateTeamPoints,
	getCurrentPoints,
	getVisibility,
	resetPoints,
};
