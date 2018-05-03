import React from 'react'
import { Container, Row, Col } from 'reactstrap'

// Component

export default () => (
    <footer className="footer">
        <Container>
            <Row>
                <Col xs={{ size: 8, offset: 2 }} md={{ size: 6, offset: 3 }} className="text-center my-3">
                    <p>
                        <span className="footer--main">Ambrosus Tendermint Explorer</span>
                        <span className="footer--sub">by Edenlab LLC</span>
                    </p>
                </Col>
            </Row>
        </Container>
    </footer>
)