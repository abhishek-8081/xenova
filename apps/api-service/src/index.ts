import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import tradeRouter from "./routes/trade.route";
import authRouter from "./routes/auth.route";
import balanceRouter from "./routes/balance.route";
import candlesRouter from "./routes/candles.route";
import { WebSocketServer, WebSocket } from "ws";
import { redis } from "@repo/redis";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: [
      "http://localhost:3200",
      "http://localhost:3000",
      "http://localhost:3001",
      ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cookie",
      "X-Requested-With"
    ]
  })
);

app.use((req, res, next) => {
  res.on("finish", () => {
    console.log(
      `${new Date().toISOString()} - ${req.method} ${req.path} - Status: ${res.statusCode} - Origin: ${req.get("origin")}`
    );
  });
  next();
});

app.use(express.json());
app.use(cookieParser());

app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.use("/trade", tradeRouter);
app.use("/auth", authRouter);
app.use("/balance", balanceRouter);
app.use("/candles", candlesRouter);

app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Error occurred:", err);
    res.status(500).json({
      error: "Internal server error",
      message:
        process.env.NODE_ENV === "development"
          ? err.message
          : "Something went wrong",
    });
  }
);

const server = app.listen(PORT, () => {
  console.log(`API Service running on port ${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/health`);
});

const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("New WebSocket connection");
  ws.on("close", () => console.log("WebSocket connection closed"));
});

async function broadcastPrices() {
  const client = redis.duplicate();
  let lastId = "$";
  
  while (true) {
    try {
      const response = await client.xread("BLOCK", 0, "STREAMS", "engine-stream", lastId);
      if (!response || !response.length) continue;

      const [, messages] = response[0]!;
      for (const [id, fields] of messages) {
        lastId = id;
        const dataField = fields.indexOf("data");
        if (dataField === -1) continue;
        
        const raw = fields[dataField + 1];
        if (!raw) continue;

        const msg = JSON.parse(raw);
        if (msg.kind === "price-update") {
          const priceData = JSON.stringify(msg.payload);
          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(priceData);
            }
          });
        }
      }
    } catch (e) {
      console.error("Error in broadcast loop:", e);
      await new Promise(r => setTimeout(r, 1000));
    }
  }
}

broadcastPrices();

export default app;
