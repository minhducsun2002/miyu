import React from 'react';
import { Callout, Button, ButtonGroup, Slider, Intent, Popover } from '@blueprintjs/core'

import { MIN_INTERVAL, MAX_INTERVAL, STEP_INTERVAL } from './constants';
export default ({ updateEnabled, loading, interval, last, setIntervalSecs, toggleAuto, onUpdate }) => {
    const updateInterval_seconds = Math.floor(interval / 1000)

    const intervalSwitcher = (
        // first element is target,
        // second element is content

        <Popover position="bottom" disabled={!updateEnabled}>
            {/*
              * disable interval adjusting if disabled
              * position="bottom" to prevent overlapping with clock
              */}
            <Button disabled={!updateEnabled} icon='time' rightIcon="chevron-down">
                Update every : {updateInterval_seconds} seconds
            </Button>
            <div className="scoreboard-updateInterval-slider-container">
                <Slider
                    min={Math.floor(MIN_INTERVAL / 1000)}
                    max={Math.floor(MAX_INTERVAL / 1000)}
                    stepSize={Math.floor(STEP_INTERVAL / 1000)}
                    // only display start & end labels
                    labelStepSize={Math.floor((MAX_INTERVAL - MIN_INTERVAL) / 1000)}
                    onChange={setIntervalSecs}
                    value={updateInterval_seconds}
            />
            </div>
        </Popover>
    )

    return (
        <Callout>
            Last updated : &nbsp;
            {last ? <span className="code-text">{last.toString()}</span> : '(never updated)'}
            <div align="right">
                <ButtonGroup>
                    {intervalSwitcher}
                    <Button
                        icon={updateEnabled ? "automatic-updates" : null}
                        intent={updateEnabled ? Intent.SUCCESS : Intent.DANGER}
                        onClick={toggleAuto}>
                        Automatic update {updateEnabled ? 'enabled' : 'disabled'}
                    </Button>
                    <Button
                        loading={loading}
                        icon="refresh"
                        intent={Intent.PRIMARY}
                        onClick={onUpdate}>
                        Update
                        </Button>
                </ButtonGroup>
            </div>
        </Callout>
    )
}