import React from 'react';
import { Button, Popover, InputGroup, Intent, Callout } from '@blueprintjs/core';

export default class Login extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = { username: '', password: '', showPassword : false }
    }
    render() {
        const { username, password, showPassword } = this.state
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
                    <Callout icon={null} intent={Intent.PRIMARY} style={{ marginBottom: 13 }}>
                        Log in to submit solutions.
                    </Callout>
                    <InputGroup
                        round
                        style={{ marginBottom: 7 }}
                        placeholder="Enter your username..."
                        leftIcon="user"
                        fill
                        value={username}
                        onChange={({ target: { value } }) => this.setState({ username : value })} />
                    <InputGroup
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
                            intent={Intent.DANGER}
                            onClick={() => this.setState({ username: '', password: '' })}
                            style={{ marginRight: 10 }}>
                            Clear all fields
                        </Button>
                        <Button
                            intent={Intent.PRIMARY}>
                            Log in
                        </Button>
                    </div>
                </div>
            </Popover>

        )
    }
}
