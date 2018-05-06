import React from 'react'
import { Container, Row, Col } from 'reactstrap'

import '../App.css'
import Indicator from './Indicator'

// Component

export default (props) => (
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
                    <Indicator title="Chain:" isSuccess={ props.chainInited } textSuccess="Started" textFailure="Not started"/>
                </Col>
            </Row>
        </Container>
    </div>
)