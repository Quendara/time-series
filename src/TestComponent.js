import React from 'react';
import { Row, Card, Layout, version } from "antd";
import {
  Link,
  useLocation
} from "react-router-dom";

const { Header, Footer, Sider, Content } = Layout;

class TestComponent extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return <Child>
    </Child>

  }
}

class Child extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {





    return (
      <>

        <Link to="/search?user=andre">Andre</Link> |
            <Link to="/search?user=irena">Irena</Link> |
            <Link to="/test">About</Link> |

       <Footer><Card>Track and visualize Time Series data</Card></Footer>

      </>
    )
  }
}

export default TestComponent;
