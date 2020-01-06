import React from 'react';
import { Card, H4, Tag, Tabs, Tab, Button } from '@blueprintjs/core';
import { connect } from 'react-redux';

import { friendlyVerdict, friendlyIcon } from '../../../lib/verdict-parser';
import toTime from '../../../lib/acm-timeparser';
import { subsId as sub, subsIdSource as subSource } from '../api-subs';

import './index.css'

import Loading from '../loading';
import CodeBlock from './code';
import Result from './result';
import Error from '../error';

class SubmissionDetails extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            code: null,
            data: null,
            isLoading: true,
            err: null
        }
    }

    componentDidMount() {
        this.update()
    }

    update = () => {
        const { match: { params: { id } } } = this.props;

        this.setState({ isLoading: true })
        // load sub data & sub source code simultaneously
        Promise.all([
            sub(id).then(data => this.setState({ data })),
            subSource(id).then(code => this.setState({ code }))
        ])
        .catch(({ message }) => this.setState({ err: message }))
        .finally(() => this.setState({ isLoading: false }))
    }

    render() {
        const { isLoading, code, err } = this.state;
        if (isLoading) return <Loading />

        if (err) return (
            <Error 
                action={
                    <Button
                        rightIcon='refresh'
                        onClick={this.update}>
                        Reload
                    </Button>
                }
                description={<span className="code-text">{err}</span>}/>
        )

        const { match: { params: { id } }, mode, language } = this.props;

        let { status, score, prob_id, ext, username, date, tpen, tests } = this.state.data;
        ext = ext.toLowerCase().substr(1);

        const OIPanel = (
            <Tabs
                defaultSelectedTabId={tests ? "tests" : (code ? 'code' : '')}
                vertical
                renderActiveTabPanelOnly
                id="submission_oi_panel">
                <Tab
                    disabled={!tests}
                    panel={<Result tests={tests} />}
                    id="tests"
                    title="Tests" />
                <Tab
                    disabled={!code}
                    panel={<CodeBlock code={code} ext={ext} />}
                    id="code"
                    title="Source code"/>
            </Tabs>
        )

        const ACMPanel = code ? <CodeBlock code={code} /> : 'No source code'

        const panel = mode.toLowerCase() === 'oi' ? OIPanel : ACMPanel;

        return (
            <>
                <Card>
                    <div style={{ display: 'flex' }}>
                        <H4 style={{ flexGrow: 1, marginTop: 'auto', marginBottom: 'auto' }}>
                                Submissions <span className="code-text text-red">{id}</span>
                        </H4>
                        <Tag
                            round
                            large
                            className={`verdict-tag-${status.toLowerCase()}`}
                            icon={friendlyIcon(status)}>
                                {friendlyVerdict(status)}
                        </Tag>
                    </div>
                    &nbsp;
                    <div style={{ display: 'flex' }}>
                        <Tag large minimal icon="application">
                            Problem : <span className="code-text">{prob_id}</span>
                        </Tag>
                        &nbsp;
                        <Tag large minimal icon="code">
                            Language : {language[ext]} (<span className="code-text">.{ext}</span>)
                        </Tag>
                        &nbsp;
                        <Tag large minimal icon="user">
                            Contestant : <span className="code-text">{username}</span>
                        </Tag>
                        &nbsp;
                        <Tag large minimal icon="time">{new Date(date).toLocaleString()}</Tag>
                        <span style={{ flexGrow: 1 }} />
                        <H4 style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                            {mode.toLowerCase() === 'oi'
                                ? `Score : ${Number(score).toFixed(2)}`
                                : `Time : +${toTime(tpen)}`}
                        </H4>
                    </div>
                </Card>
                {panel}
            </>
        )
    }
}

const mapStateToProps = ({ contest: { mode }, presets: { language } }, props) => Object.assign({}, { mode, language }, props);
export default connect(mapStateToProps)(SubmissionDetails)
