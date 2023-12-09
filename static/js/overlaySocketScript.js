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
        let visible = false;

        // Points
        SOCKET.on('update-teams', (data) => {
            TEAMS.forEach((team) => {
                team.children[0].children[0].innerHTML = data.first.name;
                team.children[1].children[0].innerHTML = data.second.name;

                team.children[0].children[1].innerHTML = data.first.points;
                team.children[1].children[1].innerHTML = data.second.points;
            });

            visible = data.visible;

            if(data.visible) {
                gsap.to(TEAMS, {
                    duration: 1,
                    y: 0,
                    ease: "power3.inOut"
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
            const ACTOR = `#bandages-container div[data-value="${await data.actor}"]`;

            if(visible) {
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
                delay: 0.5
            });

            gsap.to(ACTOR, {
                duration: 0.5,
                x: "-100%",
                ease: "power3.inOut",
                opacity: 0,
                delay: 5
            });

            if(visible) {
                gsap.to(TEAMS, {
                    duration: 1,
                    y: 0,
                    ease: "power3.inOut",
                    delay: 5
                });
            }
        })
    });
});