import React from 'react';
import './Login.less';
import { Button } from 'antd';

//
export default class Login extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="title">
				Login
				<Button type="primary">primary</Button>
            </div>
        );
    }
}