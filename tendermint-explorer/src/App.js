import React, { Component, Fragment } from 'react'

import { userHasScopes, logout, isLoggedIn } from './services/TendermintService';

class App extends Component {

    logout = () => {
        
    }

    render () {
        const childrenWithProps = React.Children.map(
            this.props.children,
            child => React.cloneElement(child, this.props)
        )

        return (
            <Fragment>
                { childrenWithProps }

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
                        <p> {(!isLoggedIn()) ? (<p></p>) : (<button className="btn log" onClick={ logout }>Log out</button>)} </p>
                    </div>
                </footer>
            </Fragment>
        )
    }
}

export default App;