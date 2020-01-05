import React from 'react';
import { connect } from 'react-redux';

import { updateContest, updateUserState, assignToaster } from './actions/creators'

import session from './applets/shell/login/api-session';
import createToaster from './toaster';

const DISPLAY_DELAY = 500; // 0.5s
const toaster = createToaster(); // a single toaster for the whole app

class Bootstrapper extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = { loaded: false };
    }

    componentDidMount() {
        const { updateContestMetadata, updateUser, setToaster } = this.props;
        // load informations
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
                .then(() => console.log(`Loaded contest details.`)),
            session().then(updateUser).then(() => console.log(`Loaded user.`)),
            new Promise(resolve => resolve(setToaster(toaster))).then(() => console.log(`Toaster instantiated.`))
        ]).then(() => setTimeout(() => this.setState({ loaded: true }), DISPLAY_DELAY))
    }

    render = () => this.state.loaded ? this.props.children : 'Loading...'
}

const mapDispatchToProps = dispatch => ({
    updateContestMetadata: meta => dispatch(updateContest(meta)),
    updateUser: user => dispatch(updateUserState(user)),
    setToaster: toaster => dispatch(assignToaster(toaster))
})

const mapStateToProps = (state, props) => Object.assign({}, state, props);

export default connect(mapStateToProps, mapDispatchToProps)(Bootstrapper)
