import {
    takeLatest,
} from 'redux-saga/effects';

import { SEARCH_FETCH } from '../constants/searchActionTypes';
import { GET_HISTORY } from '../constants/historyActionTypes';

import { searchFetch } from './searchSaga';
import { getHistory } from './getHistory';

function* sagas() {
    yield takeLatest(SEARCH_FETCH, searchFetch);
    yield takeLatest(GET_HISTORY, getHistory);
}

export default sagas;
