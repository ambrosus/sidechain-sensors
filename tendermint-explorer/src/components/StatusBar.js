import React, { Component } from 'react'
import { bool } from 'prop-types'
import { Row, Col, Badge } from 'reactstrap'
import _ from 'lodash'

import '../app.css'
import Indicator from './Indicator'

// Component

const StatusBar = (props) => (
    <div className="status-bar">
        <Row>
            <Col className="col-xs-12">
                <h3 className="float-left">Blockchain Status</h3>
            </Col>
        </Row>

        <Row>
            <Col className="status-bar__indicator col-xs-12 col-md-3 col-lg-3">
                <Indicator title="Tendermint:" success={ props.online } textSuccess="Online" textFailure="Offline" className="float-left"/>
            </Col>
            
            <Col className="status-bar__indicator col-xs-12 col-md-3 col-lg-3"> 
                <Indicator title="Chain:" success={ props.chainInited } textSuccess="Started" textFailure="Not started" className="float-left"/>
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