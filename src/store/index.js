import { createStore }  from 'redux';
import rootReducer from '../reducers/root';

// initial root store
export default createStore(
    rootReducer,
    typeof window !== 'undefined'
    && process.env.NODE_ENV === 'development'
    && window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
