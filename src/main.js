import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

// importing components
import Shell from './applets/shell/';
import Home from './applets/home/';
import Error from './applets/error';
import Loading from './loading';
// import components lazily
const wrapErr = (C) => (..._) => <Error><C {..._}/></Error>
const wrapSuspense = (C, fallback = <Loading />) => (..._) => <Suspense fallback={fallback}><C {..._}/></Suspense>

const Scoreboard = wrapSuspense(React.lazy(() => import('./applets/scoreboard')));
const Submissions = wrapSuspense(React.lazy(() => import('./applets/submissions/')));
const Editor = wrapSuspense(React.lazy(() => import('./applets/editor/')));

// importing routes
import HomeRoute from './applets/home/route';
import ScoreboardRoute from './applets/scoreboard/route';
import SubmissionsRoute from './applets/submissions/route';
import EditorRoute from './applets/editor/route';



export default () => (
    <Router>
        <header className="header-navbar">
            <Shell />
        </header>
        <Route path={HomeRoute} exact /* only `/` can be used */ component={wrapErr(Home)} />
        <Route path={ScoreboardRoute} component={wrapErr(Scoreboard)} />
        <Route path={SubmissionsRoute} component={wrapErr(Submissions)} />
        <Route path={EditorRoute} component={wrapErr(Editor)}/>
    </Router>
)
