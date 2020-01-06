import { Internal } from '../../actions/constants';
import { initialState } from '../root';

const setToaster = (state = initialState, action) => {
    switch (action.type) {
        case Internal.TOASTER_SET:
            return Object.assign({}, state, {
                internal: {
                    ...state.internal,
                    toaster: action.toaster
                }
            })
        default: return state
    }
}

export { setToaster };
