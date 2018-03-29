import React from 'react';
import { Form, Input, Icon, Button } from 'antd';
import { withRouter } from 'react-router';

// const 
const FormItem = Form.Item;

//
class LoginForm extends React.Component {
    //
    constructor(props) {
        super(props);
        this.state = {
            validate: {
                account: {
                    status: '',
                    help: '',
                },
                pwd: {
                    status: '',
                    help: '',
                }
            },
            current: {
                account: 0,
                password: ''
            },
            isShowCaptcha: false,
            captchaUrl: "https://weiquaninfo.cn/captcha",
            isLoginLoading: false,
        }
    }

    // 点击登录
    onLogin() {
        this.onAccountBlur();
        this.onPwdBlur();
        let { password } = this.state.current;
        if (this.state.validate.account.status == "error" ||
            this.state.validate.pwd.status == "error") {
            return;
        } else if (password == "123456") {
            this.setState({ isShowCaptcha: true });
        } else {
            this.setState({ isShowCaptcha: false, isLoginLoading: true });
            setTimeout(() => {
                this.props.history.push('/index');
                this.setState({ isLoginLoading: false });
            }, 500)

        }
    }

    // 验证account
    onAccountBlur() {
        // 前端验证account格式
        let { account } = this.state.current;
        let regex = /^1\d{10}$/;
        if (!regex.test(account)) {
            let validate = this.state.validate;
            validate.account.status = 'error';
            validate.account.help = '请输入正确的帐号名（11位手机号）';
            this.setState({ validate: validate });
            return;
        }
    }
    onAccountFocus() {
        let validate = this.state.validate;
        validate.account.status = '';
        validate.account.help = '';
        this.setState({ validate: validate });
    }
    onAccountChange(e) {
        let current = this.state.current;
        current.account = e.target.value;
        this.setState({ current: current });
    }
    // 验证pwd
    onPwdBlur() {
        // 前端验证pwd格式
        let { password } = this.state.current;
        let regex = /^[a-zA-Z0-9_]{6,18}$/;
        if (!regex.test(password)) {
            let validate = this.state.validate;
            validate.pwd.status = 'error';
            validate.pwd.help = '请输入正确的密码(6-18位，字母、数字和下划线组成)';
            this.setState({ validate: validate });
            return;
        }
    }
    onPwdFocus() {
        let validate = this.state.validate;
        validate.pwd.status = '';
        validate.pwd.help = '';
        this.setState({ validate: validate });
    }
    onPwdChange(e) {
        let current = this.state.current;
        current.password = e.target.value;
        this.setState({ current: current });
    }

    // 忘记密码
    onForgetPwd(e) {
        e.preventDefault();
        this.props.onForgetPwd();
    }

    // 更新图形验证码
    onChangeCaptcha(e) {
        e.preventDefault();
        let url = this.state.captchaUrl + '?time=' + Math.random();
        this.setState({ captchaUrl: url });
    }

    //
    render() {
        // 
        return (
            <div>
                <Form>
                    <FormItem
                        validateStatus={this.state.validate.account.status}
                        help={this.state.validate.account.help}
                    >
                        <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} 
                            placeholder="请输入用户名(手机号)"
                            size="large"
                            onBlur={this.onAccountBlur.bind(this)}
                            onChange={this.onAccountChange.bind(this)}
                            onFocus={this.onAccountFocus.bind(this)}
                        />
                    </FormItem>
                    <FormItem
                        validateStatus={this.state.validate.pwd.status}
                        help={this.state.validate.pwd.help}
                    >
                        <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} 
                            placeholder="请输入密码"
                            size="large"
                            onBlur={this.onPwdBlur.bind(this)}
                            onChange={this.onPwdChange.bind(this)}
                            onFocus={this.onPwdFocus.bind(this)}
                            type="password"
                        />
                    </FormItem>
                    {
                        (this.state.isShowCaptcha)?
                        <div>
                            <Input placeholder="请输入下图中的验证码" size="large"/>
                            <div style={{width: '100%', height: 60, marginBottom: 24, display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                                <div style={{width: 256}}>
                                    <img src={this.state.captchaUrl} style={{height: 60, width: 256}}/>
                                </div>
                                <div style={{flex: 1, display: 'flex', justifyContent: 'center'}}>
                                    <a onClick={this.onChangeCaptcha.bind(this)}>看不清,换一个</a>
                                </div>
                            </div>
                        </div>:
                        <div></div>
                    }
                    <FormItem>
                        <Button 
                            type="primary"
                            style={{width: '100%'}}
                            size="large"
                            onClick={this.onLogin.bind(this)}
                            loading={this.state.isLoginLoading}
                        >登录</Button>
                        <a href="javascript:;" 
                            onClick={this.onForgetPwd.bind(this)}
                            style={{float: 'right', color:"rgba(0, 0, 0, 0.25)"}}
                        >忘记密码</a>
                </FormItem>
                </Form>
            </div>
        );
    }
}

export default withRouter(LoginForm);