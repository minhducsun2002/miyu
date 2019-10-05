import { Contest } from './constants';

function updateContest(contestMetadata) {
    return {
        type: Contest.UPDATE_CONTEST,
        contestMetadata
    }
}


export { updateContest }
