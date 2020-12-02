import React, { Fragment, useState } from "react";
import ComponentUI from "../Boundaries/ComponentUI"
import { useHistory, useParams } from 'react-router-dom';
// core components
import Button from "../Components/CustomButtons/Button.js";
//FORM
import { Dialog, DialogTitle, DialogContent } from '@material-ui/core'
import { Form } from '../Components/useForm';
import Controls from "../Components/controls/Controls.js";
import { Grid, } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
// @material-ui/core components
import { withStyles, makeStyles } from "@material-ui/core/styles";
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import IconButton from '@material-ui/core/IconButton';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import ComponentManagement from "../Control/ComponentManagement";
import Component from "../Entities/Component";
import SubComponentManagement from "../Control/SubComponentManagement";
import SubComponent from "../Entities/Subcomponent";

const StyledTableSortLabel = withStyles((theme) => ({
    root: {
      color: 'white',
      "&:hover": {
        color: 'white',
      },
      '&$active': {
        color: 'white',
      },
    },
    active: {},
    icon: {
      color: 'inherit !important'
    },
  })
)(TableSortLabel);

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover
    },
  },
}))(TableRow);

/********************************** ROW DATA **********************************/
function createData(component, weightage, s, w) {
  return { 
    component, 
    weightage, 
    subcomponent: [{sc: s, weight: w}],
    open:false
  };
}

const rowsOld = [
  createData('Quiz', '40%','Quiz 1', '10%' ),
  createData('Project', '20%', 'Project 1', '20%'),
];


function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}


/********************************** TABLE HEAD **********************************/
const headCells = [
  { id: 'collapse', numeric: false, disablePadding: false, label: '' },
  { id: 'component', numeric: false, disablePadding: true, label: 'Component' },
  { id: 'weightage', numeric: false, disablePadding: false, label: 'Weightage' },
  { id: 'edit', numeric: false, disablePadding: false, label: '' },
];

function EnhancedTableHead(props) {
  const { classes, order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
        <StyledTableRow>
          {headCells.map((headCell) => (
            <StyledTableCell
              key={headCell.id}
              align={headCell.numeric ? 'left' : 'center'}
              padding={headCell.disablePadding ? 'none' : 'default'}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <StyledTableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <span className={classes.visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </span>
                ) : null}
              </StyledTableSortLabel>
            </StyledTableCell>
          ))}
        </StyledTableRow>
        
      </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
    clear: 'right'
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  buttonDiv: {
    backgroundColor: 'transparent',
    float: 'right',
    margin: '10px',
  }
}));

export default function ComponentView() {
  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('name');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [open, setOpen] = React.useState(-1);
  const [openEditComponentPopup, setOpenEditComponentPopup] = useState(false);
  const [openEditSubcomponentPopup, setOpenEditSubcomponentPopup] = useState(false);
  const [rows, setRows] = useState([]);
  const [editableRows, setEditableRows] = useState([]);
  const [newRows, setNewRows] = useState([]);
  const [targetRow, setTargetRow] = useState(null); //The target row that is having its subcomponents editted
  const [editableSubcomponentRows, setEditableSubcomponentRows] = useState([]);
  const [newSubcomponentRows, setNewSubcomponentRows] = useState([]);
  const { moduleId } = useParams();
  const history = useHistory();
  const [submittingComponent, setSubmittingComponent] = useState(false);
  
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSubmitComponents = async (event) => {
    event.preventDefault();
    if (submittingComponent) {
      return;
    }

    let totalWeightage = 0;
    editableRows.forEach((row) => {
      totalWeightage += parseInt(row.weightage);
    });
    newRows.forEach((row) => {
      totalWeightage += parseInt(row.weightage);
    });

    if (totalWeightage != 100){
      alert("Weightage must add up to 100");
      console.log("Weightage must add up to 100, current weightage: " + totalWeightage);
      return;
    }

    setSubmittingComponent(true);
    setOpenEditComponentPopup(false);
    editableRows.forEach(async (row) => {
      await ComponentManagement.updateComponent(new Component(row._id, row.name, row.componentType, row.weightage));
    });
    newRows.forEach(async (row) => {
      await ComponentManagement.addComponent(new Component(null, row.name, row.componentType, row.weightage), moduleId);
    });

    setRows([]);
    setEditableRows([]);
    setNewRows([]);

    await loadData();

    setSubmittingComponent(false);
  }

  const handleSubmitSubcomponents = async (event) => {
    event.preventDefault();
    if (submittingComponent) {
      return;
    }

    let totalWeightage = 0;
    editableSubcomponentRows.forEach((row) => {
      totalWeightage += parseInt(row.weightage);
    });
    newSubcomponentRows.forEach((row) => {
      totalWeightage += parseInt(row.weightage);
    });

    if (totalWeightage != 100){
      alert("Weightage must add up to 100");
      console.log("Weightage must add up to 100, current weightage: " + totalWeightage);
      return;
    }

    setSubmittingComponent(true);
    setOpenEditSubcomponentPopup(false);
    editableSubcomponentRows.forEach(async (row) => {
      await SubComponentManagement.updateSubComponent(new SubComponent(row._id, row.name, row.weightage, {}));
    });
    newSubcomponentRows.forEach(async (row) => {
      await SubComponentManagement.createSubComponent(new SubComponent(null, row.name, row.weightage, {}), targetRow._id);
    });

    setRows([]);
    setEditableRows([]);
    setNewRows([]);

    await loadData();

    setSubmittingComponent(false);
  }

  const handleNewComponent = () => {
    setNewRows([...newRows, {name: "", componentType: "", weightage: 0}]);
  }
  const handleNewSubComponent = () => {
    setNewSubcomponentRows([...newSubcomponentRows, {name: "", weightage: 0}]);
  }

  const handleDisplayEditSubcomponent = (row) => {
    setTargetRow(row);
    setEditableSubcomponentRows(row.subcomponents);
    setNewSubcomponentRows([]);
    setOpenEditSubcomponentPopup(true);
  }

  const loadData = async () => {
    const results = await ComponentManagement.getAllComponents(moduleId);
    setRows(results);
    setEditableRows(JSON.parse(JSON.stringify(results))); //Deep copy
  };

  React.useEffect(() => {
    console.log("Page loaded!");

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /****************** RETURN HTML ******************/
  return (
    <div className={classes.root}>
      <div className={classes.buttonDiv}>
        <Button
          onClick={() => setOpenEditComponentPopup(true)}
          tabIndex="0"
          type="button"
          style={{ backgroundColor: "#139DAE" }}
        >
          <span className="MuiButton-label">Add/Edit Component</span>
          <span className="MuiTouchRipple-root"></span>
        </Button>
        <Button
          onClick={() => history.push("/admin/moduleclasses/" + moduleId)}
          type="button"
          style={{ backgroundColor: "#139DAE" }}
        >
          <span className="MuiButton-label">View class grades (temp)</span>
          <span className="MuiTouchRipple-root"></span>
        </Button>
      </div>
      <Paper className={classes.paper}>
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size="small"
          >
            <EnhancedTableHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  return (
                    <React.Fragment key={row._id}>
                      <StyledTableRow>
                        {/********************* INPUT CELL DATA *********************/}
                        <StyledTableCell>
                          <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={() => setOpen(open === index ? -1 : index)}
                          >
                            {open === index ? (
                              <KeyboardArrowUpIcon />
                            ) : (
                              <KeyboardArrowDownIcon />
                            )}
                          </IconButton>
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {row.name}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {row.weightage}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          <Button
                            onClick={() => handleDisplayEditSubcomponent(row)}
                            style={{ backgroundColor: "#C36A33" }}
                            tabIndex="0"
                            type="button"
                          >
                            <span className="MuiButton-label">
                              Add/Edit Subcomponents
                            </span>
                            <span className="MuiTouchRipple-root"></span>
                          </Button>
                          {/* <Button onClick = {() => setOpenEditSubcomponentPopup(true)} style={{backgroundColor: '#C36A33'}}  tabIndex="0" type="button">
                          <span className="MuiButton-label">Edit Subcomponents</span><span className="MuiTouchRipple-root"></span>
                        </Button> */}
                          <Button
                            onClick={() =>
                              history.push("/admin/componentgrades/" + row._id)
                            }
                            style={{ backgroundColor: "#C36A33" }}
                            tabIndex="0"
                            type="button"
                          >
                            <span className="MuiButton-label">
                              Component grades
                            </span>
                            <span className="MuiTouchRipple-root"></span>
                          </Button>
                        </StyledTableCell>
                      </StyledTableRow>
                      <StyledTableRow>
                        <TableCell
                          style={{
                            paddingRight: 0,
                            paddingBottom: 0,
                            paddingTop: 0,
                          }}
                          colSpan={6}
                        >
                          <Collapse
                            in={open === index}
                            timeout="auto"
                            unmountOnExit
                          >
                            <Box margin={1}>
                              <Table
                                size="small"
                                aria-label="Subcomponent information"
                              >
                                <TableHead>
                                  <TableRow>
                                    <TableCell style={{ fontWeight: "700" }}>
                                      Subcomponent Name
                                    </TableCell>
                                    <TableCell style={{ fontWeight: "700" }}>
                                      Weightage
                                    </TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {row.subcomponents.map((scRow) => (
                                    <TableRow key={scRow._id}>
                                      <TableCell component="th" scope="row">
                                        {scRow.name}
                                      </TableCell>
                                      <TableCell>{scRow.weightage}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </StyledTableRow>
                    </React.Fragment>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>

      {/* ADD/EDIT Component Form */}
      <Dialog open={openEditComponentPopup} maxWidth="md" fullWidth={true}>
        <DialogTitle>
          <span>
            <span
              style={{
                fontSize: "30px",
                fontWeight: "bold",
                display: "block",
                float: "left",
                marginRight: "0px",
              }}
            >
              Add/Edit Component
            </span>
            <span style={{ marginLeft: "-23px" }}>
              <Controls.ActionButton
                onClick={() => setOpenEditComponentPopup(false)}
                color="secondary"
              >
                <CloseIcon fontSize="small" />
              </Controls.ActionButton>
            </span>
          </span>
        </DialogTitle>
        <DialogContent>
          <Form onSubmit={handleSubmitComponents}>
            <Grid container>
              <span>Edit components</span>
              {editableRows.map((row, index) => {
                return (
                  <Grid item xs={12} key={row._id}>
                    <span>
                      <span style={{ display: "block", float: "left" }}>
                        <Controls.Input
                          label="Component Name"
                          required
                          value={row.name}
                          onChange={(e) => {
                            let updated = [...editableRows];
                            updated[index].name = e.target.value;
                            setEditableRows(updated);
                          }}
                          name="ComponentId"
                          row="1"
                          style={{ width: 450, marginBottom: 10 }}
                        />
                      </span>
                      <span style={{ display: "block", float: "left" }}>
                        <Controls.Input
                          label="Component Type"
                          required
                          value={row.componentType}
                          onChange={(e) => {
                            let updated = [...editableRows];
                            updated[index].componentType = e.target.value;
                            setEditableRows(updated);
                          }}
                          name="ComponentType"
                          row="1"
                          style={{ width: 230, marginBottom: 10 }}
                        />
                      </span>
                      <span
                        style={{
                          display: "block",
                          float: "left",
                          textAlign: "center",
                        }}
                      >
                        <Controls.Input
                          label="Component Weight"
                          name="ComponentWeight"
                          value={row.weightage}
                          row="1"
                          required
                          type="number"
                          onChange={(e) => {
                            if (e.target.value < 0 || e.target.value > 100) {
                              return;
                            }
                            let updated = [...editableRows];
                            updated[index].weightage = e.target.value;
                            setEditableRows(updated);
                          }}
                          style={{ width: 160, marginBottom: 10 }}
                        />
                      </span>
                    </span>
                  </Grid>
                );
              })}
              <br />
              <br />
              <br />
              <br />
              <div style={{width:"100%"}}>Add components</div>
              {newRows.map((row, index) => {
                return (
                  <Grid item xs={12} key={"new" + index}>
                    <span>
                      <span style={{ display: "block", float: "left" }}>
                        <Controls.Input
                          label="Component Name"
                          value={row.name}
                          name="ComponentId"
                          row="1"
                          required
                          onChange={(e) => {
                            let updated = [...newRows];
                            updated[index].name = e.target.value;
                            setNewRows(updated);
                          }}
                          style={{ width: 450, marginBottom: 10 }}
                        />
                      </span>
                      <span style={{ display: "block", float: "left" }}>
                        <Controls.Input
                          label="Component Type"
                          value={row.componentType}
                          name="ComponentType"
                          row="1"
                          required
                          onChange={(e) => {
                            let updated = [...newRows];
                            updated[index].componentType = e.target.value;
                            setNewRows(updated);
                          }}
                          style={{ width: 230, marginBottom: 10 }}
                        />
                      </span>
                      <span
                        style={{
                          display: "block",
                          float: "left",
                          textAlign: "center",
                        }}
                      >
                        <Controls.Input
                          label="Component Weight"
                          name="ComponentWeight"
                          value={row.weightage}
                          row="1"
                          type="number"
                          required
                          onChange={(e) => {
                            if (e.target.value < 0 || e.target.value > 100) {
                              return;
                            }
                            let updated = [...newRows];
                            updated[index].weightage = e.target.value;
                            setNewRows(updated);
                          }}
                          style={{ width: 160, marginBottom: 10 }}
                        />
                      </span>
                    </span>
                  </Grid>
                );
              })}
              <div
                style={{
                  display: "block",
                  clear: "both",
                  margin: "auto",
                }}
              >
                <Controls.Button text="+" onClick={handleNewComponent} />
              </div>
              <br />
              <Grid item xs={12}>
                <div
                  style={{
                    display: "block",
                    clear: "both",
                    float: "right",
                    marginRight: "27px",
                    marginTop: "20px",
                  }}
                >
                  <Controls.Button
                    type="submit"
                    text="Submit"
                  />
                  <Controls.Button
                    text="Reset"
                    color="default"
                    onClick={() => {
                      setNewRows([]);
                      setEditableRows(JSON.parse(JSON.stringify(rows)));
                    }}
                  />
                </div>
              </Grid>
            </Grid>
          </Form>
        </DialogContent>
      </Dialog>
      {/* END OF EDIT COMPONENTS FORM */}

      {/* ADD/EDIT SubComponent Form */}
      <Dialog open={openEditSubcomponentPopup} maxWidth="md" fullWidth={true}>
        <DialogTitle>
          <span>
            <span
              style={{
                fontSize: "30px",
                fontWeight: "bold",
                display: "block",
                float: "left",
                marginRight: "0px",
              }}
            >
              Add/Edit Subcomponent
            </span>
            <span style={{ marginLeft: "-23px" }}>
              <Controls.ActionButton
                onClick={() => setOpenEditSubcomponentPopup(false)}
                color="secondary"
              >
                <CloseIcon fontSize="small" />
              </Controls.ActionButton>
            </span>
          </span>
        </DialogTitle>
        <DialogContent>
          <Form onSubmit={handleSubmitSubcomponents}>
            <Grid container>
              {editableSubcomponentRows.length < 1 ? <p>No existing subcomponents</p>
              : <div style={{width:"100%"}}>Edit subcomponents</div>}
              {editableSubcomponentRows.map((row, index) => {
                return (
                  <Grid item xs={12} key={row._id}>
                    <span>
                      <span style={{ display: "block", float: "left" }}>
                        <Controls.Input
                          label="Subcomponent Name"
                          required
                          value={row.name}
                          onChange={(e) => {
                            let updated = [...editableSubcomponentRows];
                            updated[index].name = e.target.value;
                            setEditableSubcomponentRows(updated);
                          }}
                          name="ComponentId"
                          row="1"
                          style={{ width: 650, marginBottom: 10 }}
                        />
                      </span>                 
                      <span
                        style={{
                          display: "block",
                          float: "left",
                          textAlign: "center",
                        }}
                      >
                        <Controls.Input
                          label="Subcomponent Weight"
                          name="SubcomponentWeight"
                          value={row.weightage}
                          row="1"
                          required
                          type="number"
                          onChange={(e) => {
                            if (e.target.value < 0 || e.target.value > 100) {
                              return;
                            }
                            let updated = [...editableSubcomponentRows];
                            updated[index].weightage = e.target.value;
                            setEditableSubcomponentRows(updated);
                          }}
                          style={{ width: 200, marginBottom: 10 }}
                        />
                      </span>
                    </span>
                  </Grid>
                );
              })}
              <br />
              <br />
              <br />
              <br />
              <div style={{width:"100%"}}>Add subcomponents</div>
              {newSubcomponentRows.map((row, index) => {
                return (
                  <Grid item xs={12} key={"new" + index}>
                    <span>
                      <span style={{ display: "block", float: "left" }}>
                        <Controls.Input
                          label="Subcomponent Name"
                          value={row.name}
                          name="SubcomponentName"
                          row="1"
                          required
                          onChange={(e) => {
                            let updated = [...newSubcomponentRows];
                            updated[index].name = e.target.value;
                            setNewSubcomponentRows(updated);
                          }}
                          style={{ width: 650, marginBottom: 10 }}
                        />
                      </span>
                      <span
                        style={{
                          display: "block",
                          float: "left",
                          textAlign: "center",
                        }}
                      >
                        <Controls.Input
                          label="Subcomponent Weight"
                          name="SubcomponentWeight"
                          value={row.weightage}
                          row="1"
                          type="number"
                          required
                          onChange={(e) => {
                            if (e.target.value < 0 || e.target.value > 100) {
                              return;
                            }
                            let updated = [...newSubcomponentRows];
                            updated[index].weightage = e.target.value;
                            setNewSubcomponentRows(updated);
                          }}
                          style={{ width: 200, marginBottom: 10 }}
                        />
                      </span>
                    </span>
                  </Grid>
                );
              })}
              <div
                style={{
                  display: "block",
                  clear: "both",
                  margin: "auto",
                }}
              >
                <Controls.Button text="+" onClick={handleNewSubComponent} />
              </div>
              <br />
              <Grid item xs={12}>
                <div
                  style={{
                    display: "block",
                    clear: "both",
                    float: "right",
                    marginRight: "27px",
                    marginTop: "20px",
                  }}
                >
                  <Controls.Button
                    type="submit"
                    text="Submit"
                  />
                  <Controls.Button
                    text="Reset"
                    color="default"
                    onClick={() => {
                      setNewSubcomponentRows([]);
                      setEditableRows(JSON.parse(JSON.stringify(targetRow.subcomponents)));
                    }}
                  />
                </div>
              </Grid>
            </Grid>
          </Form>
        </DialogContent>
      </Dialog>
      {/* END OF EDIT SUBCOMPONENTS FORM */}
    </div>
  );
  }