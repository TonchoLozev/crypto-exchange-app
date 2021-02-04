import React from 'react';
import { render } from 'react-dom';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from 'react-router-dom';

import Home from './components/Home';

import './style.scss';

export default function App() {
    return (
        <Switch>
            <Route exact path="/">
                <Home search="default" />
            </Route>
            <Route path="/:crypto/details">
                <Home search="search with details" />
            </Route>
            {/* In case crypto pair is written with slash */}
            <Route path="/:crypto/:crypto/details">
                <Home search="search with details" />
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
    <Router>
        <App />
    </Router>,
    document.getElementById('root'),
);
