import React from 'react';
import { NonIdealState, Collapse, Pre, Button } from '@blueprintjs/core'

export default class extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = { err: null, errShown: false };
    }
    render() {
        let { err, errShown } = this.state;
        if (this.state.err)
            return (
                <NonIdealState
                    title={'Uh oh. Something bad happened.'}
                    icon="error"
                    description={'You may want to report this.'}
                    action={<Button text='Retry' onClick={() => this.setState({ err: null })} />}>
                    
                    <a href onClick={() => this.setState({ errShown: !errShown })}>
                        Click here to {errShown ? 'hide' : 'show'} error log.
                    </a>
                    <div style={{ maxWidth: '100%' }}>
                        <Collapse isOpen={errShown}>
                            <Pre style={{ overflowX: 'scroll', textAlign: 'left' }}>
                                {`${err.stack}`}
                            </Pre>
                        </Collapse>
                    </div>
                </NonIdealState>
            )
        else return this.props.children;
    }

    componentDidCatch(err) {
        this.setState({ err });
    }
}