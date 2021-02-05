import {
    call, put,
} from 'redux-saga/effects';
import {
    SEARCH_FETCH_SUCCESS,
    SEARCH_FETCH_ERROR,
    SET_PROVIDER_DATA,
} from '../constants/searchActionTypes';

import Api from '../Api';

function* callCurrentApi(provider, firstValue, secondValue) {
    try {
        const providers = {
            BINANCE: {
                api: 'https://api.binance.com',
                query: `/api/v3/depth?symbol=${firstValue}${secondValue}&limit=5`,
                transform: (data) => ({
                    price: data.asks[0][0],
                }),
            },
            BITFINEX: {
                api: 'https://api-pub.bitfinex.com/v2/',
                query: `trades/t${firstValue}${secondValue}/hist?limit=120&sort=-1`,
                transform: (data) => {
                    console.log(data);
                },
            },
        };

        const url = `${providers[provider].api}${providers[provider].query}`;
        const data = yield call(Api.get, url);
        const dataTransform = providers[provider].transform(data);

        yield put({ type: SET_PROVIDER_DATA, provider, data: dataTransform });
    } catch (error) {
        yield put({ type: SET_PROVIDER_DATA, provider, data: null });
    }
}

export function* searchFetch({ data: cryptoPair }) {
    try {
        const [firstValue, secondValue] = cryptoPair.trim().split(/\W+/);

        // yield call(callCurrentApi, 'BINANCE', firstValue, secondValue);
        yield call(callCurrentApi, 'BITFINEX', firstValue, secondValue);

        yield put({ type: SEARCH_FETCH_SUCCESS });
    } catch (error) {
        yield put({ type: SEARCH_FETCH_ERROR, error });
    }
}
