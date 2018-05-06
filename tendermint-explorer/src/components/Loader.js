import React from 'react'
import { BeatLoader } from 'react-spinners'

// Component

export default (props) => (
    <div className="loader">
        <h3>Loading Ambrosus Network</h3>
        <BeatLoader color="#fff" loading={ props.loading } />
    </div>
)