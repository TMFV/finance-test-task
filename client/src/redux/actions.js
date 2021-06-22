import { createAction } from "@reduxjs/toolkit";

const getTickersRequest = createAction("tickers/addContactRequest");
const getTickersSuccess = createAction("tickers/addContactSuccess");
const getTickersError = createAction("tickers/addContactError");

const addLastPricesRequest = createAction(
  "tickersLastPrices/addLastPriceTickersRequest"
);
const addLastPricesSuccess = createAction(
  "tickersLastPrices/addLastPriceTickersSuccess"
);
const addLastPricesError = createAction(
  "tickersLastPrices/addLastPriceTickersError"
);

export default {
  getTickersRequest,
  getTickersSuccess,
  getTickersError,
  addLastPricesRequest,
  addLastPricesSuccess,
  addLastPricesError,
};
