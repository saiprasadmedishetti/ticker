import React, { useEffect, useRef } from "react";
import { createChart, CrosshairMode } from "lightweight-charts";

let lineSeries, volumeSeries;

const getTime = (time) =>
  new Date(Number(time)).toLocaleDateString().split("/").reverse().join("-");

function Chart({ price, height, width, history }) {
  const chartContainerRef = useRef();
  const chart = useRef();
  useEffect(() => {
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
    volumeSeries = chart.current.addHistogramSeries({
      color: "#26a69a",
      priceFormat: {
        type: "volume",
      },
      priceScaleId: "",
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
    });
    return () => {
      chart.current.remove();
      //
    };
  }, []);
  useEffect(() => {
    lineSeries.setData(history);
    const volumeHistory = history.map((item, i, arr) => {
      //       upColor: "#4bffb5",
      // downColor: "#ff4976",
      return {
        time: item.time,
        value: item.volumeto,
        color: arr[i + 1]?.volumeto < item.volumeto ? "#009688cc" : "#ff5252cc",
      };
    });
    volumeSeries.setData(volumeHistory);
    chart.current.timeScale().fitContent();
  }, [history.length]);
  useEffect(() => {
    if (lineSeries && price) {
      // const { time, open, high, low, close } = price;
      const { time, close, volume } = price;
      const last = history[history.length - 1];
      const time_ = getTime(time);
      lineSeries.update({
        time: time_,
        open: last.open,
        high: Math.max(last.high, close),
        low: Math.min(last.low, close),
        close,
      });
      volumeSeries.update({
        time: time_,
        value: volume,
      });
    }
  }, [price, lineSeries]);

  return <div ref={chartContainerRef}></div>;
}

export default Chart;
