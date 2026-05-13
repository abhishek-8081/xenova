import { WebSocket } from "ws";
import { redis } from "@repo/redis";

function connect() {
  const url = "wss://ws.backpack.exchange";
  const ws = new WebSocket(url);

  console.log("Attempting to connect to Backpack WebSocket...");

  ws.on("open", () => {
    console.log("Connected to Backpack Exchange! Subscribing to BTC_USDC...");
    const subscribeMessage = {
      method: "SUBSCRIBE",
      params: ["bookTicker.BTC_USDC"],
      id: 1,
    };
    ws.send(JSON.stringify(subscribeMessage));
  });

  ws.on("message", async (message) => {
    try {
      const data = JSON.parse(message.toString());
      
      // If it's a price update (bookTicker)
      if (data.b || data.a || (data.data && (data.data.b || data.data.a))) {
        const payload = data.data || data;
        await redis.xadd(
          "engine-stream",
          "*",
          "data",
          JSON.stringify({ kind: "price-update", payload })
        );
      }
    } catch (e) {
      console.log("Error processing message:", e);
    }
  });

  ws.on("close", () => {
    console.log("Backpack connection closed. Reconnecting in 3 seconds...");
    setTimeout(connect, 3000);
  });

  ws.on("error", (err) => {
    console.log("Backpack connection error:", err.message);
    ws.close();
  });
}

connect();
