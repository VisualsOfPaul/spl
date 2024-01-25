// IMPORTS
const EXPRESS = require("express");
const PATH = require("path");
const ROUTER = EXPRESS.Router();

// CONTROLLERS

// ROUTES
ROUTER.get("/", async (req, res) => {
	res.redirect("/overlay");
});

ROUTER.get("/unauthorized", async (req, res) => {
	res.sendFile(PATH.join(__dirname, "../views/unauthorized.html"));
});

ROUTER.get("/dashboard", async (req, res) => {
	if (
		req.cookies.password === process.env.PASSWORD ||
		req.query.password === process.env.PASSWORD
	) {
		res.sendFile(PATH.join(__dirname, "../views/dashboard.html"));
	} else {
		res.redirect("/unauthorized");
	}
});

ROUTER.get("/overlay", async (req, res) => {
	res.sendFile(PATH.join(__dirname, "../views/overlay.html"));
});

ROUTER.get("/stop-shutdown", async (req, res) => {
	res.sendFile(PATH.join(__dirname, "../views/stop-shutdown.html"));
});

module.exports = ROUTER;
