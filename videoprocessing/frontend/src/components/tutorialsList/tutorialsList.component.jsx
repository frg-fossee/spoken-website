import React from "react";
import axios from 'axios'
import {Col, Row, Select, Table, Typography} from 'antd';

const {Option} = Select;
const {Text} = Typography
const columns = [
    {
        title: 'Tutorial Name',
        dataIndex: 'tutorial',
        key: 'tutorial',
    },
    {
        title: 'FOSS',
        dataIndex: 'foss',
        key: 'foss',
    },
    {
        title: 'Language',
        dataIndex: 'language',
        key: 'language',
    },
];

class TutorialsListComponent extends React.Component {
    constructor() {
        super();
        this.state = {
            tutorials: [],
            filteredTutorials: [],
            tutorialsInTable: [],
            isLoading: true,
            isTutDisabled: true
        }
        this.filterFosses = this.filterFosses.bind(this)
        this.filterTutorials = this.filterTutorials.bind(this)
        this.renderAllFosses = this.renderAllFosses.bind(this);

    }


    async filterFosses(value, option) {
        if (value === 'All'){
            let all = this.state.tutorials

            this.setState({filteredTutorials: all, isTutDisabled: false, tutorialsInTable: all})
        }
        let tuts = this.state.tutorials
        tuts = await tuts.filter((item) => {
            return item.foss === value
        })
        console.log(tuts)
        this.setState({filteredTutorials: tuts, isTutDisabled: false, tutorialsInTable: tuts})
    }

    async filterTutorials(value, option){
        let tuts = this.state.filteredTutorials
        tuts = await tuts.filter((item) => {
            return item.tutorial === value
        })
        console.log(tuts)
        this.setState({tutorialsInTable: tuts})
    }


    renderAllFosses() {
        let options = new Set()
        this.state.tutorials.map((item) => {
            options.add(<Option value={item.foss}>{item.foss}</Option>)
        })
        return options
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
                    this.setState({
                        tutorials: filtered_tuts,
                        isLoading: false,
                        filteredTutorials: filtered_tuts,
                        tutorialsInTable: filtered_tuts
                    })


                })
        })
    }

    render() {

        return (
            <div>

            <Row justify="start" gutter={[24, 8]}>
                <Col span={2} offset={6}> <Text>
                    FOSS
                </Text>
                </Col>
                <Col span={2}>
                    <Select onChange={this.filterFosses} defaultValue="All" style={{width: 120}}>
                        <Option value='All'>All</Option>
                        {
                            this.renderAllFosses()
                        }
                    </Select>
                </Col>
                <Col span={2}>
                    <Text>
                        Tutorial
                    </Text>
                </Col>
                <Col span={2}>
                    <Select allowClear disabled={this.state.isTutDisabled} defaultValue="All" style={{width: 120}} onChange={this.filterTutorials}>
                        <Option value='All'>All</Option>
                        {
                            this.state.filteredTutorials.map((item)=>{
                                return <Option value={item.tutorial}>{item.tutorial}</Option>
                            })

                        }
                    </Select>
                </Col>
            </Row>
        <Table dataSource={this.state.tutorialsInTable} columns={columns} />;
            </div>


    );
    }
}

export default TutorialsListComponent
