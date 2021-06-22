import actions from "./actions";

const getTickers = (res) => async (dispatch) => {
  dispatch(actions.getTickersRequest());
  try {
    const data = res;
    return dispatch(actions.getTickersSuccess(data));
  } catch (error) {
    dispatch(actions.getTickersError(error.message));
  }
};

const addLastPriceTickers = (res) => (dispatch) => {
  dispatch(actions.addLastPricesRequest());
  try {
    const data = res;
    dispatch(actions.addLastPricesSuccess(data));
  } catch (error) {
    dispatch(actions.addLastPricesError(error.message));
  }
};
export default {
  getTickers,
  addLastPriceTickers,
};
