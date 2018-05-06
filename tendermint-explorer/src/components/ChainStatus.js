import React from 'react';
import { Row, Col } from 'reactstrap';

// Component

export default () => (
    <Row className="chain-status pt-3">
        <Col md="12" className="pt-3">
            <b>Chain already started</b>
        </Col>

        <Col md="12" className="pt-3">
            <b>Login as buyer to proceed</b>
        </Col>
    </Row>
)
