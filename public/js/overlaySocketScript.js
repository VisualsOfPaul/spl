// Imports
import io from "https://cdn.skypack.dev/socket.io-client";
import gsap from "https://cdn.skypack.dev/gsap";
import { getHost } from "./wsHost.js";

document.addEventListener("DOMContentLoaded", () => {
	// Establish connection
	const SOCKET = io(getHost(window.location.href));

	SOCKET.on("connect", () => {
		console.log(`Connected with ${SOCKET.id}.`);
	});

	// STARTING SCREEN
	SOCKET.on("toggle-starting-screen-done", (data) => {
		const STARTINGSCREEN = document.querySelector("#starting-screen-container");

		if (data) {
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
					gsap.to(CARDS[index], {
						duration: 1,
						rotateY: 180,
						ease: "power3.inOut",
						delay: TIME * (index + 1) + 1,
					});

					gsap.to(CARDS[index + 1], {
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
			});

			CARDS.forEach((card, index) => {
				gsap.to(CARDS[index], {
					duration: 0,
					rotateY: 0,
					delay: 2,
				});
			});
		}
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
					duration: 20,
					scale: 1,
					ease: "linear",
					delay: 2,
				});

				window.SCALE = gsap.to(IMAGES[index].querySelector("#scale"), {
					duration: 20,
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

				IMAGES[index].querySelector("img").style.transform = "scale(4)";
				IMAGES[index].querySelector("#scale").style.width = "0%";
			}
		});
	});

	SOCKET.on("toggle-where-is-this-answer-done", async (data) => {
		const ANSWERS = await document.querySelectorAll(
			"li[id^='where-is-this-image-'] #correct-answer"
		);

		data.forEach(async (image, index) => {
			IMAGESCALE.pause();
			SCALE.pause();

			if (image.answerVisible) {
				gsap.to(ANSWERS[index], {
					duration: 0.5,
					opacity: 1,
					ease: "power3.inOut",
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
				console.log(IMAGES[index]);

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

	// POLL
	// SOCKET.on("toggle-poll-done", (data) => {
	// 	const POLL = document.querySelector("#poll-container");
	// 	window.updatePlayers(data);
	// 	if (data.visible) {
	// 		POLL.classList.remove("hidden")
	// 		gsap.to(POLL, {
	// 			duration: 1,
	// 			y: 0,
	// 			opacity: 1,
	// 			ease: "power3.inOut",
	// 		});
	// 	} else {
	// 		POLL.classList.add("hidden")
	// 		gsap.to(POLL, {
	// 			duration: 1,
	// 			y: "100%",
	// 			opacity: 0,
	// 			ease: "power3.inOut",
	// 		});
	// 	}
	// });

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

	SOCKET.on("update-poll", async (data) => {
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

	// DISCONNECT
	SOCKET.on("disconnect", (reason) => {
		if (reason === "io server disconnect") {
			SOCKET.connect();
		}
	});
});
