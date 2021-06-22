import { createSelector } from "@reduxjs/toolkit";

const getTickersArray = (state) => state.app.tickers;
const getLastPricesArray = (state) => state.app.tickersLastPrices;

export default {
  getTickersArray,
  getLastPricesArray,
};
