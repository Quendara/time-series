import React from 'react';
import { Row, Card, Layout, version } from "antd";

const { Header, Footer, Sider, Content } = Layout;


class TestComponent extends React.Component {
  constructor(props) {
    super(props);
  }
  render(){
    return <Child> 
    </Child>

  }
}

class Child extends React.Component {
  constructor(props) {
    super(props);
  }
  render(){
    return <Footer><Card>Track and visualize Time Series data</Card></Footer>
  }
}

export default TestComponent;