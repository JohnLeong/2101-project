import React from "react";
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
import { useHistory, useParams } from "react-router-dom";
// @material-ui/icons
// import ArrowUpward from "@material-ui/icons/ArrowUpward";
// core components
import GridItem from "../Components/Grid/GridItem.js";
import GridContainer from "../Components/Grid/GridContainer.js";
import Card from "../Components/Card/Card.js";
import CardBody from "../Components/Card/CardBody.js";

import styles from "../assets/jss/material-dashboard-react/views/dashboardStyle.js";

// Images
import ClassManagement from "../Control/ClassManagement";

const useStyles = makeStyles(styles);


export default function Dashboard() {
  const classes = useStyles();
  const { moduleId } = useParams();
  const history = useHistory();

  const [moduleclasses, setClasses] = React.useState(null);
  

  React.useEffect(() => {
    console.log("Page loaded!");

    const loadData = async () => {
      const classes = await ClassManagement.getAllClasses(moduleId);
      setClasses(classes);
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navigateToClass = (classId) => {
    console.log(classId);
    history.push("/admin/classgrades/" + classId);
  };

  return (
    <div className={classes.root}>
      <div><h3>Component Name Here</h3></div>
      <GridContainer>
        {moduleclasses == null ? (
          <p key="loading">Loading</p>
        ) : (
          moduleclasses.map((moduleclass) => (
            <GridItem xs={12} sm={12} md={12} key={moduleclass.id} onClick={() => navigateToClass(moduleclass.id)}>
              <Card chart style={{marginBottom: 0, cursor: 'pointer'}}>
                <CardBody>
                  <h4 className={classes.cardTitle}>{moduleclass.name}</h4>
                  <p className={classes.cardCategory}>{moduleclass.classHours}</p>
                </CardBody>
              </Card>
            </GridItem>
          ))
        )}

      </GridContainer>
    </div>
  );
}
