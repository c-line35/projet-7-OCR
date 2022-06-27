import { Tabs } from 'antd';
import LogForm from './LogForm';
import SignForm from './SignForm';
const { TabPane } = Tabs;

const Tab = () =>   {
  const onChange = (key) => {
    console.log(key)
  };
 

  return(
  <Tabs onChange={onChange} type="card"> 
      <TabPane tab={"S'identifier"} key="login">
        <LogForm />
      </TabPane>
    
      <TabPane tab={"S'inscrire"} key={"signup"}>
        <SignForm />
      </TabPane>
    
  </Tabs>   
  )
}

export default Tab;