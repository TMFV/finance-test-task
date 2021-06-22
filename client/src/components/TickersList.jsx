import { connect } from "react-redux";
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { io } from "socket.io-client";
import selectors from "../redux/selectors";
import operations from "../redux/operations";
import CollapsibleTable from "./Table/Table";

const socket = io("http://localhost:4000");
socket.emit("start");

function TickersList({ getTickers }) {
  useEffect(() => {
    socket.on("ticker", (response) => {
      getTickers(response);
    });
  }, []);

  return (
    <section>
      <h2>TickersList</h2>
      <CollapsibleTable />
    </section>
  );
}

const mapStateToProps = (state) => ({
  tickers: selectors.getTickersArray(state),
});

const mapDispatchToProrps = (dispatch) => ({
  getTickers: (data) => dispatch(operations.getTickers(data)),
});
TickersList.propTypes = {
  getTickers: PropTypes.func.isRequired,
};
export default connect(mapStateToProps, mapDispatchToProrps)(TickersList);
