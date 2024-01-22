// IMPORTS
const EXPRESS = require("express");
const ROUTER = EXPRESS.Router();

// CONTROLLERS
const BANDAGESCONTROLLER = require("../controllers/bandagesController");
const QUIZCONTROLLER = require("../controllers/quizController");
const LEGOCONTROLLER = require("../controllers/legoController");
const MEMORYCONTROLLER = require("../controllers/memoryController");
const WITCONTROLLER = require("../controllers/witController");
const COUNTLETTERSCONTROLLER = require("../controllers/countLettersController");
const POLLCONTROLLER = require("../controllers/pollController");

// ROUTES
ROUTER.get("/bandages", async (req, res) => {
	res.send(await BANDAGESCONTROLLER.getBandages());
});

ROUTER.get("/quiz", async (req, res) => {
	res.send(await QUIZCONTROLLER.getQuiz());
});

ROUTER.get("/lego-builds", async (req, res) => {
	res.send(await LEGOCONTROLLER.getImages());
});

ROUTER.get("/memory", async (req, res) => {
	res.send(await MEMORYCONTROLLER.getMemory());
});

ROUTER.get("/where-is-this", async (req, res) => {
	res.send(await WITCONTROLLER.getImages());
});

ROUTER.get("/count-letters", async (req, res) => {
	res.send(await COUNTLETTERSCONTROLLER.getData());
});

ROUTER.get("/poll", async (req, res) => {
	res.send(await POLLCONTROLLER.getPoll());
});

module.exports = ROUTER;
