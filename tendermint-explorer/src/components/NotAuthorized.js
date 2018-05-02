import React, { Component } from 'react';

import { login, logout, isLoggedIn } from '../services/TendermintService';

export default () => (
    <div className="not-authorized">
        <h3>You are not Authorized, please:</h3>

        <div className="row col-md-12">
            <button className="log btn btn-info col-md-12" onClick={() => login("driver")}>Log In as Driver</button>
            <hr/>
            <p>or</p>
            <hr/>
            <button className="log btn btn-info col-md-12" onClick={() => login("buyer")}>Log In as Buyer</button>
        </div>
    </div>
)
