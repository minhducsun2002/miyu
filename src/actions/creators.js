import { Contest } from './constants';

const updateContest = (contestMetadata) => ({ type: Contest.UPDATE_CONTEST, contestMetadata })
const updateUserState = (user) => ({ type: Contest.UPDATE_USER, user })


export { updateContest, updateUserState }
