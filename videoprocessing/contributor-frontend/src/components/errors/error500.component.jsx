import React from 'react'
import {Button, Result} from "antd";

class Error500Component extends React.Component{
    render() {
        return(  <Result
            status="500"
            title="500"
            subTitle="Sorry, you are not authorized to access this page."
            extra={<Button type="primary" href={'/videoprocessing'}>Back Home</Button>}
        />)

    }

}

export default Error500Component
