import React from 'react';
import './App.css';
import TutorialsListComponent from "./pages/tutorialsList/tutorialsList.page";
import {Route, Switch} from 'react-router-dom';
import Dashboard from "./pages/dashboard/dashboard.page";
import {instanceOf} from 'prop-types';
import {Cookies, withCookies} from 'react-cookie';
import axios from "axios";

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
            <div className='App'>
                <Switch>
                    <Route exact path='/' component={TutorialsListComponent}/>
                    <Route path='/dashboard' component={Dashboard}/>
                </Switch>
            </div>

        )
    };
}


export default withCookies(App);
