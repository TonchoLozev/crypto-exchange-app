import {
    GET_HISTORY,
    GET_HISTORY_SUCCESS,
    GET_HISTORY_ERROR,
} from '../constants/historyActionTypes';

export const getHistory = (data) => ({
    type: GET_HISTORY,
    data,
});

export const getHistorySuccess = ({ data }) => ({
    type: GET_HISTORY_SUCCESS,
    data,
});

export const getHistoryError = ({ error }) => ({
    type: GET_HISTORY_ERROR,
    error,
});
