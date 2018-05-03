import React, { Component } from 'react'
import { Jumbotron, Container, Row, Col } from 'reactstrap'

import { initChain } from './services/TendermintService'

import StatusBar from './components/StatusBar'
import DriverForm from './components/DriverForm'

// Component

class Driver extends Component {

  state = {
    tendermint: {
      data: {}
    },
    chain_started: false
  }

  // Render

  render() {
    const { data, online } = this.state.tendermint
    const { chain_initilized } = data

    return (
      <div className="driver">
        <Jumbotron>
          <Container>
            <Row>
              <Col xs="12" md={{ size: 10, offset: 1 }} lg={{ size: 8, offset: 2 }}>
                <StatusBar online={ online || false } chainInitialized={ chain_initilized || false } />
              </Col>
            </Row>

            <Row>
              <Col xs="12" md={{ size: 10, offset: 1 }} lg={{ size: 8, offset: 2 }}>
                <DriverForm onStartTrip={initChain} />
              </Col>
            </Row>
          </Container>
        </Jumbotron>
      </div>
    );
  }
}

export default Driver
