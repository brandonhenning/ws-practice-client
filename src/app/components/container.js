import React from 'react';
import socketIOClient from 'socket.io-client';

class Container extends React.Component {
  constructor() {
    super();
    this.state = {
      response: false,
      api: 'http://127.0.0.1:4001' //TODO move to config
    };
  }

  componentDidMount() {
    const { endpoint } = this.state;
    const socket = socketIOClient(api);
    socket.on('getPrice', data => this.setState({ response: data }));
  }

  render() {
    const { response } = this.state;
    return (
      <div>
        {response
          ? <p>
              {response}
            </p>
          : <p>Loading...</p>}
      </div>
    );
  }
}

export default Container;
