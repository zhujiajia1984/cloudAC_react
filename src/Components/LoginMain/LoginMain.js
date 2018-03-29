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
            	<div>LoginMain</div>
            	<div>{this.props.children}</div>
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