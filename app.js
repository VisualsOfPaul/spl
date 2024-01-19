// IMPORTS
const COOKIEPARSER = require("cookie-parser");
const HTTP = require("http");
const EXPRESS = require("express");
const SOCKETIO = require("socket.io");
const DOTENV = require("dotenv");
const FS = require("fs");

// ROUTES
const VIEWSROUTE = require("./routes/views.js");
const APIROUTE = require("./routes/api.js");

// SERVER SETUP
const APP = EXPRESS();
const SERVER = HTTP.createServer(APP);

// MIDDLEWARE
APP.use(EXPRESS.static(__dirname + "/static"));
APP.use(COOKIEPARSER());
DOTENV.config();

//ROUTING
APP.use("/", VIEWSROUTE);
APP.use("/api", APIROUTE);

// CONTROLLERS
const STARTINGSCREENCONTROLLER = require("./controllers/startingScreenController.js");
const SPONSORSCONTROLLER = require("./controllers/sponsorsController.js");
const TIMERCONTROLLER = require("./controllers/timerController.js");
const POINTSCONTROLLER = require("./controllers/pointsController.js");
const QUIZCONTROLLER = require("./controllers/quizController.js");

// SOCKET SETUP
const IO = new SOCKETIO.Server(SERVER);

IO.on("connection", async (socket) => {
	console.log(`Connected with ${socket.id}.`);

	// IO.emit("update-teams", teams);
	// IO.emit("send-lego-builds", LEGOBUILDS);
	// IO.emit("send-where-is-this", WHEREISTHIS);
	// IO.emit("send-memory", MEMORY.visible);
	// IO.emit("send-question", QUIZ);
	// IO.emit("send-view", visibleViewIndex);
	// IO.emit("show-sponsors", visibleSponsors);

	// FUNCTIONS TO BE CALLED AT CONNECTION
	IO.emit("toggle-points-done", await POINTSCONTROLLER.getVisibility());
	IO.emit("update-points-done", await POINTSCONTROLLER.getCurrentPoints());

	// ORDER
	// // STARTING SCREEN
	// // SPONSORS
	// // BANDAGES
	// // TIMER
	// // TEAMS
	// // QUIZ
	// LEGO
	// MEMORY
	// WHERE IS THIS
	// COUNT LETTERS

	// SWITCH VIEW
	socket.on("switch-view", (data) => {
		IO.emit("switch-view-done", data);
	});

	// STARTING SCREEN
	socket.on("toggle-starting-screen", async () => {
		IO.emit(
			"toggle-starting-screen-done",
			await (
				await STARTINGSCREENCONTROLLER.toggle()
			).visible
		);
	});

	// SPONSORS
	socket.on("toggle-sponsors", async () => {
		IO.emit(
			"toggle-sponsors-done",
			await (
				await SPONSORSCONTROLLER.toggle()
			).visible
		);
	});

	// BANDAGES
	socket.on("show-bandage", (data) => {
		IO.emit("show-bandage-done", data);
	});

	// TIMER
	socket.on("change-timer-action", (data) => {
		IO.emit("change-timer-action-done", data);
	});

	socket.on("toggle-timer", async () => {
		IO.emit(
			"toggle-timer-done",
			await (
				await TIMERCONTROLLER.toggle()
			).visible
		);
	});

	socket.on("start-timer", (data) => {
		IO.emit("start-timer-done", data);
	});

	socket.on("stop-timer", () => {
		IO.emit("stop-timer-done");
	});

	// POINTS
	socket.on("toggle-points", async () => {
		IO.emit(
			"toggle-points-done",
			await (
				await POINTSCONTROLLER.toggle()
			).visible
		);
	});

	socket.on("update-points", async (data) => {
		let updatedPoints = null;

		switch (data.type) {
			case "points":
				updatedPoints = await POINTSCONTROLLER.updateTeamPoints(
					data.team,
					data.operation
				);
				break;
			case "name":
				updatedPoints = await POINTSCONTROLLER.updateTeamName(
					data.team,
					data.name
				);
				break;
		}

		IO.emit("update-points-done", await updatedPoints);
	});

	socket.on("reset-points", async () => {
		IO.emit("update-points-done", await POINTSCONTROLLER.resetPoints());
	});

	// QUIZ
	socket.on("toggle-question", async (data) => {
		IO.emit("toggle-question-done", await QUIZCONTROLLER.toggle(data.index));
	});

	socket.on("log-answer", async (data) => {
		IO.emit(
			"log-answer-done",
			await QUIZCONTROLLER.logAnswer(data.index, data.id)
		);
	});

	socket.on("show-answer", async (data) => {
		IO.emit("show-answer-done", await QUIZCONTROLLER.showAnswer(data.index));
	});

	socket.on("reset-quiz", async () => {
		IO.emit("reset-quiz-done", await QUIZCONTROLLER.resetQuiz());
	});

	// socket.on("toggle-lego-build", (data) => {
	// 	LEGOBUILDS.forEach((build) => {
	// 		if (build.index !== data.index) build.visible = false;
	// 	});

	// 	const build = LEGOBUILDS.find((build) => {
	// 		return build.index === data.index;
	// 	});

	// 	build.visible = !build.visible;

	// 	IO.emit("send-lego-builds", LEGOBUILDS);
	// });

	// socket.on("toggle-where-is-this", (data) => {
	// 	WHEREISTHIS.forEach((image) => {
	// 		if (image.index !== data.index) image.visible = false;
	// 	});

	// 	const image = WHEREISTHIS.find((image) => {
	// 		return image.index === data.index;
	// 	});

	// 	image.visible = !image.visible;

	// 	IO.emit("send-where-is-this", WHEREISTHIS);
	// });

	// socket.on("toggle-memory", () => {
	// 	MEMORY.visible = !MEMORY.visible;

	// 	IO.emit("send-memory", MEMORY.visible);
	// });

	// socket.on("switch-view", (data) => {
	// 	visibleViewIndex = data.index;

	// 	IO.emit("send-view", visibleViewIndex);
	// });

	// //Show sponsors
	// socket.on("toggle-sponsors", () => {
	// 	visibleSponsors = !visibleSponsors;
	// 	IO.emit("show-sponsors", visibleSponsors);
	// });

	// // COUNT LETTERS
	// socket.on("toggle-word", (index) => {
	// 	COUNTLETTERS[index].visible = !COUNTLETTERS[index].visible;
	// 	COUNTLETTERS[index].solutionVisible = false;

	// 	IO.emit("send-count-letters", COUNTLETTERS);
	// });

	// socket.on("show-solution", (index) => {
	// 	COUNTLETTERS[index].solutionVisible = !COUNTLETTERS[index].solutionVisible;
	// 	IO.emit("send-count-letters", COUNTLETTERS);
	// });

	socket.on("disconnect", () => {
		// pointsModel.setPoints(teams.first.name, teams.first.points);
		// pointsModel.setPoints(teams.second.name, teams.second.points);
		console.log(`Socket ${socket.id} disconnected.`);
	});
});

// Host on port
SERVER.listen(process.env.PORT, () => {
	console.log(`Listening on port ${process.env.PORT}.`);
});
