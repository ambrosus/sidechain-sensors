import React from 'react'
import { bool } from 'prop-types'
import { Container, Row, Col } from 'reactstrap'

import '../app.css'
import Indicator from './Indicator'

// Component

const StatusBar = (props) => (
    <div className="status-bar">
        <Container>
            <Row>
                <Col xs="12" className="status-bar__title">
                    <h3>Blockchain Status</h3>
                </Col>
            </Row>

            <Row>
                <Col xs={{ size: 12, order: 1 }} md={{ size: 4, offset: 4 }} className="status-bar__indicator">
                    <Indicator title="Tendermint:" isSuccess={ props.online } textSuccess="Online" textFailure="Offline"/>
                </Col>
                    
                <Col xs={{ size: 12, order: 2 }} md={{ size: 4 }} className="status-bar__indicator"> 
                    <Indicator title="Chain:" isSuccess={ props.chainInitialized } textSuccess="Started" textFailure="Not started"/>
                </Col>
            </Row>
        </Container>
    </div>
)

// Export

StatusBar.contextTypes = {
    online: bool.isRequired,
    chainInitialized: bool.isRequired
}

export default StatusBar;