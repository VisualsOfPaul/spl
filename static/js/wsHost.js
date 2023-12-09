export function getHost(location) {
    if(location.includes('localhost')) {
        return 'ws://localhost:3000';
    } else {
        return 'wss://spl-e931.onrender.com/';
    }
  
}