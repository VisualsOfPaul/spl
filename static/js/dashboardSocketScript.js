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

            if( confirm("Willst du das wirklich?") == true ) {
                SOCKET.emit('show-teams')
            }
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
            });
        });

        // Reset teams
        RESETTEAMSFORM.addEventListener('submit', ($event) => {
            $event.preventDefault();
            if( confirm("Willst du die Teams wirklich zurücksetzen?") == true ) {
                SOCKET.emit('reset-teams');
            }
        });

        // Show bandage
        BANDAGEFORM.addEventListener('submit', ($event) => {
            $event.preventDefault();

            SOCKET.emit('show-bandage', {
                "actor": BANDAGESELECT.value
            });
        });

        // Show quiz
        function showQuestion(index) {
            SOCKET.emit('show-question', {
                "index": index
            });
        }

        window.showQuestion = showQuestion;

        // Send answer
        function sendAnswer(index, id) {
            SOCKET.emit('log-answer', {
                "index": index,
                "id": id
            });
        }

        // Show Correct Answer
        function showAnswer(index, id) {
            SOCKET.emit('show-answer', {
                "index": index,
                "id": id
            });
        }

        // Reset Quiz
        const RESETQUIZFORM = document.querySelector('#reset-quiz');
        RESETQUIZFORM.addEventListener('submit', ($event) => {
            $event.preventDefault();
            if( confirm("Willst du das Quiz wirklich zurücksetzen?") == true ) {
                SOCKET.emit('reset-quiz');
            }
        });


        window.sendAnswer = sendAnswer;
        window.showAnswer = showAnswer;
    });
});