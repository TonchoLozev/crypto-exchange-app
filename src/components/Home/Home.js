import React from 'react';
import { useLocation, useRouteMatch } from 'react-router-dom';

export function Home(props) {
    const location = useLocation();
    const routerMatch = useRouteMatch();

    console.log(location);
    console.log(routerMatch);
    console.log(props);
    return (
        <div>Home asd</div>
    );
}
