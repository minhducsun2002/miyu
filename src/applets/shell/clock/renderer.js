import React from 'react';
import PropTypes from 'prop-types';
import { Callout, Popover, Tooltip } from '@blueprintjs/core';

import timeAgo from './diff';

const Intent = {
    PRIMARY : 'primary',
    SUCCESS : 'success',
    WARNING : 'warning',
    DANGER : 'danger'
}

// change color based on contest time remaining
const progressiveIntent = (progress) => {
    if (progress <= 0) return Intent.PRIMARY;
    else
        if (0.5 <= progress)
            if (0.9 <= progress) return Intent.DANGER;
            else return Intent.WARNING;
        else return Intent.SUCCESS;
}

export default class extends React.PureComponent {
    render() {
        const { start, end, current } = this.props;
        const started = current > start, ended = current > end, progress = (current - start) / (end - start);
        return (
            <Popover>
                <Tooltip content={
                    <div>
                        {start.toLocaleString()} - {end.toLocaleString()}
                        <br />
                        {(progress > 0.5) && `${Math.floor(progress * 100)}% time passed`}
                    </div>
                }>
                    <Callout intent={progressiveIntent(progress)} icon={null}>
                        {ended
                            ? 'Contest ended'
                            : (started
                                ? `Time left : ${timeAgo(start, current)} / ${timeAgo(start, end)}`
                                : `Before contest : ${timeAgo(current, start)}`)}
                    </Callout>
                </Tooltip>
            </Popover>
        )
    }

    static propTypes = {
        start : PropTypes.instanceOf(Date).isRequired,
        end : PropTypes.instanceOf(Date).isRequired,
        current : PropTypes.instanceOf(Date).isRequired,
    }
}
