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
const POLLCONTROLLER = require("./controllers/pollController.js");

// SOCKET SETUP
const IO = new SOCKETIO.Server(SERVER);

IO.on("connection", async (socket) => {
	console.log(`Connected with ${socket.id}.`);

	// FUNCTIONS TO BE CALLED AT CONNECTION
	/**
	 * Overall functions from dashboard
	 */
	IO.emit("update-points-done", await POINTSCONTROLLER.getCurrentPoints()); //
	IO.emit("update-starting-screen-done", await STARTINGSCREENCONTROLLER.get()); //
	IO.emit("update-sponsors-done", await SPONSORSCONTROLLER.get()); //
	IO.emit("update-timer-done", await TIMERCONTROLLER.get()); //
	IO.emit("update-total-points-done", await POINTSCONTROLLER.getTotalPoints()); //
	IO.emit("update-poll-done", await POLLCONTROLLER.getPoll()); //

	/**
	 * Functions from games
	*/
	IO.emit("update-quiz-done", await QUIZCONTROLLER.getQuiz());
	IO.emit("update-lego-build-done", await LEGOCONTROLLER.get()); 
	IO.emit("update-remember-image-done", await REMEMBERIMAGECONTROLLER.get());
	IO.emit("update-where-is-this-done", await WHEREISTHISCONTROLLER.get()); //
	IO.emit("update-imitate-done", await IMITATECONTROLLER.getImitate()); //

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

	// POINTS (TOTAL)
	socket.on("update-total-points", async (points) => {
		IO.emit(
			"update-total-points-done",
			await POINTSCONTROLLER.updateTotalPoints(points)
		);
	});

	socket.on("toggle-total-points", async () => {
		IO.emit(
			"toggle-total-points-done",
			await (
				await POINTSCONTROLLER.toggleTotal()
			).visible
		);
	});

	socket.on("reset-total-points", async () => {
		IO.emit(
			"update-total-points-done",
			await POINTSCONTROLLER.resetTotalPoints()
		);
	});

	// POINTS (GAME)
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

	// POLL
	socket.on("toggle-poll", async (data) => {
		if (data[0] != "" && data[1] != "") {
			POLLCONTROLLER.changePlayers(data);
		}
		const POLL = await POLLCONTROLLER.togglePollStarted();
		IO.emit("toggle-poll-done", await POLL);
		if (await POLL.started) {
			POLLCONTROLLER.startPoll(
				POLL.pollPlayers[0].answer,
				POLL.pollPlayers[1].answer
			);
		} else {
			POLLCONTROLLER.stopPoll();
			const Winner = await POLLCONTROLLER.showPollWinner();
			IO.emit("show-poll-winner-done", await Winner.winner);
		}
	});

	socket.on("update-poll-counter", async () => {
		const POLL = await POLLCONTROLLER.getPoll();
		IO.emit("update-poll-counter-done", {
			ones: POLL.pollPlayers[0].votes,
			twos: POLL.pollPlayers[1].votes,
			total: POLL.votes,
		});
	});

	socket.on("clear-poll", async () => {
		IO.emit("clear-poll-done", await POLLCONTROLLER.clearPoll());
	});

	socket.on("toggle-poll-visible", async (data) => {
		if (data[0] != "" && data[1] != "") {
			POLLCONTROLLER.changePlayers(data);
		}
		IO.emit("toggle-poll-visible-done", await POLLCONTROLLER.togglePoll());
	});

	socket.on("disconnect", () => {
		socket.disconnect(true);
		console.log(`Socket ${socket.id} disconnected.`);
	});
});

// Host on port
SERVER.listen(process.env.PORT, () => {
	console.log(`Listening on port ${process.env.PORT}.`);
});
