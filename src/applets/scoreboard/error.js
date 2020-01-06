import React from 'react';
import { NonIdealState } from '@blueprintjs/core'

// component to show when error occurs
export default ({ action, description, icon }) => (
    <div style={{ width: '100%', alignContent: 'center', marginTop: 5 }}>
        <NonIdealState action={action} description={description} icon={icon || 'error'} />
    </div>
)