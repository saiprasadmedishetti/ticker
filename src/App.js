import { useEffect, useRef, useState } from "react";
import Chart from "./components/Chart";

const URL = "wss://streamer.cryptocompare.com/v2?format=streamer";

// const URL = "wss://stream.coinmarketcap.com/price/latest";

function App() {
  const ws = useRef();
  const containerRef = useRef();
  const [price, setPrice] = useState();
  const [direction, setDirection] = useState("");
  const [ticker, setTicker] = useState("");
  useEffect(() => {
    ws.current = new WebSocket(URL);
    const isDevice = window.matchMedia("(max-width: 580px)").matches;
    if (isDevice) {
      containerRef.current.style.height = window.innerHeight + "px";
    }
  }, []);

  useEffect(() => {
    if (ws) {
      ws.current.onopen = () => {
        ws.current.send(
          JSON.stringify({
            action: "SubAdd",
            subs: ["24~CCCAGG~BTC~USD~m"],
          })
        );
        // ws.send(
        //   JSON.stringify({
        //     method: "subscribe",
        //     id: "price",
        //     data: { cryptoIds: [1], index: null },
        //   })
        // );
        ws.current.onmessage = (e) => {
          const result = e.data.split("~");
          // if (result[0] === "2" && (result[4] === "1" || result[4] === "2"))
          if (result[0] === "24") {
            setPrice((prev) => {
              if (prev) {
                prev < result[10] ? setDirection("up") : setDirection("down");
              }
              return {
                time: result[4],
                open: result[7],
                high: result[8],
                low: result[9],
                close: result[10],
              };
            });
            if (!ticker) {
              setTicker(result[2] + "/" + result[3]);
            }

            document.title = result[2] + "-" + result[3] + " | " + result[10];
          }
        };
      };
    }

    return () => {
      ws.current.onclose = () => {
        ws.current.send(
          JSON.stringify({
            action: "SubRemove",
            subs: ["24~CCCAGG~BTC~USD~m"],
          })
        );
      };
    };
  }, [ws]);

  return (
    <main className="container" ref={containerRef}>
      {price && price.close && (
        <div className="block">
          <h4 className="ticker">{ticker}</h4>
          <h2
            className={`price ${
              direction === "up" ? "up" : direction === "down" ? "down" : ""
            }`}
          >
            {"$ " + Number(price.close).toFixed(2)}
          </h2>
        </div>
      )}
      <Chart
        price={price}
        height={
          (containerRef &&
            containerRef.current &&
            containerRef.current.clientHeight) ||
          window.innerHeight
        }
        width={
          (containerRef &&
            containerRef.current &&
            containerRef.current.clientWidth) ||
          window.innerWidth
        }
      />
    </main>
  );
}

export default App;
