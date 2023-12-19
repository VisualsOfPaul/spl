// Imports
const COOKIEPARSER = require('cookie-parser')
const HTTP = require('http');
const EXPRESS = require('express');
const SOCKETIO = require('socket.io');
const DOTENV = require('dotenv');

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

var teams = {
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
})

// Socket setup
const IO = new SOCKETIO.Server(SERVER);

IO.on('connection', async (socket) => {
    console.log(`Connected with ${socket.id}.`);

    teams.first.points = Number((await pointsModel.getPoints(teams.first.name)).rows[0].points);
    teams.second.points = Number((await pointsModel.getPoints(teams.second.name)).rows[0].points);

    IO.emit('update-teams', teams);

    socket.on('show-teams', async () => {
        teams.visible = !teams.visible;
        IO.emit('update-teams', (teams));
    })

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

    socket.on('show-question', (data) => {
        IO.emit('show-question', data);
    });

    socket.on('log-answer', (data) => {
        IO.emit('log-answer', data);
    })

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