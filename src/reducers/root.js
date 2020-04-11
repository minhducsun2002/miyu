import { updateContestMetadata, updateUserState } from './contest';
import { setToaster } from './internal/toaster';

import language from '../lib/language.json';
import MonacoLanguage from '../lib/language-monaco.json';
import { Prism as PrismLanguage, PrismTheme } from '../lib/code-view/';

const initialState = {
    user: {
        // user information
        loggedIn: false,
        username: null,
        id: null,
        isAdmin: false
    },
    contest: {
        // contest information
        name : 'defaultContestName',
        time : {
            start: new Date(),
            end: new Date()
        },
        problems: [],
        ext: [],
        // list of allowed languages, in source file extensions
        // example: ['.CPP']
        mode: 'OI',
        // contest allows registration?
        allowEveryoneReg: false
    },
    presets: {
        // overrideable configurations, like language mappings

        language,
        // human-friendly names mapped from source file extensions
        editor : {
        // modes mapping for editor components to support syntax highlighting
        // (and possibly other features)
            monaco: MonacoLanguage
            // language modes mapping for Monaco
        },
        codeView : {
        // modes mapping for rendering components to support syntax highlighting
            "react-syntax-highlighter" : {
            // language modes mapping for `react-syntax-highlighter`
                prism : {
                    language: PrismLanguage,
                    theme: PrismTheme
                }
                // mapping for Prism.js version
            }
        }
    },
    internal: {
        // toaster component
        toaster: {}
    }
}

export { initialState };
export default (state = initialState, action) => {
    // merging reducers manually
    const reducers = [updateContestMetadata, updateUserState, setToaster];
    return reducers.reduce((state, nextReducers) => nextReducers(state, action), state);
}
