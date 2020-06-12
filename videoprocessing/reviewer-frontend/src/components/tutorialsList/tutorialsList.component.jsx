import React from 'react'
import axios from 'axios'
import {Button, Table, Typography} from "antd";

const {Text} = Typography

const columns = [
    {
        title: 'FOSS',
        dataIndex: 'foss',
        key: 'key',
        render: value => value.name,
        sorter: (a, b) => a.foss.name.localeCompare(b.foss.name),
        sortDirections: ['descend', 'ascend']
    },
    {
        title: 'Tutorial Name',
        dataIndex: 'tutorial_detail',
        key: 'key',
        render: value => value.tutorial,
        sorter: (a, b) => a.tutorial_detail.tutorial.localeCompare(b.tutorial_detail.tutorial),
        sortDirections: ['descend', 'ascend']
    },
    {
        title: 'Language',
        dataIndex: 'language',
        key: 'key',
        render: value => value.name,
        sorter: (a, b) => a.language.name.localeCompare(b.language.name),
        sortDirections: ['descend', 'ascend']
    }
    , {
        title: 'Status',
        dataIndex: 'submission_status',
        key: 'key',
        filters: [
            {text: 'Submitted for Review', value: 'submitted'},
            {text: 'Accepted', value: 'accepted'},
            {text: 'Rejected', value: 'rejected'},

        ],
        // filteredValue: filteredInfo.submission_status || null,
        onFilter: (value, record) => record.submission_status.includes(value),
        render: value => {
            if (value === 'submitted')
                return <Text type="warning">Submitted for Review</Text>
            if (value === 'accepted')
                return <Text style={{color: 'green'}}>Accepted</Text>
            if (value === 'rejected')
                return <Text type="danger">Rejected</Text>
        }
    },
    {
        title: 'Review',
        dataIndex: 'key',
        key: 'key',
        render: value => <Button href={`#/dashboard?id=${value}`}>Review</Button>
    },
];

class TutorialsListComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tutorialsList: null,
            loading: true
        }
    }

    componentDidMount() {
        axios.get(`${process.env.REACT_APP_API_URL}/review`)
            .then((res) => {
                this.setState({tutorialsList: res.data, loading: false})
            })

    }

    render() {
        return (
            <div>
                <Table
                    loading={this.state.loading}
                    dataSource={this.state.tutorialsList}
                    columns={columns}/>
            </div>

        )
    }
}

export default TutorialsListComponent
