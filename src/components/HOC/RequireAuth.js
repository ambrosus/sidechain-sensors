import React, { Component } from 'react'

import history from '../../history'
import { isLoggedIn, logout } from '../../services/AuthService'

// Component

export default function (ComposedComponent) {
  class Authentication extends Component {

    componentWillMount () {
      if (!isLoggedIn()) logout()
    }

    componentWillUpdate (nextProps) {
      if (!isLoggedIn()) logout()
    }

    render () {
      return <ComposedComponent { ...this.props }/>
    }
  }

  return Authentication
}