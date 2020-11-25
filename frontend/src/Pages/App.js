import React from "react";
import "./App.css";
import { Route, Switch, Redirect, BrowserRouter } from "react-router-dom";
// import { ExamplePage } from "./Pages/ExamplePage";
// import { Dashboard } from "./Pages/Dashboard";
// import { ExamplePage2 } from "./Pages/ExamplePage2";
// import { LoginPage } from "./Pages/LoginPage";
// import { UploadCsvPage } from "./Pages/UploadCsvPage";
// import { TableList } from "./Pages/TableList";
// import PrivateRoute from "./Components/PrivateRoute";

import Admin from "./layouts/Admin.js";

import "./assets/css/material-dashboard-react.css?v=1.9.0";

function App() {
  return (
    <BrowserRouter>
      <div>
        <Switch>
          <Route path="/admin" component={Admin} />
          <Redirect from="/" to="/admin/dashboard" />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
