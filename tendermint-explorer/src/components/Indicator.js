import React from 'react'
import { string, bool} from 'prop-types'
import { Badge } from 'reactstrap'

// Component

const Indicator = (props) => {
    const color = props.isSuccess ? "success" : "danger"
    const text = props.isSuccess ? props.textSuccess : props.textFailure

    return (
        <div className="indicator">
            <span className="indicator__label">{ props.title }</span> 
            <Badge color={ color }>{ text }</Badge>
        </div>
    )
}

// Export

Indicator.contextTypes = {
    title: string.isRequired,
    isSuccess: bool.isRequired,
    textSuccess: string.isRequired,
    textFailure: string.isRequired
}

export default Indicator