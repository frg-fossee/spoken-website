import React from 'react'
import {Avatar, Button, Card, Divider, List, Skeleton, Tooltip, Typography} from 'antd';
import {EditOutlined} from '@ant-design/icons';
import ReactPlayer from 'react-player'
import axios from 'axios'

const {Meta} = Card;
const {Title,Text, Paragraph} = Typography;

class ProcessedTutorials extends React.Component {
    constructor() {
        super();
        this.state = {
            processedTutorials: ['skeleton', 'skeleton', 'skeleton', 'skeleton', 'skeleton', 'skeleton'],
            cardLoading: true
        }
    }

    componentDidMount() {
        axios.get(`${process.env.REACT_APP_API_URL}/process_tutorials`)
            .then(res => {
                this.setState({processedTutorials: res.data})

            })
            .then(() => {
                    setTimeout(
                        () => this.setState({cardLoading: false}),
                        1000)
                }
            )
    }

    render() {
        const isCardLoading = this.state.cardLoading;
        return (
            <div>

                <List
                    grid={{
                        gutter: 32,
                        xs: 1,
                        sm: 2,
                        md: 4,
                        lg: 4,
                        xl: 4,
                        xxl: 4,
                    }} dataSource={this.state.processedTutorials}
                    renderItem={item => (
                        <List.Item>
                            <Card
                                loading={isCardLoading}
                                hoverable
                                size="small"
                                cover=
                                    {
                                        isCardLoading
                                            ?
                                            <Skeleton.Input style={{width: '300px', height: '300px'}} active={true}
                                                            size='default'/>
                                            : <ReactPlayer
                                                url={item.video}
                                                controls
                                                width={'100%'}
                                                height={'100%'}
                                            />
                                    }


                                actions={[
                                    isCardLoading ?
                                        <Skeleton.Button active size='large'/>
                                        :
                                        <Tooltip placement="topLeft" title="Change audio of any part in video" arrowPointAtCenter>
                                        <Button
                                            size={'large'}
                                            icon={<EditOutlined/>}
                                        >Edit Video</Button>
                                        </Tooltip>

                                ]}

                            >
                                <Meta
                                    title={<Text strong>
                                        Command Line Arguments in C
                                    </Text>}
                                    description={
                                        <Typography>
                                            <Paragraph>
                                                FOSS : Advanced C
                                            </Paragraph>
                                            <Paragraph>
                                                Language: English
                                            </Paragraph>
                                            <Paragraph>
                                                Total Chunks: 53
                                            </Paragraph>
                                        </Typography>
                                    }
                                />
                            </Card> </List.Item>
                    )}
                />
            </div>

        );
    }
}

export default ProcessedTutorials
