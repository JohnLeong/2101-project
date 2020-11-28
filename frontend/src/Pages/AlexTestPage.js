import React, { Component, Fragment, useEffect, useState } from "react";
import { ExampleHeader } from "../Components/ExampleHeader";
import { ExampleFooter } from "../Components/ExampleFooter";
import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css";
import ComponentManagement from "../Control/componentManagement";
import SubComponentManagement from "../Control/SubComponentManagement";

export const AlexTestPage = () => {
  useEffect(() => {
    //This gets called when the page is loaded
    //You can write any javascript code here
    console.log("Page loaded!");

    //programming logic
    const loadData = async () => {
        // calls to the control classes
        //const component = await ComponentManagement.getComponent("5f8ed1b166ea0039a87b3bf3");
        // await ComponentManagement.updateComponent(new ModuleComponent("5f8ed1b166ea0039a87b3bf3", "Online Quiz 1", "Class test", 25));
        // console.log(component);

        // determine success?
        // const subcomponent = await SubComponentManagement.createSubComponent("5f8ed1b166ea0039a87b3bf3","Section D",30);
        // console.log("boundary");
        // console.log(subcomponent);

        const getAllSubComponent = await SubComponentManagement.getAllSubComponent();
        console.log(getAllSubComponent);
    }
    
    //function call
    loadData();

  }, []);

  return (
    <Fragment>
      <ExampleHeader />
      <p>This is Alex's Test Page</p>
      <ExampleFooter />
    </Fragment>
  );
};