import React from 'react';
import { connect } from 'react-redux';
import { Button } from '@blueprintjs/core';
import scores from './api-scores';
import ScoreboardRenderer from './render';

import './index.css';
import Control from './control';
import Error from './error';

class Scoreboard extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            result: [],
            lastUpdated: null,
            loading: false,
            autoUpdateEnabled: false,
            // by default, disable automatic updates
            updateInterval: 15000,
            // 15 seconds by default
            // respect the MIN/MAX_INTERVAL above
            err: null
        }
    }

    componentDidMount() {
        this.update();
    }

    // update and then set immediately
    update = () => {
        this.setState({ loading: true, err: null });
        scores()
            .then(result => this.setState({ result, lastUpdated: new Date(), err: null }))
            .catch(({ message }) => this.setState({ err: message }))
            .finally(() => this.setState({ loading: false }))
    }

    toggleAutoUpdate = () => {
        this.setState({ autoUpdateEnabled: !this.state.autoUpdateEnabled })
    }

    componentDidUpdate(prevProps) {
        // taking care of interval

        // resetting interval if autoUpdateEnabled
        // or clear interval instead
        clearInterval(this.updateInterval)
        // resetting
        if (this.state.autoUpdateEnabled)
            this.updateInterval = setInterval(this.update, this.state.updateInterval)

        // reload if login state changes
        if (prevProps.auth !== this.props.auth) this.update()
    }

    // cleanup when unmount
    componentWillUnmount = () => clearInterval(this.updateInterval);

    setUpdateInterval_seconds = (value) => this.setState({ updateInterval: value * 1000 })

    render() {
        if (this.state.err)
            return (
                <Error
                    action={<Button rightIcon='refresh' onClick={this.update}>Reload</Button>}
                    description={<span className="code-text">{this.state.err}</span>} />
            )

        const { problems, mode } = this.props;
        const { result, lastUpdated, autoUpdateEnabled, loading, updateInterval } = this.state;

        return (
            // wrapping in a div to prevent overflows
            // from breaking the navbar
            <>
                <Control
                    updateEnabled={autoUpdateEnabled}
                    loading={loading}
                    last={lastUpdated}
                    interval={updateInterval}
                    setIntervalSecs={this.setUpdateInterval_seconds}
                    toggleAuto={this.toggleAutoUpdate}
                    onUpdate={this.update} />

                <div style={{ overflowX : 'auto' }}>
                    <ScoreboardRenderer problems={problems} mode={mode} result={result} />
                </div>
            </>
        )
    }
}

const mapStateToProps = ({ contest: { problems, mode }, user: { loggedIn } }, props) =>
    Object.assign({}, { problems, mode, auth: loggedIn }, props);

export default connect(mapStateToProps)(Scoreboard);