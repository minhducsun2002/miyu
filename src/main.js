import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

// importing components
import Shell from './applets/shell/index';
import Home from './applets/home/index';
import Scoreboard from './applets/scoreboard/index';
import Submissions from './applets/submissions/index';
import Editor from './applets/editor/index';

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
        <Route path={HomeRoute} exact /* only `/` can be used */ component={Home} />
        <Route path={ScoreboardRoute} component={Scoreboard} />
        <Route path={SubmissionsRoute} component={Submissions} />
        <Route path={EditorRoute} component={Editor} />
    </Router>
)
