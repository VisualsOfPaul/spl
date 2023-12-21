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
        let teamsVisible = false;

        // Points
        SOCKET.on('update-teams', (data) => {
            TEAMS.forEach((team) => {
                team.children[0].children[0].innerHTML = data.first.name;
                team.children[1].children[0].innerHTML = data.second.name;

                team.children[0].children[1].innerHTML = data.first.points;
                team.children[1].children[1].innerHTML = data.second.points;
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
                    ease: "power3.inOut",
                    delay: (visibleBandage !== undefined) ? 1 : 0
                });
            }
            else {
                gsap.to(TEAMS, {
                    duration: 1,
                    y: "100%",
                    ease: "power3.inOut"
                });
            }
        });


        // Bandages
        SOCKET.on('show-bandage', async (data) => {
            const ACTOR = document.querySelector(`#bandages-container div[data-value="${await data.actor}"]`);

            ACTOR.classList.add('active');

            if(teamsVisible) {
                gsap.to(TEAMS, {
                    duration: 1,
                    y: "100%",
                    ease: "power3.inOut"
                });
            }

            gsap.to(ACTOR, {
                duration: 1,
                x: 0,
                ease: "power3.inOut",
                opacity: 1,
                delay: (teamsVisible) ? 0.5 : 0
            });

            gsap.to(ACTOR, {
                duration: 0.5,
                x: "-100%",
                ease: "power3.inOut",
                opacity: 0,
                delay: 5
            });

            if(teamsVisible) {
                gsap.to(TEAMS, {
                    duration: 1,
                    y: 0,
                    ease: "power3.inOut",
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
                        ease: "power3.inOut"
                    });
                }
                else {
                    gsap.to(QUESTIONS[index], {
                        duration: 1,
                        y: "100%",
                        ease: "power3.inOut"
                    });
                }
            });
        });

        SOCKET.on('log-answer', async (data) => {
            const QUESTIONS = document.querySelectorAll("#quiz-container article");
            [...QUESTIONS[data.index].children[1].children].forEach((answer) => {
                answer.classList.remove('selected');
            });
            QUESTIONS[data.index].children[1].children[data.id].classList.add('selected')
        });

        SOCKET.on('show-answer', async (data) => {
            const QUESTIONS = document.querySelectorAll("#quiz-container article");
            const ANSWERS = [...QUESTIONS[data.index].children[1].children];
            ANSWERS.forEach((answer) => {
                if(answer.classList.contains('selected') && answer.innerHTML.includes(data.correctAnswer)) {
                    answer.classList.add('correct');
                }

                if(answer.classList.contains('selected') && !answer.innerHTML.includes(data.correctAnswer)) {
                    answer.classList.add('wrong');
                }

                if(answer.innerHTML.includes(data.correctAnswer)) {
                    answer.classList.add('correct');
                }
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