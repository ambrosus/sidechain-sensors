import React, { Component } from 'react';
import './App.css';
import { Button, Container, Input, Row, Label, FormGroup } from 'reactstrap';
import Rules from './components/Rules'
import axios from 'axios';
import config from './config';
import TendermintStatus from './components/TendermintStatus'
import _ from 'lodash'

class App extends Component {
  constructor() {
    super();
    this.state = {rules: '', seed: '', seedError: false, rulesError: false, tendermint: {data: {}}, chain_started: false};
    this.handleInputChange = this.handleInputChange.bind(this);
    this.startTrip = this.startTrip.bind(this);
  }
  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }
  componentDidMount() {
    console.log("componentDidMount()");
    axios.defaults.headers.common['Authorization'] = "Bearer " + localStorage.getItem('access_token');
    axios.get(config.API_BACKEND + "/health")
      .then(function (res) {
        let data = JSON.parse(res.data)
        this.setState({tendermint: {
          online: data.result ? true : false,
          data: data.result ? JSON.parse(data.result.response.data) : null
        }})
        if (JSON.parse(data.result.response.data).chain_initilized) window.location.href = "/chain-started";
      }.bind(this))
  }
  startTrip(event) {
    if (this.state.seed.length < 8) { this.setState({seedError: true}); return }
    if (this.state.rules.length < 8) { this.setState({rulesError: true}); return }
    let data = {
      seed: this.state.seed,
      rules: this.state.rules
    }
    axios.post(config.API_BACKEND + "/initilize-chain", data)
    .then((res) => {
      if (JSON.parse(res.data).result.hash) {
        window.location.href = "/chain-started";
      }
    })
  }
  render() {
    return (
      <div className="App">
        <Container className="pt-3">
          <TendermintStatus status={this.state.tendermint} />
          <FormGroup>
          <Row className="col-md-12">
            <Row className="col-md-12 pt-3">
                <Input id="seed" placeholder="Seed" value={this.state.seed} className={this.state.seedError ? "is-invalid" : ""} name="seed" onChange={this.handleInputChange}/>
            </Row>
            <Row className="col-md-12 mt-3">
                  <Label>Set of rules: </Label>
            </Row>
            <Row className="col-md-12 pt-4">
                <Input id="seed" name="rules" value={this.state.rules} className={this.state.rulesError ? "is-invalid" : ""} onChange={this.handleInputChange} placeholder="Rules seed"/>
            </Row>
            <Rules rules={this.state.rules} />
            <Row className="col-md-12 pt-4">
                  <Button className="btn-success col-md-12" onClick={this.startTrip} >Initialize chain & start trip</Button>
            </Row>
          </Row>
          </FormGroup>
        </Container>
      </div>
    );
  }
}

export default App;
