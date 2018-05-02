import React, { Component } from 'react'

import { setIdToken, setAccessToken } from '../services/AuthService'

// Component

class Callback extends Component {

  componentDidMount() {
    setAccessToken();
    setIdToken();

    window.location.href = "/";
  }

  render() {
    return <div className="callback"></div>
  }
}

export default Callback;
