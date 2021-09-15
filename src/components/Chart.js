import React, { useEffect, useRef, useState } from "react";
import { createChart, CrosshairMode } from "lightweight-charts";

let lineSeries;
const API_URL =
  "https://min-api.cryptocompare.com/data/v2/histoday?fsym=BTC&tsym=USD&limit=100";
function Chart({ price, height, width }) {
  const [data, setData] = useState([]);
  const chartContainerRef = useRef();
  const chart = useRef();
  useEffect(() => {}, []);
  useEffect(() => {
    fetch(API_URL)
      .then((resp) => resp.json())
      .then((data) => setData(data.Data.Data));
    chart.current = createChart(chartContainerRef.current, {
      width,
      height,
      layout: {
        backgroundColor: "#253248",
        textColor: "rgba(255, 255, 255, 0.9)",
      },
      grid: {
        vertLines: {
          color: "#334158",
        },
        horzLines: {
          color: "#334158",
        },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
      },
      priceScale: {
        borderColor: "#485c7b",
      },
      timeScale: {
        borderColor: "#485c7b",
      },
    });
    lineSeries = chart.current.addCandlestickSeries({
      upColor: "#4bffb5",
      downColor: "#ff4976",
      borderDownColor: "#ff4976",
      borderUpColor: "#4bffb5",
      wickDownColor: "#838ca1",
      wickUpColor: "#838ca1",
    });
    return () => {
      chart.current.remove();
      //
    };
  }, []);
  useEffect(() => {
    lineSeries.setData(data);
    chart.current.timeScale().fitContent();
  }, [data]);
  useEffect(() => {
    if (lineSeries && price) {
      const { time, open, high, low, close } = price;
      const time_ = new Date(Number(time) * 1000)
        .toLocaleDateString()
        .split("/")
        .reverse()
        .join("-");
      lineSeries.update({
        time: time_,
        open,
        high,
        low,
        close,
      });
    }
  }, [price, lineSeries]);

  return <div ref={chartContainerRef}></div>;
}

export default Chart;
