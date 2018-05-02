import React, { Component } from 'react'
import { bool } from 'prop-types'
import { Jumbotron, Row, Col, Badge } from 'reactstrap'
import _ from 'lodash'

import '../app.css'
import Indicator from './Indicator'

// Component

const StatusBar = (props) => (
    <div className="status-bar">
        <Row>
            <Col className="col-xs-12 col-md-3 col-lg-3">
                <h3>Blockchain Status</h3>
            </Col>
        </Row>

        <Row>
            <Col className="status-bar__indicator col-xs-12 col-md-3 col-lg-3">
                <Indicator title="Tendermint:" success={ props.online } textSuccess="Online" textFailure="Offline"/>
            </Col>
                
            <Col className="status-bar__indicator col-xs-12 col-md-3 col-lg-3"> 
                <Indicator title="Chain:" success={ props.chainInited } textSuccess="Started" textFailure="Not started"/>
            </Col>
        </Row>
    </div>
)

// Export

StatusBar.contextTypes = {
    online: bool.isRequired,
    chainInited: bool.isRequired
}

export default StatusBar;