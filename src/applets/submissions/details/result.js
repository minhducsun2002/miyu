import React from 'react';
import { HTMLTable } from '@blueprintjs/core';

import { friendlyVerdict } from '../../../lib/verdict-parser';

// render tests
export default ({ tests }) => (
    <HTMLTable bordered striped condensed style={{ width: '100%', flexGrow: 1 }}>
        <thead style={{ textAlign: 'center' }}>
            <tr>
                <th style={{ textAlign: 'center' }}>Verdict</th>
                <th style={{ textAlign: 'center' }}>Execution time</th>
                <th style={{ textAlign: 'center' }}>Score</th>
            </tr>
        </thead>
        <tbody>
            {tests.map(({ score, time, verdict }, index) => (
                <tr key={`${score}_${verdict}_${time}_${index}`}>
                    <td>{friendlyVerdict(verdict)}</td>
                    <td style={{ textAlign: 'right' }}>{time}s</td>
                    <td style={{ textAlign: 'right' }}>{score}</td>
                </tr>
            ))}
        </tbody>
    </HTMLTable>
)
