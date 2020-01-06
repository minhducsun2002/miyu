import React from 'react';
import InfiniteScroller from 'react-infinite';
import { connect } from 'react-redux';
import { Intent, Button } from '@blueprintjs/core'

import { Route } from 'react-router-dom';

import subs from './api-subs';
import SubDetail from './details/index';
import SubCard from './card/index';
import Loading from './loading';
import Error from './error';

import SubmissionBaseRoute from './route';

class SubmissionsListing extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            result: [],
            lastUpdated: null,
            // server values
            size: 20,
            page: -1,
            // initially no load
            count: 0,
            updating: false,
            err: null
        }
    }

    update = () => {
        this.setState({ updating: true, err: null });
        const { size, page, count, result } = this.state;
        subs(count, page + 1, size).then(
            ({ data, page, size, count }) => this.setState({
                result: result.concat(data),
                lastUpdated: new Date(),
                page, size, count
            })
        ).catch(({ message }) => {
            this.props.toaster.show({
                message: <>Error fetching submissions : <span className="code-text">{message}</span></>,
                intent: Intent.DANGER
            });
            this.setState({ err: message })
        }).finally(() => this.setState({ updating: false }))
    }

    clearResult = () => this.setState({ result: [] })

    componentDidMount() {
        this.update();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.authed !== this.props.authed)
            this.update()
    }

    render() {
        const { result, updating, err } = this.state;
        const out = result.map((sub, i) => <SubCard key={`submission_card_${i}`} {...sub} />)
        const error = (
            <Error 
                action={
                    <Button
                        rightIcon='refresh'
                        onClick={() => {
                            this.clearResult();
                            // clear before reloading, or previous data (if any) will be displayed
                            this.update();
                        }}>
                        Reload
                    </Button>
                }
                description={<span className="code-text">{err}</span>}/>
        )
        return (
            <InfiniteScroller
                useWindowAsScrollContainer
                elementHeight={100}
                infiniteLoadBeginEdgeOffset={50}
                onInfiniteLoad={this.update}
                isInfiniteLoading={updating}
                loadingSpinnerDelegate={<Loading />}>
                {err ? error : out}
            </InfiniteScroller>
        )
    }
}

const mapStateToProps = ({ internal: { toaster }, user: { loggedIn } }, props) =>
    Object.assign({}, { toaster, authed: loggedIn }, props);

export default () => (
    <>
        <Route path={SubmissionBaseRoute} exact component={
            connect(mapStateToProps)(SubmissionsListing)
        } />
        <Route path={SubmissionBaseRoute + '/:id'} component={
            connect(mapStateToProps)(SubDetail)
        } />
    </>
)
