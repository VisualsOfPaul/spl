// Imports
import io from 'https://cdn.skypack.dev/socket.io-client';
import gsap from 'https://cdn.skypack.dev/gsap';
import { getHost } from "./wsHost.js";

document.addEventListener('DOMContentLoaded', () => {
    // Establish connection
    const SOCKET = io(getHost(window.location.href));

    SOCKET.on('connect', () => {
        console.log(`Connected with ${SOCKET.id}.`);

        // Variables
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
        })
    });
});