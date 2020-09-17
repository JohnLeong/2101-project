import React, { Fragment, useEffect, useState } from "react";
import { ExampleHeader } from "../Components/ExampleHeader";
import { ExampleFooter } from "../Components/ExampleFooter";
import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css";

export const ExamplePage2 = () => {
  //This is how to declare variables that can be changed in the page, aka states
  // E.g.
  // const [variableName, setVariableName] = useState(initial value for the variable);
  //To change the variable value: setVariableName(new value)
  const [exampleList, setExampleList] = useState([]);

  useEffect(() => {
    //This gets called when the page is loaded
    //You can write any javascript code here
    console.log("Page loaded!");
    setExampleList(["ListItem1", "ListItem2", "ListItem3"])
  }, []);

  return (
    <Fragment>
      <ExampleHeader />
      <p>This is an example page</p>
      {exampleList.map((item) => (
        <p>{item}</p>
      ))}
      <ExampleFooter />
    </Fragment>
  );
};
