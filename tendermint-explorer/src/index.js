import React from 'react';
import ReactDOM from 'react-dom';
import { Main } from 'reactstrap';
import {
    BrowserRouter as Router,
    Route,
    Link,
    Switch,
    Redirect
} from "react-router-dom";

import registerServiceWorker from './registerServiceWorker';
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
import { userHasScopes, logout, isLoggedIn } from './services/AuthService';

import App from './App';
import Callback from './components/Callback'
import NotAuthorized from './components/NotAuthorized'
import NoMatch from './components/NoMatch'
import ChainStatus from './components/ChainStatus'
import Viewer from './components/Viewer'

// Component

const Root = () => (
    <div className="root">
        <main role="main" className="container mt-5">
            <Router>
                <Switch>
                    { (isLoggedIn()) ? (
                        (userHasScopes(["create:transactions"]) ? (
                            <Route path="/" exact component={ App } />
                        ) : (<Route path="/" exact component={ Viewer } />))
                        ) : (<Route path="/" exact component={ NotAuthorized } />)
                    }
                    <Route path="/callback" component={ Callback } />
                    <Route path="/chain-started" component={ ChainStatus } />
                    <Route component={ NoMatch } />
                </Switch>
            </Router>
        </main>

        <footer className="page-footer footer font-small blue pt-4 mt-4">
            <div className="container-fluid text-center text-md-left">
                <div className="row">
                    <div className="col-md-6">
                        <h1>{userHasScopes(["create:transactions"])}</h1>
                    </div>
                </div>
            </div>
            
            <div className="footer-copyright py-3 text-center">
                Ambrosus Tendermint Explorer
                <p> {(!isLoggedIn()) ? (<p></p>) : (<button className="btn log" onClick={() => logout()}>Log out</button>)} </p>
            </div>
        </footer>
    </div>
)

ReactDOM.render(< Root />, document.getElementById('root'));
registerServiceWorker();
