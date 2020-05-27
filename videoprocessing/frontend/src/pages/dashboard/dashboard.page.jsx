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
    Progress,
    Result,
    Row,
    Skeleton,
    Table,
    Tabs,
    Typography,
    Upload
} from 'antd';
import ReactAudioPlayer from 'react-audio-player';
import ReactPlayer from "react-player";
import {
    AudioOutlined,
    CaretRightOutlined,
    DownloadOutlined,
    HomeOutlined,
    InboxOutlined,
    LoadingOutlined,
    PauseOutlined,
    RollbackOutlined,
    VideoCameraOutlined
} from '@ant-design/icons'
import MediaNotFound from "../../components/errors/mediaNotFound";
import Error403Component from "../../components/errors/error403.component";
import './dashboard.page.css'
import RevertModal from "../../components/revertModal/revertModal.component";

const {Dragger} = Upload;
const {Title, Text} = Typography;
const {TabPane} = Tabs


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
            selected_chunk: 0,
            selected_chunk_sub: '',
            playing: false,
            revertModalVisible: false,
            revisionData: [],
            revisionsTableLoading: true,
            revertChunkSelected: ''
        }
        this.handleChange = (e) => {
            let value = e.target.value
            this.setState({selected_chunk_sub: value});

        }
        this.revertShowModal = (chunk_no) => {
            this.setState({revertModalVisible: true, revisionData: [], revertChunkSelected: chunk_no})
            axios.get(`${process.env.REACT_APP_API_URL}/process_tutorials/${this.state.id}/${chunk_no}`)
                .then((res) => {
                    console.log(res.data.history)
                    this.setState({revisionData: res.data.history.slice(1)})

                })
                .then(() => {
                    this.setState({revisionsTableLoading: false})
                })
        }
        this.handleUpload = () => {
            this.setState({
                uploading: true,
                progress_status: 'normal',
                status: 'Uploading'
            });
            const {audio_file, selected_chunk, selected_chunk_sub} = this.state;
            console.log(audio_file)
            const formData = new FormData();
            formData.append('audio_chunk', audio_file);
            formData.append('subtitle', selected_chunk_sub)
            axios.put(`${process.env.REACT_APP_API_URL}/process_tutorials/${this.state.id}/${selected_chunk}`, formData)
                .then(() => {
                    this.fetchData();
                    this.setState({uploading: false});
                })
                .then(() => this.handleCancel())
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
                width: '10%',
                render: (audio_chunk) => {
                    return (<ReactAudioPlayer
                        src={audio_chunk}
                        controls
                        controlsList="nodownload"
                    />)
                },
            },
            {
                title: 'Start Time',
                dataIndex: 'start_time',
                key: 'start_time',
                width: '10%',


            },
            {
                title: 'End Time',
                dataIndex: 'end_time',
                key: 'end_time',
                width: '10%',

            },
            {
                title: 'Subtitle',
                dataIndex: 'subtitle',
                key: 'subtitle',
                width: '55%',
                // render: (value) => {
                //     return (ReactHtmlParser(value))
                // },
                sorter: (a, b) => a.subtitle.localeCompare(b.subtitle),
                sortDirections: ['descend', 'ascend']
            },
            {
                title: 'Change Audio',
                width: '10%',
                render: (value) => {
                    return (<Button icon={<AudioOutlined/>} onClick={() => this.changeAudioShowModal(value.chunk_no)}>Change
                            Audio</Button>
                    )
                }
            },
            {
                title: 'Revert',
                width: '10%',
                render: (value) => {
                    return (<Button icon={<RollbackOutlined/>}
                                    onClick={() => this.revertShowModal(value.chunk_no)}>Revert </Button>
                    )
                }
            },
        ];
        this.changeAudioShowModal = (chunk) => {
            let sutitle = this.state.chunks[chunk]['subtitle']
            let start_time = this.state.chunks[chunk]['start_time']
            setTimeout((chunk) => {
                let a = start_time.split(':');
                let seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
                console.log(seconds)
                this.player.seekTo(seconds, 'seconds')
                // this.player.showPreview()

            }, 1000)
            this.setState({
                visible: true,
                selected_chunk: chunk,
                selected_chunk_sub: sutitle
            });
        };

        this.handleOk = e => {
            console.log(e);
            this.setState({
                visible: false,
            });
        };

        this.revertHandleCancel = () => {
            this.setState({revertModalVisible: false})
        }

        this.revertChunk = (history_id,chunk_no) => {
            this.setState({
                uploading: true,
                progress_status: 'normal',
                status: 'Reverting',
            });
            axios.put(`${process.env.REACT_APP_API_URL}/process_tutorials/${this.state.id}/${chunk_no}/revert/${history_id}`)
                .then(() => {
                    this.fetchData();
                    this.setState({uploading: false});
                })
                .then(() => this.revertHandleCancel())
        }

        this.handleCancel = e => {

            console.log(e);
            this.setState({playing: false})
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

    ref = player => {
        this.player = player
    }

    togglePlayButton = () => {
        let status = this.state.playing
        status ? this.setState({playing: false}) : this.setState({playing: true})
    }

    pauseVideo = video => {
        let chunk = this.state.selected_chunk

        let start_time = this.state.chunks[chunk]['start_time']
        let a = start_time.split(':');
        let start_seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);

        let end_time = this.state.chunks[chunk]['end_time']
        a = end_time.split(':');
        let end_seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
        // this.player.showPreview()


        if (Math.floor(video.playedSeconds) === end_seconds) {
            this.setState({playing: false})
            this.player.seekTo(start_seconds, 'seconds')
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
            files: []
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
                                    <Button
                                        type="primary" icon={<DownloadOutlined/>} size='large'
                                        download='video'
                                        href={this.state.processed_video}
                                        style={{textDecoration: 'none', color: 'white'}}>Download
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

                            {
                                this.state.status === 'done' ? <ReactPlayer


                                        height={200}
                                        url={this.state.processed_video} controls/> :
                                    <Skeleton.Input style={{height: '200px'}} active/>
                            }


                        </Col>

                    </Row>
                    <Row>
                        <Table
                            className='data-table'
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
                        <ReactPlayer
                            controls={false}
                            playing={this.state.playing}
                            onProgress={this.pauseVideo}
                            ref={this.ref}
                            width='100%'
                            url={this.state.processed_video}/>
                        <br/>
                        <div style={{textAlign: 'center'}}>

                            <Button
                                size='large'
                                type="primary"
                                shape="round"
                                icon={this.state.playing ? <PauseOutlined/> : <CaretRightOutlined/>}
                                onClick={this.togglePlayButton}
                            />
                        </div>


                        <Divider/>
                        <Dragger {...config}>
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined/>
                            </p>
                            <p className="ant-upload-text">Click or drag audio to this area to upload</p>
                        </Dragger>
                        <Divider/>
                        <Text>Subititle</Text>
                        {
                            this.state.status === 'done' ?
                                <Input.TextArea allowClear
                                                autoSize
                                                value={this.state.selected_chunk_sub}
                                                onChange={this.handleChange}
                                />
                                :
                                null


                        }

                    </Modal>
                    <RevertModal
                        revertModalVisible={this.state.revertModalVisible}
                        revertHandleCancel={this.revertHandleCancel}
                        dataSource={this.state.revisionData}
                        isLoading={this.state.revisionsTableLoading}
                        chunk_no={this.state.revertChunkSelected}
                        revertChunk={this.revertChunk}
                    />

                </div>

            )
        }
    }


}

export default withRouter(Dashboard)
