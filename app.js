// Imports
const COOKIEPARSER = require('cookie-parser')
const HTTP = require('http');
const EXPRESS = require('express');
const SOCKETIO = require('socket.io');
const DOTENV = require('dotenv');

const TEAMS = {
    "first" : {
        "name": "-",
        "points": 0
    },
    "second" : {
        "name": "-",
        "points": 0
    }
}

// App setup
const APP = EXPRESS();
const SERVER = HTTP.createServer(APP);

//Middleware
APP.use(EXPRESS.static(__dirname + '/static'));
APP.use(COOKIEPARSER());
DOTENV.config();

//Routing
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

// Socket setup
const IO = new SOCKETIO.Server(SERVER);

IO.on('connection', (socket) => {
    console.log(`Connected with ${socket.id}.`);

    IO.emit('update-teams', TEAMS)

    socket.on('set-team', (data) => {
        
        switch(data.team) {
            case "1": TEAMS.first.name = data.value; break;
            case "2": TEAMS.second.name = data.value; break;
        }

        IO.emit('update-teams', TEAMS)
    });

    socket.on('set-point', (data) => {
       switch(data.team) {
            case "1": TEAMS.first.points = data.operation === "add" ? TEAMS.first.points + 1 : TEAMS.first.points - 1; break;
            case "2": TEAMS.second.points = data.operation === "add" ? TEAMS.second.points + 1 : TEAMS.second.points - 1; break;
       }

       IO.emit('update-teams', TEAMS)
    })

    socket.on('disconnect', () => {
        console.log(`Socket ${socket.id} disconnected.`);
    });
})

// Host on port
SERVER.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}.`);
});