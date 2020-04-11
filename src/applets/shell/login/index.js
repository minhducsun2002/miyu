import React from 'react';
import { connect } from 'react-redux';
import { Button, ButtonGroup, Popover, InputGroup, Intent, Callout } from '@blueprintjs/core';

import { updateUserState } from './../../../actions/creators.js';

import login from './api-login';
import session from './api-session';
import register from './api-user-post';

import './login.css';

class Login extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = { username: '', password: '', showPassword : false, trying: false, failed: null }
    }

    login = () => {
        const { setUserState, toaster } = this.props;
        // block all activity during login
        this.setState({ trying: true });
        const { username, password } = this.state;
        login(username, password)
            .then(ok => {
                if (!ok) throw Error(`Invalid credentials, login failed.`)
                // load session if success
                else return session()
            })
            .then(status => {
                setUserState(status);
                toaster.show({
                    message: <>Logged in as <span className="code-text">{status.username}</span></>,
                    intent: Intent.SUCCESS
                })
            })
            .catch(err => this.setState({ failed: err.message }))            
            .finally(() => this.setState({ trying: false }))
    }

    register = () => {
        const { toaster } = this.props;
        // block all activity during registration
        this.setState({ trying: true });
        const { username, password } = this.state;
        register(username, password)
            .then(ok => {
                if (!ok) throw Error(`Registration failed.`);
                this.setState({ failed: null })
                toaster.show({
                    message: <>Successfully registered user <span className="code-text">{username}</span></>,
                    intent: Intent.SUCCESS
                })
            })
            .catch(err => this.setState({ failed: err.message }))            
            .finally(() => this.setState({ trying: false }))
    }

    resolveEnterKey = ({ keyCode }) => keyCode === 13 && this.login();

    render() {
        const { username, password, showPassword, trying, failed } = this.state
        const { registrable } = this.props;
        const showPasswordButton =
            <Button
                minimal
                icon={showPassword ? "eye-open" : "eye-off"}
                onClick={() => this.setState({ showPassword: !showPassword })} />

        return (
            // first element is target,
            // second element is content
            <Popover>
                <Button large rightIcon="log-in" intent={Intent.SUCCESS} minimal>
                    Log in
                </Button>
                <div className="login-form-container">
                    <Callout
                        icon={null}
                        intent={failed ? Intent.DANGER: Intent.PRIMARY}
                        style={{ marginBottom: 13 }}>
                        {(typeof failed === 'string' && failed) || 'Log in to submit solutions.'}
                    </Callout>
                    <InputGroup
                        disabled={trying}
                        round
                        style={{ marginBottom: 7 }}
                        placeholder="Enter your username..."
                        leftIcon="user"
                        fill
                        value={username}
                        onChange={({ target: { value } }) => this.setState({ username : value })}
                        onKeyDown={this.resolveEnterKey} />
                    <InputGroup
                        disabled={trying}
                        round
                        placeholder="Enter your password..."
                        leftIcon="lock"
                        fill
                        value={password}
                        type={showPassword ? "text" : "password"}
                        onChange={({ target: { value } }) => this.setState({ password : value })}
                        rightElement={showPasswordButton}
                        onKeyDown={this.resolveEnterKey} />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 15 }}>
                    <Button
                            disabled={!registrable}
                            loading={trying}
                            intent={Intent.PRIMARY}
                            onClick={this.register}
                            style={{ marginRight: 10 }}>
                            Register
                        </Button>
                        <Button
                            disabled={trying}
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

const mapStateToProps = ({ internal: { toaster }, contest: { allowEveryoneReg } }, props) =>
    Object.assign({}, { toaster, registrable: allowEveryoneReg }, props)

const mapDispatchToProps = dispatch => ({
    setUserState : (userState) => dispatch(updateUserState(userState))
})

export default connect(mapStateToProps, mapDispatchToProps)(Login)
