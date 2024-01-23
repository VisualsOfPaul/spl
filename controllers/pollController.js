const POLL = require('../data/poll');
const TWITCHBOT = require('../public/js/bot.js');

async function togglePoll() {
    POLL.visible = !POLL.visible;
    return await POLL;
}

async function togglePollStarted() {
    POLL.started = !POLL.started;
    return await POLL;
}

async function changePlayers(players) {
    POLL.pollPlayers[0].answer = players[0];
    POLL.pollPlayers[1].answer = players[1];
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
    TWITCHBOT.stopPoll();
}

async function clearPoll() {
    POLL.votes = 0;
    POLL.visible = false;
    POLL.pollPlayers[0].votes = 0;
    POLL.pollPlayers[1].votes = 0;
    POLL.pollPlayers[0].answer = 'Player 1';
    POLL.pollPlayers[1].answer = 'Player 2';
    return await POLL;
}

async function showPollWinner() {
    if(POLL.pollPlayers[0].votes > POLL.pollPlayers[1].votes) {
        POLL.winner = 0;
    } else if(POLL.pollPlayers[0].votes < POLL.pollPlayers[1].votes) {
        POLL.winner = 1;
    }
    return await POLL;
}

module.exports = {
    togglePoll,
    startPoll,
    stopPoll,
    getPoll,
    changePlayers,
    clearPoll,
    showPollWinner,
    togglePollStarted
}