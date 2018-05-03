import React from 'react'

import { logout, isLoggedIn } from '../services/TendermintService'

export default () => (
    <div>
        { !isLoggedIn() ? <p></p> : <button className="btn log" onClick={ logout }>Log out</button> }
    </div>
)