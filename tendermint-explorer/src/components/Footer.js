import React from 'react'

import { userHasScopes, logout, isLoggedIn } from '../services/TendermintService';

// Component

export default () => (
    <footer className="footer">
        <div className="container">
            <div className="row">
                <div className="col-md-6">
                    <h1>{userHasScopes(["create:transactions"])}</h1>
                </div>
            </div>
        </div>

        <div className="">
            Ambrosus Tendermint Explorer
                        <p> {(!isLoggedIn()) ? (<p></p>) : (<button className="btn log" onClick={logout}>Log out</button>)} </p>
        </div>
    </footer>
)