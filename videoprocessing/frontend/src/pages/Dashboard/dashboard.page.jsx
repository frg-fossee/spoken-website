import React from "react";
import {withRouter} from "react-router-dom";
import qs from 'qs'
import axios from 'axios'
import {
    Breadcrumb,
    Button,
    Col,
    Divider,
    Input,
    Modal,
    notification,
    Progress, Result,
    Row,
    Space,
    Spin,
    Table,
    Typography
} from "antd";
import ReactAudioPlayer from 'react-audio-player';
import ReactPlayer from "react-player";
import {
    AudioOutlined,
    LoadingOutlined,
    InboxOutlined,
    DownloadOutlined,
    HomeOutlined,
    VideoCameraOutlined
} from '@ant-design/icons'
import {Upload, message} from 'antd';
import MediaNotFound from "../../components/errors/mediaNotFound";
import Error403Component from "../../components/errors/error403.component";
import './dashboard.page.css'

const {Dragger} = Upload;
const {Title, Text} = Typography;


class Dashboard extends React.Component {
    warning

    constructor(props) {
        super(props);
        this.state = {
            id: '',
            current_count: '',
            chunks: [],
            status: 'loading',
            checksum: '',
            foss: '',
            tutorial_name: '',
            language: '',
            total_count: '',
            processed_video: '',
            processed: false,
            progress_status: '',
            visible: false,
            audio_file: '',
            uploading: false,
            selected_chunk: 0
        }
        this.handleUpload = () => {
            const {audio_file} = this.state;
            console.log(audio_file)
            const formData = new FormData();
            formData.append('files[]', audio_file);

            this.setState({
                uploading: true,
            });
            //to do


        };

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
                render: (value) => {
                    return (<Button icon={<AudioOutlined/>} onClick={() => this.showModal(value.chunk_no)}>Change
                            Audio</Button>
                    )
                }
            },
        ];
        this.showModal = (chunk) => {
            this.setState({
                visible: true,
                selected_chunk: chunk
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
                audio_file: '',
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
                        if (res.data.video_data.status === 'done' || res.data.video_data.status === 'error' || res.data.video_data.status === 'media_not_found') {
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
        const {uploading, audio_file} = this.state;
        const config = {
            disabled: audio_file,
            accept: 'audio/mp3',
            onRemove: () => this.setState({audio_file: ''}),
            beforeUpload: file => {
                this.setState(state => ({
                    audio_file: file,
                }));
                return false;
            },
            name: audio_file.name,
        };
        let status = this.state.status
        if (status === 'loading') {
            return (
                <Result
                    icon={<LoadingOutlined/>}
                    title="Fetching Files"
                />

            )
        } else if (status === 'not found') {
            return (<Error403Component/>)
        } else if (status === 'media_not_found') {
            return (<MediaNotFound/>)
        } else {
            return (
                <div>
                    <Breadcrumb>
                        <Breadcrumb.Item href="/">
                            <HomeOutlined/>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item href="/videoprocessing">
                            <VideoCameraOutlined/>
                            <span>Video Processing</span>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            <span>Dashboard</span>
                        </Breadcrumb.Item>
                    </Breadcrumb>
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
                            dataSource={this.state.chunks}
                            columns={this.columns}/>
                    </Row>
                    <Modal
                        title="Change Audio"
                        visible={this.state.visible}
                        onOk={this.handleOk}
                        okButtonProps={{


                            type: "primary",
                            onClick: this.handleUpload,
                            disabled: audio_file.length === 0,
                            loading: uploading,
                            style: {marginTop: 16}
                        }
                        }
                        okText={uploading ? 'Uploading' : 'Start Upload'}
                        onCancel={this.handleCancel}
                    >
                        <Dragger {...config}>
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined/>
                            </p>
                            <p className="ant-upload-text">Click or drag audio to this area to upload</p>
                        </Dragger>
                        <Divider/>
                        <Text>Subititle</Text>
                        <Input.TextArea  allowClear autoSize defaultValue={this.state.chunks[this.state.selected_chunk]['subtitle']}/>,
                    </Modal>
                </div>

            )
        }
    }


}

export default withRouter(Dashboard)
