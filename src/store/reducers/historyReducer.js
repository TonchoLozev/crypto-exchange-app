import {
    GET_HISTORY,
    GET_HISTORY_SUCCESS,
    GET_HISTORY_ERROR,
} from '../constants/historyActionTypes';

const initialState = {
    isLoading: false,
    data: null,
    error: null,
};

export const historyReducer = (state = initialState, action) => {
    const { data, error, provider } = action;
    switch (action.type) {
    case GET_HISTORY:
        return {
            ...state,
            isLoading: true,
        };
    case GET_HISTORY_SUCCESS:
        return {
            data: {
                ...state.data,
                [provider]: data,
            },
            isLoading: false,
            error: null,
        };
    case GET_HISTORY_ERROR:
        return {
            data: null,
            isLoading: false,
            error,
        };
    default:
        return state;
    }
};
