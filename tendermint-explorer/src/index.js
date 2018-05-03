import React from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter as Router,
    Route,
    Switch
} from "react-router-dom";

import registerServiceWorker from './registerServiceWorker';
import 'bootstrap/dist/css/bootstrap.css';
import { userHasScopes, isLoggedIn } from './services/TendermintService';

import App from './App';
import Driver from './Driver';
import Callback from './components/Callback'
import Welcome from './components/Welcome'
import NoMatch from './components/NoMatch'
import ChainStatus from './components/ChainStatus'
import Buyer from './Buyer'

// Component

const Root = () => (
    <div className="root">
        <App>
            <Router>
                <Switch>
                    { (isLoggedIn()) ? (
                        (userHasScopes(["create:transactions"]) ? (
                            <Route path="/" exact component={ Driver } />
                        ) : (<Route path="/" exact component={ Buyer } />))
                        ) : (<Route path="/" exact component={ Welcome } />)
                    }
                    <Route path="/callback" component={ Callback } />
                    <Route path="/chain-started" component={ ChainStatus } />
                    <Route component={ NoMatch } />
                </Switch>
            </Router>
        </App>
    </div>
)

ReactDOM.render(<Root/>, document.getElementById('root'));
registerServiceWorker();
