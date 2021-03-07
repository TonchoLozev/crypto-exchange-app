import { eventChannel, END } from 'redux-saga';

export default {
    createWebSocketConnection: (
        url,
        msg,
    ) => new Promise((resolve, reject) => {
        const socket = new WebSocket(url);

        socket.onopen = () => {
            if (msg) { socket.send(JSON.stringify(msg)); }
            resolve(socket);
        };

        socket.onerror = (evt) => {
            reject(evt);
        };
    }),

    createSocketChannel: (socket) => eventChannel((emit) => {
        socket.onmessage = (event) => {
            emit(event.data);
        };

        socket.onclose = () => {
            emit(END);
        };

        const unsubscribe = () => {
            socket.onmessage = null;
        };

        return unsubscribe;
    }),

};
