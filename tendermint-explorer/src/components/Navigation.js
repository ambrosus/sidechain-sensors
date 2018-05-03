import React from 'react'
import { Navbar, Button } from 'reactstrap'

import { logout, isLoggedIn } from '../services/TendermintService'

// Component

export default () => {
    if (!isLoggedIn()) {
        return <div></div>
    }

    return (
        <div className="header">
            <Navbar>
                <Button color="danger" onClick={ logout }>Sign out</Button>
            </Navbar>  
        </div> 
    )
}