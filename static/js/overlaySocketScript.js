// Imports
import io from 'https://cdn.skypack.dev/socket.io-client';
import gsap from 'https://cdn.skypack.dev/gsap';
import { getHost } from "./wsHost.js";

document.addEventListener('DOMContentLoaded', () => {
    // Establish connection
    const SOCKET = io(getHost(window.location.href));

    SOCKET.on('connect', () => {
        console.log(`Connected with ${SOCKET.id}.`);

        // VARIABLES
        const POINTS = document.querySelectorAll('section[id="teams"]');
        const POINTSCONTENT = document.querySelectorAll('section[id="teams"] .content');
        const COMPONENTVISIBILITY = {
            "bandages": false,
            "teams": false,
            "quiz": false,
            "lego-builds": false,
            "memory": false
        };


        // HIDE AND SHOW COMPONENTS
        function hideComponents(components, callback) {
            const VISIBLECOMPONENTS = components.filter(component => COMPONENTVISIBILITY[component]);

            console.log(components, VISIBLECOMPONENTS);

            if(VISIBLECOMPONENTS.length === 0) {
                callback();
                return;
            }

            const TIMELINE = gsap.timeline({ onComplete: () => {
                callback();
            }});

            VISIBLECOMPONENTS.forEach((component) => {
                COMPONENTVISIBILITY[component] = false;

                let tweenParams = {
                    duration: 2,
                    opacity: 0,
                    ease: "power4.inOut"
                };

                console.log(component);

                switch(component) {
                    case "bandages":
                        COMPONENTVISIBILITY["bandages"] = false;
                        component = document.querySelector("#bandages-container-left div[data-visible='true']").getAttribute('id');
                        tweenParams.x = "-100%";
                        break;
                    case "teams":
                        COMPONENTVISIBILITY["teams"] = false;
                        tweenParams.x = "-100%";
                        SOCKET.emit('hide-teams');
                        break;
                    case "quiz":
                        COMPONENTVISIBILITY["quiz"] = false;
                        component = document.querySelector("#quiz-container article[data-visible='true']").getAttribute('id');
                        SOCKET.emit('hide-questions');
                        tweenParams.y = "100%";
                        break;
                }

                TIMELINE.to(`#${component}`, tweenParams, 0);
            });
        }


        // STARTING SCREEN
        SOCKET.on('send-starting-screen', (data) => {
            const STARTINGSCREEN = document.querySelector("#starting-screen-container");

            if(data) {
                gsap.to(STARTINGSCREEN, {
                    duration: 0.5,
                    opacity: 1,
                    ease: "power4.inOut"
                });

                startingScreenCountDown({
                    minutes: 5,
                    seconds: 0
                });
            }
            else {
                gsap.to(STARTINGSCREEN, {
                    duration: 0.5,
                    opacity: 0,
                    ease: "power4.inOut"
                });

                clearInterval(window.STARTINGSCREENCOUNTDOWN);
            }
        });

        function startingScreenCountDown(time) {
            const TIMER = document.querySelector("#starting-screen-countdown");
            const TIME = {
                minutes: time.minutes,
                seconds: time.seconds
            }

            const STARTINGSCREENCOUNTDOWN = setInterval(() => {
                if(TIME.seconds > 0) {
                    TIME.seconds--;
                }
                else {
                    TIME.seconds = 59;
                    TIME.minutes--;
                }

                TIMER.textContent = `in ${
                    TIME.minutes.toLocaleString('de-DE', {
                        minimumIntegerDigits: 2,
                        useGrouping: false
                    })}:${
                        TIME.seconds.toLocaleString('de-DE', {
                            minimumIntegerDigits: 2,
                            useGrouping: false
                        })
                    }`;

                if(TIME.minutes === 0 && TIME.seconds === 0) {
                    clearInterval(STARTINGSCREENCOUNTDOWN);

                    TIMER.textContent = "bald...";
                }
            }, 1000);

            window.STARTINGSCREENCOUNTDOWN = STARTINGSCREENCOUNTDOWN;
        }









        // POINTS
        SOCKET.on('update-teams', (data) => {
            COMPONENTVISIBILITY.teams = data.visible;

            POINTSCONTENT.forEach((team) => {
                team.children[0].textContent = data[team.dataset.value].name;
                team.children[1].textContent = data[team.dataset.value].points;
            });

            if(data.visible) {
                hideComponents(["bandages", "quiz"], () => {

                    gsap.to(POINTS, {
                        duration: 2,
                        x: 0,
                        opacity: 1,
                        ease: "power4.inOut",
                    });

                });
            }
            else {
                gsap.to(POINTS, {
                    duration: 2,
                    x: "-100%",
                    opacity: 0,
                    opacity: 0,
                    ease: "power4.inOut",
                });
            }
        });


        // BANDAGES
        SOCKET.on('show-bandage', async (data) => {
            COMPONENTVISIBILITY.bandages = true;

            const BANDAGE = document.querySelector(`#bandages-container-${data.on} div[data-value="${await data.actor}"]`);

            if(data.on == "left") {
                hideComponents(["teams", "quiz"], () => {

                    BANDAGE.dataset.visible = true;

                    // Show bandage
                    gsap.to(BANDAGE, {
                        duration: 2,
                        x: 0,
                        opacity: 1,
                        ease: "power4.inOut"
                    });

                    gsap.to(BANDAGE, {
                        duration: 2,
                        x: (data.on == "left") ? "-100%" : "100%",
                        opacity: 0,
                        ease: "power4.inOut",
                        delay: 5
                    });

                });
            }
            else {
                hideComponents(["quiz"], () => {

                    // Show bandage
                    gsap.to(BANDAGE, {
                        duration: 2,
                        x: 0,
                        opacity: 1,
                        ease: "power4.inOut"
                    });

                    gsap.to(BANDAGE, {
                        duration: 2,
                        x: (data.on == "left") ? "-100%" : "100%",
                        opacity: 0,
                        ease: "power4.inOut",
                        delay: 5
                    });

                });
            }

            
            setTimeout(() => {
                COMPONENTVISIBILITY.bandages = false;
                BANDAGE.dataset.visible = false;
            }, 7000);
        });


        // QUIZ
        // Show quiz
        SOCKET.on('send-question', async (data) => {
            const QUESTIONS = document.querySelectorAll("#quiz-container article");

            COMPONENTVISIBILITY.quiz = Object.keys(data).some(key => data[key].visible);

            Object.keys(data).forEach((key, index) => {
                if(data[key].visible) {
                    hideComponents(["teams", "bandages"], () => {
                        QUESTIONS[index].dataset.visible = true;

                        gsap.to(QUESTIONS[index], {
                            duration: 2,
                            y: 0,
                            opacity: 1,
                            ease: "power4.inOut"
                        });
                    });
                }
                else {
                    QUESTIONS[index].dataset.visible = false;

                    gsap.to(QUESTIONS[index], {
                        duration: 2,
                        y: "100%",
                        opacity: 0,
                        ease: "power4.inOut"
                    });
                }
            });
        });

        // Log answer
        SOCKET.on('log-answer', async (data) => {
            const QUIZCONTAINER = document.querySelectorAll("#quiz-container article");
            const CURRENTQUESTION = QUIZCONTAINER[data.index];
            const ANSWERCONTAINER = CURRENTQUESTION.querySelector('.content ul');
            const ANSWERS = ANSWERCONTAINER.children;
        
            [...ANSWERS].forEach((answer, index) => {
                answer.classList.toggle('selected', index === data.id);
            });
        });
        
        // Show answer
        SOCKET.on('show-answer', async (data) => {
            const QUIZCONTAINER = document.querySelectorAll("#quiz-container article");
            const CURRENTQUESTION = QUIZCONTAINER[data.index];
            const ANSWERCONTAINER = CURRENTQUESTION.querySelector('.content ul');
            const ANSWERS = ANSWERCONTAINER.children;

            [...ANSWERS].forEach((answer, index) => {
                answer.classList.remove('selected');
                answer.classList.toggle('wrong', index === data.id && answer.textContent !== data.correctAnswer);
                answer.classList.toggle('correct', answer.textContent === data.correctAnswer);
            });
        });

        SOCKET.on('reset-quiz', () => {
            const QUESTIONS = document.querySelectorAll("#quiz-container article");

            gsap.to(QUESTIONS, {
                duration: 2,
                y: "100%",
                opacity: 0,
                ease: "power4.inOut"
            })
        })


        // TIMER
        SOCKET.on('got-count-down', (data) => {
            countDown(data);
        });

        SOCKET.on('got-count-up', (data) => {
            countUp(data);
        });

        SOCKET.on('got-stop-timer', () => {
            stopTimer();
        });

        SOCKET.on('got-toggle-timer', (data) => {
            if(data) {
                gsap.to("#timer", {
                    duration: 1,
                    y: 0,
                    opacity: 1,
                    ease: "power3.inOut"
                });
            } else {
                gsap.to("#timer", {
                    duration: 1,
                    y: "-100%",
                    opacity: 0,
                    ease: "power3.inOut"
                });
            }
        });


        // SPONSORS
        // Todo: Eventuell Animation ändern
        SOCKET.on('show-sponsors', (data) => {
            if(data == true) {
                gsap.to("#sponsors-container", {
                    duration: 0.5,
                    opacity: 1,
                    ease: "power3.inOut"
                });
            } else {
                gsap.to("#sponsors-container", {
                    duration: 0.5,
                    opacity: 0,
                    ease: "power3.inOut"
                });
            }
        });












        // Lego Builds
        SOCKET.on('send-lego-builds', async (data) => {
            const BUILDS = document.querySelectorAll("li[id^='lego-build-image-']");

            data.forEach((build, index) => {
                if(build.visible) {
                    gsap.to(BUILDS[index], {
                        duration: 1,
                        y: 0,
                        opacity: 1,
                        ease: "power3.inOut"
                    });
                }
                else {
                    gsap.to(BUILDS[index], {
                        duration: 1,
                        y: "50%",
                        opacity: 0,
                        ease: "power3.inOut"
                    });
                }
            });
        });




        // Where is this?
        SOCKET.on('send-where-is-this', async (data) => {
            const IMAGES = document.querySelectorAll("li[id^='where-is-this-image-']");

            data.forEach((images, index) => {
                if(images.visible) {
                    gsap.to(IMAGES[index], {
                        duration: 1,
                        y: 0,
                        opacity: 1,
                        ease: "power3.inOut"
                    });
                }
                else {
                    gsap.to(IMAGES[index], {
                        duration: 1,
                        y: "50%",
                        opacity: 0,
                        ease: "power3.inOut"
                    });
                }
            });
        });




        // Memory
        SOCKET.on('send-memory', (data) => {
            const MEMORY = document.querySelector("#memory-container ul");

            if(data) {
                gsap.to(MEMORY, {
                    duration: 1,
                    y: 0,
                    opacity: 1,
                    ease: "power3.inOut"
                });
            }
            else {
                gsap.to(MEMORY, {
                    duration: 1,
                    y: "100%",
                    opacity: 0,
                    ease: "power3.inOut"
                });
            }
        });



    });


    // COUNT LETTERS
    SOCKET.on('send-count-letters', (data) => {
        const WORDS = document.querySelectorAll("#count-letters-container > ul > li[id*='word']");
        const SOLUTIONS = document.querySelectorAll("#count-letters-container > ul > li[id*='solution']");

        data.forEach((word, index) => {
            if(word.visible && !word.solutionVisible) {
                gsap.to(WORDS[index], {
                    duration: 1,
                    y: 0,
                    opacity: 1,
                    ease: "power3.inOut"
                });
            }
            else {
                gsap.to(WORDS[index], {
                    duration: 1,
                    y: "100%",
                    opacity: 0,
                    ease: "power3.inOut"
                });
            }

            if(word.solutionVisible) {
                gsap.to(SOLUTIONS[index], {
                    duration: 1,
                    y: 0,
                    opacity: 1,
                    ease: "power3.inOut"
                });
            }
            else {
                gsap.to(SOLUTIONS[index], {
                    duration: 1,
                    y: "100%",
                    opacity: 0,
                    ease: "power3.inOut"
                });
            }
        });
    });
});