// Imports
import io from "https://cdn.skypack.dev/socket.io-client";
import gsap from "https://cdn.skypack.dev/gsap";
import { getHost } from "./wsHost.js";

document.addEventListener("DOMContentLoaded", () => {
	// Establish connection
	const SOCKET = io(getHost(window.location.href));

	SOCKET.on("connect", () => {
		console.log(`Connected with ${SOCKET.id}.`);

		// VARIABLES
		// const POINTS = document.querySelectorAll('section[id="teams"]');
		// const POINTSCONTENT = document.querySelectorAll(
		// 	'section[id="teams"] .content'
		// );

		// HIDE AND SHOW COMPONENTS
		// function hideComponents(components, callback) {
		// 	const VISIBLECOMPONENTS = components.filter(
		// 		(component) => COMPONENTVISIBILITY[component]
		// 	);

		// 	console.log(components, VISIBLECOMPONENTS);

		// 	if (VISIBLECOMPONENTS.length === 0) {
		// 		callback();
		// 		return;
		// 	}

		// 	const TIMELINE = gsap.timeline({
		// 		onComplete: () => {
		// 			callback();
		// 		},
		// 	});

		// 	VISIBLECOMPONENTS.forEach((component) => {
		// 		COMPONENTVISIBILITY[component] = false;

		// 		let tweenParams = {
		// 			duration: 2,
		// 			opacity: 0,
		// 			ease: "power4.inOut",
		// 		};

		// 		console.log(component);

		// 		switch (component) {
		// 			case "bandages":
		// 				COMPONENTVISIBILITY["bandages"] = false;
		// 				component = document
		// 					.querySelector(
		// 						"#bandages-container-left div[data-visible='true']"
		// 					)
		// 					.getAttribute("id");
		// 				tweenParams.x = "-100%";
		// 				break;
		// 			case "teams":
		// 				COMPONENTVISIBILITY["teams"] = false;
		// 				tweenParams.x = "-100%";
		// 				SOCKET.emit("hide-teams");
		// 				break;
		// 			case "quiz":
		// 				COMPONENTVISIBILITY["quiz"] = false;
		// 				component = document
		// 					.querySelector("#quiz-container article[data-visible='true']")
		// 					.getAttribute("id");
		// 				SOCKET.emit("hide-questions");
		// 				tweenParams.y = "100%";
		// 				break;
		// 		}

		// 		TIMELINE.to(`#${component}`, tweenParams, 0);
		// 	});
		// }

		// STARTING SCREEN
		SOCKET.on("toggle-starting-screen-done", (data) => {
			const STARTINGSCREEN = document.querySelector(
				"#starting-screen-container"
			);

			if (data) {
				gsap.to(STARTINGSCREEN, {
					duration: 0.5,
					opacity: 1,
					ease: "power4.inOut",
				});

				startingScreenCountDown({
					minutes: 5,
					seconds: 0,
				});
			} else {
				gsap.to(STARTINGSCREEN, {
					duration: 0.5,
					opacity: 0,
					ease: "power4.inOut",
				});

				clearInterval(window.STARTINGSCREENCOUNTDOWN);
			}
		});

		function startingScreenCountDown(time) {
			const TIMER = document.querySelector("#starting-screen-countdown");
			const TIME = {
				minutes: time.minutes,
				seconds: time.seconds,
			};

			const STARTINGSCREENCOUNTDOWN = setInterval(() => {
				if (TIME.seconds > 0) {
					TIME.seconds--;
				} else {
					TIME.seconds = 59;
					TIME.minutes--;
				}

				TIMER.textContent = `in ${TIME.minutes.toLocaleString("de-DE", {
					minimumIntegerDigits: 2,
					useGrouping: false,
				})}:${TIME.seconds.toLocaleString("de-DE", {
					minimumIntegerDigits: 2,
					useGrouping: false,
				})}`;

				if (TIME.minutes === 0 && TIME.seconds === 0) {
					clearInterval(STARTINGSCREENCOUNTDOWN);

					TIMER.textContent = "bald...";
				}
			}, 1000);

			window.STARTINGSCREENCOUNTDOWN = STARTINGSCREENCOUNTDOWN;
		}

		SOCKET.on("disconnect", () => {
			console.log(`Disconnected from ${SOCKET.id}.`);
		});
	});

	// SPONSORS
	// Todo: Eventuell Animation ändern
	SOCKET.on("toggle-sponsors-done", (data) => {
		if (data == true) {
			gsap.to("#sponsors-container", {
				duration: 0.5,
				opacity: 1,
				ease: "power3.inOut",
			});
		} else {
			gsap.to("#sponsors-container", {
				duration: 0.5,
				opacity: 0,
				ease: "power3.inOut",
			});
		}
	});

	// BANDAGES
	SOCKET.on("show-bandage-done", async (data) => {
		const BANDAGE = document.querySelectorAll(
			`#bandages-container-${data.on} > div`
		)[data.index];

		switch (data.on) {
			case "left":
				gsap.to(BANDAGE, {
					duration: 2,
					x: 0,
					opacity: 1,
					ease: "power4.inOut",
				});

				gsap.to(BANDAGE, {
					duration: 2,
					x: "-100%",
					opacity: 0,
					ease: "power4.inOut",
					delay: 5,
				});
				break;
			case "right":
				gsap.to(BANDAGE, {
					duration: 2,
					x: 0,
					opacity: 1,
					ease: "power4.inOut",
				});

				gsap.to(BANDAGE, {
					duration: 2,
					x: "100%",
					opacity: 0,
					ease: "power4.inOut",
					delay: 5,
				});
				break;
		}
	});

	// TIMER
	SOCKET.on("change-timer-action-done", (data) => {
		window.showTime(data);
	});

	SOCKET.on("toggle-timer-done", (data) => {
		if (data) {
			gsap.to("#timer", {
				duration: 1,
				y: 0,
				opacity: 1,
				ease: "power3.inOut",
			});
		} else {
			gsap.to("#timer", {
				duration: 1,
				y: "-100%",
				opacity: 0,
				ease: "power3.inOut",
			});
		}
	});

	SOCKET.on("start-timer-done", (data) => {
		window.startTimer(data);
	});

	SOCKET.on("stop-timer-done", () => {
		window.stopTimer();
	});

	// POINTS
	const POINTS = document.querySelector("#points");

	SOCKET.on("toggle-points-done", (data) => {
		if (data) {
			gsap.to(POINTS, {
				duration: 2,
				x: 0,
				opacity: 1,
				ease: "power4.inOut",
			});
		} else {
			gsap.to(POINTS, {
				duration: 2,
				x: "-100%",
				opacity: 0,
				ease: "power4.inOut",
			});
		}
	});

	SOCKET.on("update-points-done", (data) => {
		const TEAMS = document.querySelectorAll("#team-points");

		[...TEAMS].forEach((team, index) => {
			team.children[0].textContent = data.teams[index].name;
			team.children[1].textContent = data.teams[index].points;
		});
	});

	// QUIZ
	SOCKET.on("toggle-question-done", (data) => {
		const QUESTIONS = document.querySelectorAll("#quiz-container article");

		Object.keys(data).forEach((key, index) => {
			if (data[key].visible) {
				QUESTIONS[index].dataset.visible = true;

				gsap.to(QUESTIONS[index], {
					duration: 2,
					y: 0,
					opacity: 1,
					ease: "power4.inOut",
				});
			} else {
				QUESTIONS[index].dataset.visible = false;

				gsap.to(QUESTIONS[index], {
					duration: 2,
					y: "100%",
					opacity: 0,
					ease: "power4.inOut",
				});
			}
		});
	});

	SOCKET.on("log-answer-done", (data) => {
		const QUESTIONS = document.querySelectorAll("#quiz-container article");

		Object.keys(data).forEach((key, index) => {
			const ANSWERS = QUESTIONS[index].querySelectorAll(".content ul li");

			[...ANSWERS].forEach((answer, index) => {
				answer.classList.toggle(
					"selected",
					index === data[key].selectedAnswerIndex
				);
			});
		});
	});

	SOCKET.on("show-answer-done", async (data) => {
		const VISIBLEQUESTION = await data.findIndex(
			(question) => question.visible
		);
		const QUESTION = await document.querySelectorAll("#quiz-container article")[
			VISIBLEQUESTION
		];
		const ALLANSWERS = await QUESTION.querySelectorAll(".content > ul > li");
		const SELECTEDANSWER = await ALLANSWERS[
			data[VISIBLEQUESTION].selectedAnswerIndex
		];
		const CORRECTANSWER = await ALLANSWERS[
			data[VISIBLEQUESTION].answers.findIndex((answer) => {
				return answer.correct;
			})
		];

		SELECTEDANSWER.classList.remove("selected");

		SELECTEDANSWER.classList.toggle(
			"wrong",
			data[VISIBLEQUESTION].selectedAnswerIndex !==
				data[VISIBLEQUESTION].answers.findIndex((answer) => {
					return answer.correct;
				})
		);

		CORRECTANSWER.classList.toggle("correct");
	});

	SOCKET.on("reset-quiz-done", () => {
		const QUESTIONS = document.querySelectorAll("#quiz-container article");

		gsap.to(QUESTIONS, {
			duration: 2,
			y: "100%",
			opacity: 0,
			ease: "power4.inOut",
		});
	});

	// LEGO
	SOCKET.on("toggle-lego-build-done", (data) => {
		const BUILDS = document.querySelectorAll("li[id^='lego-build-image-']");

		data.forEach((build, index) => {
			if (build.visible) {
				gsap.to(BUILDS[index], {
					duration: 1,
					y: 0,
					opacity: 1,
					ease: "power3.inOut",
				});
			} else {
				gsap.to(BUILDS[index], {
					duration: 1,
					y: "50%",
					opacity: 0,
					ease: "power3.inOut",
				});
			}
		});
	});

	// MEMORY
	SOCKET.on("toggle-memory-done", (data) => {
		const MEMORY = document.querySelector("#memory-container ul");

		if (data.visible) {
			gsap.to(MEMORY, {
				duration: 1,
				y: 0,
				opacity: 1,
				ease: "power3.inOut",
			});
		} else {
			gsap.to(MEMORY, {
				duration: 1,
				y: "100%",
				opacity: 0,
				ease: "power3.inOut",
			});
		}
	});

	// WIT

	// !!! Warum gibt es von GSAP eine Warnung, obwohl es funktioniert? !!!
	SOCKET.on("toggle-where-is-this-done", async (data) => {
		const IMAGES = await document.querySelectorAll(
			"li[id^='where-is-this-image-']"
		);

		data.forEach(async (image, index) => {
			if (image.visible) {
				gsap.to(IMAGES[index], {
					duration: 1,
					y: 0,
					opacity: 1,
					ease: "power3.inOut",
				});
			} else {
				gsap.to(IMAGES[index], {
					duration: 1,
					y: "50%",
					opacity: 0,
					ease: "power3.inOut",
				});
			}
		});
	});

	// COUNT LETTERS
	SOCKET.on("update-count-letters-done", (data) => {
		const WORDS = document.querySelectorAll(
			"#count-letters-container > ul > li[id*='word']"
		);
		const SOLUTIONS = document.querySelectorAll(
			"#count-letters-container > ul > li[id*='solution']"
		);

		data.forEach((word, index) => {
			if (word.visible && !word.solutionVisible) {
				gsap.to(WORDS[index], {
					duration: 1,
					y: 0,
					opacity: 1,
					ease: "power3.inOut",
				});
			} else {
				gsap.to(WORDS[index], {
					duration: 1,
					y: "100%",
					opacity: 0,
					ease: "power3.inOut",
				});
			}

			if (word.solutionVisible) {
				gsap.to(SOLUTIONS[index], {
					duration: 1,
					y: 0,
					opacity: 1,
					ease: "power3.inOut",
				});
			} else {
				gsap.to(SOLUTIONS[index], {
					duration: 1,
					y: "100%",
					opacity: 0,
					ease: "power3.inOut",
				});
			}
		});
	});
});
