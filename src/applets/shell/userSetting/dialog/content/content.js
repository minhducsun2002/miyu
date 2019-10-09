import React from 'react';
import { Tab,Tabs } from '@blueprintjs/core';

import ChangePassword from './changePassword';

export default class extends React.PureComponent {
    render() {
        return (
            <div style={{ margin: 5 }}>
                <Tabs selectedTabId="change-pwd" vertical>
                    <Tab id="change-pwd" title="Change password" panel={<ChangePassword />} />
                </Tabs>
            </div>
        )
    }
}
