import {
    call, put, take, cancelled, dispatch, fork,
} from 'redux-saga/effects';
import {
    SEARCH_FETCH_SUCCESS,
    SEARCH_FETCH_ERROR,
    SET_PROVIDER_DATA,
} from '../constants/searchActionTypes';
import {
    BINANCE_API,
    BITFINEX_API,
    HOUBI_API,
    KRAKEN_API,
    BINANCE_WEBSOCKET,
    BITFINEX_WEBSOCKET,
    HOUBI_WEBSOCKET,
    KRAKEN_WEBSOCKET,
} from '../constants';

import Api from '../Api';
import WebSocket from '../WebSocket';

function* callApi(provider, firstValue, secondValue) {
    const providers = {
        BINANCE: {
            api: BINANCE_API,
            endpoint: `/api/v3/depth?symbol=${firstValue.toUpperCase()}${secondValue.toUpperCase()}&limit=5`,
            transform: (data) => data.asks[0][0].toString(),
        },
        BITFINEX: {
            api: BITFINEX_API,
            endpoint: `/ticker/t${firstValue.toUpperCase()}${secondValue.toUpperCase()}`,
            transform: (data) => data[0].toString(),
        },
        HOUBI: {
            api: HOUBI_API,
            endpoint: `/market/detail/merged?symbol=${firstValue.toLowerCase()}${secondValue.toLowerCase()}`,
            transform: (data) => data.tick.bid[0].toString(),
        },
        KRAKEN: {
            api: KRAKEN_API,
            endpoint: `/0/public/Ticker?pair=${firstValue.toUpperCase()}${secondValue.toUpperCase()}`,
            transform: (data) => Object.values(data.result)[0].a[0]
                .toString(),
        },
    };
    try {
        // const url = `${providers[provider].api}${providers[provider].endpoint}`;
        const data = yield call(Api.get, providers[provider].endpoint);
        const dataTransform = providers[provider].transform(data);

        yield put({ type: SET_PROVIDER_DATA, provider, data: dataTransform });
    } catch (error) {
        yield put({ type: SET_PROVIDER_DATA, provider, data: null });
    }
}

function* callWebSocket(provider, firstValue, secondValue) {
    let socket;
    let socketChannel;

    const providers = {
        BINANCE: {
            websocket: BINANCE_WEBSOCKET,
            endpoint: `/ws/${firstValue.toLowerCase()}${secondValue.toLowerCase()}@depth`,
            transform: (data) => JSON.parse(data).a[0][0].toString(),
        },
        BITFINEX: {
            websocket: BITFINEX_WEBSOCKET,
            msg: {
                event: 'subscribe',
                channel: 'ticker',
                symbol: `t${firstValue.toUpperCase()}${secondValue.toUpperCase()}`,
            },
            transform: (data) => (Array.isArray(JSON.parse(data))
                ? JSON.parse(data)[1][0].toString() : null),
        },
        HOUBI: {
            websocket: HOUBI_WEBSOCKET,
            msg: {
                sub: `market.${firstValue.toLowerCase()}${secondValue.toLowerCase()}.depth.step0`,
                id: 'id1',
            },
            transform: async (data) => {
                const dataLoaded = await data.text();
                return dataLoaded;
            },
        },
        KRAKEN: {
            websocket: KRAKEN_WEBSOCKET,
            msg: {
                event: 'subscribe',
                pair: [`${firstValue.toUpperCase()}/${secondValue.toUpperCase()}`],
                subscription: { name: 'spread' },
            },
            transform: (data) => (Array.isArray(JSON.parse(data))
                ? JSON.parse(data)[1][0] : null),
        },
    };

    const url = `${providers[provider].websocket}${providers[provider].endpoint || ''}`;
    const { msg } = providers[provider];

    try {
        socket = yield call(WebSocket.createWebSocketConnection, url, msg);
        socketChannel = yield call(WebSocket.createSocketChannel, socket);

        console.info(`Connecting to ${provider} WebSocket completed`);

        while (true) {
            const data = yield take(socketChannel);
            const dataTransform = yield providers[provider].transform(data);

            if (dataTransform) {
                yield put({
                    type: SET_PROVIDER_DATA,
                    provider,
                    data: dataTransform,
                });
            }
        }
    } catch (error) {
        console.error(`Connecting to ${provider} WebSocket failed`);
    } finally {
        if (yield cancelled()) {
            socketChannel.close();
            socket.close();
        } else {
            console.info(`${provider} WebSocket disconnected`);
        }
    }
}

export function* searchFetch({ data: cryptoPair }) {
    try {
        const [firstValue, secondValue] = cryptoPair.trim().split(/\W+/);
        if (!firstValue || !secondValue) { throw Error('Write a correct pair as the examples in the input.'); }

        yield call(callApi, 'BINANCE', firstValue, secondValue);
        yield call(callApi, 'BITFINEX', firstValue, secondValue);
        yield call(callApi, 'HOUBI', firstValue, secondValue);
        yield call(callApi, 'KRAKEN', firstValue, secondValue);

        yield put({ type: SEARCH_FETCH_SUCCESS, data: cryptoPair });

        yield fork(callWebSocket, 'BINANCE', firstValue, secondValue);
        yield fork(callWebSocket, 'BITFINEX', firstValue, secondValue);
        // yield fork(callWebSocket, 'HOUBI', firstValue, secondValue); // Has problem with reading the data from the websockets
        yield fork(callWebSocket, 'KRAKEN', firstValue, secondValue);
    } catch (error) {
        yield put({ type: SEARCH_FETCH_ERROR, error: error.message });
    }
}
