import React from 'react';
import PropTypes from 'prop-types';
import './LoginMain.less';
import imgUrl from '../../../assets/images/login.jpg';

//
export default class LoginMain extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="LoginMainStyle" style={styles.root}>
            	<div className="title">
                    <span style={{lineHeight: '38px'}}>Double</span>
                    <span style={{color:'#E43F41', lineHeight: '38px'}}>Com</span>
                    <span style={{margin: '0px 10px', lineHeight: '38px'}}>|</span>
                    <span style={{fontSize: 26}}>云AC管理平台</span>
                </div>
            	<div className="contentWrapper">
                    <div className="content">
                        {this.props.children}
                    </div>   
                </div>
            </div>
        );
    }
}

// 
LoginMain.propTypes = {
    children: PropTypes.element,
};

// style
const styles = {
    root: {
        backgroundImage: 'url(' + imgUrl + ')',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 100%',
    },
}