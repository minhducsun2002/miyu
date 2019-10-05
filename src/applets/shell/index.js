import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Navbar, Alignment } from '@blueprintjs/core';

import Clock from './clock/clock';

class Shell extends React.PureComponent {
    render() {
        const { contestName } = this.props;
        return (
            <Navbar>
                <Navbar.Group align={Alignment.LEFT}>
                    <Navbar.Heading>{contestName}</Navbar.Heading>
                    <Navbar.Divider />
                    <Clock />
                </Navbar.Group>
            </Navbar>
        )
    }

    static propTypes = {
        contestName: PropTypes.string.isRequired
    }

    static defaultProps = {
        contestName : 'Mock contest'
    }
}

const mapStateToProps = (state, props) => Object.assign({}, { contestName : state.contest.name }, props)

export default connect(mapStateToProps)(Shell);
