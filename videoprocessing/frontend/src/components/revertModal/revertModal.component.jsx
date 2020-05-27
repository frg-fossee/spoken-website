import React from "react";
import {Button, Modal, Popconfirm, Table, Tabs} from "antd";
import ReactAudioPlayer from 'react-audio-player';
import ReactDiffViewer from 'react-diff-viewer';
import './revertModal.styles.css'
const {TabPane} = Tabs

const oldCode = `
const a = 10
const b = 10
const c = () => console.log('foo')

if(a > 10) {
  console.log('bar')
}

console.log('done')
`;
const newCode = `
const a = 10
const boo = 10

if(a === 10) {
  console.log('bar')
}
`;

const RevertModal = (props) => {
    const {revertModalVisible, revertHandleCancel, isLoading, dataSource, revertChunk, chunk_no} = props
    const columns = [
        {
            title: 'Date',
            dataIndex: 'history_date',
            key: 'history_date',
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
                <Popconfirm onConfirm={() => revertChunk(value.history_id, chunk_no)} title="Are you sure?" okText="Yes"
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
               onCancel={revertHandleCancel}
               width='60%'

        >
            <Tabs size='large' type="card">
                <TabPane tab="Revert" key="1">
                    <Table loading={isLoading} columns={columns} dataSource={dataSource}/>

                </TabPane>
                <TabPane tab="Compare" key="2">
                    <ReactDiffViewer oldValue={oldCode} newValue={newCode} splitView={true} />
                </TabPane>
            </Tabs>

        </Modal>
    )
}


export default RevertModal
