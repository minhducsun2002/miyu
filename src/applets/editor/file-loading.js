import React from 'react';
import { Spinner, NonIdealState } from '@blueprintjs/core'
export default () => <NonIdealState icon={<Spinner />} title="Reading your file..." />
