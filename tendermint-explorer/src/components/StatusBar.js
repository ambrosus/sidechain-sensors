import React, { Component } from 'react'
import { bool } from 'prop-types'
import { Row, Col } from 'reactstrap'

import '../app.css'
import Indicator from './Indicator'

// Component

const StatusBar = (props) => (
    <div className="status-bar">
        <Row>
            <Col className="status-bar__title scol-xs-12 col-md-4 col-lg-3 col-sm-offset-0 col-md-offset-4">
                <h3>Blockchain Status</h3>
            </Col>
        </Row>

        <Row>
            <Col className="status-bar__indicator col-xs-12 col-md-3 col-lg-3">
                <Indicator title="Tendermint:" isSuccess={ props.online } textSuccess="Online" textFailure="Offline"/>
            </Col>
                
            <Col className="status-bar__indicator col-xs-12 col-md-3 col-lg-3"> 
                <Indicator title="Chain:" isSuccess={ props.chainInitialized } textSuccess="Started" textFailure="Not started"/>
            </Col>
        </Row>
    </div>
)

// Export

StatusBar.contextTypes = {
    online: bool.isRequired,
    chainInitialized: bool.isRequired
}

export default StatusBar;