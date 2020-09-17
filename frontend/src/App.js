import React from "react";
import "./App.css";
import { ExamplePage } from "./Pages/ExamplePage";
import { DefaultPage } from "./Pages/DefaultPage";
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ExamplePage2 } from "./Pages/ExamplePage2";

function App() {
  return (
    <BrowserRouter>
      <div>
        <Switch>
          <Route exact path="/" component={DefaultPage} />
          <Route path="/example" component={ExamplePage} />
          <Route path="/example2" component={ExamplePage2} />
          {/* <Route component={NotFoundPage} /> */}
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
