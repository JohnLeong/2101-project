import React, { Fragment, useEffect, useState } from "react";
import { ExampleHeader } from "../Components/ExampleHeader";
import { ExampleFooter } from "../Components/ExampleFooter";
import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css";

export const ExamplePage = () => {
  //This is how to declare variables that can be changed in the page, aka states
  // E.g.
  // const [variableName, setVariableName] = useState(initial value for the variable);
  //To change the variable value: setVariableName(new value)
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    //This gets called when the page is loaded
    //You can write any javascript code here
    console.log("Page loaded!");
  }, []);

  //This arrow function gets called when the button is clicked
  const onButtonClick = () => {
    setCounter(counter + 1);
  };

  return (
    <Fragment>
      <ExampleHeader />
      <p>This is an example page</p>
      <button onClick={onButtonClick}>Increase counter</button>
      <p>{counter}</p>
      <ExampleFooter />
    </Fragment>
  );
};
