import React from "react";
import {Button, Divider, Modal, Popconfirm, Select, Space, Switch, Table, Tabs} from "antd";
import ReactAudioPlayer from 'react-audio-player';
import ReactDiffViewer from 'react-diff-viewer';
import './revertModal.styles.css'

const {TabPane} = Tabs
const {Option} = Select


class RevertModal extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            splitView: true,
            oldValue: '',
            newValue: '',
            oldDropDownValue: 'Select a date',
            newDropDownValue: 'Select a date'
        }
    }

    toggleSplitView = () => {
        this.setState({splitView: !this.state.splitView})
    }

    handleChangeCompare = (value, type) => {

        console.log(value, type)
        const subtitle = this.props.dataSource[value].subtitle
        const d = new Date(this.props.dataSource[value].history_date)

        if (type === 'old') {
            this.setState({
                oldValue: subtitle,
                oldDropDownValue: `${d.toDateString()} ${d.toTimeString().split(' ')[0]}`
            })

        } else {
            this.setState({
                newValue: subtitle,
                newDropDownValue: `${d.toDateString()} ${d.toTimeString().split(' ')[0]}`
            })
        }

    }
    resetDropdown = () => {
        this.setState({
            oldValue: '',
            newValue: '',
            oldDropDownValue: 'Select a date',
            newDropDownValue: 'Select a date'
        })
    }


    componentDidMount() {
        const history = this.props.dataSource;
        console.log(history)


    }

    render() {

        const {revertModalVisible, revertHandleCancel, isLoading, dataSource, revertChunk, chunk_no} = this.props

        const columns = [
            {
                title: 'Date',
                dataIndex: 'history_date',
                key: 'history_date',
                render: (date) => {
                    const d = new Date(date)
                    const date_time = `${d.toDateString()} ${d.toTimeString().split(' ')[0]}`
                    return date_time
                }
            },
            {
                title: 'Subtitle',
                dataIndex: 'subtitle',
                key: 'subtitle',
            },
            {
                title: 'Audio',
                dataIndex: 'audio_chunk',
                key: 'audio_chunk',
                render: (audio_chunk) => {
                    return (<ReactAudioPlayer
                        src={`${process.env.REACT_APP_MEDIA_URL}/${audio_chunk}`}
                        controls
                        controlsList="nodownload"
                    />)
                }
            },

            {
                title: 'Revert',
                render: (value) => (
                    <Popconfirm onConfirm={() => revertChunk(value.history_id, chunk_no)} title="Are you sure?"
                                okText="Yes"
                                cancelText="No">
                        <Button size='middle' type="primary">Revert</Button>
                    </Popconfirm>
                )
            },
        ];
        return (
            <Modal className='revertModal' footer={null}
                   title="Revisions"
                   visible={revertModalVisible}
                   onCancel={() => {
                       revertHandleCancel()
                       this.resetDropdown()
                   }}
                   width='60%'

            >
                <Tabs size='large' type="card">
                    <TabPane tab="Revert" key="1">
                        <Table loading={isLoading} columns={columns} dataSource={dataSource.slice(1)}/>

                    </TabPane>
                    <TabPane tab="Compare" key="2">
                        <Space style={{width: '88%'}} size='large' align='baseline'>
                            <Select
                                value={this.state.oldDropDownValue}
                                onChange={(e) => this.handleChangeCompare(e, 'old')} style={{width: 240}}>
                                {
                                    dataSource.map((item, idx) => {
                                        console.log(item)
                                        const d = new Date(item.history_date)
                                        return (<Option

                                            key={item.history_id}
                                            value={idx}>
                                            {`${d.toDateString()} ${d.toTimeString().split(' ')[0]}`}
                                        </Option>)
                                    })
                                }
                            </Select>
                            With
                            <Select
                                value={this.state.newDropDownValue}
                                onChange={(e) => this.handleChangeCompare(e, 'new')}
                                style={{width: 240}}>
                                {
                                    dataSource.map((item, idx) => {
                                        console.log(item)
                                        const d = new Date(item.history_date)
                                        return (<Option
                                            key={item.history_id}
                                            value={idx}>
                                            {`${d.toDateString()} ${d.toTimeString().split(' ')[0]}`}
                                        </Option>)
                                    })
                                }
                            </Select>

                        </Space>
                        <Space style={{width: '12%'}} align='end'>
                            Split View
                            <Switch onChange={this.toggleSplitView} defaultChecked/> </Space>
                        <Divider/>

                        <ReactDiffViewer oldValue={this.state.oldValue} newValue={this.state.newValue}
                                         splitView={this.state.splitView}/>
                    </TabPane>
                </Tabs>

            </Modal>
        )
    }

}


export default RevertModal
