import React from 'react';
import './App.css';
import {Button} from 'antd'
import {PlusCircleFilled} from '@ant-design/icons'
function App() {
  return (
    <div className="App">
         <Button type="primary" icon={<PlusCircleFilled/>}>Button</Button>

    </div>
  );
}

export default App;
