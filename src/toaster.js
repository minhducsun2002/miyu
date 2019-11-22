import { Toaster } from '@blueprintjs/core';

const MAX_TOASTS = 3; // 3 toasts is too enough
const TIMEOUT = 3000; // 3 secs

export default () => Toaster.create({ maxToasts: MAX_TOASTS, className: 'toast-container', timeout: TIMEOUT })
