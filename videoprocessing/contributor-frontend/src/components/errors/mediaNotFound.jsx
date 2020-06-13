import React from 'react'
import {Button, Result} from "antd";

class MediaNotFound extends React.Component{
    render() {
        return(  <Result
            status="warning"
            title="Media Not Found"
            extra={<Button type="primary" href={'#'}>Back Home</Button>}
        />)

    }

}

export default MediaNotFound
