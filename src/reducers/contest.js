import { Contest } from '../actions/constants';
import { initialState } from './root';

const updateContestMetadata = (state = initialState, action) => {
    switch (action.type) {
        case Contest.UPDATE_CONTEST:
            return Object.assign({}, state, {
                contest : action.contestMetadata
            })
        default: return state
    }
}

export { updateContestMetadata };
