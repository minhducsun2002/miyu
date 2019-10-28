import React from 'react';
import InfiniteScroller from 'react-infinite';

import { Route } from 'react-router-dom';

import subs from './api-subs';
import SubDetail from './details/index';
import SubCard from './card/index';
import Loading from './loading';

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
            updating: false
        }
    }

    update = () => {
        this.setState({ updating: true });
        const { size, page, count, result } = this.state;
        subs(count, page + 1, size).then(
            ({ data, page, size, count }) => this.setState({
                 result: result.concat(data),
                 lastUpdated: new Date(),
                 page, size, count,
                 updating: false
            })
        )
    }

    componentDidMount() {
        this.update();
    }

    render() {
        const { result, updating } = this.state;
        return (
            <InfiniteScroller
                useWindowAsScrollContainer
                elementHeight={100}
                infiniteLoadBeginEdgeOffset={50}
                onInfiniteLoad={this.update}
                isInfiniteLoading={updating}
                loadingSpinnerDelegate={<Loading />}>
                {result.map(
                    (sub, i) => <SubCard key={`submission_card_${i}`} {...sub} />
                )}
            </InfiniteScroller>
        )
    }
}

const Submissions = () => (
    <>
        <Route path={SubmissionBaseRoute} exact component={SubmissionsListing} />
        <Route path={SubmissionBaseRoute + '/:id'} component={SubDetail} />
    </>
)

export default Submissions
