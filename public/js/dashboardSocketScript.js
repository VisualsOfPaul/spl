// Imports
import io from "https://cdn.skypack.dev/socket.io-client";
import { getHost } from "./wsHost.js";

document.addEventListener("DOMContentLoaded", () => {
	// Establish connection
	const SOCKET = io(getHost(window.location.href));

	SOCKET.on("connect", () => {
		console.log(`Connected with ${SOCKET.id}.`);

		// SWITCH VIEW
		async function switchView(index) {
			SOCKET.emit("switch-view", {
				index: index,
			});
		}

		// !!! Noch überarbeiten
		SOCKET.on("switch-view-done", (data) => {
			const TOGGLES = document.querySelectorAll('button[id^="switch-view-"]');
			const SECTIONS = document.querySelectorAll("section[data-navigation]");

			SECTIONS.forEach((section, index) => {
				section.classList.toggle("active", index === data.index);
			});

			TOGGLES.forEach((toggle, index) => {
				toggle.classList.toggle("active", index === data.index);
			});
		});

		window.switchView = switchView;

		// STARTING SCREEN
		const STARTINGSCREENFORM = document.querySelector("#starting-screen-form");

		STARTINGSCREENFORM.addEventListener("submit", ($event) => {
			$event.preventDefault();

			SOCKET.emit("toggle-starting-screen");
		});

		SOCKET.on("toggle-starting-screen-done", (data) => {
			const TOGGLE = STARTINGSCREENFORM.children[0];

			TOGGLE.textContent = data
				? "Startbildschirm verstecken"
				: "Startbildschirm anzeigen";
			TOGGLE.classList.toggle("active", data);
		});

		// SPONSORS
		const SPONSORFORM = document.querySelector("#show-sponsors-form");

		SPONSORFORM.addEventListener("submit", ($event) => {
			$event.preventDefault();
			SOCKET.emit("toggle-sponsors");
		});

		SOCKET.on("toggle-sponsors-done", (data) => {
			const TOGGLE = SPONSORFORM.children[0];

			TOGGLE.textContent = data ? "Sponsoren verstecken" : "Sponsoren anzeigen";
			TOGGLE.classList.toggle("active", data);
		});

		// BANDAGES
		const BANDAGESFORM = document.querySelector("#bandage");
		const BANDAGESELECT = BANDAGESFORM.children[0];

		BANDAGESFORM.addEventListener("submit", ($event) => {
			$event.preventDefault();

			SOCKET.emit("show-bandage", {
				index: BANDAGESELECT.value,
				on: $event.submitter.value,
			});

			$event.submitter.classList.toggle("active");

			setTimeout(() => {
				$event.submitter.classList.toggle("active");
			}, 5000);
		});

		// TIMER
		const TIMERFORM = document.querySelector("#timer-form");
		const ACTIONSELECT = TIMERFORM.children[2];

		ACTIONSELECT.addEventListener("change", ($event) => {
			const TIME = {
				minutes: TIMERFORM.querySelector("#minutes").value,
				seconds: TIMERFORM.querySelector("#seconds").value,
			};

			SOCKET.emit("change-timer-action", {
				action: $event.target.value,
				time: TIME,
			});
		});

		TIMERFORM.addEventListener("submit", ($event) => {
			$event.preventDefault();

			const TYPE = $event.submitter.value;
			const ACTION = ACTIONSELECT.value;
			const TIME = {
				minutes: $event.target.minutes.value,
				seconds: $event.target.seconds.value,
			};

			SOCKET.emit(`${TYPE}-timer`, {
				action: ACTION,
				time: TIME,
			});
		});

		SOCKET.on("toggle-timer-done", (data) => {
			const TOGGLE = document.querySelector("#toggle-timer");

			TOGGLE.textContent = data ? "Timer ausblenden" : "Timer anzeigen";
			TOGGLE.classList.toggle("active", data);
		});

		// POINTS
		const POINTSFORM = document.querySelector("#points-form");

		POINTSFORM.addEventListener("submit", ($event) => {
			$event.preventDefault();

			SOCKET.emit("toggle-points");
		});

		SOCKET.on("toggle-points-done", (data) => {
			const TOGGLE = POINTSFORM.children[0];

			TOGGLE.textContent = data ? "Punkte ausblenden" : "Punkte anzeigen";
			TOGGLE.classList.toggle("active", data);
		});

		const TEAMPOINTSFORM = document.querySelectorAll("#team-points-form");

		TEAMPOINTSFORM.forEach((form) => {
			form.addEventListener("submit", ($event) => {
				$event.preventDefault();

				const TEAM = $event.target.dataset.team;
				const OPERATION = $event.submitter.value;

				SOCKET.emit("update-points", {
					type: "points",
					team: TEAM,
					operation: OPERATION,
				});
			});

			form.addEventListener("change", ($event) => {
				const TEAM = $event.target.parentElement.dataset.team;
				const NAME = $event.target.value;

				SOCKET.emit("update-points", {
					type: "name",
					team: TEAM,
					name: NAME,
				});
			});
		});

		SOCKET.on("update-points-done", (data) => {
			const TEAMPOINTS = document.querySelectorAll("#team-points");

			TEAMPOINTS.forEach((teamPoints, index) => {
				teamPoints.textContent = `${data.teams[index].points} Punkte`;
			});

			const TEAMSELECTS = document.querySelectorAll("#team-select");

			TEAMSELECTS.forEach((teamSelect, index) => {
				teamSelect.value = data.teams[index].name;
			});
		});

		const RESETPOINTSFORM = document.querySelector("#reset-points-form");

		RESETPOINTSFORM.addEventListener("submit", ($event) => {
			$event.preventDefault();

			SOCKET.emit("reset-points");
		});

		// QUIZ
		function showQuestion(index) {
			SOCKET.emit("toggle-question", {
				index: index,
			});
		}

		window.showQuestion = showQuestion;

		SOCKET.on("toggle-question-done", (data) => {
			const QUESTIONS = document.querySelectorAll("#quiz-container ol li");

			QUESTIONS.forEach((question, index) => {
				question.children[1].textContent = data[index].visible
					? "Frage ausblenden"
					: "Frage einblenden";
				question.children[1].classList.toggle("active", data[index].visible);
			});
		});

		function logAnswer(index, id) {
			SOCKET.emit("log-answer", {
				index: index,
				id: id,
			});
		}

		window.logAnswer = logAnswer;

		function showAnswer(index) {
			SOCKET.emit("show-answer", {
				index: index,
			});
		}

		window.showAnswer = showAnswer;

		const RESETQUIZFORM = document.querySelector("#reset-quiz");

		RESETQUIZFORM.addEventListener("submit", ($event) => {
			$event.preventDefault();

			SOCKET.emit("reset-quiz");
		});

		SOCKET.on("reset-quiz-done", (data) => {
			const QUESTIONS = document.querySelectorAll("#quiz-container ol li");

			QUESTIONS.forEach((question, index) => {
				question.children[1].textContent = "Frage einblenden";
				question.children[1].classList.remove("active");
			});
		});

		// LEGO
		function toggleLegoBuild(index) {
			SOCKET.emit("toggle-lego-build", {
				index: index,
			});
		}

		window.toggleLegoBuild = toggleLegoBuild;

		SOCKET.on("toggle-lego-build-done", (data) => {
			const TOGGLES = document.querySelectorAll(
				'button[id^="toggle-lego-build-"]'
			);

			TOGGLES.forEach((toggle, index) => {
				toggle.textContent = data[index].visible
					? "Bild verstecken"
					: "Bild anzeigen";
				toggle.classList.toggle("active", data[index].visible);
			});
		});

		// MEMORY
		const MEMORYFORM = document.querySelector("#memory-form");

		MEMORYFORM.addEventListener("submit", ($event) => {
			$event.preventDefault();

			SOCKET.emit("toggle-memory");
		});

		SOCKET.on("toggle-memory-done", (data) => {
			const TOGGLE = MEMORYFORM.children[0];

			TOGGLE.textContent = data ? "Memory verstecken" : "Memory anzeigen";
			TOGGLE.classList.toggle("active", data.visible);
		});

		// WHERE IS THIS
		async function toggleWhereIsThis(index) {
			SOCKET.emit("toggle-where-is-this", {
				index: index,
			});
		}

		window.toggleWhereIsThis = toggleWhereIsThis;

		SOCKET.on("toggle-where-is-this-done", (data) => {
			const TOGGLES = document.querySelectorAll(
				'button[id^="toggle-where-is-this-"]'
			);

			TOGGLES.forEach((toggle, index) => {
				toggle.textContent = data[index].visible
					? "Bild verstecken"
					: "Bild anzeigen";
				toggle.classList.toggle("active", data[index].visible);
			});
		});

		// COUNT LETTERS
		function toggleWord(index) {
			SOCKET.emit("toggle-count-letters", index);
		}

		window.toggleWord = toggleWord;

		function showSolution(index) {
			SOCKET.emit("count-letters-show-solution", index);
		}

		window.showSolution = showSolution;

		SOCKET.on("update-count-letters-done", (data) => {
			const TOGGLES = document.querySelectorAll('button[id^="toggle-word-"]');
			const SOLUTIONS = document.querySelectorAll(
				'button[id^="show-solution-"]'
			);

			TOGGLES.forEach((toggle, index) => {
				toggle.textContent = data[index].visible
					? "Wort verstecken"
					: "Wort anzeigen";
				toggle.classList.toggle("active", data[index].visible);
			});

			SOLUTIONS.forEach((solution, index) => {
				solution.classList.toggle("active", data[index].solutionVisible);
			});
		});

		// Twitch poll
		const POLLFORM = document.querySelector("#toggle-poll-form");
		POLLFORM.addEventListener("submit", ($event) => {
			$event.preventDefault();
			var arr = [];
			const PLAYERS = POLLFORM.querySelectorAll("div[id^='player-'] input");
			PLAYERS.forEach((player) => {
				arr.push(player.value);
			});
			SOCKET.emit("toggle-poll", arr);
		});

		SOCKET.on("toggle-poll-done", async (data) => {
			const TOGGLE = POLLFORM.querySelector("button");

			TOGGLE.textContent = await data.visible ? "Umfrage Beenden" : "Umfrage Starten";
			TOGGLE.classList.toggle("active", await data.visible);
		});

		SOCKET.on("update-poll-counter-done", async (data) => {
			console.log(data);
			const PLAYERS = POLLFORM.querySelectorAll("div[id^='player-'] p");
			console.log(PLAYERS);
			PLAYERS[0].textContent = await data.ones + ' Stimmen';
			PLAYERS[1].textContent = await data.twos + ' Stimmen';
		})
	});
});
