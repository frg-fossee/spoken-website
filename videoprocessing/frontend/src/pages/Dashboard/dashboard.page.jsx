import React from "react";
import {withRouter} from "react-router-dom";
import qs from 'qs'
import axios from 'axios'
import {notification, Progress,Typography} from "antd";

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
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
            progress_status: ''
        }

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
                            checksum: res.data.video_data.checksum
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
        return (<div>
            <Progress type="circle" percent={parseInt((this.state.current_count / this.state.total_count) * 100)} status={this.state.progress_status}/>
            <Typography.Title level={3}>Status: {this.state.status.toUpperCase()}</Typography.Title>
        </div>)
    }


}

export default withRouter(Dashboard)
