import { Contest, Internal } from './constants';

const updateContest = (contestMetadata) => ({ type: Contest.UPDATE_CONTEST, contestMetadata })
const updateUserState = (user) => ({ type: Contest.UPDATE_USER, user })
const assignToaster = (toaster) => ({ type: Internal.TOASTER_SET, toaster })


export { updateContest, updateUserState, assignToaster }
