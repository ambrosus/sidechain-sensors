import React, { Component } from 'react'
import { Alert, Jumbotron, Container, Row, Col } from 'reactstrap'

import { health as tenderHealth, initChain } from './services/TendermintService'

import StatusBar from './components/StatusBar'
import DriverForm from './components/DriverForm'

// Component

class Driver extends Component {

  state = {
    online: false,
    tendermint: undefined,
    chainInited: false,
    error: undefined,
    warning: undefined
  }

  // Life

  componentWillMount () {
    this.checkHealth()
  }

  // Private

  async checkHealth () {
    const { status, response } = await tenderHealth()

    if (status === 200) {
      this.setState({
        online: true,
        tendermint: response,
        error: undefined,
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
      this.setState({
        warning: response
      })
    }
  }

  startTrip = () => {
    // if (JSON.parse(data.result.response.data).chain_initilized) {
    //   window.location.href = "/chain-started";
    // }
  }

  // Render

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

  render() {
    const { online, chainInited } = this.state

    return (
      <div className="driver">
        <Jumbotron>
          <Container>
            { this.state.warning && this.renderWarning(this.state.warning) }
            { this.state.error && this.renderError(this.state.error) }

            <Row>
              <Col xs="12" md={{ size: 10, offset: 1 }} lg={{ size: 8, offset: 2 }}>
                <StatusBar online={ online || false } chainInited={ chainInited || false } />
              </Col>
            </Row>

            <Row>
              <Col xs="12" md={{ size: 10, offset: 1 }} lg={{ size: 8, offset: 2 }}>
                <DriverForm onStartTrip={ this.startTrip } />
              </Col>
            </Row>
          </Container>
        </Jumbotron>
      </div>
    );
  }
}

export default Driver
