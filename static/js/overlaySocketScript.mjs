// Imports
import io from 'https://cdn.skypack.dev/socket.io-client';

document.addEventListener('DOMContentLoaded', () => {
    // Establish connection
    const SOCKET = io('wss://spl-e931.onrender.com/');

    SOCKET.on('connect', () => {
        console.log(`Connected with ${SOCKET.id}.`);

        // Variables
        const TEAMS = document.querySelectorAll('section[id="teams"]');
            SOCKET.on('update-teams', (data) => {
                TEAMS.forEach((team) => {
                    team.children[0].children[0].innerHTML = data.first.name;
                    team.children[1].children[0].innerHTML = data.second.name;

                    team.children[0].children[1].innerHTML = data.first.points;
                    team.children[1].children[1].innerHTML = data.second.points;
            });
        });
    });
});