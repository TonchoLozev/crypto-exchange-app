import {
    call, put,
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
} from '../constants';

import Api from '../Api';

function* callCurrentApi(provider, firstValue, secondValue) {
    try {
        const providers = {
            BINANCE: {
                api: BINANCE_API,
                query: `api/v3/depth?symbol=${firstValue.toUpperCase()}${secondValue.toUpperCase()}&limit=5`,
                transform: (data) => data.asks[0][0].toString(),
            },
            BITFINEX: {
                api: BITFINEX_API,
                query: `ticker/t${firstValue.toUpperCase()}${secondValue.toUpperCase()}`,
                transform: (data) => data[0].toString(),
            },
            HOUBI: {
                api: HOUBI_API,
                query: `market/detail/merged?symbol=${firstValue.toLowerCase()}${secondValue.toLowerCase()}`,
                transform: (data) => data.tick.bid[0].toString(),
            },
            KRAKEN: {
                api: KRAKEN_API,
                query: `Ticker?pair=${firstValue.toUpperCase()}${secondValue.toUpperCase()}`,
                transform: (data) => Object.values(data.result)[0].a[0]
                    .toString(),
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
        if (!firstValue || !secondValue) { throw Error('Write a correct pair as the examples in the input.'); }

        yield call(callCurrentApi, 'BINANCE', firstValue, secondValue);
        yield call(callCurrentApi, 'BITFINEX', firstValue, secondValue);
        yield call(callCurrentApi, 'HOUBI', firstValue, secondValue);
        yield call(callCurrentApi, 'KRAKEN', firstValue, secondValue);

        yield put({ type: SEARCH_FETCH_SUCCESS, data: cryptoPair });
    } catch (error) {
        yield put({ type: SEARCH_FETCH_ERROR, error: error.message });
    }
}
