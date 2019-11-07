import React from 'react';
import { connect } from 'react-redux';
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter';
// TODO : customizable theme
import { vs } from 'react-syntax-highlighter/dist/esm/styles/prism';

const languagePresetName = "react-syntax-highlighter"

const CodeViewer = ({ code, prismMapping, ext = '' }) => (
    <SyntaxHighlighter
        style={vs}
        showLineNumbers
        // fallback case when no match
        language={prismMapping[ext] || 'text'}>
        {code}
    </SyntaxHighlighter>
)

const mapStateToProps = ({ presets : { codeView: { [languagePresetName] : { prism } } } }, props) =>
    Object.assign({}, { prismMapping: prism }, props)

export default connect(mapStateToProps)(CodeViewer)
