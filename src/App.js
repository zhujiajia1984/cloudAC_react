import React from 'react';
import {
    BrowserRouter as Router,
    Route,
    Switch
} from 'react-router-dom';
import Login from './Pages/Login/Login';

//
export default class App extends React.Component {
    constructor(props) {
        super(props);
    }

    //
    render() {
        return (
            <Router>
            	<Switch>
            		<Route exact path="/" component={Login} />
            	</Switch>
           </Router>
        );
    }
}