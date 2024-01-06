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
        const TEAMS = document.querySelectorAll('section[id="teams"]');
        const TEAMSCOONTENT = document.querySelectorAll('section[id="teams"] .content');
        let teamsVisible = false;

        // Points
        SOCKET.on('update-teams', (data) => {
            TEAMSCOONTENT.forEach((team) => {
                team.children[0].textContent = data[team.dataset.value].name;
                team.children[1].textContent = data[team.dataset.value].points;
            });

            teamsVisible = data.visible;
            let visibleBandage = document.querySelector('#bandage.active');

            if(data.visible) {
                if(visibleBandage !== undefined) {
                    gsap.to(visibleBandage, {
                        duration: 1,
                        x: "-100%",
                        opacity: 0,
                        ease: "power3.inOut"
                    });
                }

                gsap.to(TEAMS, {
                    duration: 1,
                    y: 0,
                    opacity: 1,
                    ease: "power3.inOut",
                    delay: (visibleBandage !== undefined) ? 1 : 0
                });
            }
            else {
                gsap.to(TEAMS, {
                    duration: 1,
                    y: "100%",
                    opacity: 0,
                    ease: "power3.inOut"
                });
            }
        });


        // Bandages
        SOCKET.on('show-bandage', async (data) => {
            const ACTOR = document.querySelector(`#bandages-container-${data.on} div[data-value="${await data.actor}"]`);

            ACTOR.classList.add('active');

            if(teamsVisible) {
                gsap.to(TEAMS, {
                    duration: 1,
                    y: "100%",
                    ease: "power4.inOut"
                });
            }

            gsap.to(ACTOR, {
                duration: 1,
                x: 0,
                ease: "power4.inOut",
                opacity: 1,
                delay: (teamsVisible) ? 0.5 : 0
            });

            gsap.to(ACTOR, {
                duration: 1,
                x: (data.on == "left") ? "-100%" : "100%",
                ease: "power4.inOut",
                opacity: 0,
                delay: 5
            });

            if(teamsVisible) {
                gsap.to(TEAMS, {
                    duration: 1,
                    y: 0,
                    ease: "power4.inOut",
                    delay: 5
                });
            }

            setTimeout(() => {
                ACTOR.classList.remove('active');
            }, 5500);
        })

        // Quiz
        SOCKET.on('send-question', async (data) => {
            const QUESTIONS = document.querySelectorAll("#quiz-container article");

            Object.keys(data).forEach((key, index) => {
                if(data[key].visible) {
                    gsap.to(QUESTIONS[index], {
                        duration: 1,
                        y: 0,
                        opacity: 1,
                        ease: "power3.inOut"
                    });
                }
                else {
                    gsap.to(QUESTIONS[index], {
                        duration: 1,
                        y: "100%",
                        opacity: 0,
                        ease: "power3.inOut"
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
                duration: 1,
                y: "100%",
                ease: "power3.inOut"
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