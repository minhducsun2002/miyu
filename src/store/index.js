import { createStore }  from 'redux';
import rootReducer from '../reducers/root';

// initial root store
export default createStore(rootReducer);
