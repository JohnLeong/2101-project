import React from "react";
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from 'react-router-dom';
// @material-ui/icons
// import ArrowUpward from "@material-ui/icons/ArrowUpward";
// core components
import GridItem from "../Components/Grid/GridItem.js";
import GridContainer from "../Components/Grid/GridContainer.js";
import Card from "../Components/Card/Card.js";
import CardBody from "../Components/Card/CardBody.js";
import Cookies from "js-cookie";

import styles from "../assets/jss/material-dashboard-react/views/dashboardStyle.js";

// Images
import image1 from "../assets/img/Module1.jpg";
// import image2 from "../assets/img/Module2.jpg";
// import image3 from "../assets/img/Module3.jpeg";
import { getUserModulesUrl } from "../routes.js";

import "../App.css";

const useStyles = makeStyles(styles);

export default function Dashboard() {
  const classes = useStyles();
  const history = useHistory();
  const MAX_LENGTH = 100;                                     // Max char length of module description displayed
  const [moduleData, setModuleData] = React.useState(null);

  React.useEffect(() => {
    console.log("Page loaded!");

    const loadData = () => {
      fetch(getUserModulesUrl, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + Cookies.get("token"),
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            throw new Error("An error occurred");
          }
        })
        .then((jsonData) => {
          setModuleData(jsonData);
          console.log(jsonData);
        })
        .catch((err) => {
          console.error("Error: " + err);
        });
    };

    loadData();
  }, []);

  const navigateToModule = (moduleId) => {
    console.log(moduleId);
    history.push("/admin/moduleclasses/" + moduleId);
  };

  return (
    <div>
      <GridContainer>
        {moduleData == null ? (
          <p key="loading">Loading</p>
        ) : (
          moduleData.map((module) => (
              // Each Module Item 
              <GridItem
                xs={12}
                sm={12}
                md={4}
                key={module._id}
                onClick={() => navigateToModule(module._id)}
              >
                <Card chart style={{marginBottom: 0, cursor: 'pointer'}}>
                  <img src={image1} height="280px" alt="Module 1" />
                  <CardBody style={{height:'150px'}}>
                    <h4 className={classes.cardTitle}>{module.name}</h4>
                    {module.description.length > MAX_LENGTH ? ( 
                      <p className={classes.cardCategory}>{`${module.description.substring(0, MAX_LENGTH)}...`}</p>
                    ): <p></p>
                    }
                  </CardBody>
                </Card>
              </GridItem>
          ))
        )}
      </GridContainer>
    </div>
  );
}
