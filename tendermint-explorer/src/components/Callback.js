import React, { Component } from 'react'

import history from '../history'
import { setIdToken, setAccessToken, userHasScopes } from '../services/AuthService'

// Component

class Callback extends Component {

  componentDidMount() {
    setAccessToken();
    setIdToken();

    const isDriver = userHasScopes(["create:transactions"])
    history.push(isDriver ? '/driver' : '/buyer')
  }

  render() {
    return <div></div>
  }
}

export default Callback;
