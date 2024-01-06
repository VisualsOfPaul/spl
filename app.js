// Imports
const COOKIEPARSER = require('cookie-parser')
const HTTP = require('http');
const EXPRESS = require('express');
const SOCKETIO = require('socket.io');
const DOTENV = require('dotenv');
const FS = require('fs');

// App setup
const APP = EXPRESS();
const SERVER = HTTP.createServer(APP);

//Middleware
APP.use(EXPRESS.static(__dirname + '/static'));
APP.use(COOKIEPARSER());
DOTENV.config();

//Modells
const bandageModel = require('./models/bandageModel.js');
const pointsModel = require('./models/pointsModel.js');
const quizModel = require('./models/quizModel.js');

let teams = {
    "first" : {
        "name": "-",
        "points": 0
    },
    "second" : {
        "name": "-",
        "points": 0
    },
    "visible": false
}

const LEGOBUILDS = Array.from(FS.readdirSync('./static/assets/lego-builds')).map((file, index) => {
    return {
        "index": index,
        "visible": false
    };
});

const MEMORY = {
    "visible": false,
    "tiles" : [
        {
            "calculation": "Wurzel aus 25",
            "solution": 1
        },
        {
            "calculation": "(100 - 96) / 2",
            "solution": 2
        },
        {
            "calculation": "3 * 2 + 3",
            "solution": 4
        },
        {
            "calculation": "5 * 2 - 9",
            "solution": 1
        },
        {
            "calculation": "80 / 10",
            "solution": 5
        },
        {
            "calculation": "(Wurzel aus 9) + (2 * 6) - 12",
            "solution": 3
        },
        {
            "calculation": "(5 * 2 - 9) * 0 + 6",
            "solution": 2
        },
        {
            "calculation": "Wurzel aus 49",
            "solution": 3
        },
        {
            "calculation": "(76 - 36) / 40",
            "solution": 4
        },
        {
            "calculation": "",
            "solution": 6
        },
        {
            "calculation": "",
            "solution": 5
        },
        {
            "calculation": "",
            "solution": 6
        }
    ]
};

const QUIZ = {};

let visibleViewIndex = 0;

//Routing
APP.get("/", (req, res) => {
    res.redirect('/overlay');
});

APP.get("/unauthorized", (req, res) => { //login
    res.sendFile(__dirname + "/views/unauthorized.html");
});

//Whats the tech-department sees
APP.get("/dashboard", (req, res) => {
    if(
        req.cookies.password === process.env.PASSWORD ||
        req.query.password === process.env.PASSWORD
    ) {
        res.sendFile(__dirname + "/views/dashboard.html");
    } else {
        res.redirect('/unauthorized')
    }
});

//Whats shown in the stream
APP.get("/overlay", (req, res) => {
    res.sendFile(__dirname + "/views/overlay.html");
});

//What the actors see
APP.get("/view", (req, res) => {

});


APP.get("/api/bandages", async (req, res) => {
    res.send(await bandageModel.getEntries());
})

APP.get("/api/quiz", async (req, res) => {
    const quizes = await quizModel.getQuizes();
    res.send(await quizes.rows);

    quizes.rows.forEach((quiz, index) => {
        QUIZ[index] = {
            "visible": false
        }
    });
})

APP.get("/api/lego-builds", async (req, res) => {
    let images = [];

    FS.readdirSync('./static/assets/lego-builds').forEach(file => {
        images.push(file);
    });

    res.send({images: images});
})

APP.get("/api/memory", async (req, res) => {
    res.send(await MEMORY);
})

// Socket setup
const IO = new SOCKETIO.Server(SERVER);

IO.on('connection', async (socket) => {
    console.log(`Connected with ${socket.id}.`);

    teams.first.points = Number((await pointsModel.getPoints(teams.first.name)).rows[0].points);
    teams.second.points = Number((await pointsModel.getPoints(teams.second.name)).rows[0].points);

    IO.emit('update-teams', teams);
    IO.emit('send-lego-builds', LEGOBUILDS);
    IO.emit('send-memory', MEMORY.visible);
    IO.emit('send-question', QUIZ);
    IO.emit('send-view', visibleViewIndex);

    socket.on('show-teams', async () => {
        teams.visible = !teams.visible;
        IO.emit('update-teams', (teams));
    });

    socket.on('hide-teams', async () => {
        teams.visible = false;
        IO.emit('update-teams', (teams));
    });

    socket.on('set-team', async (data) => {

        await pointsModel.setPoints(teams.first.name, teams.first.points);
        await pointsModel.setPoints(teams.second.name, teams.second.points);
        
        switch(data.team) {
            case "1": teams.first.name = data.value; break;
            case "2": teams.second.name = data.value; break;
        }

        teams.first.points = Number((await pointsModel.getPoints(teams.first.name)).rows[0].points);
        teams.second.points = Number((await pointsModel.getPoints(teams.second.name)).rows[0].points);

        IO.emit('update-teams', teams);
    });

    socket.on('set-point', async (data) => {
        if(data.team === "1") {
            switch(data.operation) {
                case "add" : teams.first.points += 1; break;
                case "minus" : teams.first.points -= 1; break;
            }
        } else if(data.team === "2") {
            switch(data.operation) {
                case "add" : teams.second.points += 1; break;
                case "minus" : teams.second.points -= 1; break;
            }
        }

        IO.emit('update-teams', teams);
    })

    socket.on('reset-teams', () => {
        teams = {
            "first" : {
                "name": "-",
                "points": 0
            },
            "second" : {
                "name": "-",
                "points": 0
            },
            "visible": false
        }
        pointsModel.resetPoints();
        IO.emit('update-teams', teams);
    })

    socket.on('show-bandage', (data) => {
        IO.emit('show-bandage', data);
    })

    socket.on('toggle-question', (data) => {
        Object.keys(QUIZ).forEach(key => {
            if (key !== data.index.toString()) {
                QUIZ[key].visible = false;
            }
        });

        QUIZ[data.index].visible = !QUIZ[data.index].visible;

        IO.emit('send-question', QUIZ);
    });

    socket.on('hide-questions', () => {
        Object.keys(QUIZ).forEach(key => {
            QUIZ[key].visible = false;
        });

        IO.emit('send-question', QUIZ);
    });

    socket.on('log-answer', (data) => {
        IO.emit('log-answer', data);
    })

    socket.on('show-answer', async (data) => {
        const quiz = await quizModel.getQuiz(data.index + 1);
        var correctAnswer = null;
        quiz.rows[0].answers.forEach((answer) => {
            if(answer.correct == true) {
                correctAnswer = answer.answer;
            }
        });
        data.correctAnswer = correctAnswer;
        IO.emit('show-answer', data);
    });

    socket.on('reset-quiz', () => {
        IO.emit('reset-quiz');
    });

    socket.on('toggle-lego-build', (data) => {
        LEGOBUILDS.forEach((build) => {
            if(build.index !== data.index) build.visible = false;
        });

        const build = LEGOBUILDS.find((build) => {
            return build.index === data.index;
        });

        build.visible = !build.visible;

        IO.emit('send-lego-builds', LEGOBUILDS);
    });

    socket.on('toggle-memory', () => {
        MEMORY.visible = !MEMORY.visible;
        
        IO.emit('send-memory', MEMORY.visible);
    });

    socket.on('switch-view', (data) => {
        visibleViewIndex = data.index;
        
        IO.emit('send-view', visibleViewIndex);
    });

    socket.on('disconnect', () => {
        pointsModel.setPoints(teams.first.name, teams.first.points);
        pointsModel.setPoints(teams.second.name, teams.second.points);
        console.log(`Socket ${socket.id} disconnected.`);
    });
})

// Host on port
SERVER.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}.`);
});