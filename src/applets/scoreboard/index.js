import React from 'react';
import { connect } from 'react-redux';
import scores from './api-scores';
import { Callout, Elevation, Button, Navbar, ButtonGroup, Slider, Intent, Popover } from '@blueprintjs/core'

import { MIN_INTERVAL, MAX_INTERVAL, STEP_INTERVAL } from './constants';
import ScoreboardRenderer from './render';

import './index.css';

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

    setUpdateInterval_seconds = (value) => this.setState({ updateInterval: value * 1000 })

    render() {

        const { problems, mode } = this.props;
        const { result, lastUpdated, autoUpdateEnabled, loading, updateInterval } = this.state;

        const updateInterval_seconds = Math.floor(updateInterval / 1000);
        // rendering interval change controls here
        const intervalSwitcher = (
            // first element is target,
            // second element is content

            <Popover position="bottom" disabled={!autoUpdateEnabled}>
                {/*
                  * disable interval adjusting if disabled
                  * position="bottom" to prevent overlapping with clock
                  */}
                <Button disabled={!autoUpdateEnabled} icon='time' rightIcon="chevron-down">
                    Update every : {updateInterval_seconds} seconds
                </Button>
                <div className="scoreboard-updateInterval-slider-container">
                    <Slider
                        min={Math.floor(MIN_INTERVAL / 1000)}
                        max={Math.floor(MAX_INTERVAL / 1000)}
                        stepSize={1}
                        // only display start & end labels
                        labelStepSize={Math.floor((MAX_INTERVAL - MIN_INTERVAL) / 1000)}
                        onChange={this.setUpdateInterval_seconds}
                        value={updateInterval_seconds}
                />
                </div>
            </Popover>
        )

        // rendering controls here
        const controls = (
            <Callout>
                Last updated : &nbsp;
                {lastUpdated ? <span className="code-text">{lastUpdated.toString()}</span> : '(never updated)'}
                <div align="right">
                    <ButtonGroup>
                        {intervalSwitcher}
                        <Button
                            icon={autoUpdateEnabled ? "automatic-updates" : null}
                            intent={autoUpdateEnabled ? Intent.SUCCESS : Intent.DANGER}
                            onClick={this.toggleAutoUpdate}>
                            Automatic update {autoUpdateEnabled ? 'enabled' : 'disabled'}
                        </Button>
                        <Button
                            loading={loading}
                            icon="refresh"
                            intent={Intent.PRIMARY}
                            onClick={this.triggerUpdate}>
                            Update
                        </Button>
                    </ButtonGroup>
                </div>
            </Callout>
        )


        return (
            // wrapping in a div to prevent overflows
            // from breaking the navbar
            <>
                {controls}
                <div style={{ overflowX : 'auto' }}>
                    <ScoreboardRenderer problems={problems} mode={mode} result={result} />
                </div>
            </>
        )
    }
}

const mapStateToProps = ({ contest: { problems, mode } }, props) => Object.assign({}, { problems, mode }, props);

export default connect(mapStateToProps)(Scoreboard);
