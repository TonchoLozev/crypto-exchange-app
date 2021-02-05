import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';

import combinedReducers from './reducers';
import combinedSagas from './sagas';

const configureStore = () => {
    const sagaMiddleware = createSagaMiddleware();
    return {
        ...createStore(combinedReducers,
            applyMiddleware(sagaMiddleware, logger)),
        runSaga: sagaMiddleware.run(combinedSagas),
    };
};

export default configureStore;
