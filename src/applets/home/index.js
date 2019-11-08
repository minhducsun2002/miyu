import React from 'react';
import { connect } from 'react-redux';
import MarkdownRenderer from 'react-markdown';
import { Card } from '@blueprintjs/core';

import generate from './contest-markdown-generator';

class Home extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            code : null
        }
    }

    // placeholder state
    // TODO : customizable homepage

    render() {
        const { code } = this.state;
        return (
            <Card>
                <MarkdownRenderer
                    linkTarget={'_blank'} /* should open in new tab */
                    source={code || generate(this.props.contest, this.props.language)} />
            </Card>
        )
    }
}

const mapStateToProps = ({ contest, presets : { language } }, props) => Object.assign({}, { contest, language }, props);

export default connect(mapStateToProps)(Home)
