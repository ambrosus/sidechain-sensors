import React, { Component, Fragment } from 'react'
import ReactTable from 'react-table'
import { Alert, Jumbotron, Col, Form, Button, Container, Input, Row, Label, FormGroup } from 'reactstrap'
import { CSVLink } from 'react-csv'

import 'react-table/react-table.css'

import { checkHealth, getSeed, getData } from '../services/TendermintService'
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
    chainHeight: 0,
    seed: "",
    error: undefined,
    warning: undefined,
    blocks: [['key', 'value', 'timestamp']], 
    loaded: true
  }

  // Life

  async componentWillMount () {
    await this.checkHealth()
    await this.getSeed()
    await this.getData()
  }

  // Private 

  checkHealth = async () => {
    const queryResult = await checkHealth()
    const newState = changeState(queryResult, this.state)
    this.setState(newState)
  }

  getSeed = async () => {
    const queryResult = await getSeed()
    const newState = changeState(queryResult, this.state)
    this.setState(newState)
  }

  getData = async () => {
    const queryResult = await getData(this.state.chainHeight)
    const newState = changeState(queryResult, this.state)
    this.setState(newState)
  }

  // Render

  renderForm = (seed) => (
    <Row>
      <Col xs="12">
        <Form>
          <FormGroup>
            <Label for="seed">Seed</Label>
            <Input
              id="seed"
              name="seed"
              readOnly
              value={seed} />
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

    const { online, chainInited, seed } = this.state
    const isDataExists = this.state.blocks.length > -1
    console.log("STATE:", this.state);
    
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

              { this.state.online && !this.state.chainInited && this.renderForm(seed) }
              { this.state.online && !isDataExists && this.renderWarning("No data in chain") }
              { this.state.online && this.state.chainInited && this.renderTable() }
            </Container>
          </Jumbotron>
        </div>
      </Fragment>
    )
  }
}

export default Buyer;
