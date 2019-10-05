import React from 'react';
import { render } from 'react-dom';
import { Provider, connect } from 'react-redux';

import './index.css';
import store from './store/index';
import { updateContest } from './actions/creators';

import Shell from './applets/shell/index';

require('@blueprintjs/core/lib/css/blueprint.css');
require('@blueprintjs/icons/lib/css/blueprint-icons.css');

class Miyu extends React.PureComponent {
    componentDidMount() {
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
            .then(this.props.updateContestMetadata)
    }
    render() {
        return (
            <Shell />
        )
    }
}

Miyu = connect(
    (state, props) => Object.assign({}, state, props),
    dispatch => ({
        updateContestMetadata: meta => dispatch(updateContest(meta))
    })
)(Miyu)

render(
    <Provider store={store}>
        <Miyu />
    </Provider>,
    document.querySelector('#root')
)
