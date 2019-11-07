import React from 'react';
import { Button } from '@blueprintjs/core';

// toggle light/dark
export default ({ dark, onChangeTheme }) => (
    <Button
        style={{ height: '100%' }}
        rightIcon={dark ? 'moon' : 'lightbulb'}
        onClick={() => onChangeTheme(!dark)}>
        {dark ? 'Dark' : 'Light'}
    </Button>
)
