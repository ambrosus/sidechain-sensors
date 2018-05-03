import React from 'react'
import { Navbar, Button } from 'reactstrap'

import { logout, isLoggedIn } from '../services/AuthService'

// Component

export default () => (
    <div className="header">
        <Navbar>
            { isLoggedIn() && <Button color="danger" onClick={ logout }>Sign out</Button> }
        </Navbar>
    </div>
)