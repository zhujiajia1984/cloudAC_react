import React from 'react';
import './Login.less';
import LoginMain from '../../Components/LoginMain/LoginMain'

//
export default class Login extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
				<LoginMain>
                    <span>abc</span>            
                </LoginMain>
            </div>
        );
    }
}