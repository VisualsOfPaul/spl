const POLL = require('../data/poll');
const TWITCHBOT = require('../public/js/bot.js');

async function togglePoll() {
    POLL.visible = !POLL.visible;
    return await POLL;
}

async function getPoll() {
    return await POLL;
}

async function startPoll(player1, player2) {
    POLL.pollPlayers[0].answer = player1;
    POLL.pollPlayers[1].answer = player2;

    TWITCHBOT.startPoll(POLL);
}

async function stopPoll() {

}

module.exports = {
    togglePoll,
    startPoll,
    stopPoll,
    getPoll
}