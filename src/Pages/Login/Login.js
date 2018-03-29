import React from 'react';
import LoginMain from '../../Components/LoginMain/LoginMain';
import LoginForm from '../../Components/LoginForm/LoginForm';
import { Tabs } from 'antd';
import './Login.less';

//
const TabPane = Tabs.TabPane;

//
export default class Login extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
				<LoginMain>
                    <Tabs defaultActiveKey="account" className="loginTabStyle">
                        <TabPane tab="账号登录" key="account">
                            <LoginForm></LoginForm>
                            <div className="loginFooterStyle">
                                CloudAC ©2017 Created by DoubleCom
                            </div>
                        </TabPane>
                        <TabPane tab="微信登录" key="wx" className="qrCodeWrapper">
                        </TabPane>
                    </Tabs>
                </LoginMain>
            </div>
        );
    }
}