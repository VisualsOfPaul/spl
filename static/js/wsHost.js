export function getHost(location) {
    if(location.includes('localhost')) {
        return 'ws://localhost:3000';
    } else if(location.includes('87')) {
        return 'wss://87.186.28.104:3000/';
    } else {
        return 'wss://spl-e931.onrender.com/';
    }
  
}