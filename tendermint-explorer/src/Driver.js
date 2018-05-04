import React, { Component, Fragment } from 'react'
import { Alert, Jumbotron, Container, Row, Col } from 'reactstrap'

import { checkHealth, initChain } from './services/TendermintService'
import { logout } from './services/AuthService'

import Navigation from './components/Navigation'
import StatusBar from './components/StatusBar'
import DriverForm from './components/DriverForm'

// Component

class Driver extends Component {

  state = {
    online: false,
    chainInited: false,
    tendermint: undefined,
    error: undefined,
    warning: undefined
  }

  // Life

  componentWillMount () {
    this.checkHealth()
  }

  // Private 

  checkHealth = async () => {
    const { status, response } = await checkHealth()
    this.changeState(status, response)
  }

  startTrip = async (seed, rules) => {
    const { status, response } = await initChain(seed, rules)
    this.changeState(status, response)
    console.log("RESPONSE", response);
    
    if (response && response["hash"]) {
      this.setState({ chainInited: true })
    }
  }

  changeState = (status, response) => {
    if (status === 200 && response) {
      this.setState({
        online: true,
        tendermint: response,
        error: undefined,
        warning: undefined
      })
    } else if (status === 401) {
      logout()
    } else if (status === 404) {
      this.setState({
        online: false,
        tendermint: undefined,
        error: "Not internet connection or server unavailable",
        warning: undefined
      })
    } else if (status === 503) {
      this.setState({
        online: false,
        tendermint: undefined,
        error: response,
        warning: undefined
      })
    } else {
      if (response) {
        this.setState({ warning: response })
      } else {
        this.setState({ warning: "Tendermint have responed with an empty message" })
      }
    }
  }

  // Render

  renderSuccess = (msg) => {
    return (
      <Row>
        <Col xs="12">
          <Alert color="success">{ msg }</Alert>
        </Col>
      </Row>
    )
  }

  renderWarning = (warning) => {
    return (
      <Row>
        <Col xs="12">
          <Alert color="warning">{ warning }</Alert>
        </Col>
      </Row>
    )
  }

  renderError = (err) => {
    return (
      <Row>
        <Col xs="12">
          <Alert color="danger">{ err }</Alert>
        </Col>
      </Row>
    )
  }

  renderDriverForm = () => (
    <Row>
      <Col xs="12" md={{ size: 10, offset: 1 }} lg={{ size: 8, offset: 2 }}>
        <DriverForm onStartTrip={this.startTrip}/>
      </Col>
    </Row>
  )

  render() {
    const { online, chainInited } = this.state

    return (
      <Fragment>
        <Navigation/>
        
        <div className="driver">
          <Jumbotron>
            <Container>
              { this.state.chainInited && this.renderSuccess("Chain has been initiated. All details now available to the buyer.") }
              { this.state.warning && this.renderWarning(this.state.warning) }
              { this.state.error && this.renderError(this.state.error) }

              <Row>
                <Col xs="12" md={{ size: 10, offset: 1 }} lg={{ size: 8, offset: 2 }}>
                  <StatusBar online={ online || false } chainInited={ chainInited || false } />
                </Col>
              </Row>

              { !this.state.chainInited && this.renderDriverForm() }
            </Container>
          </Jumbotron>
        </div>
      </Fragment>
    )
  }
}

export default Driver
