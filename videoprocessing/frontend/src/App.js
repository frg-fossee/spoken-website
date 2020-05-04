import React from 'react';
import './App.css';
import AllottedTutorialsList from "./components/allotedTutorialsList/allottedTutorialsList.component";
import {Breadcrumb, Divider, Typography} from "antd";
import ProcessedTutorials from "./components/processesTutorialsList/processTutorialsList.component";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    useParams, Link
} from "react-router-dom";
const {Title} = Typography
function App() {
    return (
        <div className='App'>
            <Breadcrumb>
                <Breadcrumb.Item> <Link to="/today">Home</Link> </Breadcrumb.Item>
                <Breadcrumb.Item>
                    Tutorials List
                </Breadcrumb.Item>
            </Breadcrumb>
            <Divider />
            <Title level={2}> Processed Tutorials</Title>
            <Divider />
            <ProcessedTutorials/>
            <Divider />
            <Title level={2}> Allotted Tutorials</Title>
            <Divider />
            <AllottedTutorialsList/>
        </div>

    );
}

export default App;
