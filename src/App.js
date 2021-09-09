import { useEffect, useRef, useState } from "react";

const URL = "wss://streamer.cryptocompare.com/v2?format=streamer";

// const URL = "wss://stream.coinmarketcap.com/price/latest";

function App() {
  const ws = useRef();
  const containerRef = useRef();
  const [price, setPrice] = useState(0);
  const [direction, setDirection] = useState("");
  useEffect(() => {
    ws.current = new WebSocket(URL);
    const isDevice = window.matchMedia("(max-width: 580px)").matches;
    if (isDevice) {
      containerRef.current.style.height = window.innerHeight + "px";
    }
  }, []);

  useEffect(() => {
    if (ws) {
      console.log(ws);
      ws.current.onopen = () => {
        ws.current.send(
          JSON.stringify({
            action: "SubAdd",
            subs: ["2~Coinbase~BTC~USD"],
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
          if (result[0] === "2" && (result[4] === "1" || result[4] === "2")) {
            setPrice((prev) => {
              if (prev) {
                prev < result[5] ? setDirection("up") : setDirection("down");
              }
              return result[5];
            });
          }
        };
      };
    }

    return () => {
      ws.current.onclose = () => {
        ws.current.send(
          JSON.stringify({
            action: "SubRemove",
            subs: ["2~Coinbase~BTC~USD"],
          })
        );
      };
    };
  }, [ws]);

  return (
    <main className="container" ref={containerRef}>
      {price && (
        <h1
          className={`price ${
            direction === "up" ? "up" : direction === "down" ? "down" : ""
          }`}
        >
          {"$ " + Number(price).toFixed(2)}
        </h1>
      )}
    </main>
  );
}

export default App;
