import React from 'react';
import { connect } from 'react-redux';
import { Card, Popover, Tooltip, Tag, H4 } from '@blueprintjs/core';

import VerdictTags from './verdict-tag';

import toTime from '../../../lib/acm-timeparser';
import { friendlyVerdict, friendlyIcon, isPositive } from '../../../lib/verdict-parser';

import './index.css'

class Submission extends React.PureComponent {
    render() {
        let { date, ext, prob_id, score, status, tpen, user_id, username, mode, language, tests } = this.props;
        // ignore preceding dot
        ext = ext.toLowerCase().substr(1)
        // standardize verdict
        let _status = status; status = status.toLowerCase()

        // tooltip displayed when hover on username
        const userTooltipCard = <>Internal ID: <span className="code-text">{user_id}</span></>
        // tooltip displayed when hover on language
        const languageTooltipCard = <>Source file extension : <span className="code-text">.{ext}</span></>
        // tooltip displayed when hover on timestamp
        const timestampTooltipCard = <><span className="code-text">{new Date(date).toString()}</span></>

        // verdict tags
        const verdicts = tests
            // no tests if OI
            ? <VerdictTags tests={tests}/>
            : (
                <Tag
                    round
                    large
                    className={`verdict-tag-${status}`}
                    icon={friendlyIcon(status)}>
                        {friendlyVerdict(_status)}
                </Tag>
            )

        return (
            <Card interactive className={`sub-card-${isPositive(status) ? 'positive' : 'negative'}`}>
                <div style={{ display: 'flex' }}>
                    <H4
                        className="code-text"
                        style={{
                            flexGrow: 1,
                            display: 'inline-block',
                            marginTop: 'auto',
                            marginBottom: 'auto'
                        }}>
                        {mode.toLowerCase() === 'oi'
                            ? `Score : ${Number(score).toFixed(2)}`
                            : `Time : +${toTime(tpen)}`}
                    </H4>
                    {verdicts}
                </div>
                <br />
                <Tag large icon="application" minimal>{prob_id}</Tag>
                &nbsp;
                <Popover>
                    {/* bottom position to prevent overlaps with navbar at top */}
                    <Tooltip content={languageTooltipCard} position="bottom">
                        <Tag large icon="code" minimal>{language[ext]}</Tag>
                    </Tooltip>
                </Popover>
                &nbsp;
                <Popover>
                    <Tooltip content={userTooltipCard} position="bottom">
                        <Tag large icon="user" minimal>
                            <span className="code-text">{username}</span>
                        </Tag>
                    </Tooltip>
                </Popover>
                &nbsp;
                <Popover>
                    <Tooltip content={timestampTooltipCard} position="bottom">
                        <Tag large icon="time" minimal>{new Date(date).toLocaleString()}</Tag>
                    </Tooltip>
                </Popover>
            </Card>
        )
    }
}


const mapStateToProps = ({ contest: { mode }, presets: { language } }, props) => Object.assign({}, { mode, language }, props);

export default connect(mapStateToProps)(Submission)
