import React from "react";
import axios from 'axios'
import {Col, Row, Select, Typography} from 'antd';

const {Option} = Select;
const {Text} = Typography

class TutorialsListComponent extends React.Component {
    constructor() {
        super();
        this.state = {
            tutorials: [],
            allFosses: [],
            allTutorials: [],
            allLanguages: [],
            isLoading: true
        }
    }

    componentDidMount() {
        let filtered_tuts = []
        let fosses = new Set()
        let tutorials = new Set()
        let langs = new Set()
        axios.get(`${process.env.REACT_APP_API_URL}/tutorials`)
            .then(res => {
                let data = res.data
                data.map((tutorial) => {
                    let tut_obj = {};
                    tut_obj.foss = tutorial.foss_category.name
                    tut_obj.tutorial = tutorial.tutorial_detail.tutorial
                    tut_obj.language = tutorial.language.name
                    tut_obj.isEdited = false
                    tut_obj.tutorial_id = tutorial.tutorial_detail.id
                    tut_obj.language_id = tutorial.language.id
                    filtered_tuts.push(tut_obj)
                    fosses.add(tut_obj.foss)
                    tutorials.add(tut_obj.tutorial)
                    langs.add(tut_obj.language)
                    return filtered_tuts
                    // this.setState({tutorials: existing_tut})
                })
            }).then(() => {
            axios.get(`${process.env.REACT_APP_API_URL}/process_tutorials`)
                .then(res => {
                    let data = res.data
                    data.map((tut) => {
                        console.log(tut)
                        for (let i = 0; i < filtered_tuts.length; i++) {
                            if (filtered_tuts[i].tutorial_id === tut.tutorial_detail && filtered_tuts[i].language_id === tut.language) {
                                filtered_tuts[i].isEdited = true
                            }
                        }
                    })

                })
                .then(() => {
                    this.setState({tutorials: filtered_tuts,
                        isLoading: false,
                        allTutorials: Array.from(tutorials),
                        allFosses: Array.from(fosses)
                        , allLanguages: Array.from(langs)})
                })
        })
    }

    render() {
        return (
            <Row justify="start" gutter={[24, 8]}>
                <Col span={2} offset={6}>
                    <Text>
                        FOSS
                    </Text>
                </Col>
                <Col span={2}>

                    <Select defaultValue="All" style={{width: 120}}>
                        <Option value='All'>All</Option>
                        {this.state.allFosses.map((foss)=>{
                            return <Option value={foss}>{foss}</Option>
                        })}

                    </Select>
                </Col>
                <Col span={2}>
                    <Text>
                        Tutorial
                    </Text>
                </Col>
                <Col span={2}>
                    <Select defaultValue="All" style={{width: 120}}>
                        <Option value='All'>All</Option>
                        {this.state.allTutorials.map((foss)=>{
                            return <Option value={foss}>{foss}</Option>
                        })}                    </Select>
                </Col>
                <Col span={2}>
                    <Text>
                        Language
                    </Text>
                </Col>
                <Col span={2}>

                    <Select defaultValue="All" style={{width: 120}}>
                        <Option value='All'>All</Option>
                        {this.state.allLanguages.map((foss)=>{
                            return <Option value={foss}>{foss}</Option>
                        })}                    </Select>
                </Col>


            </Row>

        );
    }
}

export default TutorialsListComponent
