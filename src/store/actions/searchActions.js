import {
    SEARCH_FETCH,
    SEARCH_FETCH_SUCCESS,
    SEARCH_FETCH_ERROR,
    SET_PROVIDER_DATA,
} from '../constants/searchActionTypes';

export const searchFetch = (data) => ({
    type: SEARCH_FETCH,
    data,
});

export const searchFetchSuccess = ({ data }) => ({
    type: SEARCH_FETCH_SUCCESS,
    data,
});

export const searchFetchError = ({ error }) => ({
    type: SEARCH_FETCH_ERROR,
    error,
});

export const setProviderData = ({ data, provider }) => ({
    type: SET_PROVIDER_DATA,
    data,
    provider,
});
