import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ClockRenderer from './renderer';

class Clock extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = { current : new Date() };
    }
    componentDidMount() {
        // setInterval to update
        this.interval = setInterval(() => this.setState({ current : new Date() }), 1000);
    }
    componentWillUnmount() {
        // and clear it when component is no longer available
        clearInterval(this.interval);
    }
    render() {
        const { current } = this.state
        return <ClockRenderer {...this.props} current={current} />
    }

    static propTypes = {
        start : PropTypes.instanceOf(Date).isRequired,
        end : PropTypes.instanceOf(Date).isRequired
    }
}

const mapStateToProps = (state, props) => Object.assign({}, state.contest.time, props);

export default connect(mapStateToProps)(Clock)
