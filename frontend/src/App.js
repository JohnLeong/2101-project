import React from "react";
import "./App.css";
import { ExamplePage } from "./Pages/ExamplePage";
import { DefaultPage } from "./Pages/DefaultPage";
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ExamplePage2 } from "./Pages/ExamplePage2";
import { LoginPage } from "./Pages/LoginPage";
import { UploadCsvPage } from "./Pages/UploadCsvPage";
import PrivateRoute from "./Components/PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <div>
        <Switch>
          <Route exact path="/" component={DefaultPage} />
          <Route path="/example" component={ExamplePage} />
          <Route path="/example2" component={ExamplePage2} />
          <Route path="/login" component={LoginPage} />
          <Route path="/uploadcsv" component={UploadCsvPage} />
          <PrivateRoute path="/test" component={ExamplePage} roles={[1, 2]}/>
          {/* <Route component={NotFoundPage} /> */}
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
