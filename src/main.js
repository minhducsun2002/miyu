import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

// importing components
import Shell from './applets/shell/';
import Home from './applets/home/';
import Scoreboard from './applets/scoreboard/';
import Submissions from './applets/submissions/';
import Editor from './applets/editor/';
import Error from './applets/error';

// importing routes
import HomeRoute from './applets/home/route';
import ScoreboardRoute from './applets/scoreboard/route';
import SubmissionsRoute from './applets/submissions/route';
import EditorRoute from './applets/editor/route';

const wrapErr = (C) => (..._) => <Error><C {..._}/></Error>

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
