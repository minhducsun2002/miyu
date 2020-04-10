import React from 'react';
import { connect } from 'react-redux';
import { FormGroup, InputGroup, Intent, Button, Callout } from '@blueprintjs/core';

import change from './api-changePassword';
import session from '../../../login/api-session';
import { updateUserState } from '../../../../../actions/creators';

class PasswordChangeForm extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',

            trying: false,
            failed: null,

            revealOldPassword: false,
            revealNewPassword: false,
            revealConfirmPassword: false
        };
    }

    change = () => {
        const { oldPassword, newPassword } = this.state;
        const { setUserState, id } = this.props;
        this.setState({ trying: true });
        change(id, oldPassword, newPassword)
            .then(ok => {
                if (!ok) throw Error(`Error occurred while changing password.`)
                // load session if success
                else return session()
            })
            .then(setUserState)
            .catch(err => this.setState({ failed: err.message }))
            .finally(() => this.setState({ trying: false }))
    }

    render() {
        const {
            oldPassword, newPassword, confirmPassword,
            trying, failed,
            revealOldPassword, revealNewPassword, revealConfirmPassword
        } = this.state;
        let invalidNew = oldPassword && newPassword && (oldPassword === newPassword),
            invalidConfirm = newPassword && confirmPassword && (confirmPassword !== newPassword);

        const revealButtons = {
            old: <Button
                    minimal
                    icon={revealOldPassword ? "eye-open" : "eye-off"}
                    onClick={() => this.setState({ revealOldPassword: !revealOldPassword })} />,
            new: <Button
                    minimal
                    icon={revealNewPassword ? "eye-open" : "eye-off"}
                    onClick={() => this.setState({ revealNewPassword: !revealNewPassword })} />,
            confirm: <Button
                    minimal
                    icon={revealConfirmPassword ? "eye-open" : "eye-off"}
                    onClick={() => this.setState({ revealConfirmPassword: !revealConfirmPassword })} />
        }

        return (
            <>
                {failed && <Callout
                    icon={null}
                    intent={Intent.DANGER}
                    style={{ marginBottom: 13 }}
                    children={failed}/>}
                <FormGroup
                    labelInfo="(required)">
                    <InputGroup
                        fill
                        leftIcon="unlock"
                        placeholder="Old password..."
                        value={oldPassword}
                        onChange={({ target: { value } }) => this.setState({ oldPassword : value })}
                        style={{ marginBottom: 7 }}
                        rightElement={revealButtons.old}
                        type={revealOldPassword ? "text" : "password"}/>
                    <InputGroup
                        intent={(invalidNew && Intent.DANGER) || ''}
                        // no identical password, I sense Bad Request
                        fill
                        leftIcon="lock"
                        placeholder="New password..."
                        value={newPassword}
                        onChange={({ target: { value } }) => this.setState({ newPassword : value })}
                        style={{ marginBottom: 7 }}
                        rightElement={revealButtons.new}
                        type={revealNewPassword ? "text" : "password"}/>
                    <InputGroup
                        intent={(invalidConfirm && Intent.DANGER) || ''}
                        // error if fields have non-empty values mismatching
                        fill
                        leftIcon="lock"
                        placeholder="Confirm your new password..."
                        value={confirmPassword}
                        onChange={({ target: { value } }) => this.setState({ confirmPassword : value })}
                        rightElement={revealButtons.confirm}
                        type={revealConfirmPassword ? "text" : "password"}/>
                </FormGroup>
                <Button
                    onClick={this.change}
                    disabled={!oldPassword || !newPassword || !confirmPassword || invalidNew || invalidConfirm || trying}>
                    Change your password
                </Button>
            </>
        )
    }
}

const mapStateToProps = (state, props) => Object.assign({}, state.user, props);
const mapDispatchToProps = dispatch => ({
    setUserState : (userState) => dispatch(updateUserState(userState))
})

export default connect(mapStateToProps, mapDispatchToProps)(PasswordChangeForm)
