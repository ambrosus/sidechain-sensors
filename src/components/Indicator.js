import React from 'react'
import { Badge } from 'reactstrap'

// Component

export default (props) => {
    const color = props.isSuccess ? "success" : "danger"
    const text = props.isSuccess ? props.textSuccess : props.textFailure

    return (
        <div className="indicator">
            <span className="indicator__label">{ props.title }</span> 
            <Badge color={ color }>{ text }</Badge>
        </div>
    )
}