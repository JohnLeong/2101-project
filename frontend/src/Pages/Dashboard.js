import React from "react";
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons
// import ArrowUpward from "@material-ui/icons/ArrowUpward";
// core components
import GridItem from "../Components/Grid/GridItem.js";
import GridContainer from "../Components/Grid/GridContainer.js";
import Card from "../Components/Card/Card.js";
import CardBody from "../Components/Card/CardBody.js";

import styles from "../assets/jss/material-dashboard-react/views/dashboardStyle.js";

// Images
import module1 from "../assets/img/Module1.jpg";
import module2 from "../assets/img/Module2.jpg";
import module3 from "../assets/img/Module3.jpeg";

const useStyles = makeStyles(styles);

export default function Dashboard() {
  const classes = useStyles();
  return (
    <div>
      {/* MODULE 1 */}
      <GridContainer>
        <GridItem xs={12} sm={12} md={4}>
          <Card chart>
            <img src={module1} height="280" alt="Module 1" />
            <CardBody>
              <h4 className={classes.cardTitle}>ICT 2x01</h4>
              <p className={classes.cardCategory}>
                Intro to Software Engineering
              </p>
            </CardBody>
          </Card>
        </GridItem>
        {/* MODULE 2 */}
        <GridItem xs={12} sm={12} md={4}>
          <Card chart>
            <img src={module2} height="280" alt="Module 2" />
            <CardBody>
              <h4 className={classes.cardTitle}>ICT 2202</h4>
              <p className={classes.cardCategory}>
                Digital Forensics
              </p>
            </CardBody>
          </Card>
        </GridItem>
        {/* MODULE 3 */}
        <GridItem xs={12} sm={12} md={4}>
          <Card chart>
            <img src={module3} height="280" alt="Module 3" />
            <CardBody>
              <h4 className={classes.cardTitle}>ICT 2203</h4>
              <p className={classes.cardCategory}>
                Network Security
              </p>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
      
    </div>
  );
}
