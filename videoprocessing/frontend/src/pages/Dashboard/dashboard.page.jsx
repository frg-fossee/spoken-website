import React from "react";
import {withRouter} from "react-router-dom";
import qs from 'qs'
import axios from 'axios'
import {Button, Col, Modal, notification, Progress, Row, Space, Spin, Table, Typography} from "antd";
import ReactAudioPlayer from 'react-audio-player';
import ReactPlayer from "react-player";
import {AudioOutlined, InboxOutlined, DownloadOutlined} from '@ant-design/icons'
import {Upload, message} from 'antd';

const {Dragger} = Upload;
const {Title, Text} = Typography;


class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            id: '',
            current_count: '',
            chunks: [],
            status: '',
            checksum: '',
            foss: '',
            tutorial_name: '',
            language: '',
            total_count: '',
            processed_video: '',
            processed: false,
            progress_status: '',
            visible: false
        }
        this.config = {
            name: 'file',
            multiple: true,
            action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
            onChange(info) {
                const {status} = info.file;
                if (status !== 'uploading') {
                    console.log(info.file, info.fileList);
                }
                if (status === 'done') {
                    message.success(`${info.file.name} file uploaded successfully.`);
                } else if (status === 'error') {
                    message.error(`${info.file.name} file upload failed.`);
                }
            },
        }
        this.columns = [
            {
                title: 'Chunk No.',
                dataIndex: 'chunk_no',
                key: 'chunk_no',
                width: '5%'

            },
            {
                title: 'Audio',
                dataIndex: 'audio_chunk',
                key: 'audio_chunk',
                render: (audio_chunk) => {
                    return (<ReactAudioPlayer
                        src={audio_chunk}
                        controls
                        controlsList="nodownload"
                    />)
                }
            },
            {
                title: 'Start Time',
                dataIndex: 'start_time',
                key: 'start_time',
            },
            {
                title: 'End Time',
                dataIndex: 'end_time',
                key: 'end_time',
            },
            {
                title: 'Subtitle',
                dataIndex: 'subtitle',
                key: 'subtitle',
                sorter: (a, b) => a.subtitle.localeCompare(b.subtitle),
                sortDirections: ['descend', 'ascend']
            },
            {
                title: 'Change Audio',
                render: () => {
                    return (<Button icon={<AudioOutlined/>} onClick={this.showModal}>Change Audio</Button>
                    )
                }
            },
        ];
        this.showModal = () => {
            this.setState({
                visible: true,
            });
        };

        this.handleOk = e => {
            console.log(e);
            this.setState({
                visible: false,
            });
        };

        this.handleCancel = e => {
            console.log(e);
            this.setState({
                visible: false,
            });
        };

        this.fetchData = () => {
            this.setState({processed: false})
            this.apiLoop = setInterval(() => {
                axios.get(`${process.env.REACT_APP_API_URL}/process_tutorials/${this.state.id}`)
                    .then((res) => {
                        console.log(res.data)
                        this.setState({
                            current_count: res.data.chunks.length,
                            chunks: res.data.chunks,
                            total_count: res.data.video_data.total_chunks,
                            tutorial_name: res.data.video_data.tutorial_name,
                            language: res.data.video_data.language,
                            foss: res.data.video_data.foss,
                            status: res.data.video_data.status,
                            checksum: res.data.video_data.checksum,
                            loading: false
                        });
                        if (res.data.video_data.processed_video === null) {
                            this.setState(
                                {
                                    'processed_video': res.data.video_data.video
                                }
                            )
                        } else {
                            this.setState({'processed_video': res.data.video_data.processed_video})
                        }
                        if (res.data.video_data.status === 'done') {
                            clearInterval(this.apiLoop);
                            this.setState({processed: true})
                        }
                    })
                    .catch((error) => {
                        notification.error({
                            message: 'Error Occurred',
                            description: error.response ? `Status: ${error.response.status} \n ${error.response.statusText}` : 'Some Error Occurred',
                            onClick: () => {
                                console.log('Notification Clicked!');
                            },
                        });
                        this.setState({status: 'not found', progress_status: 'exception'})

                        clearInterval(this.apiLoop)
                    })
            }, 2000)

        }


    }

    componentWillMount() {
        let id = qs.parse(this.props.location.search, {ignoreQueryPrefix: true}).id
        this.setState({id: id})

    }

    componentDidMount() {
        this.fetchData()
    }


    componentWillUnmount() {
        clearInterval(this.apiLoop)
    }


    render() {
        let isLoading = this.state.loading
        return (
            <div>
                {isLoading ?
                    <Space size="middle">
                        <Spin size="large"/>
                    </Space> : <div>
                        <Row align="middle">
                            <Col span={4}
                                 style={{display: 'inline-flex', justifyContent: 'center', alignItems: 'center'}}>
                                <Progress type="circle"
                                          percent={parseInt((this.state.current_count / this.state.total_count) * 100)}
                                          status={this.state.progress_status}/>
                            </Col>
                            <Col style={{display: 'inline-flex', justifyContent: 'center', alignItems: 'center'}}
                                 span={4}>
                                <Typography>
                                    <Title level={4}>Status: {this.state.status.toUpperCase()}</Title>
                                    <Title>
                                        <Button type="primary" icon={<DownloadOutlined/>} size='large'>Download
                                            Tutorial</Button>

                                    </Title>
                                </Typography>
                            </Col>

                            <Col style={{display: 'inline-flex', justifyContent: 'center', alignItems: 'center'}}
                                 span={8}>
                                <Typography>
                                    <Title level={3}>{this.state.tutorial_name}</Title>
                                    <Title level={4}>{this.state.foss}</Title>
                                </Typography>
                            </Col>

                            <Col style={{display: 'inline-flex', justifyContent: 'center', alignItems: 'center'}}
                                 span={8}>

                                <ReactPlayer
                                    height={200}
                                    url={this.state.processed_video} controls/>
                            </Col>

                        </Row>
                        <Row>
                            <Table
                                loading={this.state.isLoading}
                                dataSource={this.state.chunks}
                                columns={this.columns}/>
                        </Row>
                        <Modal
                            title="Change Audio"
                            visible={this.state.visible}
                            onOk={this.handleOk}
                            onCancel={this.handleCancel}
                        >
                            <Dragger {...this.config}>
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined/>
                                </p>
                                <p className="ant-upload-text">Click or drag audio to this area to upload</p>
                            </Dragger>
                        </Modal>
                    </div>}

            </div>)
    }


}

export default withRouter(Dashboard)
