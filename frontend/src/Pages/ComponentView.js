import React, { Fragment, useState } from "react";
import ComponentUI from "../Boundaries/ComponentUI"
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

const rows = [
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
  const  [openAddComponentPopup, setOpenAddComponentPopup] = useState(false);
  const  [openEditComponentPopup, setOpenEditComponentPopup] = useState(false);
  const  [openAddSubcomponentPopup, setOpenAddSubcomponentPopup] = useState(false);
  const  [openEditSubcomponentPopup, setOpenEditSubcomponentPopup] = useState(false);
  
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

  /****************** RETURN HTML ******************/
  return (
    <div className={classes.root}>
      <div className={classes.buttonDiv}>
        <Button onClick = {() => setOpenAddComponentPopup(true)}tabIndex="0" type="button" style={{margin:'10px', backgroundColor: '#139DAE'}}>
          <span className="MuiButton-label">Add Component</span><span className="MuiTouchRipple-root"></span>
        </Button>
        <Button onClick = {() => setOpenEditComponentPopup(true)}tabIndex="0" type="button" style={{backgroundColor: '#139DAE'}}>
          <span className="MuiButton-label">Edit Component</span><span className="MuiTouchRipple-root"></span>
        </Button>
      </div>
      <Paper className={classes.paper}>
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size='small'
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
                    <React.Fragment>
                    <StyledTableRow>
                      {/********************* INPUT CELL DATA *********************/}
                      <StyledTableCell>
                        <IconButton aria-label="expand row" size="small" onClick={() => setOpen(open === index ? -1 : index)}>
                          {open === index ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                      </StyledTableCell>
                      <StyledTableCell align="center">{row.component}</StyledTableCell>
                      <StyledTableCell align="center">{row.weightage}</StyledTableCell>
                      <StyledTableCell align="center">
                      <Button onClick = {() => setOpenAddSubcomponentPopup(true)} style={{backgroundColor: '#C36A33'}}  tabIndex="0" type="button">
                          <span className="MuiButton-label">Add Subcomponents</span><span className="MuiTouchRipple-root"></span>
                        </Button>
                        <Button onClick = {() => setOpenEditSubcomponentPopup(true)} style={{backgroundColor: '#C36A33'}}  tabIndex="0" type="button">
                          <span className="MuiButton-label">Edit Subcomponents</span><span className="MuiTouchRipple-root"></span>
                        </Button>
                      </StyledTableCell>
                    </StyledTableRow>
                    <StyledTableRow>
                      <TableCell style={{ paddingRight:0,paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                        <Collapse in={open === index} timeout="auto" unmountOnExit>
                          <Box margin={1}>
                            <Table size="small" aria-label="Subcomponent information">
                              <TableHead>
                                <TableRow>
                                  <TableCell style={{fontWeight: '700'}}>Subcomponent Name</TableCell>
                                  <TableCell style={{fontWeight: '700'}}>Weightage</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {row.subcomponent.map((scRow) => (
                                  <TableRow key={scRow.sc}>
                                    <TableCell component="th" scope="row">
                                      {scRow.sc}
                                    </TableCell>
                                    <TableCell>{scRow.weight}</TableCell>
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
      {/* Add Component Form */}
      <Dialog open = {openAddComponentPopup} maxWidth = "md" fullWidth={true}>
            <DialogTitle>
              <span>
              <span style={{fontSize:"40px", fontWeight:"bold", display: "block", float:"left", marginRight:"0px"}}>&nbsp; Add Component</span>
                    <span style={{marginLeft:"-23px"}}>
                    <Controls.ActionButton onClick = {() => setOpenAddComponentPopup(false)} color="secondary" >
                      <CloseIcon fontSize="small" />
                    </Controls.ActionButton>
                    </span>
                </span>
            </DialogTitle>    
            <DialogContent>
            <Form>
            <Grid container>
                <Grid item xs={12}> 
                <span>
                  <span style={{display: "block", float:"left"}}>
                      <Controls.Input
                          label = "Component Name"
                          placeholder="eg: Lab Quizzes, Final Exam, etc"
                          name="ComponentId"
                          row = "1"
                          style = {{width: 450, marginBottom:10}}
                      />
                    </span>
                    <span style={{display: "block", float:"left"}}>
                      <Controls.Input
                          label = "Component Type"
                          placeholder="eg: Test, Project, Quiz, etc"
                          name="ComponentType"
                          row = "1"
                          style = {{width: 230, marginBottom:10}}
                      />
                    </span>
                    <span style={{display: "block", float:"left", textAlign:"center"}}>
                      <Controls.Input
                          label = "Component Weight"
                          placeholder="eg: 10%, 20%, etc"
                          name="ComponentWeight"
                          row = "1"
                          style = {{width: 160, marginBottom:10}}
                      />
                    </span>
                </span>
                <div style={{display: "block", clear:"both", float:"right", marginRight:"27px", marginTop:"20px"}}>
                  <Controls.Button
                      type="submit"
                      text="Submit"
                        />
                  <Controls.Button
                      text="Reset"
                      color="default" />
                </div>
                </Grid>
                
            </Grid>
        </Form>

            </DialogContent>
        </Dialog>
{/* END OF ADD COMPONENTS FORM */}

        {/* EDIT Component Form */}
      <Dialog open = {openEditComponentPopup} maxWidth = "md" fullWidth={true}>
            <DialogTitle>
              <span>
              <span style={{fontSize:"40px", fontWeight:"bold", display: "block", float:"left", marginRight:"0px"}}>&nbsp; Edit Component</span>
                    <span style={{marginLeft:"-23px"}}>
                    <Controls.ActionButton onClick = {() => setOpenEditComponentPopup(false)} color="secondary" >
                      <CloseIcon fontSize="small" />
                    </Controls.ActionButton>
                    </span>
                </span>
            </DialogTitle>    
            <DialogContent>
            <Form>
            <Grid container>
                <Grid item xs={12}> 
                <span>
                  <span style={{display: "block", float:"left"}}>
                      <Controls.Input
                          label = "Component Name"
                          defaultValue = "Quizzes"
                          name="ComponentId"
                          row = "1"
                          style = {{width: 450, marginBottom:10}}
                      />
                    </span>
                    <span style={{display: "block", float:"left"}}>
                      <Controls.Input
                          label = "Component Type"
                          name="ComponentType"
                          defaultValue = "Quiz"
                          row = "1"
                          style = {{width: 230, marginBottom:10}}
                      />
                    </span>
                    <span style={{display: "block", float:"left", textAlign:"center"}}>
                      <Controls.Input
                          label = "Component Weight"
                          name="ComponentWeight"
                          defaultValue = "30%"
                          row = "1"
                          style = {{width: 160, marginBottom:10}}
                      />
                    </span>
                </span>
                <div style={{display: "block", clear:"both", float:"right", marginRight:"27px", marginTop:"20px"}}>
                  <Controls.Button
                      type="submit"
                      text="Submit"
                        />
                  <Controls.Button
                      text="Reset"
                      color="default" />
                </div>
                </Grid>
                
            </Grid>
        </Form>

            </DialogContent>
        </Dialog>
        {/* END OF EDIT COMPONENTS FORM */}

      {/* Add SubComponent Form */}
      <Dialog open = {openAddSubcomponentPopup} maxWidth = "md" fullWidth={true}>
            <DialogTitle>
              <span>
              <span style={{fontSize:"40px", fontWeight:"bold", display: "block", float:"left", marginRight:"0px"}}>&nbsp; Add SubComponent</span>
                    <span style={{marginLeft:"-100px"}}>
                    <Controls.ActionButton onClick = {() => setOpenAddSubcomponentPopup(false)} color="secondary" >
                      <CloseIcon fontSize="small" />
                    </Controls.ActionButton>
                    </span>
                </span>
            </DialogTitle>    
            <DialogContent>
            <Form>
            <Grid container>
                <Grid item xs={12}> 
                <span>
                  <span style={{display: "block", float:"left"}}>
                      <Controls.Input
                          label = "SubComponent Name"
                          placeholder="eg: Lab Quizzes, Final Exam, etc"
                          name="SubComponentID"
                          row = "1"
                          style = {{width: 430, marginBottom:10}}
                      />
                    </span>
                    <span style={{display: "block", float:"left"}}>
                      <Controls.Input
                          label = "SubComponent Type"
                          placeholder="eg: Test, Project, Quiz, etc"
                          name="SubComponentType"
                          row = "1"
                          style = {{width: 220, marginBottom:10}}
                      />
                    </span>
                    <span style={{display: "block", float:"left", textAlign:"center"}}>
                      <Controls.Input
                          label = "SubComponent Weight"
                          placeholder="eg: 10%, 20%, etc"
                          name="SubComponentWeight"
                          row = "1"
                          style = {{width: 190, marginBottom:10}}
                      />
                    </span>
                </span>
                <div style={{display: "block", clear:"both", float:"right", marginRight:"27px", marginTop:"20px"}}>
                  <Controls.Button
                      type="submit"
                      text="Submit"
                        />
                  <Controls.Button
                      text="Reset"
                      color="default" />
                </div>
                </Grid>
                
            </Grid>
        </Form>

            </DialogContent>
        </Dialog>
{/* END OF ADD SUBCOMPONENTS FORM */}

        {/* EDIT SubComponent Form */}
      <Dialog open = {openEditSubcomponentPopup} maxWidth = "md" fullWidth={true}>
            <DialogTitle>
              <span>
              <span style={{fontSize:"40px", fontWeight:"bold", display: "block", float:"left", marginRight:"0px"}}>&nbsp; Edit SubComponent</span>
              <span style={{marginLeft:"-100px"}}>
                    <Controls.ActionButton onClick = {() => setOpenEditSubcomponentPopup(false)} color="secondary" >
                      <CloseIcon fontSize="small" />
                    </Controls.ActionButton>
                    </span>
                </span>
            </DialogTitle>    
            <DialogContent>
            <Form>
            <Grid container>
                <Grid item xs={12}> 
                <span>
                  <span style={{display: "block", float:"left"}}>
                      <Controls.Input
                          label = "SubComponent Name"
                          defaultValue = "Quiz 1"
                          name="SubComponentId"
                          row = "1"
                          style = {{width: 430, marginBottom:10}}
                      />
                    </span>
                    <span style={{display: "block", float:"left"}}>
                      <Controls.Input
                          label = "SubComponent Type"
                          name="SubComponentType"
                          defaultValue = "Quiz"
                          row = "1"
                          style = {{width: 220, marginBottom:10}}
                      />
                    </span>
                    <span style={{display: "block", float:"left", textAlign:"center"}}>
                      <Controls.Input
                          label = "SubComponent Weight"
                          name="SubComponentWeight"
                          defaultValue = "30%"
                          row = "1"
                          style = {{width: 190, marginBottom:10}}
                      />
                    </span>
                </span>
                <div style={{display: "block", clear:"both", float:"right", marginRight:"27px", marginTop:"20px"}}>
                  <Controls.Button
                      type="submit"
                      text="Submit"
                        />
                  <Controls.Button
                      text="Reset"
                      color="default" />
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