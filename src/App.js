import React from 'react';
import {
    BrowserRouter as Router,
    Route,
    Switch
} from 'react-router-dom';
import './App.less';
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
                <div className="AppFontFamily">
                    <Switch>
                        <Route exact path="/" component={Login} />
                    </Switch>
                </div>
           </Router>
        );
    }
}