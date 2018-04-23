import React from 'react';
import {
    BrowserRouter as Router,
    Route,
    Switch
} from 'react-router-dom';
import './App.less';
import Login from './Pages/Login/Login';
import HiYouWxAppMap from './Pages/HiYouWxAppMap/HiYouWxAppMap';

//
export default class App extends React.Component {
    constructor(props) {
        super(props);
    }

    //
    render() {
        return (
            <Router basename="/radar">
                <div className="AppFontFamily">
                    <Switch>
                        <Route exact path="/" component={HiYouWxAppMap} />
                        <Route path="/login" component={Login} />
                    </Switch>
                </div>
           </Router>
        );
    }
}