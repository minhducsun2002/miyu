import React from 'react';
import { connect } from 'react-redux';
import scores from './api-scores';
import { Card, Elevation, Button, Navbar, ButtonGroup } from '@blueprintjs/core'

import ScoreboardRenderer from './render';

class Scoreboard extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            result: [],
            lastUpdated: null,
            loading: false,
            autoUpdateEnabled: true,    // toggling automatic update
            updateInterval: 1000  // miliseconds
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

    render() {
        const { problems, mode } = this.props;
        const { result, lastUpdated, autoUpdateEnabled } = this.state;

        // rendering controls here
        const controls = (
            <Card>
                Last updated : &nbsp;
                {lastUpdated ? <span className="code-text">{lastUpdated.toString()}</span> : '(never updated)'}
                <div align="right">
                    <ButtonGroup>
                        <Button onClick={this.toggleAutoUpdate}>
                            Update {autoUpdateEnabled ? 'enabled' : 'disabled'}
                        </Button>
                        <Button onClick={this.triggerUpdate}>
                            Update
                        </Button>
                    </ButtonGroup>
                </div>
            </Card>
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
