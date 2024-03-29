// Imports
import io from "https://cdn.skypack.dev/socket.io-client";
import gsap from "https://cdn.skypack.dev/gsap";
import { getHost } from "./wsHost.js";

// CONFETTI
import confetti from "https://cdn.skypack.dev/canvas-confetti";

document.addEventListener("DOMContentLoaded", () => {
	// Establish connection
	const SOCKET = io(getHost(window.location.href));

	SOCKET.on("connect", () => {
		console.log(`Connected with ${SOCKET.id}.`);
	});

	var timerstarted = false;

	// STARTING SCREEN
	SOCKET.on("toggle-starting-screen-done", (data) => {
		const STARTINGSCREEN = document.querySelector("#starting-screen-container");

		if(!timerstarted) {
			if (data) {
				gsap.to(STARTINGSCREEN, {
					duration: 0.5,
					opacity: 1,
					ease: "power3.inOut",
				});
	
				timerstarted = true;
	
				startingScreenCountDown({
					minutes: 5,
					seconds: 0,
				});
			} else {
				timerstarted = false;
				gsap.to(STARTINGSCREEN, {
					duration: 0.5,
					opacity: 0,
					ease: "power3.inOut",
				});
	
				clearInterval(window.STARTINGSCREENCOUNTDOWN);
			}
		}
	});

	SOCKET.on("update-starting-screen-done", (data) => {
		const STARTINGSCREEN = document.querySelector("#starting-screen-container");

		if (data.visible) {
			gsap.to(STARTINGSCREEN, {
				duration: 0.5,
				opacity: 1,
				ease: "power3.inOut",
			});

			startingScreenCountDown({
				minutes: 5,
				seconds: 0,
			});
		} else {
			gsap.to(STARTINGSCREEN, {
				duration: 0.5,
				opacity: 0,
				ease: "power3.inOut",
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

			TIMER.textContent = `${TIME.minutes.toLocaleString("de-DE", {
				minimumIntegerDigits: 2,
				useGrouping: false,
			})}:${TIME.seconds.toLocaleString("de-DE", {
				minimumIntegerDigits: 2,
				useGrouping: false,
			})}`;

			if (TIME.minutes === 0 && TIME.seconds === 0) {
				clearInterval(STARTINGSCREENCOUNTDOWN);
			}
		}, 1000);

		window.STARTINGSCREENCOUNTDOWN = STARTINGSCREENCOUNTDOWN;
	}

	// OUTRO
	SOCKET.on("toggle-outro-done", (data) => {
		const OUTRO = document.querySelector("#outro-container");
		const OUTROBOX = document.querySelector("#outro-box");

		if (data) {
			gsap.to(OUTRO, {
				duration: 0.5,
				opacity: 1,
				ease: "power3.inOut",
			});

			window.outroScroll = gsap.to(OUTROBOX, {
				duration: 90,
				y: "-100%",
				ease: "static",
				delay: 5,
			});
		} else {
			gsap.to(OUTRO, {
				duration: 0.5,
				opacity: 0,
				ease: "power3.inOut",
				onComplete: () => {
					window.outroScroll.kill();

					gsap.to(OUTROBOX, {
						duration: 0,
						y: 0,
					});
				},
			});
		}
	});

	// PIXELS
	function createPixelArt(pixelsContainer) {
		let grid = 100,
			colors = ["a", "b", "c", "d"];

		pixelsContainer.innerHTML = "";

		for (let i = grid; i > 0; i--) {
			for (let j = 0; j < grid; j++) {
				var colorIndex = (i + j) % colors.length;
				var colorClass = colors[colorIndex];

				var pixel = document.createElement("div");
				pixel.classList.add("pixel", colorClass);
				pixelsContainer.appendChild(pixel);
			}
		}
	}

	document.querySelectorAll("#pixels").forEach((pixelsContainer) => {
		createPixelArt(pixelsContainer);
	});

	// SPONSORS
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

	SOCKET.on("update-sponsors-done", (data) => {
		if (data.visible == true) {
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
					ease: "power3.inOut",
				});

				gsap.to(BANDAGE, {
					duration: 2,
					x: "-100%",
					opacity: 0,
					ease: "power3.inOut",
					delay: 5,
				});
				break;
			case "right":
				gsap.to(BANDAGE, {
					duration: 2,
					x: 0,
					opacity: 1,
					ease: "power3.inOut",
				});

				gsap.to(BANDAGE, {
					duration: 2,
					x: "100%",
					opacity: 0,
					ease: "power3.inOut",
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

	SOCKET.on("update-timer-done", (data) => {
		if (data.visible) {
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

	// POINTS (TOTAL)
	SOCKET.on("update-total-points-done", async (data) => {
		window.updatePointsTotal(data);
	});

	SOCKET.on("toggle-total-points-done", (data) => {
		if (data) {
			gsap.to("#points-total-container", {
				duration: 1,
				opacity: 1,
				ease: "power3.inOut",
			});
		} else {
			gsap.to("#points-total-container", {
				duration: 1,
				opacity: 0,
				ease: "power3.inOut",
			});
		}
	});

	SOCKET.on("update-total-points-done", async (data) => {
		if (data.visible) {
			gsap.to("#points-total-container", {
				duration: 1,
				opacity: 1,
				ease: "power3.inOut",
			});
		} else {
			gsap.to("#points-total-container", {
				duration: 1,
				opacity: 0,
				ease: "power3.inOut",
			});
		}
	});

	// POINTS (GAME)
	const POINTS = document.querySelectorAll("div[id^='team-points-']");

	SOCKET.on("toggle-points-done", (data) => {
		POINTS.forEach((point, index) => {
			if (data) {
				gsap.to(point, {
					duration: 1,
					x: 0,
					opacity: 1,
					ease: "power3.inOut",
				});
			} else {
				gsap.to(point, {
					duration: 1,
					x: index % 2 === 0 ? "-100%" : "100%",
					opacity: 0,
					ease: "power3.inOut",
				});
			}
		});
	});

	SOCKET.on("update-points-done", async (data) => {
		const IMAGES = await document.querySelectorAll("#team-points-image");
		const TEAMSINFORMATION = await document.querySelectorAll(
			"#team-points > div"
		);
		const TEAMS = await document.querySelectorAll(
			"div[id^='team-points-outer-']"
		);

		for (let index = 0; index < TEAMS.length; index++) {
			IMAGES[index].querySelectorAll("img").forEach((image) => {
				image.classList.remove("active");
			});

			if (
				IMAGES[index].querySelector(
					`img[data-course='${data.teams[index].name}']`
				)
			)
				IMAGES[index]
					.querySelector(`img[data-course='${data.teams[index].name}']`)
					.classList.add("active");

			TEAMSINFORMATION[index].children[0].textContent = data.teams[index].name;
			TEAMSINFORMATION[index].children[1].textContent = `${
				data.teams[index].points
			} ${data.teams[index].points === 1 ? "Punkt" : "Punkte"}`;

			TEAMS[index].classList.remove(
				"allgemeine-informatik",
				"it-management",
				"medieninformatik",
				"wirtschaftsinformatik"
			);
			TEAMS[index].classList.add(
				await data.teams[index].name.toLowerCase().replaceAll(" ", "-")
			);
		}
	});

	// HALLI GALLI
	SOCKET.on("toggle-halli-galli-done", async (data) => {
		const HALLIGALLI = document.querySelector("#halli-galli-card");
		const CARDS = document.querySelectorAll(
			"div[id^='halli-galli-card-side-']"
		);
		const TIME = 2;

		if (data.visible) {
			gsap.to(HALLIGALLI, {
				duration: 1,
				y: 0,
				opacity: 1,
				ease: "power3.inOut",
			});

			CARDS.forEach((card, index) => {
				if (CARDS.length - 1 > index) {
					window["flipCardFront" + index] = gsap.to(CARDS[index], {
						duration: 1,
						rotateY: 180,
						ease: "power3.inOut",
						delay: TIME * (index + 1) + 1,
					});

					window["flipCardBack" + index] = gsap.to(CARDS[index + 1], {
						duration: 1,
						rotateY: 0,
						ease: "power3.inOut",
						delay: TIME * (index + 1) + 1,
					});
				}
			});
		} else {
			gsap.to(HALLIGALLI, {
				duration: 1,
				y: "100%",
				opacity: 0,
				ease: "power3.inOut",
				onComplete: () => {
					CARDS.forEach((card, index) => {
						window["flipCardFront" + index].kill();
						window["flipCardBack" + index].kill();

						gsap.to(CARDS[index], {
							duration: 0,
							rotateY: index == 0 ? 0 : 180,
						});
					});
				},
			});
		}
	});

	SOCKET.on("update-points-done", (data) => {
		POINTS.forEach((point, index) => {
			if (data.visible) {
				gsap.to(point, {
					duration: 1,
					x: 0,
					opacity: 1,
					ease: "power3.inOut",
				});
			} else {
				gsap.to(point, {
					duration: 1,
					x: index % 2 === 0 ? "-100%" : "100%",
					opacity: 0,
					ease: "power3.inOut",
				});
			}
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
					ease: "power3.inOut",
				});
			} else {
				QUESTIONS[index].dataset.visible = false;

				gsap.to(QUESTIONS[index], {
					duration: 2,
					y: "100%",
					opacity: 0,
					ease: "power3.inOut",
				});
			}
		});
	});

	SOCKET.on("show-answer-done", async (data) => {
		const ANSWERS = await document.querySelectorAll("#answer");

		ANSWERS.forEach((answer, index) => {
			answer.classList.toggle("hidden", !data[index].visible);
		});
	});

	SOCKET.on("reset-quiz-done", () => {
		const QUESTIONS = document.querySelectorAll("#quiz-container article");

		gsap.to(QUESTIONS, {
			duration: 2,
			y: "100%",
			opacity: 0,
			ease: "power3.inOut",
		});
	});

	SOCKET.on("update-quiz-done", (data) => {});

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
					y: "100%",
					opacity: 0,
					ease: "power3.inOut",
				});
			}
		});
	});

	SOCKET.on("update-lego-build-done", (data) => {
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
					y: "100%",
					opacity: 0,
					ease: "power3.inOut",
				});
			}
		});
	});

	// MEMORY
	// SOCKET.on("toggle-memory-done", (data) => {
	// 	const MEMORY = document.querySelector("#memory-container ul");

	// 	if (data.visible) {
	// 		gsap.to(MEMORY, {
	// 			duration: 1,
	// 			y: 0,
	// 			opacity: 1,
	// 			ease: "power3.inOut",
	// 		});
	// 	} else {
	// 		gsap.to(MEMORY, {
	// 			duration: 1,
	// 			y: "100%",
	// 			opacity: 0,
	// 			ease: "power3.inOut",
	// 		});
	// 	}
	// });

	// WIT
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

				window.IMAGESCALE = gsap.to(IMAGES[index].querySelector("img"), {
					duration: 45,
					scale: 1,
					ease: "linear",
					delay: 2,
				});

				window.SCALE = gsap.to(IMAGES[index].querySelector("#scale"), {
					duration: 45,
					width: "100%",
					ease: "linear",
					delay: 2,
				});
			} else {
				gsap.to(IMAGES[index], {
					duration: 1,
					y: "50%",
					opacity: 0,
					ease: "power3.inOut",
				});

				IMAGES[index].querySelector("img").style.transform = "scale(10)";
				IMAGES[index].querySelector("#scale").style.width = "0%";
			}
		});
	});

	SOCKET.on("toggle-where-is-this-answer-done", async (data) => {
		const IMAGES = await document.querySelectorAll(
			"li[id^='where-is-this-image-']"
		);
		const ANSWERS = await document.querySelectorAll(
			"li[id^='where-is-this-image-'] #correct-answer"
		);

		data.forEach(async (image, index) => {
			IMAGESCALE.kill();
			SCALE.kill();

			if (image.answerVisible) {
				gsap.to(IMAGES[index].querySelector("img"), {
					duration: 3,
					scale: 1,
					ease: "power3.inOut",
				});

				gsap.to(IMAGES[index].querySelector("#scale"), {
					duration: 3,
					width: "100%",
					ease: "power3.inOut",
				});

				gsap.to(ANSWERS[index], {
					duration: 0.5,
					opacity: 1,
					ease: "power3.inOut",
					delay: 3,
				});
			} else {
				gsap.to(ANSWERS[index], {
					duration: 0.5,
					opacity: 0,
					ease: "power3.inOut",
				});
			}
		});
	});

	// COUNT LETTERS
	// 	SOCKET.on("update-count-letters-done", (data) => {
	// 		const WORDS = document.querySelectorAll(
	// 			"#count-letters-container > ul > li[id*='word']"
	// 		);
	// 		const SOLUTIONS = document.querySelectorAll(
	// 			"#count-letters-container > ul > li[id*='solution']"
	// 		);

	// 		data.forEach((word, index) => {
	// 			if (word.visible && !word.solutionVisible) {
	// 				gsap.to(WORDS[index], {
	// 					duration: 1,
	// 					y: 0,
	// 					opacity: 1,
	// 					ease: "power3.inOut",
	// 				});
	// 			} else {
	// 				gsap.to(WORDS[index], {
	// 					duration: 1,
	// 					y: "100%",
	// 					opacity: 0,
	// 					ease: "power3.inOut",
	// 				});
	// 			}

	// 			if (word.solutionVisible) {
	// 				gsap.to(SOLUTIONS[index], {
	// 					duration: 1,
	// 					y: 0,
	// 					opacity: 1,
	// 					ease: "power3.inOut",
	// 				});
	// 			} else {
	// 				gsap.to(SOLUTIONS[index], {
	// 					duration: 1,
	// 					y: "100%",
	// 					opacity: 0,
	// 					ease: "power3.inOut",
	// 				});
	// 			}
	// 		});
	// 	});

	// REMEMBER IMAGE
	SOCKET.on("toggle-remember-image-done", (data) => {
		const IMAGES = document.querySelectorAll(
			"#remember-image-container > ul > li"
		);

		data.forEach((image, index) => {
			const FRONT = IMAGES[index].querySelector(".front");
			const BACK = IMAGES[index].querySelector(".back");
			const TIME = 15;

			if (image.visible) {
				// Show image
				gsap.to(IMAGES[index], {
					duration: 1,
					y: 0,
					opacity: 1,
					ease: "power3.inOut",
				});

				// Flip image
				gsap.to(FRONT, {
					duration: 1,
					rotateY: 180,
					ease: "power3.inOut",
					delay: TIME + 1,
				});

				gsap.to(BACK, {
					duration: 1,
					rotateY: 0,
					ease: "power3.inOut",
					delay: TIME + 1,
				});
			} else {
				gsap.to(IMAGES[index], {
					duration: 1,
					y: "100%",
					opacity: 0,
					ease: "power3.inOut",
				});

				gsap.to(FRONT, {
					duration: 0,
					rotateY: 0,
					delay: 2,
				});

				gsap.to(BACK, {
					duration: 0,
					rotateY: 180,
					delay: 2,
				});
			}
		});
	});

	SOCKET.on("toggle-second-question-done", (data) => {
		const QUESTIONS = document.querySelectorAll(
			"#remember-image-container > ul > li"
		);

		QUESTIONS[data.index]
			.querySelector("#question-1")
			.classList.toggle("hidden");
		QUESTIONS[data.index]
			.querySelector("#question-2")
			.classList.toggle("hidden");
	});

	// IMITATE
	SOCKET.on("toggle-imitate-done", (data) => {
		const IMITATE = document.querySelectorAll(
			"#imitate-container > ul > li[id^='imitate-']"
		);

		data.forEach((imitate, index) => {
			if (imitate.visible) {
				gsap.to(IMITATE[index], {
					duration: 1,
					y: 0,
					opacity: 1,
					ease: "power3.inOut",
				});
			} else {
				gsap.to(IMITATE[index], {
					duration: 1,
					y: "100%",
					opacity: 0,
					ease: "power3.inOut",
				});
			}
		});
	});

	SOCKET.on("update-imitate-done", (data) => {
		const IMITATE = document.querySelectorAll(
			"#imitate-container > ul > li[id^='imitate-']"
		);

		data.forEach((imitate, index) => {
			if (imitate.visible) {
				gsap.to(IMITATE[index], {
					duration: 1,
					y: 0,
					opacity: 1,
					ease: "power3.inOut",
				});
			} else {
				gsap.to(IMITATE[index], {
					duration: 1,
					y: "100%",
					opacity: 0,
					ease: "power3.inOut",
				});
			}
		});
	});

	// POLL
	SOCKET.on("toggle-poll-visible-done", (data) => {
		const POLL = document.querySelector("#poll-container");
		window.updatePlayers(data);
		if (data.visible) {
			gsap.to(POLL, {
				duration: 1,
				y: 0,
				opacity: 1,
				ease: "power3.inOut",
			});
		} else {
			gsap.to(POLL, {
				duration: 1,
				y: "100%",
				opacity: 0,
				ease: "power3.inOut",
			});
		}
	});

	SOCKET.on("update-poll-counter-done", async (data) => {
		window.updateVotes(data);
	});

	SOCKET.on("show-poll-winner-done", async (data) => {
		window.showPollWinner(await data);
	});

	SOCKET.on("clear-poll-done", async (data) => {
		window.clearPoll(data);
	});

	SOCKET.on("update-poll-done", async (data) => {
		const POLL = document.querySelector("#poll-container");
		window.updatePlayers(data);

		if (data.visible) {
			gsap.to(POLL, {
				duration: 1,
				y: 0,
				opacity: 1,
				ease: "power3.inOut",
			});
		}
	});

	// WINNER
	SOCKET.on("toggle-winner-done", (data) => {
		const WINNER = document.querySelectorAll("li[id^='winner-item-']");

		if (data.visible) {
			gsap.to(WINNER[data.course], {
				duration: 1,
				y: 0,
				opacity: 1,
				ease: "power3.inOut",
			});

			var duration = 30 * 1000;
			var animationEnd = Date.now() + duration;
			var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

			function randomInRange(min, max) {
				return Math.random() * (max - min) + min;
			}

			var interval = setInterval(function () {
				var timeLeft = animationEnd - Date.now();

				if (timeLeft <= 0) {
					return clearInterval(interval);
				}

				var particleCount = 100 * (timeLeft / duration);
				confetti({
					...defaults,
					particleCount,
					origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
				});
				confetti({
					...defaults,
					particleCount,
					origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
				});
			}, 250);
		} else {
			gsap.to(WINNER[data.course], {
				duration: 1,
				y: "100%",
				opacity: 0,
				ease: "power3.inOut",
			});
		}
	});

	// DISCONNECT
	SOCKET.on("disconnect", (reason) => {
		if (reason === "io server disconnect") {
		}
	});
});
