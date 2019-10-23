import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Navbar, Alignment, Tabs, Tab } from '@blueprintjs/core';
import { withRouter, Link } from 'react-router-dom';

import Clock from './clock/clock';
import Login from './login/login';
import UserSetting from './userSetting/user';

import ScoreboardRoute from '../scoreboard/route';
import SubmissionsRoute from '../submissions/route';

class Shell extends React.PureComponent {
    render() {
        const { contestName, auth, location } = this.props;
        return (
            <Navbar>
                <Navbar.Group align={Alignment.LEFT}>
                    <Navbar.Heading>{contestName}</Navbar.Heading>
                    <Navbar.Divider />
                </Navbar.Group>
                <Navbar.Group align={Alignment.LEFT}>
                    <Tabs selectedTabId={location.pathname}>
                        <Tab id={ScoreboardRoute}
                            title={<Link to={ScoreboardRoute} replace>Scoreboard</Link>} />
                        <Tab id={SubmissionsRoute}
                            title={<Link to={SubmissionsRoute} replace>Submissions</Link>} />
                    </Tabs>
                </Navbar.Group>
                <Navbar.Group align={Alignment.RIGHT}>
                    <Clock />
                    &nbsp;
                    {auth ? <Login /> : <UserSetting />}
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
