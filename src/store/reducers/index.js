import { combineReducers } from 'redux';

import { searchReducer } from './searchReducer';

const combinedReducers = combineReducers({
    search: searchReducer,
});

export default combinedReducers;
