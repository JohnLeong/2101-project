import React, { Fragment, useState } from "react";
import { getClaims } from '../TokenClaims';
import ComponentUI from "../Boundaries/ComponentUI"
import CommentUI from "../Boundaries/CommentUI";
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
import Checkbox from '@material-ui/core/Checkbox';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import EditIcon from '@material-ui/icons/Create'
import IconButton from '@material-ui/core/IconButton';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import { getComponentGradesUrl } from "../routes";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import ComponentManagement from "../Control/ComponentManagement";
import SubComponentManagement from "../Control/SubComponentManagement";
import Comment from "../Entities/Comment"

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
function createData(studentID, classgroup, name, grade, comment, s, m) {
  return {
    studentID,
    classgroup,
    name,
    grade,
    comment,
    subcomponent: [{ sc: s, marks: m }],
    open: false
  };
}

// const rows = [
//   createData('1902123', 'P1', 'DONNY YEN', 'A', '', 'Quiz 1', '1' ),
//   createData('1902345', 'P2', 'HAPPY ME', 'F', '', 'Quiz 1', '2'),
//   createData('1902456', 'P1', 'ALEX CHEN', 'B', '', 'Quiz 1', '3'),
//   createData('1906123', 'P3', 'HUMPTY', 'B+', '', 'Quiz 1', '4'),
//   createData('1906433', 'P3', 'DUMPTY', 'B', '', 'Quiz 1', '5'),
//   createData('1906653', 'P2', 'HEHE', 'D', '', 'Quiz 1', '6'),
// ];



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
  { id: 'studentID', numeric: false, disablePadding: true, label: 'Student ID' },
  { id: 'classgroup', numeric: false, disablePadding: false, label: 'Class' },
  { id: 'name', numeric: true, disablePadding: false, label: 'Full Name' },
  { id: 'grade', numeric: true, disablePadding: false, label: 'Grade' },
  { id: 'comment', numeric: false, disablePadding: false, label: 'Comments' },
];

function EnhancedTableHead(props) {
  const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
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
        <StyledTableCell padding="checkbox">
          <Checkbox
            style={{ color: 'white' }}
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all students to input comments' }}
          />
        </StyledTableCell>
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
  const [selected, setSelected] = React.useState([]);
  const [selectedIds, setSelectedIds] = React.useState([]);
  const [selectedString, setSelectedString] = React.useState("");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [open, setOpen] = React.useState(-1);
  const [openAddPopup, setOpenAddPopup] = useState(false);
  const [openEditPopup, setOpenEditPopup] = useState(false);
  const [rows, setRows] = useState([]);
  const [component, setComponent] = useState({});
  const { componentId } = useParams();
  const [editableComments, setEditableComments] = useState([]);
  const [targetComments, setTargetComments] = useState(null);

  // for add comments popup
  const [commentBody, setCommentBody] = useState("");
  const [submittingAddComment, setSubmittingAddComment] = useState(false);
  // for edit marks popup
  const [openEditMarksPopup, setOpenEditMarksPopup] = useState(false);
  const [submittingEditMarks, setSubmittingEditMarks] = useState(false);
  const [currentMarks, setCurrentMarks] = useState(-1);
  const [editableMarks, setEditableMarks] = useState(-1);
  const [selectedSubcomponentId, setSelectedSubcomponentId] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState("");

  React.useEffect(() => {
    console.log("Page loaded!");

    const loadData = async () => {
      const result = await ComponentManagement.getComponent(componentId);
      setComponent(result);

      fetch(getComponentGradesUrl + componentId, {
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
          setRows(jsonData);
        })
        .catch((err) => {
          console.error("Error: " + err);
        });
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.studentID);
      const newSelectedId = rows.map((id) => id._id);
      setSelected(newSelecteds);
      setSelectedIds(newSelectedId);

      let idString = " ";
      newSelecteds.forEach((id) => idString += id + ", ");
      setSelectedString(idString);

      return;
    }
    setSelected([]);
    setSelectedIds([]);
    setSelectedString("");
  };

  const handleClick = (event, _id, studentID) => {
    const selectedIndex = selected.indexOf(studentID);
    let newSelected = [];
    let newSelectedIds = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, studentID);
      newSelectedIds = newSelectedIds.concat(selectedIds, _id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
      newSelectedIds = newSelectedIds.concat(selectedIds.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
      newSelectedIds = newSelectedIds.concat(selectedIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
      newSelectedIds = newSelectedIds.concat(
        selectedIds.slice(0, selectedIndex),
        selectedIds.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
    setSelectedIds(newSelectedIds);

    let idString = " ";
    newSelected.forEach((id) => idString += id + ", ");
    setSelectedString(idString);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSubmitEditComments = async (event) => {
    event.preventDefault();

    if (submittingAddComment) {
      return;
    }

    //prevent codes from running in between editComment process
    setSubmittingAddComment(true);

    editableComments.forEach(async (c) => {
      await CommentUI.editComment(new Comment(c._id, c.studentId, c.postedBy, c.body));
    });

    setOpenEditPopup(false);
    setSubmittingAddComment(false);
    window.location.reload();
  }

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const handleSubmitAddComment = async (event) => {
    event.preventDefault();

    if (submittingAddComment) {
      return;
    }

    //prevent codes from running in between addComment process
    setSubmittingAddComment(true);

    //send to boundary class
    const results = await CommentUI.addComment(componentId, selectedIds, getClaims().userId, commentBody);
    console.log(results);

    setOpenAddPopup(false);
    setCommentBody();
    setSubmittingAddComment(false);
  }

  const handleSubmitEditMarks = async (event) => {
    event.preventDefault();

    if (submittingEditMarks) {
      return;
    }

    //prevent codes from running in between editMarks process
    setSubmittingEditMarks(true);
    
    await SubComponentManagement.updateStudentMarks(selectedSubcomponentId, selectedStudentId, editableMarks);

    setOpenEditMarksPopup(false);
    setSubmittingEditMarks(false);
    window.location.reload();
  }

  /****************** IMPORT MARKS ******************/
  const [submitting, setSubmitting] = useState(false);

  //Source: https://masakudamatsu.medium.com/how-to-customize-the-file-upload-button-in-react-b3866a5973d8
  // Create a reference to the hidden file input element
  const hiddenFileInput = React.useRef(null);

  // programatically click hidden file input element
  // when the Button is clicked
  const importClick = event => {
    hiddenFileInput.current.click();
  };

  // handle the user-selected file 
  const importChange = async (event) => {
    await ComponentUI.displayFileDialog(event, [submitting, setSubmitting], componentId);
  };

  //Handle edit/view comments
  const handleDisplayEditComments = (row) => {
    setTargetComments(row.comments);
    setEditableComments(JSON.parse(JSON.stringify(row.comments)));
    setOpenEditPopup(true);
  }

  // handle edit marks
  const handleDisplayEditMarks = (selectedScRow, selectedRow) => {
    setEditableMarks(selectedScRow.marks);
    setCurrentMarks(selectedScRow.marks);
    setSelectedSubcomponentId(selectedScRow.sc_id);
    setSelectedStudentId(selectedRow._id);
    setOpenEditMarksPopup(true);
  }

  /****************** RETURN HTML ******************/
  return (
    <div className={classes.root}>
      <div>
        <h3>{component.name}</h3>
      </div>
      <div className={classes.buttonDiv}>
        <Fragment>
          <Button
            onClick={importClick}
            type="submit"
            variant="contained"
            tabIndex="0"
            style={{ margin: "10px", backgroundColor: "#139DAE" }}
          >
            Import Marks
          </Button>

          <input
            type="file"
            name="file"
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            ref={hiddenFileInput}
            onChange={importChange}
            style={{ display: "none" }}
          />
        </Fragment>
        <Button
          onClick={() => setOpenAddPopup(true)}
          tabIndex="0"
          type="button"
          style={{ backgroundColor: "#139DAE" }}
        >
          <span className="MuiButton-label">Add Comment</span>
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
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {rows.length < 1 ? (
                <tr>
                  <td>Loading</td>
                </tr>
              ) : (
                  stableSort(rows, getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      const isItemSelected = isSelected(row.studentID);
                      const labelId = `enhanced-table-checkbox-${index}`;

                      return (
                        <React.Fragment key={row.studentID}>
                          <StyledTableRow>
                            {/********************* INPUT CELL DATA *********************/}
                            <StyledTableCell>
                              <IconButton
                                aria-label="expand row"
                                size="small"
                                onClick={() =>
                                  setOpen(open === index ? -1 : index)
                                }
                              >
                                {open === index ? (
                                  <KeyboardArrowUpIcon />
                                ) : (
                                    <KeyboardArrowDownIcon />
                                  )}
                              </IconButton>
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              {row.studentID}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              {row.classgroup}
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              {row.name}
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              {row.grade}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              <Button
                                onClick={() => handleDisplayEditComments(row)}
                                style={{ backgroundColor: "#C36A33" }}
                                tabIndex="0"
                                type="button"
                              >
                                <span className="MuiButton-label">
                                  Edit Comments
                              </span>
                                <span className="MuiTouchRipple-root"></span>
                              </Button>
                            </StyledTableCell>
                            <StyledTableCell padding="checkbox">
                              <Checkbox
                                onClick={(event) =>
                                  handleClick(event, row._id, row.studentID)
                                }
                                role="checkbox"
                                aria-checked={isItemSelected}
                                tabIndex={-1}
                                key={row.studentID}
                                selected={isItemSelected}
                                checked={isItemSelected}
                                inputProps={{ "aria-labelledby": labelId }}
                              />
                            </StyledTableCell>
                          </StyledTableRow>
                          <TableRow>
                            <TableCell
                              style={{ paddingBottom: 0, paddingTop: 0 }}
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
                                          Mark
                                      </TableCell>
                                        <TableCell></TableCell>
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      {row.subcomponents.map((scRow) => (
                                        <TableRow key={scRow.sc}>
                                          <TableCell component="th" scope="row">
                                            {scRow.sc}
                                          </TableCell>
                                          <TableCell>{scRow.marks}</TableCell>
                                          <TableCell
                                            style={{ cursor: "pointer" }}
                                          >
                                            <EditIcon
                                              onClick={() => handleDisplayEditMarks(scRow, row)}
                                            />
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </Box>
                              </Collapse>
                            </TableCell>
                          </TableRow>
                        </React.Fragment>
                      );
                    })
                )}
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
      <Dialog open={openAddPopup} maxWidth="md" fullWidth={true}>
        <DialogTitle>
          <span>
            <span
              style={{
                fontSize: "40px",
                fontWeight: "bold",
                display: "block",
                float: "left",
                marginLeft: "7px",
              }}
            >
              {" "}
              Add Comment
            </span>
            <span style={{ marginLeft: "20px" }}>
              <Controls.ActionButton
                onClick={() => setOpenAddPopup(false)}
                color="secondary"
              >
                <CloseIcon fontSize="small" />
              </Controls.ActionButton>
            </span>
          </span>
        </DialogTitle>
        <DialogContent>
          <Form>
            <Grid container>
              <Grid item xs={6}>
                <Controls.Input
                  label="Student ID:"
                  value={selectedString}
                  disabled
                  name="StudentId"
                />
                <Controls.InputLarge
                  id="commentInput"
                  name="CommentId"
                  label="Enter Comments Here"
                  rows={20}
                  onChange={(e) => {
                    setCommentBody(e.target.value);
                  }}
                />
                <div>
                  <Controls.Button
                    type="submit"
                    text="Submit"
                    onClick={handleSubmitAddComment}
                  />
                  <Controls.Button
                    text="Reset"
                    color="default"
                    onClick={(e) => {
                      setCommentBody();
                      document.getElementById("commentInput").value = null;
                      document.getElementById("commentInput").focus();
                    }}
                  />
                </div>
              </Grid>
            </Grid>
          </Form>
        </DialogContent>
      </Dialog>
      {/* END OF ADD COMMENTS FORM */}
      <Dialog open={openEditPopup} maxWidth="md" fullWidth={true}>
        <DialogTitle>
          <span>
            <span
              style={{
                fontSize: "40px",
                fontWeight: "bold",
                display: "block",
                float: "left",
                marginLeft: "0px",
              }}
            >
              &nbsp;Edit Comment
            </span>
            <span style={{ marginLeft: "20px" }}>
              <Controls.ActionButton
                onClick={() => setOpenEditPopup(false)}
                color="secondary"
              >
                <CloseIcon fontSize="small" />
              </Controls.ActionButton>
            </span>
          </span>
        </DialogTitle>
        <DialogContent>
          <Form onSubmit={handleSubmitEditComments}>
            <Grid container>
              <Grid item xs={6}>
                {editableComments.length < 1 ? (
                  <p>No existing comments</p>
                ) : (
                    editableComments.map((c, index) => {
                      return (
                        <Controls.InputLarge
                          name="CommentId"
                          label={c.datePosted + " - " + (c.commentType ? "Summative" : "Formative")}
                          rows={5}
                          value={c.body}
                          key={c._id}
                          onChange={(e) => {
                            let updated = [...editableComments];
                            updated[index].body = e.target.value;
                            setEditableComments(updated);
                          }}
                        />
                      );
                    })
                  )}
                <div>
                  {editableComments.length > 0 && (
                    <Controls.Button type="submit" text="Submit" />
                  )}
                  {editableComments.length > 0 && (
                    <Controls.Button
                      text="Reset"
                      color="default"
                      onClick={() => {
                        setEditableComments(
                          JSON.parse(JSON.stringify(targetComments))
                        );
                      }}
                    />
                  )}
                </div>
              </Grid>
            </Grid>
          </Form>
        </DialogContent>
      </Dialog>
      {/* END OF EDIT COMMENTS FORM */}
      <Dialog open={openEditMarksPopup} maxWidth="md" fullWidth={true}>
        <DialogTitle>
          <span>
            <span
              style={{
                fontSize: "40px",
                fontWeight: "bold",
                display: "block",
                float: "left",
                marginLeft: "0px",
              }}
            >
              &nbsp;Edit Marks
            </span>
            <span style={{ marginRight: "0px", float: "right" }}>
              <Controls.ActionButton
                onClick={() => setOpenEditMarksPopup(false)}
                color="secondary"
              >
                <CloseIcon fontSize="small" />
              </Controls.ActionButton>
            </span>
          </span>
        </DialogTitle>
        <DialogContent>
          <Form onSubmit={handleSubmitEditMarks}>
            <Grid container>
              <Grid item xs={6}>
                <Controls.Input
                  id="editMarks"
                  label="Marks"
                  name="marks"
                  value={editableMarks}
                  row="1"
                  required
                  type="number"
                  onChange={(e) => {
                    if (e.target.value < 0 || e.target.value > 100) {
                      return;
                    }
                    setEditableMarks(e.target.value);
                  }}
                  style={{ width: 200, marginBottom: 10 }}
                />
                <div>
                  <Controls.Button type="submit" text="Submit" />
                  <Controls.Button
                    text="Reset"
                    color="default"
                    onClick={() => {
                      setEditableMarks(currentMarks);
                      document.getElementById("editMarks").focus();
                    }}
                  />
                </div>
              </Grid>
            </Grid>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}