import React from 'react'
import axios from 'axios'
import {Button, List, Select, Tooltip, Typography} from "antd";
import {EditOutlined} from '@ant-design/icons';

const {Option} = Select;

class AllottedTutorialsList extends React.Component {
    constructor() {
        super();
        this.state = {
            allottedTutorials: [],
            languages: {}
        }

        this.returnOptions = this.returnOptions.bind(this);


    }

    returnOptions (tutorial_id) {
        // this.state.languages._tutorial_id.map((item)=>{
        //     return <Option value={item}>{item}</Option>
        // }
        let temp = tutorial_id
        let lang = this.state.languages
        return <Option value={lang[temp]}>{lang[temp]}</Option>
    }

    componentDidMount() {
        axios.get('http://127.0.0.1:8000/videoprocessing/api/tutorials')
            .then(res => {
                let separateTutorials = res.data
                let language = {}
                this.setState({allottedTutorials: res.data})
                separateTutorials.map(
                    (item) => {
                        console.log(item.tutorial_detail.id)
                        if (language[item.tutorial_detail.id] === undefined) {
                            language[item.tutorial_detail.id] = []
                        }
                        language[item.tutorial_detail.id].push(item.language.name)
                    }
                )
                return language
            })
            .then((language) => {
                this.setState({languages: language})
            })

    }

    render() {
        return (
            <List
                size="large"
                itemLayout="horizontal"
                dataSource={this.state.allottedTutorials}
                renderItem={(item) => (
                    <List.Item
                        actions={[<Select size='large' defaultValue={item.language.name}
                                          style={{width: 120}}>
                            {
                                this.returnOptions(item.tutorial_detail.id)
                            }
                        </Select>,
                            <Tooltip placement="topLeft" title="Change audio of any part in video" arrowPointAtCenter>
                                <Button
                                    size={'large'}
                                    icon={<EditOutlined/>}
                                >Edit Video</Button>
                            </Tooltip>]}
                    >

                        <List.Item.Meta
                            title={
                                <Typography.Text
                                    strong
                                >
                                    {
                                        item.tutorial_detail.tutorial
                                    }
                                </Typography.Text>
                            }
                            description={<Typography.Text>{item.foss_category.name}</Typography.Text>}
                        />
                    </List.Item>
                )}
            />);
    }
}

export default AllottedTutorialsList
