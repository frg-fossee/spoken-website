import React from 'react';
import './App.css';
import AllottedTutorialsList from "./components/allotedTutorialsList/allottedTutorialsList.component";
import {Breadcrumb, Divider, Typography} from "antd";
import ProcessedTutorials from "./components/processesTutorialsList/processTutorialsList.component";
const {Title} = Typography
function App() {
    return (
        <div className='App'>
            <Breadcrumb>
                <Breadcrumb.Item> <a href="/">Home</a></Breadcrumb.Item>
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
