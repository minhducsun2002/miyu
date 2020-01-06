import React from 'react';
import { connect } from 'react-redux';
import scores from './api-scores';
import ScoreboardRenderer from './render';

import './index.css';
import Control from './control';

class Scoreboard extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            result: [],
            lastUpdated: null,
            loading: false,
            autoUpdateEnabled: false,
            // by default, disable automatic updates
            updateInterval: 15000
            // 15 seconds by default
            // respect the MIN/MAX_INTERVAL above
        }
    }

    componentDidMount() {
        this.triggerUpdate();
        this.componentDidUpdate();
    }

    // update and then set immediately
    update = () => scores().then(result => this.setState({ result, lastUpdated: new Date() }));

    triggerUpdate = () => {
        this.setState({ loading: true });
        this.update().then(() => this.setState({ loading: false }))
    }

    toggleAutoUpdate = () => {
        this.setState({ autoUpdateEnabled: !this.state.autoUpdateEnabled })
    }

    // taking care of interval
    componentDidUpdate() {
        // resetting interval if autoUpdateEnabled
        // or clear interval instead
        clearInterval(this.updateInterval)
        // resetting
        if (this.state.autoUpdateEnabled)
            this.updateInterval = setInterval(this.triggerUpdate, this.state.updateInterval)
    }

    // cleanup when unmount
    componentWillUnmount = () => clearInterval(this.updateInterval);

    setUpdateInterval_seconds = (value) => this.setState({ updateInterval: value * 1000 })

    render() {

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
                    onUpdate={this.triggerUpdate}/>

                <div style={{ overflowX : 'auto' }}>
                    <ScoreboardRenderer problems={problems} mode={mode} result={result} />
                </div>
            </>
        )
    }
}

const mapStateToProps = ({ contest: { problems, mode } }, props) => Object.assign({}, { problems, mode }, props);

export default connect(mapStateToProps)(Scoreboard);
