
import { Box } from '@mui/material';
import React, { Component } from "react";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { version: null };
  }

  async componentDidMount() {
    const version = await window.ipc_handlers.ipc_twoWay({ type: 0 });
    this.setState({ version: version });
  }
  render() {

    return (
      <Box>
        test2
        <br />
        {this.state.version}
      </Box>
    );
  }
}

export default App;
