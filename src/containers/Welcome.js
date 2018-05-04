import React from 'react';
import { Alert, Jumbotron, Container, Row, Col, Button } from 'reactstrap'

import { userHasScopes, login } from '../services/AuthService'

// Component

const renderError = (err) => {
    if (!err || err === "") return null

    return (
        <Row>
            <Col xs="12">
                <Alert color="danger">{err}</Alert>
            </Col>
        </Row>
    )
}

export default (props) => {
    const error = props.location.state.error

    return (
        <div className="welcome">
            <Jumbotron>
                <Container>
                    { error && renderError(error) }

                    <Row>
                        <Col xs="12">
                            <h1 className="heading-primary">
                                <span className="heading-primary--main">Ambrosus</span>
                                <span className="heading-primary--sub">please sign in</span>
                            </h1>
                        </Col>
                    </Row>

                    <Row>
                        <Col xs={{ size: 10, order: 1, offset: 1 }} sm={{ size: 8, offset: 2 }} md={{ size: 6, offset: 3 }} lg={{ size: 4, offset: 4 }}>
                            <Button color="success" block onClick={() => login("driver")}>I'm a Driver</Button>
                        </Col>

                        <Col xs={{ size: 10, order: 2, offset: 1 }} sm={{ size: 8, offset: 2 }} md={{ size: 6, offset: 3 }} lg={{ size: 4, offset: 4 }} className="pt-4">
                            <Button color="success" block onClick={() => login("buyer")}>I'm a Buyer</Button>
                        </Col>
                    </Row>

                    <Row>
                        <Col md="6">
                            <h1>{userHasScopes(["create:transactions"])}</h1>
                        </Col>
                    </Row>
                </Container>
            </Jumbotron>
        </div>
    )
}
