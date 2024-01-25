// Imports
import io from "https://cdn.skypack.dev/socket.io-client";
import { getHost } from "./wsHost.js";

document.addEventListener("DOMContentLoaded", () => {
	// Establish connection
	const SOCKET = io(getHost(window.location.href));

	SOCKET.on("connect", () => {
		console.log(`Connected with ${SOCKET.id}.`);

		SOCKET.on('reload-client', () => {
			setTimeout(() => {
				SOCKET.emit('reload-server');
			}, 30000);
		})

		// SWITCH VIEW
		async function switchView(index) {
			SOCKET.emit("switch-view", {
				index: index,
			});
		}

		SOCKET.on("switch-view-done", (data) => {
			const SECTIONS = document.querySelectorAll("section[data-navigation]");

			SECTIONS.forEach((section, index) => {
				section.classList.toggle("active", index === Number(data.index));
			});
		});

		window.switchView = switchView;

		// STARTING SCREEN
		const STARTINGSCREENFORM = document.querySelector("#starting-screen-form");
		const OUTROFORM = document.querySelector("#outro-form");

		STARTINGSCREENFORM.addEventListener("submit", ($event) => {
			$event.preventDefault();

			SOCKET.emit("toggle-starting-screen");
		});

		SOCKET.on("toggle-starting-screen-done", (data) => {
			const TOGGLE = STARTINGSCREENFORM.children[0];

			TOGGLE.textContent = data
				? "Startbild verstecken"
				: "Startbild anzeigen";
			TOGGLE.classList.toggle("active", data);
		});

		OUTROFORM.addEventListener("submit", ($event) => {
			$event.preventDefault();

			SOCKET.emit("toggle-outro");
		});

		SOCKET.on("toggle-outro-done", (data) => {
			const TOGGLE = OUTROFORM.children[0];

			TOGGLE.textContent = data ? "Outro verstecken" : "Outro anzeigen";
			TOGGLE.classList.toggle("active", data);
		});
		SOCKET.on("update-starting-screen-done", (data) => {
			const TOGGLE = STARTINGSCREENFORM.children[0];

			TOGGLE.textContent = data.visible
				? "Startbild verstecken"
				: "Startbild anzeigen";
			TOGGLE.classList.toggle("active", data.visible);
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

		SOCKET.on("update-sponsors-done", (data) => {
			const TOGGLE = SPONSORFORM.children[0];

			TOGGLE.textContent = data.visible
				? "Sponsoren verstecken"
				: "Sponsoren anzeigen";
			TOGGLE.classList.toggle("active", data.visible);
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

		SOCKET.on('update-timer-done', (data) => {
			const TOGGLE = document.querySelector("#toggle-timer");

			TOGGLE.textContent = data.visible ? "Timer ausblenden" : "Timer anzeigen";
			TOGGLE.classList.toggle("active", data.visible);
		});

		// POINTS (TOTAL)
		const TOTALPOINTSFORM = document.querySelector("#points-total-form");

		TOTALPOINTSFORM.addEventListener("submit", ($event) => {
			$event.preventDefault();

			const ACTION = $event.submitter.dataset.value;

			switch (ACTION) {
				case "update":
					{
						const POINTS = Array.from(
							document.querySelectorAll("#points-total-form input")
						).map((input) => Number(input.value));

						SOCKET.emit("update-total-points", POINTS);
					}
					break;
				case "toggle":
					{
						SOCKET.emit("toggle-total-points");
					}
					break;
				case "reset":
					{
						SOCKET.emit("reset-total-points");
					}
					break;
			}
		});

		SOCKET.on("update-total-points-done", (data) => {
			const POINTS = document.querySelectorAll("#points-total-form input");

			POINTS.forEach((point, index) => {
				point.value = data.teams[index].points;
			});
		});

		SOCKET.on("toggle-total-points-done", (data) => {
			const TOGGLE = document.querySelector("#toggle-total-points");

			TOGGLE.textContent = data
				? "Gesamtpunkte ausblenden"
				: "Gesamtpunkte anzeigen";
			TOGGLE.classList.toggle("active", data);
		});

		SOCKET.on('update-total-points-done', (data) => {
			const POINTS = document.querySelectorAll("#points-total-form input");

			POINTS.forEach((point, index) => {
				point.value = data.teams[index].points;
			});

			const TOGGLE = document.querySelector("#toggle-total-points");

			TOGGLE.textContent = data.visible ? "Gesamtpunkte ausblenden" : "Gesamtpunkte anzeigen";
			TOGGLE.classList.toggle("active", data.visible);
		});

		// POINTS (GAME)
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

			const TOGGLE = POINTSFORM.children[0];

			TOGGLE.textContent = data.visible ? "Punkte ausblenden" : "Punkte anzeigen";
			TOGGLE.classList.toggle("active", data.visible);
		});

		const RESETPOINTSFORM = document.querySelector("#reset-points-form");

		RESETPOINTSFORM.addEventListener("submit", ($event) => {
			$event.preventDefault();

			SOCKET.emit("reset-points");
		});

		// HALLI GALLI
		const HALLIGALLIFORM = document.querySelector("#halli-galli-form");

		HALLIGALLIFORM.addEventListener("submit", ($event) => {
			$event.preventDefault();

			SOCKET.emit("toggle-halli-galli");
		});

		SOCKET.on("toggle-halli-galli-done", (data) => {
			const TOGGLE = document.querySelector("#halli-galli-form button");

			TOGGLE.textContent = data.visible
				? "Halli Galli ausblenden"
				: "Halli Galli anzeigen";
			TOGGLE.classList.toggle("active", data.visible);
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

		SOCKET.on('update-quiz-done', (data) => {
			const QUESTIONS = document.querySelectorAll("#quiz-container ol li");

			QUESTIONS.forEach((question, index) => {
				question.children[1].textContent = data[index].visible ? "Frage ausblenden" : "Frage einblenden";
				question.children[1].classList.toggle("active", data[index].visible);
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

		SOCKET.on("update-lego-build-done", (data) => {
			const TOGGLES = document.querySelectorAll(
				'button[id^="toggle-lego-build-"]'
			);

			TOGGLES.forEach((toggle, index) => {
				toggle.textContent = data[index].visible
					? "Bild verstecken"
					: "Bild anzeigen";
				toggle.classList.toggle("active", data[index].visible);
			});
		})

		// MEMORY
		// const MEMORYFORM = document.querySelector("#memory-form");

		// MEMORYFORM.addEventListener("submit", ($event) => {
		// 	$event.preventDefault();

		// 	SOCKET.emit("toggle-memory");
		// });

		// SOCKET.on("toggle-memory-done", (data) => {
		// 	const TOGGLE = MEMORYFORM.children[0];

		// 	TOGGLE.textContent = data ? "Memory verstecken" : "Memory anzeigen";
		// 	TOGGLE.classList.toggle("active", data.visible);
		// });

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

		function toggleWhereIsThisAnswer(index) {
			SOCKET.emit("toggle-where-is-this-answer", {
				index: index,
			});
		}

		window.toggleWhereIsThisAnswer = toggleWhereIsThisAnswer;

		SOCKET.on("toggle-where-is-this-answer-done", (data) => {
			const TOGGLES = document.querySelectorAll('button[id^="toggle-answer"]');

			TOGGLES.forEach((toggle, index) => {
				toggle.textContent = data[index].answerVisible
					? "Lösung verstecken"
					: "Lösung anzeigen";
				toggle.classList.toggle("active", data[index].answerVisible);
			});
		});

		SOCKET.on('update-where-is-this-done', (data) => {
			const TOGGLES = document.querySelectorAll(
				'button[id^="toggle-where-is-this-"]'
			);

			TOGGLES.forEach((toggle, index) => {
				toggle.textContent = data[index].visible
					? "Bild verstecken"
					: "Bild anzeigen";
				toggle.classList.toggle("active", data[index].visible);
			});

			const ANSWERS = document.querySelectorAll('button[id^="toggle-answer"]');

			ANSWERS.forEach((answer, index) => {
				answer.textContent = data[index].answerVisible
					? "Lösung verstecken"
					: "Lösung anzeigen";
				answer.classList.toggle("active", data[index].answerVisible);
			});
		})

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

		// REMEMBER IMAGE
		function toggleRememberImage(index) {
			SOCKET.emit("toggle-remember-image", {
				index: index,
			});
		}

		window.toggleRememberImage = toggleRememberImage;

		SOCKET.on("toggle-remember-image-done", (data) => {
			const TOGGLES = document.querySelectorAll(
				'button[id^="toggle-remember-image-"]'
			);

			TOGGLES.forEach((toggle, index) => {
				toggle.textContent = data[index].visible
					? "Bild verstecken"
					: "Bild anzeigen";
				toggle.classList.toggle("active", data[index].visible);
			});
		});

		SOCKET.on('update-remember-image-done', (data) => {
			const TOGGLES = document.querySelectorAll('button[id^="toggle-remember-image-"]');

			TOGGLES.forEach((toggle, index) => {
				toggle.textContent = data[index].visible
					? "Bild verstecken"
					: "Bild anzeigen";
				toggle.classList.toggle("active", data[index].visible);
			});
		});

		// IMITATE
		function toggleImitate(index) {
			SOCKET.emit("toggle-imitate", {
				index: index,
			});
		}

		window.toggleImitate = toggleImitate;

		SOCKET.on("toggle-imitate-done", (data) => {
			const TOGGLES = document.querySelectorAll(
				'button[id^="toggle-imitate-"]'
			);

			TOGGLES.forEach((toggle, index) => {
				toggle.textContent = data[index].visible
					? "Bild verstecken"
					: "Bild anzeigen";
				toggle.classList.toggle("active", data[index].visible);
			});
		});

		SOCKET.on('update-imitate-done', (data) => {
			const TOGGLES = document.querySelectorAll(
				'button[id^="toggle-imitate-"]'
			);

			TOGGLES.forEach((toggle, index) => {
				toggle.textContent = data[index].visible
					? "Bild verstecken"
					: "Bild anzeigen";
				toggle.classList.toggle("active", data[index].visible);
			});
		});

		// Twitch poll
		const POLLFORM = document.querySelector("#toggle-poll-form");
		const TOGGLEPOLLBUTTON = document.querySelector("#toggle-poll-button");
		const CLEARPOLLFORM = document.querySelector("#clear-poll-form");
		const TOGGLEPOLLVISIBLEFORM = document.querySelector(
			"#toggle-poll-visible-form"
		);
		const TOGGLEPOLLVISIBLEBUTTON = document.querySelector(
			"#toggle-poll-visible-button"
		);
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
			const TOGGLE = TOGGLEPOLLBUTTON;

			TOGGLE.textContent = (await data.started)
				? "Umfrage Stoppen"
				: "Umfrage Starten";
			TOGGLE.classList.toggle("active", await data.started);
		});

		SOCKET.on("update-poll-counter-done", async (data) => {
			const PLAYERS = POLLFORM.querySelectorAll("div[id^='player-'] p");
			PLAYERS[0].textContent = (await data.ones) + " Stimmen";
			PLAYERS[1].textContent = (await data.twos) + " Stimmen";
		});

		CLEARPOLLFORM.addEventListener("submit", ($event) => {
			const PLAYERS = POLLFORM.querySelectorAll("div[id^='player-'] input");
			const PLAYERSPOINTS = POLLFORM.querySelectorAll("div[id^='player-'] p");
			$event.preventDefault();
			SOCKET.emit("clear-poll");
			PLAYERS.forEach((player) => {
				player.value = "";
			});
			PLAYERSPOINTS[0].textContent = "0 Stimmen";
			PLAYERSPOINTS[1].textContent = "0 Stimmen";
		});

		TOGGLEPOLLVISIBLEFORM.addEventListener("submit", ($event) => {
			$event.preventDefault();
			var arr = [];
			const PLAYERS = POLLFORM.querySelectorAll("div[id^='player-'] input");
			PLAYERS.forEach((player) => {
				arr.push(player.value);
			});
			SOCKET.emit("toggle-poll-visible", arr);
		});

		SOCKET.on("toggle-poll-visible-done", async (data) => {
			const TOGGLE = TOGGLEPOLLVISIBLEBUTTON;

			TOGGLE.textContent = (await data.visible)
				? "Umfrage Ausblenden"
				: "Umfrage Anzeigen";
			TOGGLE.classList.toggle("active", await data.visible);
		});

		SOCKET.on("update-poll-done", async (data) => {
			const PLAYERS = POLLFORM.querySelectorAll("div[id^='player-'] input");
			const POINTS = POLLFORM.querySelectorAll("div[id^='player-'] p");
			if (
				(await data.pollPlayers[0].answer) != "Player 1" &&
				(await data.pollPlayers[1].answer) != "Player 2"
			) {
				PLAYERS[0].value = await data.pollPlayers[0].answer;
				PLAYERS[1].value = await data.pollPlayers[1].answer;
			}
			POINTS[0].textContent = (await data.pollPlayers[0].votes) + " Stimmen";
			POINTS[1].textContent = (await data.pollPlayers[1].votes) + " Stimmen";

			data.visible
				? TOGGLEPOLLVISIBLEBUTTON.classList.toggle("active", data.visible)
				: "";
			data.visible
				? (TOGGLEPOLLVISIBLEBUTTON.textContent = "Umfrage Ausblenden")
				: (TOGGLEPOLLVISIBLEBUTTON.textContent = "Umfrage Anzeigen");
			data.started
				? TOGGLEPOLLBUTTON.classList.toggle("active", data.started)
				: "";
			data.started
				? (TOGGLEPOLLBUTTON.textContent = "Umfrage Stoppen")
				: (TOGGLEPOLLBUTTON.textContent = "Umfrage Starten");
		});

		//DISCONNECT
		SOCKET.on("disconnect", () => {
			console.log(`Socket ${SOCKET.id} disconnected.`);
		});
	});
});
