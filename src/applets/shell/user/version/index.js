import React from 'react';
import { Dialog, Callout, Intent, NonIdealState } from '@blueprintjs/core'
const { VERSION, VERSION_DELIMITER, APP_NAME, GIT_URL, LICENSE, AUTHOR_NAME, AUTHOR_URL, BUILD_TIMESTAMP } = process.env;
let prod = process.env.NODE_ENV === 'production';

export default (p) => (
    <Dialog
        usePortal
        lazy
        title="About"
        {...p}>
        <div style={{ margin: 5 }}>
            <Callout intent={prod ? Intent.SUCCESS : Intent.WARNING}>
                You are running a {prod ? 'production' : 'development'} build.
            </Callout>
            <NonIdealState
                icon="info-sign"
                title={<><b>{APP_NAME}</b> {VERSION_DELIMITER}{VERSION}</>}
                description={<>by <b><a href={AUTHOR_URL}>{AUTHOR_NAME}</a></b></>}>
                <div>
                    Source code <a href={GIT_URL}>here</a>. {LICENSE} license.
                    <br />
                    This build was made at &nbsp;
                    <span className="code-text red">
                        {new Date(BUILD_TIMESTAMP).toLocaleString('en-US')}
                    </span>.
                </div>
            </NonIdealState>
        </div>
    </Dialog>
)