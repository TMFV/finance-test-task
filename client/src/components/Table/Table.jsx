import React from "react";
import { connect } from "react-redux";
import selectors from "../../redux/selectors";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import Graph from "../Graph/Graph";

const useRowStyles = makeStyles({
  root: {
    "*": {
      heigth: "10px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    "& > *": {
      borderBottom: "unset",
      heigth: "10px",
    },
  },

  priceUp: {
    background: "#14cc6163",
    textAlign: "center",
    fontSize: "14px",
  },

  priceDown: {
    background: "#db5e5e4b",
    textAlign: "center",
    fontSize: "14px",
  },

  chart: {
    maxWidth: "250px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  bigchart: {
    maxWidth: "900",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
});

function createData({ ...ticker }) {
  return {
    ...ticker,
  };
}

function displayDate(dateString) {
  let date = dateString.slice(0, 10);
  let time = dateString.slice(11, 19);
  return (
    <>
      <span>{date}</span> <span>{time}</span>
    </>
  );
}

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();

  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell
          className={props.colorSelectorUpDownPriceLine(row, classes)}
          component="th"
          scope="row"
        >
          {row.ticker}
        </TableCell>
        <TableCell align="right">{row.exchange}</TableCell>
        <TableCell
          className={props.colorSelectorUpDownPriceLine(row, classes)}
          align="right"
        >
          {row.price}
        </TableCell>
        <TableCell align="right">{row.change}</TableCell>
        <TableCell align="right">{row.change_percent}</TableCell>
        <TableCell align="right">{row.dividend}</TableCell>
        <TableCell align="right">{row.yield}</TableCell>
        <TableCell className={classes.chart} align="right">
          <>
            <Graph
              key={`little-chart-${row.ticker}`}
              chartName={row.ticker}
              height={50}
              width={250}
            />
          </>
        </TableCell>
        <TableCell align="right">{displayDate(row.last_trade_time)}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                {row.ticker}
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead></TableHead>
                <TableBody>
                  <TableRow className={classes.bigchart} align="center">
                    <>
                      <Graph
                        key={`big-chart-${row.ticker}`}
                        chartName={row.ticker}
                        height={150}
                        width={900}
                        valueaxis={true}
                      />
                    </>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    ticker: PropTypes.string.isRequired,
    change: PropTypes.string.isRequired,
    change_percent: PropTypes.string.isRequired,
    dividend: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
    yield: PropTypes.string.isRequired,
  }).isRequired,
};
let rows = [];
function createRows(tickers) {
  return tickers.map((ticker) => {
    return createData(ticker);
  });
}

function CollapsibleTable({ tickers, getLastPricesArray }) {
  function colorSelectorUpDownPriceLine(row, classes) {
    let curElem = getLastPricesArray.filter(
      (item) => Object.keys(item)[0] === row.ticker
    );
    let pricesObj = curElem[0];
    let pricesArr;
    if (curElem.length !== 0) {
      pricesArr = Object.values(pricesObj)[0];
      let endPrice = pricesArr[pricesArr.length - 1];
      if (endPrice < row.price) {
        return classes.priceUp;
      } else {
        return classes.priceDown;
      }
    }
  }

  rows = createRows(tickers);
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Name</TableCell>
            <TableCell align="right">Exchange</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="right">Change</TableCell>
            <TableCell align="right">Change,%</TableCell>
            <TableCell align="right">Dividend</TableCell>
            <TableCell align="right">Yield</TableCell>
            <TableCell align="center">Chart</TableCell>
            <TableCell align="right">Last trade time</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => {
            return (
              <Row
                colorSelectorUpDownPriceLine={colorSelectorUpDownPriceLine}
                key={row.ticker}
                row={row}
              />
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

const mapStateToProps = (state) => ({
  tickers: selectors.getTickersArray(state),
  getLastPricesArray: selectors.getLastPricesArray(state),
});

CollapsibleTable.propTypes = {
  tickers: PropTypes.array.isRequired,
  getLastPricesArray: PropTypes.array.isRequired,
};

export default connect(mapStateToProps, null)(CollapsibleTable);
