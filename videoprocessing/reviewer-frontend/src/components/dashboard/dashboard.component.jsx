import React from "react";
import qs from 'qs'
import axios from "axios";
import ReactAudioPlayer from 'react-audio-player';
import {Button, Col, Input, Modal, notification, Popconfirm, Row, Skeleton, Space, Table, Typography} from "antd";
import {EyeOutlined, LeftOutlined, MessageOutlined} from '@ant-design/icons';
import {Player} from 'video-react';
import "video-react/dist/video-react.css";
import {withRouter} from "react-router-dom"; // import css
const {Title} = Typography

class DashboardComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            id: null,
            isModalVisible: false,
            oldChunk: null,
            newChunk: null,
            fetchingChunk: true,
            chunks: [],
            status: '',
            tutorial_name: '',
            foss: '',
            total_count: '',
            processed_video: '',
            isCommentVisible: false,
            isRejectionVisible: false,
            comment: '',
            submission_status: ''
        }

        this.showModal = (chunk_no) => {
            this.setState({isModalVisible: true, fetchingChunk: true})
            axios.get(`${process.env.REACT_APP_API_URL}/review/${this.state.id}/${chunk_no}`)
                .then((res) => {
                    this.setState({
                        oldChunk: res.data.history[res.data.history.length - 1],
                        newChunk: res.data.history[0]
                    })
                })
                .then(() => this.setState({fetchingChunk: false}))
        }

        this.columns = [
            {
                title: 'Chunk No.',
                dataIndex: 'chunk_no',
                key: 'chunk_no',
                width: '5%',
                render(text, record) {
                    return {
                        props: {
                            style: {
                                backgroundColor: record.revisions > 1 ? '#bae7ff' : 'white',
                                fontWeight: record.revisions > 1 ? 'bold' : 'normal'
                            }

                        },
                        children: <div>{text + 1}</div>,
                    };
                }


            },
            {
                title: 'Audio',
                dataIndex: 'audio_chunk',
                key: 'audio_chunk',
                width: '10%',
                render: (audio_chunk, record) => {
                    return {
                        props: {
                            style: {
                                backgroundColor: record.revisions > 1 ? '#bae7ff' : 'white',
                                fontWeight: record.revisions > 1 ? 'bold' : 'normal'
                            }

                        }, children:
                            <ReactAudioPlayer
                                src={audio_chunk}
                                controls
                            />
                    }
                },
            },
            {
                title: 'Start Time',
                dataIndex: 'start_time',
                key: 'start_time',
                width: '10%',
                render(text, record) {
                    return {
                        props: {
                            style: {
                                backgroundColor: record.revisions > 1 ? '#bae7ff' : 'white',
                                fontWeight: record.revisions > 1 ? 'bold' : 'normal'
                            }

                        },
                        children: <div>{text}</div>,
                    };
                }


            },
            {
                title: 'End Time',
                dataIndex: 'end_time',
                key: 'end_time',
                width: '10%',
                render(text, record) {
                    return {
                        props: {
                            style: {
                                backgroundColor: record.revisions > 1 ? '#bae7ff' : 'white',
                                fontWeight: record.revisions > 1 ? 'bold' : 'normal'
                            }

                        },
                        children: <div>{text}</div>,
                    };
                },

            },
            {
                title: 'Subtitle',
                dataIndex: 'subtitle',
                key: 'subtitle',
                width: '55%',
                render(text, record) {
                    return {
                        props: {
                            style: {
                                backgroundColor: record.revisions > 1 ? '#bae7ff' : 'white',
                                fontWeight: record.revisions > 1 ? 'bold' : 'normal'
                            },
                        },
                        children: <div>{text}</div>,
                    };
                },
                sorter: (a, b) => a.subtitle.localeCompare(b.subtitle),
                sortDirections: ['descend', 'ascend']
            },
            {
                title: 'Changes',
                dataIndex: 'revisions',
                key: 'revisions',
                width: '10%',
                render: (value, record) => {
                    return {
                        props: {
                            style: {
                                backgroundColor: record.revisions > 1 ? '#bae7ff' : 'white',
                                fontWeight: record.revisions > 1 ? 'bold' : 'normal'
                            },
                        },
                        children:
                            <div>
                                <Button
                                    icon={<EyeOutlined/>}
                                    onClick={() => this.showModal(record.chunk_no)}
                                    disabled={record.revisions <= 1}>
                                    View Changes
                                </Button>
                            </div>

                    }
                }


            }
        ];

    }


    componentWillMount() {
        let id = qs.parse(this.props.location.search, {ignoreQueryPrefix: true}).id
        this.setState({id: id})
    }


    componentDidMount() {
        axios.get(`${process.env.REACT_APP_API_URL}/review/${this.state.id}`)
            .then((res) => {
                this.setState({
                    chunks: res.data.chunks,
                    total_count: res.data.video_data.total_chunks,
                    tutorial_name: res.data.video_data.tutorial_name,
                    language: res.data.video_data.language,
                    foss: res.data.video_data.foss,
                    status: res.data.video_data.status,
                    submission_status: res.data.video_data.submission_status,
                    loading: false,
                    processed_video: res.data.video_data.processed_video,
                    comment: res.data.video_data.comment

                });
            })
    }

    closeModal = () => {
        this.setState({
            isModalVisible: false
        })

    }

    showComment = () => {
        this.setState({
            isCommentVisible: true
        })
    }

    closeCommentModal = () => {
        this.setState({
            isCommentVisible: false
        })
    }

    closeRejectionModal = () => {
        this.setState({
            isRejectionVisible: false
        })
    }

    showRejectionModal = () => {
        this.setState({
            isRejectionVisible: true
        })
    }


    openNotificationWithIcon = (title, message, type) => {
        notification[type]({
            message: title,
            description: message
        });
    };

    sendVerdict = (formData, status) => {
        axios.post(`${process.env.REACT_APP_API_URL}/review/${this.state.id}/verdict`, formData)
            .then(() => {
                if (status === 'accepted')
                    this.openNotificationWithIcon('Accepted', 'Tutorial Accepted Successfully', 'success')
                else
                    this.openNotificationWithIcon('Rejected', 'Tutorial Rejected Successfully', 'warning')
            })
            .then(() => {
                this.props.history.push('/')
            })
            .catch(() => {
                this.openNotificationWithIcon('Error', 'Some Error Occurred', 'error')
            })
    }

    acceptTutorial = () => {
        const formData = new FormData();
        formData.append('verdict', 'accepted')
        this.sendVerdict(formData, 'accepted')

    }

    rejectTutorial = () => {
        const formData = new FormData();
        formData.append('verdict', 'rejected')
        formData.append('comment', this.state.comment)
        this.sendVerdict(formData, 'rejected')
    }


    render() {
        let status_text
        if (this.state.submission_status === 'submitted')
            status_text = <Title level={4} type="warning">Submitted for Review</Title>
        else if (this.state.submission_status === 'accepted')
            status_text = <Title level={4} style={{color: 'green'}}>Accepted</Title>
        else if (this.state.submission_status === 'rejected')
            status_text = <Title level={4} type="danger">Rejected</Title>


        return (
            <div>
                <Button type="round"
                        icon={<LeftOutlined/>}
                        onClick={() => this.props.history.push('/')}
                        size='small'
                >
                    Back
                </Button>

                <Row align="middle">
                    <Col style={{display: 'inline-flex', justifyContent: 'center', alignItems: 'center'}}
                         span={8}>
                        <Typography>
                            <Title level={3}>{this.state.tutorial_name}</Title>
                            <Title level={4}>{this.state.foss}</Title>
                        </Typography>

                    </Col>

                    <Col style={{display: 'inline-flex', justifyContent: 'center', alignItems: 'center'}}
                         span={8}>
                        <Typography>
                            {status_text}
                            <Title>
                                <Space size='large'>
                                    <Popconfirm
                                        title="Are you sure？"
                                        okText="Yes"
                                        cancelText="No"
                                        disabled={this.state.status !== 'done' || this.state.submission_status !== 'submitted'}
                                        onConfirm={this.acceptTutorial}>
                                        <Button
                                            disabled={this.state.status !== 'done' || this.state.submission_status !== 'submitted'}
                                            size='large'
                                            type="primary"
                                        >Accept</Button>
                                    </Popconfirm>
                                    <Button
                                        size='large'
                                        type="primary"
                                        danger
                                        onClick={this.showRejectionModal}
                                        disabled={this.state.status !== 'done' || this.state.submission_status !== 'submitted'}
                                    >Reject</Button>
                                    <Button
                                        size='large'
                                        icon={<MessageOutlined/>}
                                        onClick={this.showComment}
                                        disabled={this.state.status !== 'done' || this.state.submission_status !== 'submitted'}

                                    >
                                        View Comment

                                    </Button>

                                </Space>

                            </Title>
                        </Typography>
                    </Col>

                    <Col style={{display: 'inline-flex', justifyContent: 'center', alignItems: 'center'}}
                         span={8}>

                        {
                            this.state.status === 'done' ?
                                <Player
                                    fluid={false}
                                    preload='auto'
                                    height={200}
                                    playsInline
                                    src={this.state.processed_video}
                                />


                                // <VideoPlayer
                                //     autoplay={false}
                                //     controls={true}
                                //     preload="auto"
                                //     // width={200}
                                //     sources={[{
                                //         src: this.state.processed_video,
                                //         type: 'video/mp4'
                                //     }]}
                                // />
                                :
                                <Skeleton.Input style={{height: '200px'}} active/>
                        }


                    </Col>

                </Row>
                <Row>

                    <Table
                        loading={this.state.loading}
                        className='data-table'
                        dataSource={this.state.chunks}
                        columns={this.columns}/>
                </Row>
                <Modal
                    loading={true}
                    width={'60vw'}
                    title="View Changes"
                    visible={this.state.isModalVisible}
                    onOk={this.closeModal}
                    onCancel={this.closeModal}
                >
                    {!this.state.fetchingChunk ?
                        <Row gutter={32}>
                            <Col span={12}>
                                <Typography.Title level={4}>Old Version</Typography.Title>
                                <br/>
                                <ReactAudioPlayer
                                    src={`${process.env.REACT_APP_MEDIA_URL}/${this.state.oldChunk.audio_chunk}`}
                                    controls

                                />
                                <br/> <br/>

                                <Typography.Paragraph>
                                    {this.state.oldChunk.subtitle}
                                </Typography.Paragraph>
                            </Col>
                            <Col span={12}>
                                <Typography.Title level={4}>New Version</Typography.Title>
                                <br/>

                                <ReactAudioPlayer
                                    src={`${process.env.REACT_APP_MEDIA_URL}/${this.state.newChunk.audio_chunk}`}
                                    controls

                                />
                                <br/> <br/>

                                <Typography.Paragraph>
                                    {this.state.newChunk.subtitle}
                                </Typography.Paragraph>
                            </Col>
                        </Row> : null}
                </Modal>
                <Modal
                    title="Comment from Contributor"
                    visible={this.state.isCommentVisible}
                    onOk={this.closeCommentModal}
                    onCancel={this.closeCommentModal}
                >
                    <Typography.Paragraph>
                        {this.state.comment}
                    </Typography.Paragraph>
                </Modal>
                <Modal
                    title="Reject"
                    visible={this.state.isRejectionVisible}
                    onOk={this.rejectTutorial}
                    okButtonProps={{danger: true}}
                    onCancel={this.closeRejectionModal}
                    okText='Reject'
                >
                    <Typography.Text>Rejection Message</Typography.Text>
                    <Input.TextArea allowClear
                                    autoSizer
                                    rows={4}
                                    onChange={(e) => {
                                        this.setState({comment: e.target.value})
                                    }}
                    />
                </Modal>
            </div>
        )
    }


}

export default withRouter(DashboardComponent)
