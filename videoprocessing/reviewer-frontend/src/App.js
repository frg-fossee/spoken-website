import React from 'react';
import './App.css';
import {Route, Switch} from 'react-router-dom';
import TutorialsListComponent from "./components/tutorialsList/tutorialsList.component";
import DashboardComponent from "./components/dashboard.component";
import axios from 'axios'
import {Cookies, withCookies} from 'react-cookie';
import {instanceOf} from 'prop-types';

class App extends React.Component {
        static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };


    constructor(props) {
        super(props);

        const {cookies} = props;
        this.state = {
            csrftoken: cookies.get('csrftoken')
        };
        axios.defaults.headers.common['X-CSRFToken'] = this.state.csrftoken // for all requests

    }


      render() {
        return (
            <div>
                <Switch>
                    <Route exact path='/' component={TutorialsListComponent}/>
                    <Route path='/dashboard' component={DashboardComponent}/>
                </Switch>
            </div>

        );
    }


}

export default withCookies(App);
