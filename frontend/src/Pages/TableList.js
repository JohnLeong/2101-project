import React from "react";
// core components
import Button from "../Components/CustomButtons/Button.js";
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
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
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
function createData(studentID, classgroup, name, grade, comment, s, m) {
  return { studentID, 
    classgroup, 
    name, 
    grade, 
    comment,
    subcomponent: [{sc: s, marks: m}],
    open:false
  };
}

const rows = [
  createData('1902123', 'P1', 'DONNY YEN', 'A', '', 'Quiz 1', '1' ),
  createData('1902345', 'P2', 'HAPPY ME', 'F', '', 'Quiz 1', '2'),
  createData('1902456', 'P1', 'ALEX CHEN', 'B', '', 'Quiz 1', '3'),
  createData('1906123', 'P3', 'HUMPTY', 'B+', '', 'Quiz 1', '4'),
  createData('1906433', 'P3', 'DUMPTY', 'B', '', 'Quiz 1', '5'),
  createData('1906653', 'P2', 'HEHE', 'D', '', 'Quiz 1', '6'),
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
}));

export default function TableList() {
  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('name');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [open, setOpen] = React.useState(false);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.studentID);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
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
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.studentID);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <React.Fragment>
                    <StyledTableRow
                    >
                      {/********************* INPUT CELL DATA *********************/}
                      <StyledTableCell>
                        <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                          {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                      </StyledTableCell>
                      <StyledTableCell align="center">{row.studentID}</StyledTableCell>
                      <StyledTableCell align="center">{row.classgroup}</StyledTableCell>
                      <StyledTableCell align="left">{row.name}</StyledTableCell>
                      <StyledTableCell align="left">{row.grade}</StyledTableCell>
                      <StyledTableCell align="center">
                        <Button color="success"  tabindex="0" type="button">
                          <span class="MuiButton-label">Add/Edit Comments</span><span class="MuiTouchRipple-root"></span>
                        </Button>
                      </StyledTableCell>
                      <StyledTableCell padding="checkbox">
                        <Checkbox
                          hover
                          onClick={(event) => handleClick(event, row.studentID)}
                          role="checkbox"
                          aria-checked={isItemSelected}
                          tabIndex={-1}
                          key={row.studentID}
                          selected={isItemSelected}
                          checked={isItemSelected}
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </StyledTableCell>
                    </StyledTableRow>
                    <TableRow>
                      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                          <Box margin={1}>
                            <Table size="small" aria-label="Subcomponent information">
                              <TableHead>
                                <TableRow>
                                  <TableCell>Subcomponent Name</TableCell>
                                  <TableCell>Mark</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {row.subcomponent.map((scRow) => (
                                  <TableRow key={scRow.sc}>
                                    <TableCell component="th" scope="row">
                                      {scRow.sc}
                                    </TableCell>
                                    <TableCell>{scRow.marks}</TableCell>
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
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
    </div>
    );
  }