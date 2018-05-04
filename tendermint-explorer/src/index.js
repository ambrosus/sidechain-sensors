import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Switch } from "react-router-dom";

import history from './history'
import registerServiceWorker from './registerServiceWorker'
import 'bootstrap/dist/css/bootstrap.css'

import App from './App'
import Driver from './Driver'
import Callback from './components/Callback'
import Welcome from './components/Welcome'
import NoMatch from './components/NoMatch'
import ChainStatus from './components/ChainStatus'
import RequireAuth from './components/HOC/RequireAuth'
import Buyer from './Buyer'

// Component

const Root = () => {
    return (
        <div className="root">
            <App>
                <Router history={ history }>
                    <Switch>
                        <Route path="/" exact component={ Welcome } />
                        <Route path="/driver" exact component={ RequireAuth(Driver) } />
                        <Route path="/buyer" exact component={ RequireAuth(Buyer) } />
                        <Route path="/callback" component={ Callback } />
                        <Route path="/chain-started" component={ ChainStatus } />
                        <Route component={ NoMatch } />
                    </Switch>
                </Router>
            </App>
        </div>
    )
}

ReactDOM.render(<Root/>, document.getElementById('root'))
registerServiceWorker()
