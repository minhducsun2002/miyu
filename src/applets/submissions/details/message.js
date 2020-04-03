import React from 'react';
import { Pre } from '@blueprintjs/core';

export default ({ text }) => text ? <Pre>{text}</Pre> : <div>No global message.</div>