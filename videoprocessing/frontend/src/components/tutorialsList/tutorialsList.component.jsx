import React from "react";
import axios from 'axios'
import {Button, Col, Input, Popconfirm, Row, Select, Table, Typography} from 'antd';
import {EditOutlined, EyeOutlined, SearchOutlined} from '@ant-design/icons'

const {Option} = Select;
const {Text} = Typography

const columns = [
    {
        title: 'FOSS',
        dataIndex: 'foss',
        key: 'foss',
        sorter: (a, b) => a.foss.localeCompare(b.foss),
        sortDirections: ['descend', 'ascend']
    },
    {
        title: 'Tutorial Name',
        dataIndex: 'tutorial',
        key: 'tutorial',
        sorter: (a, b) => a.tutorial.localeCompare(b.tutorial),
        sortDirections: ['descend', 'ascend']
    },
    {
        title: 'Language',
        dataIndex: 'language',
        key: 'language',
        sorter: (a, b) => a.language.localeCompare(b.language),
        sortDirections: ['descend', 'ascend']
    }, {
        title: 'Edit Video',
        dataIndex: 'button',
        key: 'button',
    },
];

class TutorialsListComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tutorials: [],
            filteredTutorials: [],
            tutorialsInTable: [],
            searchFilteredTable: [],
            isLoading: true,
            isTutDisabled: true,
            fossDropdownOption: 'All',
            tutorialDropdownOption: 'All',
            searchBox: ''
        }
        this.filterFosses = this.filterFosses.bind(this)
        this.filterTutorials = this.filterTutorials.bind(this)
        this.renderOptions = this.renderOptions.bind(this);
        this.searchTable = this.searchTable.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(tut_id,lang_id){
        console.log(tut_id,lang_id)
        const data = new FormData();
        data.append('tutorial_detail', tut_id);
        data.append('language', lang_id);
        axios.post(`${process.env.REACT_APP_API_URL}/process_tutorials`,data)
            .then((res)=>{
                console.log(res.data)
            })
    }


    async filterFosses(value, option) {
        console.log(value)
        if (value === 'All') {
            let all = this.state.tutorials
            console.log(all)

            this.setState({
                fossDropdownOption: 'All',
                filteredTutorials: all,
                isTutDisabled: true,
                tutorialsInTable: all,
                tutorialDropdownOption: 'All'
            })
        } else {
            let tuts = this.state.tutorials
            tuts = await tuts.filter((item) => {
                return item.foss === value
            })
            console.log(tuts)
            this.setState({
                fossDropdownOption: value,
                filteredTutorials: tuts,
                isTutDisabled: false,
                tutorialsInTable: tuts
            })
        }
    }

    async filterTutorials(value, option) {
        if (value === 'All') {
            let tuts = this.state.filteredTutorials
            tuts = await tuts.filter((item) => {
                return item.foss === this.state.fossDropdownOption
            })
            this.setState({tutorialsInTable: tuts, tutorialDropdownOption: value})

        } else {
            let tuts = this.state.filteredTutorials
            tuts = await tuts.filter((item) => {
                return item.tutorial === value
            })
            console.log(tuts)
            this.setState({tutorialsInTable: tuts, tutorialDropdownOption: value})
        }
    }


    renderOptions(type) {
        let options = new Set()
        let optionRender = []
        this.state.tutorials.map((item) => {
            options.add(type === 'foss' ? item.foss : item.tutorial)
        })
        options = Array.from(options)
        options.map((item) => {
            optionRender.push(<Option value={item}>{item}</Option>)
        })

        return optionRender

    }

    async searchTable(e) {
        let value = e.target.value
        let filteredList = this.state.tutorialsInTable
        filteredList = await filteredList.filter(item => {
            let booltut = item.tutorial.toLowerCase().includes(value.toLowerCase())
            let boolfoss = item.foss.toLowerCase().includes(value.toLowerCase())
            let boollang = item.language.toLowerCase().includes(value.toLowerCase())
            return booltut || boollang || boolfoss
        })
        this.setState({searchFilteredTable: filteredList, searchBox: value})

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
                    tut_obj.button =   <Popconfirm   onConfirm={
                        () => this.handleSubmit(
                            tutorial.tutorial_detail.id,
                            tutorial.language.id)
                    } title="Are you sure?" okText="Yes" cancelText="No">
                        <Button size={'large'} icon={<EditOutlined/>}
                                           >Edit
                            Video</Button></Popconfirm>
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
                                filtered_tuts[i].button =
                                    <Button size={'large'} icon={<EyeOutlined/>}>View</Button>
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
                <Row xs={2} sm={4} md={6} lg={10} xl={10}>
                    <Col span={6} offset={1}>
                        <Text level={4}>
                            FOSS &nbsp; &nbsp; &nbsp;
                        </Text>
                        <Select
                            value={this.state.fossDropdownOption}
                            size='large'
                            onChange={this.filterFosses}
                            defaultValue="All"
                            style={{width: 120}}>
                            <Option value='All'>All</Option>
                            {
                                this.renderOptions('foss')
                            }
                        </Select>
                    </Col>
                    <Col span={6}>
                        <Text level={3}>
                            Tutorial  &nbsp; &nbsp; &nbsp;
                        </Text>
                        <Select value={this.state.tutorialDropdownOption}
                                size='large'
                                disabled={this.state.isTutDisabled}
                                style={{width: 120}}
                                onChange={this.filterTutorials}>
                            <Option value='All'>All</Option>
                            {
                                this.renderOptions('tutorials')

                            }
                        </Select>
                    </Col>
                    <Col span={10}>
                        <Input allowClear size="large" placeholder="Search" prefix={<SearchOutlined/>}
                               onChange={this.searchTable}/>

                    </Col>
                    <Col span={1}/>
                </Row>
                <Table loading={this.state.isLoading}
                       dataSource={this.state.searchBox !== '' ? this.state.searchFilteredTable : this.state.tutorialsInTable}
                       columns={columns}/>
            </div>


        );
    }
}

export default TutorialsListComponent
