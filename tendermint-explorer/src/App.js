import React, { Component } from 'react'
import { Jumbotron, Container, Row, Col } from 'reactstrap'

import { initChain } from './services/TendermintService'

import StatusBar from './components/StatusBar'
import DriverForm from './components/DriverForm'

// Component

class App extends Component {

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
      <div className="app">
        <Jumbotron>
          <Container>
            <Row>
              <Col className="col-xs-12 col-md-10 col-lg-8 col-xl-8 offset-md-1 offset-lg-2 offset-xl-3">
                <StatusBar online={online || false} chainInitialized={chain_initilized || false} />
              </Col>
            </Row>

            <Row>
              <Col className="col-xs-12 col-md-10 col-lg-8 col-xl-6 offset-md-1 offset-lg-2 offset-xl-3">
                <DriverForm onStartTrip={initChain} />
              </Col>
            </Row>
          </Container>
        </Jumbotron>
      </div>
    );
  }
}

export default App
