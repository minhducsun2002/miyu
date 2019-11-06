import React from 'react';
import { connect } from 'react-redux';

import Editor from './editor';
import Controller from './controller';

class Submit extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            currentExt: props.ext[0],
            currentProblem: props.problems[0],
            value: '',

            // theming
            darkTheme: false
        }
    }

    componentDidUpdate({ ext, problem }) {
        // reset all selections if data gets updated
        if ((this.props.ext !== ext) || (this.props.problem !== problem))
            this.setState({
                currentExt: this.props.ext[0],
                currentProblem: this.props.problems[0],
            })
    }

    render() {
        const { currentExt, currentProblem, value, darkTheme } = this.state;
        return (
            <>
                <Controller
                    onProblemChange={currentProblem => this.setState({ currentProblem })}
                    onExtChange={currentExt => this.setState({ currentExt })}
                    currentValues={{ ext: currentExt, problem: currentProblem }}
                    // no empty string submit
                    disableSubmit={!value}
                    getCode={() => value}
                    cosmetic={{
                        onChangeTheme : () => this.setState({ darkTheme: !darkTheme }),
                        dark : darkTheme
                    }}
                    />
                <Editor
                    ext={`${currentExt}`.substr(1).toLowerCase()}
                    value={value}
                    theme={darkTheme ? 'dark' : 'light'}
                    onChange={(value) => { this.setState({ value }) }}/>
            </>
        )
    }
}

const mapStateToProps = ({ contest: { ext, problems } }, props) => Object.assign({}, { ext, problems }, props)

export default connect(mapStateToProps)(Submit)
