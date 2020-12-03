import React from 'react'
import { Redirect, Route } from 'react-router-dom'
import AuthenticationManagement from '../Control/AuthenticationManagement';

const PrivateRoute = ({ component: Component, roles, ...rest }) => {
  
  return (
    <Route
      {...rest}
      render={props =>
        (AuthenticationManagement.authenticateUser(roles)) ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        )
      }
    />
  )
}

export default PrivateRoute