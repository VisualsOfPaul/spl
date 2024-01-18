const tmi = require('tmi.js');
const io = require('socket.io-client');

const SOCKET = io("ws://localhost:3000");

var counter =  {
    ones: 0,
    twos: 0,
}

var poll = false;

// Define configuration options
const opts = {
  identity: {
    username: 'spl-integration',
    password: '87xbhgbjddun7b17obyumktkcmbzw6'
  },
  channels: [
    'justinpennerthkoeln'
  ]
};

// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

// Called every time a message comes in
function onMessageHandler (target, context, msg, self) {
  if (self) { return; } // Ignore messages from the bot

  // Remove whitespace from chat message
  const commandName = msg.trim();

  // If the command is known, let's execute it

  switch(commandName) {
    case '!dice': 
            const num = rollDice();
            client.say(target, `You rolled a ${num}`);
            console.log(`* Executed ${commandName} command`);
        break;
    case '1': 
        if (poll) {counter.ones++; SOCKET.emit('update-counter', counter)}
        break;
    case '2': 
        if (poll) {counter.twos++; SOCKET.emit('update-counter', counter)}
        break;
  }
}

exports.counter = function () {
    return counter;
}

exports.resetCounter = function () {
    counter.ones = 0;
    counter.twos = 0;
}

exports.startPoll = function () {
    poll = true;
    client.say('justinpennerthkoeln', `Abstimmung gestartet! \n 1 für Jonas \n 2 für Paul`);
}

exports.stopPoll = function () {
    poll = false;
    client.say('justinpennerthkoeln', `Abstimmung beendet! \n Jonas: ${counter.ones} \n Paul: ${counter.twos}`);
}

// Function called when the "dice" command is issued
function rollDice () {
  const sides = 6;
  return Math.floor(Math.random() * sides) + 1;
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}