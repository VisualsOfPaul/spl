// Imports
import io from 'https://cdn.skypack.dev/socket.io-client';
import { getHost } from "./wsHost.js";

document.addEventListener('DOMContentLoaded', () => {
    
    // Establish connection
    const SOCKET = io(getHost(window.location.href));

    SOCKET.on('connect', () => {
        console.log(`Connected with ${SOCKET.id}.`);


        // VARIABLES
        const STARTINGSCREENFORM = document.querySelector('#starting-screen-form');
        const BANDAGEFORM = document.querySelector('#bandage');
        const BANDAGESELECT = BANDAGEFORM.children[0];
        const TEAMS = document.querySelectorAll('article[id^="team"]');
        const SHOWTEAMSFORM = document.querySelector('#show-teams-form');
        const TEAMPOINTS = document.querySelectorAll('p[id^="points-team-"]');
        const RESETTEAMSFORM = document.querySelector('#reset-teams-form');
        const MEMORYFORM = document.querySelector('#toggle-memory');


        // STARTING SCREEN
        STARTINGSCREENFORM.addEventListener('submit', ($event) => {
            $event.preventDefault();

            SOCKET.emit('toggle-starting-screen');
        });

        SOCKET.on('send-starting-screen', (data) => {
            const TOGGLE = STARTINGSCREENFORM.children[0];
            
            TOGGLE.textContent = data ? "Startbildschirm verstecken" : "Startbildschirm anzeigen";
            TOGGLE.classList.toggle('active',data);
        });









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

            SHOWTEAMSFORM.children[0].textContent = data.visible ? "Punkte ausblenden" : "Punkte einblenden";

            if(data.visible) {
                SHOWTEAMSFORM.children[0].classList.add('active');
            } else {
                SHOWTEAMSFORM.children[0].classList.remove('active');
            }
        });

        // Show teams
        SHOWTEAMSFORM.addEventListener('submit', ($event) => {
            $event.preventDefault();

            SOCKET.emit('show-teams');

            // if( confirm("Willst du das wirklich?") == true ) {
            //     SOCKET.emit('show-teams');
            // }
        })

        // Set teams
        TEAMS.forEach((team) => {
            const SELECT = team.children[1];
            const FORM = team.children[3];

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

            console.log($event.submitter.value);

            SOCKET.emit('show-bandage', {
                "actor": BANDAGESELECT.value,
                "on": $event.submitter.value
            });

            $event.submitter.classList.toggle('active');

            setTimeout(() => {
                $event.submitter.classList.toggle('active');
            }, 5000);
        });

        // Show quiz
        function showQuestion(index) {
            SOCKET.emit('toggle-question', {
                "index": index
            });
        }

        window.showQuestion = showQuestion;

        // Get quiz
        SOCKET.on('send-question', (data) => {
            const QUESTIONS = document.querySelectorAll("#quiz-container ol li");

            QUESTIONS.forEach((question, index) => {
                question.children[1].textContent = data[index].visible ? "Frage ausblenden" : "Frage einblenden";
                question.children[1].classList.toggle('active', data[index].visible);
            });
        });

        // Send answer
        function sendAnswer(index, id) {
            SOCKET.emit('log-answer', {
                "index": index,
                "id": id
            });
        }

        window.sendAnswer = sendAnswer;

        // Show Correct Answer
        function showAnswer(index, id) {
            SOCKET.emit('show-answer', {
                "index": index,
                "id": id
            });
        }

        window.showAnswer = showAnswer;

        // Reset Quiz
        const RESETQUIZFORM = document.querySelector('#reset-quiz');
        RESETQUIZFORM.addEventListener('submit', ($event) => {
            $event.preventDefault();
            if( confirm("Willst du das Quiz wirklich zurücksetzen?") == true ) {
                SOCKET.emit('reset-quiz');
            }
        });

        // Toggle lego build
        async function toggleLegoBuild(index) {
            SOCKET.emit('toggle-lego-build', {
                "index": index
            });
        }

        window.toggleLegoBuild = toggleLegoBuild;

        // Get lego builds
        SOCKET.on('send-lego-builds', (data) => {
            const TOGGLES = document.querySelectorAll('button[id^="toggle-lego-build-"]');
            
            TOGGLES.forEach((toggle, index) => {
                toggle.textContent = data[index].visible ? "Bild verstecken" : "Bild anzeigen";
                toggle.classList.toggle('active', data[index].visible);
            });
        });




        // Toggle where is this
        async function toggleWhereIsThis(index) {
            SOCKET.emit('toggle-where-is-this', {
                "index": index
            });
        }

        window.toggleWhereIsThis = toggleWhereIsThis;

        // Get where is this
        SOCKET.on('send-where-is-this', async (data) => {
            const TOGGLES = document.querySelectorAll('button[id^="toggle-where-is-this-"]');

            Promise.resolve(data).then((data) => {
                TOGGLES.forEach((toggle, index) => {
                    toggle.textContent = data[index].visible ? "Bild verstecken" : "Bild anzeigen";
                    toggle.classList.toggle('active', data[index].visible);
                });
            });
        });


        // TIMER
        const TIMERFORM = document.querySelector('#timer-form');

        TIMERFORM.addEventListener('submit', ($event) => {
            $event.preventDefault();

            const ACTION = $event.submitter.value;
            const TIME = {
                hours: $event.target[0].value,
                minutes: $event.target[1].value,
                seconds: $event.target[2].value
            }

            SOCKET.emit(ACTION, TIME);
        });

        // Toggle timer
        SOCKET.on('got-toggle-timer', (data) => {
            const TOGGLE = document.querySelector('#toggle-timer');
            
            TOGGLE.textContent = data ? "Timer ausblenden" : "Timer anzeigen";
            TOGGLE.classList.toggle('active',data);
        });



        // COUNT LETTERS
        function toggleWord(index) {
            SOCKET.emit('toggle-word', index);
        }

        window.toggleWord = toggleWord;

        // Show solution
        function showSolution(index) {
            SOCKET.emit('show-solution', index);
        }

        window.showSolution = showSolution;

        // Get words
        SOCKET.on('send-count-letters', (data) => {
            const TOGGLES = document.querySelectorAll('button[id^="toggle-word-"]');
            const SOLUTIONS = document.querySelectorAll('button[id^="show-solution-"]');
            
            TOGGLES.forEach((toggle, index) => {
                toggle.textContent = data[index].visible ? "Wort verstecken" : "Wort anzeigen";
                toggle.classList.toggle('active', data[index].visible);
            });

            SOLUTIONS.forEach((solution, index) => {
                solution.classList.toggle('active', data[index].solutionVisible);
            });
        });









        // Toogle memory
        MEMORYFORM.addEventListener('submit', ($event) => {
            $event.preventDefault();

            SOCKET.emit('toggle-memory');
        });

        // Get memory
        SOCKET.on('send-memory', (data) => {
            const TOGGLE = MEMORYFORM.children[0];
            
            TOGGLE.textContent = data ? "Memory verstecken" : "Memory anzeigen";
            TOGGLE.classList.toggle('active',data);
        });

        // Navigation
        async function switchView(index) {
            SOCKET.emit('switch-view', {
                "index": index
            });
        }

        window.switchView = switchView;

        // Get navigation
        SOCKET.on('send-view', (data) => {
            const TOGGLES = document.querySelectorAll('button[id^="switch-view-"]');
            const SECTIONS = document.querySelectorAll('section[data-navigation]');
            
            SECTIONS.forEach((section, index) => {
                section.classList.toggle('active', index === data);
            });

            TOGGLES.forEach((toggle, index) => {
                toggle.classList.toggle('active', index === data);
            });
        });

        // Show Sponsors
        const SPONSORFORM = document.querySelector('#show-sponsors-form');
        SPONSORFORM.addEventListener('submit', ($event) => {
            $event.preventDefault();
            SOCKET.emit('toggle-sponsors');
        });

        // Get sponsors
        SOCKET.on('show-sponsors', (data) => {
            const TOGGLE = SPONSORFORM.children[0];
            
            TOGGLE.textContent = data ? "Sponsoren verstecken" : "Sponsoren anzeigen";
            TOGGLE.classList.toggle('active',data);
        });
    });
});