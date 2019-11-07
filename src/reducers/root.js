import { updateContestMetadata, updateUserState } from './contest';
import language from '../lib/language.json';
import MonacoLanguage from '../lib/language-monaco.json';

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
        ext: [],
        mode: 'OI'
    },
    presets: {
        language,
        editor : {
            monaco: MonacoLanguage
        }
    }
    // overrideable language
}

export { initialState };
export default (state = initialState, action) => {
    // merging reducers manually
    const reducers = [updateContestMetadata, updateUserState];
    return reducers.reduce((state, nextReducers) => nextReducers(state, action), state);
}
