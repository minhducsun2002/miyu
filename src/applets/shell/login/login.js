import React from 'react';
import { connect } from 'react-redux';
import { Button, Popover, InputGroup, Intent, Callout } from '@blueprintjs/core';

import { updateUserState } from './../../../actions/creators.js';

import login from './api-login';
import session from './api-session';

class Login extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = { username: '', password: '', showPassword : false, trying: false, failed: null }
    }

    login = () => {
        const { setUserState } = this.props;
        this.setState({ trying: true });
        const { username, password } = this.state;
        login(username, password)
            .then(ok => {
                if (!ok) throw Error(`Invalid credentials, login failed.`)
                else return session()
            })
            .then((userState) => setUserState(userState))
            .catch(err => this.setState({ failed: err.message }))
            .finally(() => this.setState({ trying: false }))
    }

    render() {
        const { username, password, showPassword, trying, failed } = this.state
        const showPasswordButton =
            <Button
                minimal
                icon={showPassword ? "eye-open" : "eye-off"}
                onClick={() => this.setState({ showPassword: !showPassword })} />

        return (
            // first element is target,
            // second element is content
            <Popover>
                <Button large rightIcon="key" intent={Intent.SUCCESS}>
                    Log in
                </Button>
                <div style={{ margin: 10, width: '30vw' }}>
                    <Callout
                        icon={null}
                        intent={failed ? Intent.DANGER: Intent.PRIMARY}
                        style={{ marginBottom: 13 }}>
                        Log in to submit solutions.
                    </Callout>
                    <InputGroup
                        disabled={trying}
                        round
                        style={{ marginBottom: 7 }}
                        placeholder="Enter your username..."
                        leftIcon="user"
                        fill
                        value={username}
                        onChange={({ target: { value } }) => this.setState({ username : value })} />
                    <InputGroup
                        disabled={trying}
                        round
                        placeholder="Enter your password..."
                        leftIcon="lock"
                        fill
                        value={password}
                        type={showPassword ? "text" : "password"}
                        onChange={({ target: { value } }) => this.setState({ password : value })}
                        rightElement={showPasswordButton} />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 15 }}>
                        <Button
                            loading={trying}
                            intent={Intent.DANGER}
                            onClick={() => this.setState({ username: '', password: '' })}
                            style={{ marginRight: 10 }}>
                            Clear all fields
                        </Button>
                        <Button
                            loading={trying}
                            intent={Intent.PRIMARY}
                            onClick={this.login}>
                            Log in
                        </Button>
                    </div>
                </div>
            </Popover>

        )
    }
}

const mapDispatchToProps = dispatch => ({
    setUserState : (userState) => dispatch(updateUserState(userState))
})

export default connect(null, mapDispatchToProps)(Login)
