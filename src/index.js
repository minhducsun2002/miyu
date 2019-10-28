import React from 'react';
import { render } from 'react-dom';
import { Provider, connect } from 'react-redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import './index.css';
import store from './store/index';
import { updateContest, updateUserState } from './actions/creators';

import session from './applets/shell/login/api-session';

// importing components
import Shell from './applets/shell/index';
import Scoreboard from './applets/scoreboard/index';
import Submissions from './applets/submissions/index';
import Editor from './applets/editor/index';

// importing routes
import ScoreboardRoute from './applets/scoreboard/route';
import SubmissionsRoute from './applets/submissions/route';
import EditorRoute from './applets/editor/route';

require('@blueprintjs/core/lib/css/blueprint.css');
require('@blueprintjs/icons/lib/css/blueprint-icons.css');

class Miyu extends React.PureComponent {
    componentDidMount() {
        const { updateUser, updateContestMetadata } = this.props;
        fetch('/api/info')
            .then(res => res.json())
            .then(({ name, startTime, endTime, probList, allowedCodeExt, mode }) => ({
                name : `${name}`,
                time : {
                    start : new Date(startTime),
                    end : new Date(endTime),
                },
                problems : probList,
                ext : allowedCodeExt,
                mode : mode
            }))
            .then(updateContestMetadata);
        session().then(updateUser);
    }
    render() {
        return (
            <Router>
                <header className="header-navbar">
                    <Shell />
                </header>
                <Route path={ScoreboardRoute} component={Scoreboard} />
                <Route path={SubmissionsRoute} component={Submissions} />
                <Route path={EditorRoute} component={Editor} />
            </Router>
        )
    }
}

Miyu = connect(
    (state, props) => Object.assign({}, state, props),
    dispatch => ({
        updateContestMetadata: meta => dispatch(updateContest(meta)),
        updateUser: user => dispatch(updateUserState(user))
    })
)(Miyu)

render(
    <Provider store={store}>
        <Miyu />
    </Provider>,
    document.querySelector('#root')
)
