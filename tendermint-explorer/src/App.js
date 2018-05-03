import React, { Fragment } from 'react'

import Navigation from './components/Navigation'
import Footer from './components/Footer'

// Component

export default (props) => {
    const childrenWithProps = React.Children.map(
        props.children,
        child => React.cloneElement(child, props)
    )

    return (
        <Fragment>
            <Navigation/>
            { childrenWithProps }
            <Footer/>
        </Fragment>
    )
}