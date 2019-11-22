import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import './index.css';
import store from './store/index';

import Main from './main';
import Bootstrapper from './bootstrap';

require('@blueprintjs/core/lib/css/blueprint.css');
require('@blueprintjs/icons/lib/css/blueprint-icons.css');

const Miyu = () => <Bootstrapper><Main /></Bootstrapper>

render(
    <Provider store={store}>
        <Miyu />
    </Provider>,
    document.querySelector('#root')
)
