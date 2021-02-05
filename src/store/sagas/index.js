import {
    takeLatest,
} from 'redux-saga/effects';

import {
    SEARCH_FETCH,
} from '../constants/searchActionTypes';

import { searchFetch } from './searchSaga';

function* sagas() {
    yield takeLatest(SEARCH_FETCH, searchFetch);
}

export default sagas;
