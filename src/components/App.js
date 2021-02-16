import React, {Component} from "react";
import {BrowserRouter as Router, Route, Redirect, Switch} from "react-router-dom";
import Login from './Login';
import Data from './Data';

class App extends Component {
    render() {
        return (
            <Router basename='/proj'>
                <div className="App">
                    <Switch>
                        {/*<Route exact path="/login" component={Login}/>*/}
                        <Route exact path="/data" component={Data}/>
                        <Redirect from="/" to="data"/>
                    </Switch>
                </div>
            </Router>
        );
    }
}

export default App;
