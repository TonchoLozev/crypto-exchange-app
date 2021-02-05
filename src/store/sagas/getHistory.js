import {
    put, select, call,
} from 'redux-saga/effects';

import { selectPair } from '../selectors';

import {
    GET_HISTORY_SUCCESS,
    GET_HISTORY_ERROR,
} from '../constants/historyActionTypes';
import {
    BINANCE_API,
    BITFINEX_API,
    HOUBI_API,
    KRAKEN_API,
} from '../constants';

import Api from '../Api';

export function* getHistory({ data: provider }) {
    try {
        const cryptoPair = yield select(selectPair);
        const [firstValue, secondValue] = cryptoPair.trim().split(/\W+/);
        const providers = {
            BINANCE: {
                api: BINANCE_API,
                query: `api/v3/trades?symbol=${firstValue.toUpperCase()}${secondValue.toUpperCase()}&limit=5`,
                transform: (data) => data.reduce((prev, current) => ({
                    ...prev,
                    [current.id]: {
                        date: new Date(current.time).toString().split('GMT')[0].trim(),
                        price: current.price.toString(),
                        sell: Number(current.qty) < 0,
                    },
                }), {}),
            },
            BITFINEX: {
                api: BITFINEX_API,
                query: `trades/t${firstValue.toUpperCase()}${secondValue.toUpperCase()}/hist?limit=5`,
                transform: (data) => data.reduce((prev, current) => ({
                    ...prev,
                    [current[0]]: {
                        date: new Date(current[1]).toString().split('GMT')[0].trim(),
                        sell: current[2] < 0,
                        price: current[3].toString(),
                    },
                }), {}),
            },
            HOUBI: {
                api: HOUBI_API,
                query: `market/history/trade?symbol=${firstValue.toLowerCase()}${secondValue.toLowerCase()}&size=5`,
                transform: (data) => data.data.reduce((prev, current) => ({
                    ...prev,
                    [current.id]: {
                        date: new Date(current.data[0].ts).toString().split('GMT')[0].trim(),
                        sell: current.data[0].direction !== 'buy',
                        price: current.data[0].price.toString(),
                    },
                }), {}),
            },
            KRAKEN: {
                api: KRAKEN_API,
                query: `Trades?pair=${firstValue}${secondValue}`,
                transform: (data) => Object.values(data.result)[0]
                    .slice(0, 5)
                    .reduce((prev, current, index) => ({
                        ...prev,
                        [index]: {
                            date: new Date(current[2] * 1000).toString().split('GMT')[0].trim(),
                            sell: current[1] < 0,
                            price: current[0].toString(),
                        },
                    }), {}),
            },
        };

        const url = `${providers[provider].api}${providers[provider].query}`;
        const data = yield call(Api.get, url);
        const dataTransform = providers[provider].transform(data);

        yield put({ type: GET_HISTORY_SUCCESS, provider, data: dataTransform });
    } catch (error) {
        yield put({ type: GET_HISTORY_ERROR, error: error.message });
    }
}
