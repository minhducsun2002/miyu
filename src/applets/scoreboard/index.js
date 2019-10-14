import React from 'react';
import { connect } from 'react-redux';
import scores from './api-scores';

import ScoreboardRenderer from './render';

class Scoreboard extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            result: []
        }
    }

    componentDidMount() {
        scores().then(result => this.setState({ result }));
    }

    render() {
        const { problems, mode } = this.props;
        const { result } = this.state;
        return <ScoreboardRenderer problems={problems} mode={mode} result={result} />
    }
}

const mapStateToProps = ({ contest: { problems, mode } }, props) => Object.assign({}, { problems, mode }, props);

export default connect(mapStateToProps)(Scoreboard);
