import React from 'react';
import { Pre, NonIdealState } from '@blueprintjs/core';

export default ({ text }) => text
    ? <Pre>{text}</Pre>
    : <div>
        <NonIdealState icon="tick" title="No message." />
    </div>