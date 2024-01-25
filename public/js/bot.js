const tmi = require('tmi.js');
const io = require('socket.io-client');
const POLL = require('../../data/poll.json');

const LOCALLINK = 'ws://localhost:3000';
const REMOTELINK = 'wss://spl-e931.onrender.com';
const PILINK = 'ws://87.186.16.196:3000';

const SOCKET = io(REMOTELINK);

SOCKET.on("disconnect", (reason) => {
  if(reason === 'io server disconnect') {
    console.log('Socket disconnected. Reconnecting...');
  }
});

var votes = 0;
var voters = [];
var channelsTH = ['mithkoeln'];
var channelsJustin = ['justinpennerthkoeln'];

// Define configuration options
const opts = {
  options: {
    debug: true
  },
  identity: {
    username: 'justinpennerthkoeln',
    password: 'fjkabk3yjlxogywsf0zlynnlix6lvx'
  },
  channels: channelsTH
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
  const commandName = msg.trim().toLowerCase();

  // If the command is known, let's execute it
  switch(commandName) {
    case '!dice': 
        const num = rollDice();
        client.say(target, `You rolled a ${num}`);
        break;
    case '1':
        if(!voters.includes(context.username)) {
            voters.push(context.username);
            POLL.pollPlayers[0].votes++;
            POLL.votes++;
            SOCKET.emit('update-poll-counter');
        };
        break;
    case '2':
        if(!voters.includes(context.username)) {
          voters.push(context.username);
          POLL.pollPlayers[1].votes++;
          POLL.votes++;
          SOCKET.emit('update-poll-counter');
        };
        break;
    case '!commands':
        client.say(target, `!dice, !commands, !website, !instagram`);
        break;
    case '!youtube':
        client.say(target, `https://www.youtube.com/@mikoeln`);
        break;
    case '!instagram':
    case '!insta':
        client.say(target, `https://www.instagram.com/mithkoeln/`);
        break;
    default: 
        break;
  }
}

exports.counter = function () {
  return votes;
}

exports.resetCounter = function () {
  votes = 0;
  POLL.pollPlayers[0].votes = 0;
  POLL.pollPlayers[1].votes = 0;
}

const mikoeln_id = '760615928';
const justinpennerthkoeln_id = '1019573186';
exports.startPoll = async function () {
  fetch(`https://api.twitch.tv/helix/chat/announcements?broadcaster_id=${mikoeln_id}&moderator_id=1019573186`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': '*/*',
      'Authorization': 'Bearer w3wvzudsh2k6oh7mm4m3bjmxpapfk7',
      'Client-Id': '9n8gs2q0svqy0wq7hcx07inlhnyzck'
    },
    body: JSON.stringify({"message": `[Abstimmung] 1 für ${POLL.pollPlayers[0].answer} || 2 Für ${POLL.pollPlayers[1].answer}`, "color": "blue"})
  });
}

exports.stopPoll = function () {
  voters = [];
  fetch(`https://api.twitch.tv/helix/chat/announcements?broadcaster_id=${mikoeln_id}&moderator_id=1019573186`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': '*/*',
      'Authorization': 'Bearer w3wvzudsh2k6oh7mm4m3bjmxpapfk7',
      'Client-Id': '9n8gs2q0svqy0wq7hcx07inlhnyzck'
    },
    body: JSON.stringify({"message": `[Beendet] ${POLL.pollPlayers[0].answer}: ${POLL.pollPlayers[0].votes} || ${POLL.pollPlayers[1].answer}: ${POLL.pollPlayers[1].votes}`, "color": "blue"})
  })
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