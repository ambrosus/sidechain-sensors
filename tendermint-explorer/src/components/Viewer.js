import React, { Component } from 'react';
import axios from 'axios';
import config from '../config';
import { Button, Container, Input, Row, Label, FormGroup } from 'reactstrap';
import {CSVLink} from 'react-csv';
import _ from 'lodash';

import ReactTable from 'react-table'
import 'react-table/react-table.css'

class Viewer extends Component {

  constructor() {
    super()
    this.state = {seed: "", blocks: [['key', 'value', 'timestamp']], loaded: false}
  }

  componentDidMount() {
    axios.defaults.headers.common['Authorization'] = "Bearer " + localStorage.getItem('access_token');
    axios.get(config.API_BACKEND + "/seed")
      .then(function (res) {
        let data = JSON.parse(res.data)
        this.setState({seed:  data.value.slice(4, data.value.length)})
      }.bind(this))
    this.featchData();
  }

  getData(height) {
    return axios.get(config.API_BACKEND + `/blocks?height=${height}`)
    .then(function (res) {
      if (res.data.length > 5) {
        let data = JSON.parse(res.data)
        res = _.filter(data,
            (i) => i.tags ?
                    _.filter(i.tags, (t) => t.key == "app.creator")
                    : false)
            .map((i) => i.tags)
            .map(function(i) {
              return _.map(i, (v) => v.valueString)
            })
        this.state.blocks.push(res[0])
        this.setState({blocks: this.state.blocks})
      }
    }.bind(this))
  }

  featchData() {
    let height = 0;
    axios.get(config.API_BACKEND + "/health")
      .then(function (res) {
        return JSON.parse(res.data).result.response.last_block_height
      }.bind(this))
      .then(function (height) {
        for (var i = 1; i <= height; i++) {
          this.getData(i)
        }
        this.setState({loaded: true})
      }.bind(this))
  }

  render() {
    return (
        <div className="App">
        <Container className="pt-3">
          <FormGroup>
          <Row className="col-md-12">
          <Row className="col-md-12 mt-3">
                  <Label>Blocks: </Label>
            </Row>
            <ReactTable
              data={this.state.blocks}
              columns={[
                {
                  id: "key",
                  accessor: d => d[0]
                },
                {
                  id: "value",
                  accessor: d => d[1]
                },
                {
                  id: "timestamp",
                  accessor: d => d[2]
                }

              ]}
              defaultPageSize={10}
              className="-striped -highlight"
            />
            <Row className="col-md-12 mt-3">
                  <Label>Chain seed: </Label>
            </Row>
            <Row className="col-md-12 pt-3">
                <Input id="seed" placeholder="Seed" value={this.state.seed} readOnly={true} name="seed"/>
            </Row>
            <Row className="col-md-12 pt-3">
              {(this.state.loaded && this.state.blocks.length > 1) ?
                (<CSVLink data={this.state.blocks} filename="tendermint-export.csv">Export Chain Data</CSVLink>) :
                (<p>Data loading from blockchain. Wait for link here</p>)
              }
            </Row>
          </Row>
        </FormGroup>
        </Container>
        </div>
    )
  }
}

export default Viewer;
