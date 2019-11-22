import React from 'react';
import { connect } from 'react-redux';
import { Pre } from '@blueprintjs/core';

import { updateContest, updateUserState } from './actions/creators'

import session from './applets/shell/login/api-session';
const DISPLAY_DELAY = 500; // 0.5s

class Bootstrapper extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            progress: 'Initializing...'
        }
    }

    addProgress = _ => this.setState({ progress: this.state.progress + _ })

    componentDidMount() {
        const { updateContestMetadata, updateUser } = this.props;
        Promise.all([
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
                .then(updateContestMetadata)
                .then(() => this.addProgress(`\nLoaded contest details.`)),
            session().then(updateUser).then(() => this.addProgress(`\nLoaded user.`))
        ]).then(() => setTimeout(() => this.setState({ loaded: true }), DISPLAY_DELAY))
    }

    render = () => this.state.loaded ? this.props.children : <Pre>{this.state.progress}</Pre>
}

const mapDispatchToProps = dispatch => ({
    updateContestMetadata: meta => dispatch(updateContest(meta)),
    updateUser: user => dispatch(updateUserState(user))
})

const mapStateToProps = (state, props) => Object.assign({}, state, props);

export default connect(mapStateToProps, mapDispatchToProps)(Bootstrapper)
