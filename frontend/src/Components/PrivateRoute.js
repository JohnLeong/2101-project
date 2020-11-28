import React from 'react'
import { Redirect, Route } from 'react-router-dom'
import Cookies from 'js-cookie'
import { getClaims } from '../TokenClaims';

const PrivateRoute = ({ component: Component, roles, ...rest }) => {

  const isLoggedIn = Cookies.get("token") != null;
  const isAuthorized = roles.includes(getClaims().role);

  console.log("Logged in");
  console.log(isLoggedIn);
  console.log("Auth");
  console.log(isAuthorized);
  console.log("Role");
  console.log(getClaims().role);

  return (
    <Route
      {...rest}
      render={props =>
        (isLoggedIn && isAuthorized) ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        )
      }
    />
  )
}

export default PrivateRoute