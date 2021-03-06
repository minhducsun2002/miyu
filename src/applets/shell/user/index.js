import React from 'react';
import { connect } from 'react-redux';
import { Button, ButtonGroup, Popover, Intent, Callout } from '@blueprintjs/core';

import { updateUserState } from './../../../actions/creators.js';

import Settings from './settings';
import Version from './version';
import logout from './api-logout';
import session from '../login/api-session';

import './user.css';

class UserSetting extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = { settingsOpen: false, versionOpen: false, trying: false };
    }

    logout = () => {
        const { setUserState } = this.props;
        this.setState({ trying: true })
        logout()
            .then(success => {
                if (success) return session();
                else throw Error('Failed to log out');
            })
            .then(setUserState)
            .catch(null)
            .finally(() => this.setState({ trying: false }))
    }

    render() {
        const { username, id, isAdmin } = this.props, { settingsOpen, trying, versionOpen } = this.state;
        return (
            <Popover>
                <Button
                    minimal
                    large
                    rightIcon="caret-down"
                    icon={isAdmin ? "endorsed" : "user"}
                    intent={isAdmin ? Intent.SUCCESS : Intent.PRIMARY}>
                    {username}
                </Button>
                <div className="userinfo-container">
                    <Callout
                        intent={isAdmin ? Intent.SUCCESS : Intent.PRIMARY}
                        icon={isAdmin ? "endorsed" : "user"}>
                        Username : <span className="username-user-setting code-text text-red">{username}</span>
                        <br />
                        Internal ID : <span className="userid-user-setting code-text text-red">{id}</span>
                    </Callout>
                    <ButtonGroup fill>
                        <Button
                            loading={trying}
                            icon="cog"
                            onClick={() => this.setState({ settingsOpen: true })}>
                            Settings
                            </Button>
                        <Button
                            icon="info-sign"
                            onClick={() => this.setState({ versionOpen: true })}>
                            About
                            </Button>
                        <Button
                            onClick={this.logout}
                            loading={trying}
                            intent={Intent.DANGER}
                            icon="log-out">
                            Log out
                        </Button>
                    </ButtonGroup>
                    <Settings isOpen={settingsOpen} onClose={() => this.setState({ settingsOpen: false })}/>
                    <Version isOpen={versionOpen} onClose={() => this.setState({ versionOpen: false })}/>
                </div>
            </Popover>
        )
    }
}


const mapStateToProps = (state, props) => Object.assign({}, state.user, props);
const mapDispatchToProps = dispatch => ({
    setUserState : (userState) => dispatch(updateUserState(userState))
})

export default connect(mapStateToProps, mapDispatchToProps)(UserSetting)
