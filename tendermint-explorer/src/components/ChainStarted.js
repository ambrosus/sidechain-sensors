import React, { Component } from 'react';
import { Row} from 'reactstrap';

class ChainStarted extends Component {

  constructor() {
    super()
  }

  render() {
    return (
        <Row className="col-md-12 pt-3">
            <Row className="col-md-12 pt-3">
                <b> Chain already started</b>
            </Row>
            <Row className="col-md-12 pt-3">
                <b> Login as buyer to proceed </b>
            </Row>
        </Row>
    )
  }
}

export default ChainStarted;
