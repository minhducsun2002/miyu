import React, { useState } from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import { Button, Intent } from '@blueprintjs/core';

import submit from './api-subs';
import CosmeticController from './cosmetic-controller';

// wrap
const wrapInFlexContainer = (elements = [], elementsWithoutFlexGrow = []) => (
    <div style={{ display: 'flex', flexDirection: 'row', margin: 0 }}>
        {elements.map(
            (element, key) => (
                <p
                    key={`flex_element_${key}`}
                    style={{ flexGrow: 1, margin: 0 }}>
                    {element}
                </p>
            )
        )}
        {elementsWithoutFlexGrow.map(
            (element, key) => (
                <p
                    key={`non_flex_element_${key}`}
                    style={{ margin: 0 }}>
                    {element}
                </p>
            )
        )}
    </div>
)

const SubmitInvoker = (props) => <Button {...props}>Submit</Button>;

const Controller = ({
    ext, problems, currentValues,
    onProblemChange, onExtChange,
    language,
    getCode,
    disableSubmit,
    cosmetic : { onChangeTheme = null, dark = false }
}) => {
    const [loading, setLoading] = useState(false);
    // initially, not loading

    const probToRecord = prob => ({ value: prob, label: prob });
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

    return wrapInFlexContainer([
        <Select
            options={problems.map(probToRecord)}
            onChange={({ value }) => onProblemChange(value)}
            value={probToRecord(currentValues.problem)}
            />,
        <Select
            options={ext.map(extToRecord)}
            onChange={({ value }) => onExtChange(value)}
            value={extToRecord(currentValues.ext)} />,
    ], [
        <CosmeticController
            onChangeTheme={onChangeTheme}
            dark={dark}/>,
        <SubmitInvoker
            style={{ height: '100%' }}
            rightIcon="small-tick"
            intent={Intent.SUCCESS}
            disabled={disableSubmit}
            loading={loading}
            onClick={() => {
                setLoading(true);
                submit(getCode(), `${currentValues.problem}.${currentValues.ext.substr(1).toLowerCase()}`)
                    .then(() => setLoading(false))
            }} />
    ])
}

const mapStateToProps = ({ contest: { ext, problems }, presets: { language } }, props) =>
    Object.assign({}, { ext, problems, language }, props)

export default connect(mapStateToProps)(Controller)
