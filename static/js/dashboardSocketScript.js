// Imports
import io from 'https://cdn.skypack.dev/socket.io-client';
import { getHost } from "./wsHost.js";

document.addEventListener('DOMContentLoaded', () => {
    
    // Establish connection
    const SOCKET = io(getHost(window.location.href));

    SOCKET.on('connect', () => {
        console.log(`Connected with ${SOCKET.id}.`);


        // Variables
        const BANDAGEFORM = document.querySelector('#bandage');
        const BANDAGESELECT = BANDAGEFORM.children[0];
        const TEAMS = document.querySelectorAll('div[id^="team"]');
        const SHOWTEAMSFORM = document.querySelector('#show-teams-form');


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

            SHOWTEAMSFORM.children[0].textContent = data.visible ? "Hide Teams" : "Show Teams";
        });


        // Show bandage
        BANDAGEFORM.addEventListener('submit', ($event) => {
            $event.preventDefault();

            SOCKET.emit('show-bandage', {
                "actor": BANDAGESELECT.value
            });
        });

        // Show teams
        SHOWTEAMSFORM.addEventListener('submit', ($event) => {
            $event.preventDefault();
            SOCKET.emit('show-teams')
        })

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