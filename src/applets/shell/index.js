import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Navbar, Alignment, Tabs, Tab } from '@blueprintjs/core';
import { withRouter, Link, matchPath } from 'react-router-dom';

import Clock from './clock';
import Login from './login';
import User from './user/';

import HomeRoute from '../home/route';
import ScoreboardRoute from '../scoreboard/route';
import SubmissionsRoute from '../submissions/route';
import EditorRoute from '../editor/route';

class Shell extends React.PureComponent {
    render() {
        const { contestName, auth, location } = this.props;
        // check if path matches
        let match = [ScoreboardRoute, SubmissionsRoute, EditorRoute]
            .find(route => matchPath(location.pathname, {
                path: route,
                exact: false
            }))
        // specifically handle homepage
        if (location.pathname === HomeRoute) match = HomeRoute

        return (
            <Navbar>
                <Navbar.Group align={Alignment.LEFT}>
                    <Navbar.Heading>{contestName}</Navbar.Heading>
                    <Navbar.Divider />
                </Navbar.Group>
                <Navbar.Group align={Alignment.LEFT}>
                    <Tabs selectedTabId={match || null}>
                        {/*
                            If no match, HomeRoute would still be highlighted.
                            However, passing `null` seems enough to signal that no tab is enabled.
                            */}
                        <Tab id={HomeRoute}
                            title={<Link to={HomeRoute} replace>Home</Link>} />
                        <Tab id={ScoreboardRoute}
                            title={<Link to={ScoreboardRoute} replace>Scoreboard</Link>} />
                        <Tab id={SubmissionsRoute}
                            title={<Link to={SubmissionsRoute} replace>Submissions</Link>} />
                        <Tab id={EditorRoute}
                            title={<Link to={EditorRoute} replace>Submit solution</Link>} />
                    </Tabs>
                </Navbar.Group>
                <Navbar.Group align={Alignment.RIGHT}>
                    <Clock />
                    &nbsp;
                    {auth ? <Login /> : <User />}
                </Navbar.Group>
            </Navbar>
        )
    }

    static propTypes = {
        contestName: PropTypes.string.isRequired,
        auth: PropTypes.bool.isRequired
    }

    static defaultProps = {
        contestName : 'Mock contest',
        auth: false
    }
}

const mapStateToProps = (state, props) => Object.assign({}, { contestName : state.contest.name, auth: !state.user.loggedIn }, props)

export default connect(mapStateToProps)(withRouter(Shell));
