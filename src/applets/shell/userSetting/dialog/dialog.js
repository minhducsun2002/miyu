import React from 'react';
import { connect } from 'react-redux';
import { Dialog } from '@blueprintjs/core';
import PropTypes from 'prop-types';

import Content from './content/content';

class SettingDialog extends React.PureComponent {
    render() {
        const { isOpen, onClose, user } = this.props;
        return (
            <Dialog
                usePortal
                lazy
                icon="cog"
                title={`Settings of ${user.username}`}
                isOpen={isOpen}
                onClose={onClose}>
                <Content />
            </Dialog>
        )
    }

    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        onClose: PropTypes.func.isRequired,
        user: PropTypes.shape({
            isAdmin: PropTypes.bool,
            username: PropTypes.string.isRequired,
            id: PropTypes.string.isRequired
        })
    }
}

export default connect(
    ({ user }, props) => Object.assign({}, { user }, props)
)(SettingDialog)
