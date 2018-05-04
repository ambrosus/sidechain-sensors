import React, { Component, Fragment } from 'react'
import ReactTable from 'react-table'
import { Alert, Jumbotron, Col, Form, Button, Container, Input, Row, Label, FormGroup } from 'reactstrap'
import { CSVLink } from 'react-csv'

import 'react-table/react-table.css'

import { checkHealth } from '../services/TendermintService'
import { changeState } from '../services/TendermintFSM'

import Navigation from '../components/Navigation'
import Loader from '../components/Loader'
import StatusBar from '../components/StatusBar'

// Components

class Buyer extends Component {

  // State

  state = {
    online: false,
    chainInited: false,
    tendermint: undefined,
    error: undefined,
    warning: undefined,
    seed: "", 
    blocks: [['key', 'value', 'timestamp']], 
    loaded: true
  }

  // Life

  componentWillMount () {
    this.checkHealth()
  }

  // Private 

  checkHealth = async () => {
    const { status, response } = await checkHealth()
    const newState = changeState(status, response)

    if (newState) {
      this.setState({ ...this.state, ...newState })
    }
  }

  // Render

  renderForm = () => (
    <Row>
      <Col xs="12">
        <Form>
          <FormGroup>
            <Label for="seed">Seed</Label>
            <Input
              id="seed"
              name="seed"
              readOnly
              value={this.state.seed} />
          </FormGroup>
        </Form>
      </Col>
    </Row>
  )

  renderTable = () => {
    const columns = [
      { id: "key", accessor: d => d[0] }, 
      { id: "value", accessor: d => d[1] }, 
      { id: "timestamp", accessor: d => d[2] }
    ]

    return (
      <Fragment>
        <Row className="py-2">
          <Col xs="12">
            <ReactTable data={ this.state.blocks } columns={ columns } defaultPageSize={ 10 } className="-striped -highlight"/>
          </Col>
        </Row>

        <Row className="py-2">
          <Col xs="12">
            <Button block color="success">
              <CSVLink data={ this.state.blocks } filename="tendermint-export.csv">Export Chain Data</CSVLink>
            </Button>
          </Col>
        </Row>
      </Fragment>
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

  render() {
    if (!this.state.loaded) return <Loader loading/>

    const { online, chainInited } = this.state
    const isDataExists = this.state.blocks.length > -1
  
    return (
      <Fragment>
        <Navigation/>

        <div className="buyer">
          <Jumbotron>
            <Container>
              <Row>
                <Col xs="12" md={{ size: 10, offset: 1 }} lg={{ size: 8, offset: 2 }}>
                  <StatusBar online={ online || false } chainInited={ chainInited || false } />
                </Col>
              </Row>

              { this.renderForm() }
              { !isDataExists && this.renderWarning("No data in chain") }
              { isDataExists && this.renderTable() }
            </Container>
          </Jumbotron>
        </div>
      </Fragment>
    )
  }
}

export default Buyer;
