import React from 'react';
import { Spinner, NonIdealState } from '@blueprintjs/core'
export default () => (
    <NonIdealState
        description="Preparing editor. Please wait..."
        icon={<Spinner />} title="Loading..." />
)
