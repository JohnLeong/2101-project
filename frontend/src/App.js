import React from "react";
import "./App.css";
import { Route, Switch, Redirect, BrowserRouter } from "react-router-dom";
 import { LoginPage } from "./Pages/LoginPage";

import Admin from "./layouts/Admin.js";

import "./assets/css/material-dashboard-react.css?v=1.9.0";
import PrivateRoute from "./Components/PrivateRoute";
import GamificationPage from "./Pages/GamificationPage"

function App() {
  return (
    <BrowserRouter>
      <div>
        <Switch>
          <Route path="/login" component={LoginPage} />
          <PrivateRoute path="/student/gamification" component={GamificationPage} roles={[2]}/>
          <Route path="/admin" component={Admin} />
          <Redirect from="/" to="/login" />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
