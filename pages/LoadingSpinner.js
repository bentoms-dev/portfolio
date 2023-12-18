import React from "react";
import { PropagateLoader } from "react-spinners";

const styles = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh'
}

const LoadingSpinner = () => {
    return (
        <div style={styles}>
            <PropagateLoader color="#91CE30" />
        </div>
    )
}

export default LoadingSpinner;

