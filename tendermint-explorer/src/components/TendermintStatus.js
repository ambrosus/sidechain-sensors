import React, { Component } from 'react';
import '../App.css';
import { Row, Badge } from 'reactstrap';
import _ from 'lodash';

class TendermintStatus extends Component {
    constructor(props) {
        super();
    }
    render() {
        return (
            <Row className="col-md-12 pt-3">
                <p> Tendermint status {
                    this.props.status.online ?
                    (<Badge color="success">Online</Badge >) :
                    (<Badge  color="danger">Offline</Badge >)
                    } </p>
                <p> Chain status  {
                    this.props.status.data.chain_initilized ?
                    (<Badge color="danger">Started</Badge >) :
                    (<Badge  color="success">Not started</Badge >)
                    } </p>
            </Row>
        );
    }
}

export default TendermintStatus;
