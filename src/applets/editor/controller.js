import React from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';

// wrap
const wrapInFlexContainer = (elements) => (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
        {elements.map((element, key) => <p key={`flex_element_${key}`} style={{ flexGrow: 1 }}>{element}</p>)}
    </div>
)

const out = ({ ext, problems, onProblemChange, onExtChange, currentValues, language }) => {
    const extToRecord = (ext = '') => ({
        // take care of cases where `ext` is undefined or not a string
        value: ext,
        label: (
            <>
                {language[ext.substr(1).toLowerCase()] + ' '}
                (<span className="code-text">{ext.toLowerCase()}</span>)
            </>
        )
    });
    const probToRecord = prob => ({
        value: prob,
        label: prob
    });

    return wrapInFlexContainer([
        <Select
            options={problems.map(probToRecord)}
            onChange={({ value }) => onProblemChange(value)}
            value={probToRecord(currentValues.problem)}
            />,
        <Select
            options={ext.map(extToRecord)}
            onChange={({ value }) => onExtChange(value)}
            value={extToRecord(currentValues.ext)} />
    ])
}

const mapStateToProps = ({ contest: { ext, problems }, presets: { language } }, props) =>
    Object.assign({}, { ext, problems, language }, props)

export default connect(mapStateToProps)(out)
