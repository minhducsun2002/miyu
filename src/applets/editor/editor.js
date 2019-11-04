import React from 'react';
import { connect } from 'react-redux';
import { ControlledEditor as Editor } from '@monaco-editor/react';

import { EDITOR_TOP_PADDING } from './constants';

const out = ({
    value, onChange,
    loadingPlaceholder = 'Preparing editor...',
    theme = 'light',
    options = {},
    ext,
    languageSet = {}
}) => (
    <Editor
        height={`calc(100vh - ${EDITOR_TOP_PADDING})`}
        options={options}
        theme={theme}
        value={value}
        onChange={(event, string) => onChange(string)}
        language={languageSet[ext] || ''}
        loading={loadingPlaceholder}/>
)

const mapStateToProps = ({ presets: { editor: { monaco } } }, props) => Object.assign({}, { languageSet: monaco }, props)

export default connect(mapStateToProps)(out)
