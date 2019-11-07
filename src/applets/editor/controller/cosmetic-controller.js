import React from 'react';
import { Button, Intent } from '@blueprintjs/core';

// toggle light/dark
export default ({ dark, onChangeTheme }) => (
    <Button
        intent={dark ? Intent.PRIMARY : Intent.SUCCESS}
        style={{ height: '100%' }}
        rightIcon={dark ? 'moon' : 'lightbulb'}
        onClick={() => onChangeTheme(!dark)}>
        {dark ? 'Dark' : 'Light'}
    </Button>
)
