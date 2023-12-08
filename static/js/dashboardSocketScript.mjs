// Imports
import io from 'https://cdn.skypack.dev/socket.io-client';

document.addEventListener('DOMContentLoaded', () => {
    // Establish connection
    const SOCKET = io('ws://spl-lilac.vercel.app/');

    SOCKET.on('connect', () => {
        console.log(`Connected with ${SOCKET.id}.`);

        // Variables
        const TEAMS = document.querySelectorAll('div[id^="team"]');

        // Get current stats
        SOCKET.on('update-teams', (data) => {
            Array.from(TEAMS[0].children[1].children).forEach((entry) => {
                if(entry.value === data.first.name) {
                    entry.selected = true;
                }
            });

            Array.from(TEAMS[1].children[1].children).forEach((entry) => {
                if(entry.value === data.second.name) {
                    entry.selected = true;
                }
            });
        });

        // Set teams
        TEAMS.forEach((team) => {
            const SELECT = team.children[1];
            const FORM = team.children[2];

            SELECT.addEventListener('change', () => {
                SOCKET.emit('set-team', {
                    team: SELECT.id.split('-')[1],
                    value: SELECT.value
                });
            });

            FORM.addEventListener('submit', ($event) => {
                $event.preventDefault();

                SOCKET.emit('set-point', {
                    team: SELECT.id.split('-')[1],
                    operation: $event.submitter.value
                });
            });
        });
    });
});