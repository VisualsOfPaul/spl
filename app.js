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

// Socket setup
const IO = new SOCKETIO.Server(SERVER);

IO.on('connection', async (socket) => {
    console.log(`Connected with ${socket.id}.`);

    teams.first.points = (await pointsModel.getPoints(teams.first.name)).rows[0].points;
    teams.second.points = (await pointsModel.getPoints(teams.second.name)).rows[0].points;

    IO.emit('update-teams', teams);

    socket.on('show-teams', async () => {
        teams.visible = !teams.visible;
        teams.first.points = (await pointsModel.getPoints(teams.first.name)).rows[0].points;
        teams.second.points = (await pointsModel.getPoints(teams.second.name)).rows[0].points;
        IO.emit('update-teams', (teams));
    })

    socket.on('set-team', async (data) => {
        
        switch(data.team) {
            case "1": teams.first.name = data.value; break;
            case "2": teams.second.name = data.value; break;
        }

        teams.first.points = (await pointsModel.getPoints(teams.first.name)).rows[0].points;
        teams.second.points = (await pointsModel.getPoints(teams.second.name)).rows[0].points;

        IO.emit('update-teams', teams)
    });

    socket.on('set-point', async (data) => {
        pointsModel.setPoints(data.selectedOption, data.operation)
        teams.first.points = (await pointsModel.getPoints(teams.first.name)).rows[0].points;
        teams.second.points = (await pointsModel.getPoints(teams.second.name)).rows[0].points;
        IO.emit('update-teams', teams)
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
        IO.emit('update-teams', teams)
    })

    socket.on('show-bandage', (data) => {
        IO.emit('show-bandage', data)
    })

    socket.on('disconnect', () => {
        console.log(`Socket ${socket.id} disconnected.`);
    });
})

// Host on port
SERVER.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}.`);
});