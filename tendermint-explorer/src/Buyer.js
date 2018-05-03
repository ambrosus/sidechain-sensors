import React, { Component, Fragment } from 'react'
import ReactTable from 'react-table'
import axios from 'axios'
import { Alert, Jumbotron, Col, Form, Button, Container, Input, Row, Label, FormGroup } from 'reactstrap'
import { CSVLink } from 'react-csv'
import _ from 'lodash'

import 'react-table/react-table.css'
import config from './config'

import Loader from './components/Loader'

// Components

class Buyer extends Component {

  // State

  state = {
    seed: "", 
    blocks: [['key', 'value', 'timestamp']], 
    loaded: true
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
    if (!this.state.loaded) {
      return <Loader loading/>
    }

    const isDataExists = this.state.blocks.length > -1
  
    return (
        <div className="buyer">
          <Jumbotron>
            <Container>
              { this.renderForm() }
              { !isDataExists && this.renderWarning("No data in chain") }
              { isDataExists && this.renderTable() }
            </Container>
          </Jumbotron>
        </div>
    )
  }
}

export default Buyer;
