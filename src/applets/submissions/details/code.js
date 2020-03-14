import React, { useState } from 'react';
import { connect } from 'react-redux';
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import * as styles from 'react-syntax-highlighter/dist/esm/styles/prism';
import Select from 'react-select';

const languagePresetName = "react-syntax-highlighter"

const CodeViewer = ({ code, prismLang, prismTheme, ext = '' }) => {
    const [theme, setTheme] = useState("okaidia")
    const themeToRecord = s => ({ 
        value: s,
        label: <span className="code-text">{s}</span>
    });
    const themeMap = prismTheme.map(themeToRecord);
    return (
        <>
            <Select
                options={themeMap}
                onChange={({ value }) => setTheme(value)}
                value={themeToRecord(theme)}/>
            <SyntaxHighlighter
                style={styles[theme]}
                showLineNumbers
                // fallback case when no match
                language={prismLang[ext] || 'text'}>
                {code}
            </SyntaxHighlighter>
        </>
    )
}

const mapStateToProps = ({ presets : { codeView: { [languagePresetName] : { prism: { language, theme } } } } }, props) =>
    Object.assign({}, { prismLang: language, prismTheme: theme }, props)

export default connect(mapStateToProps)(CodeViewer)