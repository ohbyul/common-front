import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const AuthRoute = ({ authenticated, component: Component, render, redirect, ...rest }) => {
    return (
        <>
            <Route
                {...rest}
                render={(props) =>
                    authenticated ? (
                        render ? (
                            render(props)
                        ) : (
                            <Component {...props} />
                        )
                    ) : (
                        <Redirect
                            to={{ pathname: redirect, state: { from: props.location } }}
                        />
                    )
                }
            />
        </>
    )
}

export default AuthRoute