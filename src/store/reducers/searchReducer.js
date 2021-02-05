import {
    SEARCH_FETCH,
    SEARCH_FETCH_SUCCESS,
    SEARCH_FETCH_ERROR,
    SET_PROVIDER_DATA,
} from '../constants/searchActionTypes';

const initialState = {
    pair: '',
    isLoading: false,
    data: null,
    error: null,
};

export const searchReducer = (state = initialState, action) => {
    const { data, error, provider } = action;
    switch (action.type) {
    case SEARCH_FETCH:
        return {
            ...state,
            isLoading: true,
        };
    case SEARCH_FETCH_SUCCESS:
        return {
            ...state,
            pair: data,
            isLoading: false,
            error: null,
        };
    case SEARCH_FETCH_ERROR:
        return {
            data: null,
            isLoading: false,
            error,
        };
    case SET_PROVIDER_DATA:
        return {
            ...state,
            data: {
                ...state.data,
                [provider]: data,
            },
        };
    default:
        return state;
    }
};
