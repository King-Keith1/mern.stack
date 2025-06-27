import React from "react"

const GreetingBanner = (props) => {
    return (
        <div className="greeting-banner">
            <h5>Welcome to Movie Reviews!</h5>
            {props.user && (
                <p>Hello, {props.user.name}!</p>
            )}
        </div>
    )
}

export default GreetingBanner