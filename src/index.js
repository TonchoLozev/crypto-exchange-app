import React from 'react';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from 'react-router-dom';

import configureStore from './store';

import Home from './components/Home';

import './style.scss';

const store = configureStore();

export default function App() {
    return (
        <Switch>
            <Route exact path="/">
                <Home search="default" />
            </Route>
            <Route path="/:crypto/details">
                <Home search="searchDetails" />
            </Route>
            {/* In case crypto pair is written with slash */}
            <Route path="/:crypto/:crypto/details">
                <Home search="searchDetails" />
            </Route>
            <Route path="/:crypto">
                <Home search="search" />
            </Route>
            {/* In case crypto pair is written with slash */}
            <Route path="/:crypto/:crypto">
                <Home search="search" />
            </Route>
        </Switch>
    );
}

render(
    <Provider store={store}>
        <Router>
            <App />
        </Router>
    </Provider>,
    document.getElementById('root'),
);
