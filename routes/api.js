// IMPORTS
const EXPRESS = require("express");
const ROUTER = EXPRESS.Router();

// CONTROLLERS
const BANDAGESCONTROLLER = require("../controllers/bandagesController");
const POINTSCONTROLLER = require("../controllers/pointsController");
const HALLIGALLICONTROLLER = require("../controllers/halliGalliController");
const QUIZCONTROLLER = require("../controllers/quizController");
const LEGOCONTROLLER = require("../controllers/legoController");
const MEMORYCONTROLLER = require("../controllers/memoryController");
const WITCONTROLLER = require("../controllers/witController");
const COUNTLETTERSCONTROLLER = require("../controllers/countLettersController");
const REMEMBERIMAGECONTROLLER = require("../controllers/rememberImageController");
const IMITATECONTROLLER = require("../controllers/imitateController");
const POLLCONTROLLER = require("../controllers/pollController");
const OUTROCONTROLLER = require("../controllers/outroController");

// ROUTES
ROUTER.get("/bandages", async (req, res) => {
	res.send(await BANDAGESCONTROLLER.getBandages());
});

ROUTER.get("/teams", async (req, res) => {
	res.send(await POINTSCONTROLLER.getTeams());
});

ROUTER.get("/halli-galli", async (req, res) => {
	res.send(await HALLIGALLICONTROLLER.getHalliGalli());
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

ROUTER.get("/remember-image", async (req, res) => {
	res.send(await REMEMBERIMAGECONTROLLER.getImages());
});

ROUTER.get("/imitate", async (req, res) => {
	res.send(await IMITATECONTROLLER.getImitate());
});

ROUTER.get("/poll", async (req, res) => {
	res.send(await POLLCONTROLLER.getPoll());
});

ROUTER.get("/outro", async (req, res) => {
	res.send(await OUTROCONTROLLER.getOutro());
});

module.exports = ROUTER;
