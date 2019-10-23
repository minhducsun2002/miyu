import { updateContestMetadata, updateUserState } from './contest';
import language from '../lib/language.json';

const initialState = {
    user: {
        loggedIn: false,
        username: null,
        id: null,
        isAdmin: false
    },
    contest: {
        name : 'defaultContestName',
        time : {
            start: new Date(),
            end: new Date()
        },
        problems: [],
        ext: [null],
        mode: 'OI'
    },
    presets: { language }
    // overrideable language
}

export { initialState };
export default (state = initialState, action) => {
    // merging reducers manually
    const reducers = [updateContestMetadata, updateUserState];
    return reducers.reduce((state, nextReducers) => nextReducers(state, action), state);
}
