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
        const TEAMPOINTS = document.querySelectorAll('p[id^="points-team-"]');
        const RESETTEAMSFORM = document.querySelector('#reset-teams-form');

        // Get current stats
        SOCKET.on('update-teams', (data) => {
            Array.from(TEAMS[0].children[1].children).forEach((entry) => {
                if(entry.value === data.first.name) {
                    entry.selected = true;
                }

                TEAMPOINTS[0].textContent = `${data.first.points} Punkte`;
            });

            Array.from(TEAMS[1].children[1].children).forEach((entry) => {
                if(entry.value === data.second.name) {
                    entry.selected = true;
                }

                TEAMPOINTS[1].textContent = `${data.second.points} Punkte`;
            });

            SHOWTEAMSFORM.children[0].textContent = data.visible ? "Hide Teams" : "Show Teams";
        });

        // Show teams
        SHOWTEAMSFORM.addEventListener('submit', ($event) => {
            $event.preventDefault();

            confirm("Are you sure you want to show the teams?")

            SOCKET.emit('show-teams')
        })

        // Set teams
        TEAMS.forEach((team) => {
            const SELECT = team.children[1];
            const FORM = team.children[2];

            SELECT.addEventListener('change', ($event) => {

                SOCKET.emit('set-team', {
                    team: SELECT.id.split('-')[1],
                    value: SELECT.value
                });
            });

            FORM.addEventListener('submit', ($event) => {
                $event.preventDefault();

                const selectedOption = SELECT.options[SELECT.selectedIndex].value;

                SOCKET.emit('set-point', {
                    team: SELECT.id.split('-')[1],
                    operation: $event.submitter.value,
                    selectedOption: selectedOption
                });

                // SOCKET.emit('set-point', {
                //     team: SELECT.id.split('-')[1],
                //     operation: $event.submitter.value
                // });
            });
        });

        // Reset teams
        RESETTEAMSFORM.addEventListener('submit', ($event) => {
            $event.preventDefault();
            confirm("Willst du die Teams wirklich zurücksetzen?")
            SOCKET.emit('reset-teams');
        });

        // Show bandage
        BANDAGEFORM.addEventListener('submit', ($event) => {
            $event.preventDefault();

            SOCKET.emit('show-bandage', {
                "actor": BANDAGESELECT.value
            });
        });
    });
});