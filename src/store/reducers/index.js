import { combineReducers } from 'redux';

import { searchReducer } from './searchReducer';
import { historyReducer } from './historyReducer';

const combinedReducers = combineReducers({
    search: searchReducer,
    history: historyReducer,
});

export default combinedReducers;
