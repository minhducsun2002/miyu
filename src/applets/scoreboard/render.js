import React from 'react';
import { HTMLTable } from '@blueprintjs/core';

const toTime = (minute) => {
    let hr = Math.floor(Number(minute) / 60), min = Number(minute) % 60;
    return `${hr < 10 ? '0' + hr : hr}:${min < 10 ? '0' + min : min}`;
}

export default class extends React.PureComponent {
    render() {
        let { mode, result, problems } = this.props;
        mode = mode.toLowerCase()
        const initialStrings = [
            'Name',
            (mode === 'oi' ? 'Score' : 'Penalty'),
            (mode === 'oi' ? 'AC' : 'Subs count')
        ]

        // render main table here
        const out = result.map(({ name, aced, score, result }, index) => {
            const records = problems.map(entries => {
                let score = result[entries];
                return (
                    <td
                        align='center'
                        key={`row_${index}_${entries}`}
                        style={{ whiteSpace: 'pre' }}>
                        {mode === 'oi'
                        ? (score.pri ? Number(score.pri).toFixed(2) : '')
                        : (!score.sec
                            ? ''
                            : <>
                                <div style={{ fontWeight: 'bold' }}>
                                    {`${score.sec}\n`}
                                </div>
                                <span style={{ fontSize: 'smaller' }}>
                                    {`+${toTime(score.pri)}`}
                                </span>
                            </>)}
                    </td>
                )
            })
            return (
                <tr key={`row_${index}`}>
                    <td style={{ textAlign: 'center' }} className="code-text">{name}</td>
                    <td style={{ textAlign: 'center' }}>
                        {mode === 'acm' ? `+${toTime(score)}` : Number(score).toFixed(2)}
                    </td>
                    <td style={{ textAlign: 'center' }}>{aced}</td>
                    {records}
                </tr>

            )
        })

        return (
            <HTMLTable bordered striped condensed style={{ width: '100%' }}>
                <thead style={{ textAlign: 'center' }}>
                    <tr>
                        {initialStrings.concat(this.props.problems).map((entries, index) => (
                            <th key={`head_${index}`} style={{ textAlign: 'center' }}>
                                {entries}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {out}
                </tbody>
            </HTMLTable>
        )
    }
}
