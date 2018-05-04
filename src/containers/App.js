import React, { Fragment } from 'react'

import Footer from '../components/Footer'

// Component

export default (props) => {
    const childrenWithProps = React.Children.map(
        props.children,
        child => React.cloneElement(child, props)
    )

    return (
        <Fragment>
            { childrenWithProps }
            <Footer/>
        </Fragment>
    )
}