import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Navbar, Alignment } from '@blueprintjs/core';

import Clock from './clock/clock';
import Login from './login/login';
import UserSetting from './userSetting/user';

class Shell extends React.PureComponent {
    render() {
        const { contestName, auth } = this.props;
        return (
            <Navbar>
                <Navbar.Group align={Alignment.LEFT}>
                    <Navbar.Heading>{contestName}</Navbar.Heading>
                    <Navbar.Divider />
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
        contestName: PropTypes.string.isRequired
    }

    static defaultProps = {
        contestName : 'Mock contest'
    }
}

const mapStateToProps = (state, props) => Object.assign({}, { contestName : state.contest.name, auth: !state.user.loggedIn }, props)

export default connect(mapStateToProps)(Shell);
