import React from 'react';
import { Tag } from '@blueprintjs/core';
import friendlyVerdict, { friendlyIcon } from '../../../lib/verdict-parser';

// calculating tag indicating tests verdict
export default ({ tests, id }) => {
    // checking for verdicts used
    let out = {}, original = {};
    tests.forEach(({ verdict }) => {
        let _verdict = verdict.toLowerCase();
        original[_verdict] = verdict;
        if (_verdict in out) out[_verdict]++;
            else out[_verdict] = 1;
    })

    return (
        <>
            {Object.keys(out).map((verdict, index) => (
                <React.Fragment key={`verdict_tag_${verdict}_${index}`}>
                    &nbsp;
                    <Tag
                        className={`verdict-tag-${verdict}`}
                        large
                        round
                        icon={friendlyIcon(verdict)}>
                        {friendlyVerdict(original[verdict])} ({out[verdict]}/{tests.length})
                    </Tag>
                </React.Fragment>
            ))}
        </>
    )
}
