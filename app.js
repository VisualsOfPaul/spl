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
APP.use(EXPRESS.static(__dirname + "/public"));
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
const LEGOCONTROLLER = require("./controllers/legoController.js");
const MEMORYCONTROLLER = require("./controllers/memoryController.js");
const WHEREISTHISCONTROLLER = require("./controllers/witController.js");
const COUNTLETTERSCONTROLLER = require("./controllers/countLettersController.js");
const REMEMBERIMAGECONTROLLER = require("./controllers/rememberImageController.js");
const IMITATECONTROLLER = require("./controllers/imitateController.js");

// SOCKET SETUP
const IO = new SOCKETIO.Server(SERVER);

IO.on("connection", async (socket) => {
	console.log(`Connected with ${socket.id}.`);

	// FUNCTIONS TO BE CALLED AT CONNECTION
	IO.emit("update-points-done", await POINTSCONTROLLER.getCurrentPoints());

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

	// LEGO
	socket.on("toggle-lego-build", async (data) => {
		IO.emit("toggle-lego-build-done", await LEGOCONTROLLER.toggle(data.index));
	});

	// MEMORY
	socket.on("toggle-memory", async () => {
		IO.emit("toggle-memory-done", await MEMORYCONTROLLER.toggle());
	});

	// WHERE IS THIS
	socket.on("toggle-where-is-this", async (data) => {
		IO.emit(
			"toggle-where-is-this-done",
			await WHEREISTHISCONTROLLER.toggle(data.index)
		);
	});

	socket.on("toggle-where-is-this-answer", async (data) => {
		IO.emit(
			"toggle-where-is-this-answer-done",
			await WHEREISTHISCONTROLLER.toggleAnswer(data.index)
		);
	});

	// COUNT LETTERS
	socket.on("toggle-count-letters", async (data) => {
		IO.emit(
			"update-count-letters-done",
			await COUNTLETTERSCONTROLLER.toggleWord(data)
		);
	});

	socket.on("count-letters-show-solution", async (data) => {
		IO.emit(
			"update-count-letters-done",
			await COUNTLETTERSCONTROLLER.showSolution(data)
		);
	});

	// REMEMBER IMAGE
	socket.on("toggle-remember-image", async (data) => {
		IO.emit(
			"toggle-remember-image-done",
			await REMEMBERIMAGECONTROLLER.toggle(data.index)
		);
	});

	// IMITATE
	socket.on("toggle-imitate", async (data) => {
		IO.emit("toggle-imitate-done", await IMITATECONTROLLER.toggle(data.index));
	});

	socket.on("disconnect", () => {
		console.log(`Socket ${socket.id} disconnected.`);
	});
});

// Host on port
SERVER.listen(process.env.PORT, () => {
	console.log(`Listening on port ${process.env.PORT}.`);
});
