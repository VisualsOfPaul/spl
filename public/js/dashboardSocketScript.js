// Imports
import {io} from "socket.io-client";

document.addEventListener('DOMContentLoaded', () => {
    // Establish connection
    const SOCKET = io('ws://localhost:3000');

    SOCKET.on('connect', () => {
        console.log(`Connected with ${SOCKET.id}.`);
    });
});