import React, { Component } from 'react';
import { login, logout, isLoggedIn } from '../services/AuthService';

class NotAuthorized extends Component {
  render() {
    return (
        <div>
            <h3>
                You are not Authorized, please:
            </h3>
            <h3>
                <div className="row col-md-12">

                    <button className="btn btn-info log col-md-12" onClick={() => login("driver")}>Log In as Driver</button>
                    <hr/>
                    <p> or </p>
                    <hr/>
                    <button className="btn btn-info log col-md-12" onClick={() => login("buyer")}>Log In as Buyer</button>
                </div>
            </h3>
        </div>
    );
  }
}

export default NotAuthorized;
