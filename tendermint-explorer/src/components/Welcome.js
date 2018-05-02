import React from 'react';
import { Jumbotron, Container, Row, Col, Button } from 'reactstrap'

import { login, logout, isLoggedIn } from '../services/TendermintService';

// Component

export default () => (
    <div className="welcome">
        <Jumbotron>
            <Container>
                <Row>
                    <Col className="col-xs-12 col-md-10 col-lg-8 col-xl-8 offset-md-1 offset-lg-2 offset-xl-3">
                        <h3>Welcome. Please sign in.</h3>
                    </Col>
                </Row>

                <Row>
                    <Col className="col-xs-12 col-md-10 col-lg-8 col-xl-8 offset-md-1 offset-lg-2 offset-xl-3">
                        <Button onClick={() => login("driver") }>I'm a Driver</Button>
                    </Col>

                    <Col className="col-xs-12 col-md-10 col-lg-8 col-xl-8 offset-md-1 offset-lg-2 offset-xl-3">
                        <Button onClick={() => login("buyer") }>I'm a Buyer</Button>
                    </Col>
                </Row>
            </Container>
        </Jumbotron>
    </div>
)
