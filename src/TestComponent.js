import React from 'react';


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
    return <h1> Just a test2 </h1>
  }
}

export default TestComponent;