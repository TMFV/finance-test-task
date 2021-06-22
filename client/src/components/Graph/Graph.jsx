import { connect } from "react-redux";
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import selectors from "../../redux/selectors";
import operations from "../../redux/operations";
import {
  BarSeries,
  ValueAxis,
  Chart,
  LineSeries,
} from "@devexpress/dx-react-chart-material-ui";

function Graph({
  tickers,
  addLastPriceTickers,
  chartName,
  height,
  width,
  valueaxis,
}) {
  const [pricesTickers, setPricesTickers] = useState([]);
  const [chartData, setChartData] = useState([{ argument: 0, value: 0 }]);

  function createNewPrices(pricesTickers) {
    let data = tickers.map((item) => {
      let name = item.ticker;
      let price = item.price;
      return { [name]: [Number(price)] };
    });
    return data;
  }

  function addNewItemToPrices(prevPriceTickers) {
    let data = tickers.map((item, index) => {
      let name = item.ticker;
      let price = item.price;
      let currentPrevTicker = prevPriceTickers[index];
      let currentPrevPriceArray = currentPrevTicker[name];
      let newPriceArray = [...currentPrevPriceArray, Number(price)];
      return { [name]: newPriceArray };
    });
    return data;
  }
  useEffect(() => {
    createChartData(pricesTickers, chartName);
  }, [pricesTickers]);

  useEffect(() => {
    if (pricesTickers.length === 0) {
      let firstItemPrice = createNewPrices(pricesTickers);
      setPricesTickers(firstItemPrice);
    } else if (pricesTickers.length >= 1) {
      setPricesTickers((prevPriceTickers) => {
        return addNewItemToPrices(prevPriceTickers);
      });
    }
    addLastPriceTickers(pricesTickers);
  }, [tickers]);

  function createChartData(pricesTickers, chartName) {
    if (pricesTickers.length > 0) {
      let currentTicker = pricesTickers.filter(
        (item) => chartName === Object.keys(item)[0]
      );
      let objValues = currentTicker[0];
      let arrValues = objValues[chartName];
      let values = arrValues.map((item, idx) => {
        return { argument: idx + 1, value: item };
      });
      setChartData(values);
    } else {
      return setChartData([{ argument: 0, value: 0 }]);
    }
  }

  return (
    <Chart data={chartData} height={height} width={width} valueaxis={valueaxis}>
      {valueaxis === true ? <ValueAxis /> : null}
      <LineSeries valueField="value" argumentField="argument" />
      <BarSeries valueField="value" argumentField="argument" color="green" />
    </Chart>
  );
}

const mapStateToProps = (state) => ({
  tickers: selectors.getTickersArray(state),
});

const mapDispatchToProrps = (dispatch) => ({
  getTickers: (data) => dispatch(operations.getTickers(data)),
  addLastPriceTickers: (data) => dispatch(operations.addLastPriceTickers(data)),
});
Graph.propTypes = {
  tickers: PropTypes.array.isRequired,
  addLastPriceTickers: PropTypes.func.isRequired,
  chartName: PropTypes.string.isRequired,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  valueaxis: PropTypes.bool,
};

export default connect(mapStateToProps, mapDispatchToProrps)(Graph);
