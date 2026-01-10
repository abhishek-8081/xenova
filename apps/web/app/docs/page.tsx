"use client";
import Link from "next/link";
import Header from "../components/Header";

/* ─── Reusable section card ─── */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#e8e8e8] rounded-3xl overflow-hidden mb-4">
      <div className="px-8 py-5 border-b border-gray-300">
        <h2 className="text-xl font-extrabold text-black font-dm-sans tracking-tight">{title}</h2>
      </div>
      <div className="p-8">{children}</div>
    </div>
  );
}

/* ─── Code block ─── */
function Code({ children }: { children: string }) {
  return (
    <pre className="bg-black text-white p-4 rounded-xl font-ibm-plex-mono text-xs overflow-x-auto leading-relaxed">
      {children}
    </pre>
  );
}

/* ─── Mono list ─── */
function MonoList({ items }: { items: string[] }) {
  return (
    <div className="bg-white rounded-xl p-4 space-y-1.5">
      {items.map((item, i) => (
        <div key={i} className="font-ibm-plex-mono text-xs text-gray-700">{item}</div>
      ))}
    </div>
  );
}

/* ─── API row ─── */
function ApiRow({ method, path }: { method: "GET" | "POST"; path: string }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-200 last:border-0">
      <span className={`font-ibm-plex-mono text-xs font-bold px-2.5 py-1 rounded-lg ${method === "POST" ? "bg-black text-white" : "bg-gray-200 text-black"}`}>
        {method}
      </span>
      <span className="text-sm font-ibm-plex-mono text-gray-700">{path}</span>
    </div>
  );
}

/* ─── Flow step ─── */
function FlowStep({ n, text }: { n: number; text: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span className="font-ibm-plex-mono text-xs bg-white px-2.5 py-1.5 rounded-lg font-bold text-black flex-shrink-0">{n}</span>
      <span className="text-sm text-gray-700 font-dm-sans leading-relaxed">{text}</span>
    </div>
  );
}

const Docs = () => {
  return (
    <div className="min-h-screen bg-[#f0f0f0] p-4 md:p-6 lg:p-8 font-dm-sans">

      {/* Header card */}
      <div className="bg-[#e8e8e8] rounded-3xl mb-4 overflow-hidden relative">
        <Header />
      </div>

      {/* Hero */}
      <div className="bg-[#e8e8e8] rounded-3xl px-8 md:px-14 py-14 mb-4 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-black font-dm-sans tracking-tight mb-4">
          Xenova Docs
        </h1>
        <p className="text-sm text-gray-500 font-dm-sans max-w-xl mx-auto">
          Technical architecture, API reference, and implementation details for the Xenova high-performance trading engine.
        </p>
      </div>

      <div className="max-w-5xl mx-auto space-y-4">

        {/* Architecture */}
        <Section title="System Architecture">
          <div className="mb-6">
            <img
              src="/images/architecture.png"
              alt="Xenova System Architecture"
              className="w-full max-w-4xl mx-auto rounded-2xl border border-gray-300"
            />
          </div>
          <p className="text-sm text-gray-600 font-dm-sans leading-relaxed">
            Xenova follows a microservices architecture with three core services communicating through Redis streams.
            Real-time price data flows from Backpack Exchange via WebSocket, gets processed by the trading engine,
            and triggers automatic liquidations based on leverage and risk parameters.
          </p>
        </Section>

        {/* Core Components */}
        <Section title="Core Components & Implementation">
          <div className="space-y-10">

            {/* Trading Engine */}
            <div>
              <h3 className="text-lg font-extrabold text-black font-dm-sans mb-5">Trading Engine</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-bold text-black font-dm-sans mb-3">Order Processing Logic</h4>
                  <p className="text-sm text-gray-600 font-dm-sans mb-3">
                    Orders are processed via Redis streams with real-time price validation:
                  </p>
                  <MonoList items={[
                    "• Validates user balance against required margin",
                    "• Calculates opening price based on bid/ask spread",
                    "• Deducts margin: (price × qty) / leverage",
                    "• Stores order in memory for real-time monitoring",
                  ]} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-black font-dm-sans mb-3">Liquidation Mechanism</h4>
                  <p className="text-sm text-gray-600 font-dm-sans mb-3">
                    Automatic liquidation runs on every price update:
                  </p>
                  <MonoList items={[
                    "• Take Profit: long ≥ target, short ≤ target",
                    "• Stop Loss: long ≤ target, short ≥ target",
                    "• Margin Call: remaining margin ≤ 5% of initial",
                    "• PnL: (closing - opening) × qty × side",
                  ]} />
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-sm font-bold text-black font-dm-sans mb-4">Redis Stream Communication</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    {
                      title: "engine-stream (Input)",
                      items: ["price-update: Real-time price data", "create-order: New order requests", "close-order: Manual order closures"],
                    },
                    {
                      title: "callback-queue (Output)",
                      items: ["created: Order successfully created", "closed: Order liquidated/closed", "insufficient_balance: Margin not met"],
                    },
                  ].map((s) => (
                    <div key={s.title} className="bg-white rounded-2xl p-5">
                      <p className="text-xs font-bold text-black font-dm-sans uppercase tracking-wider mb-3">{s.title}</p>
                      <div className="space-y-1.5">
                        {s.items.map((item, i) => (
                          <p key={i} className="font-ibm-plex-mono text-xs text-gray-600">{item}</p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Price Poller */}
            <div>
              <h3 className="text-lg font-extrabold text-black font-dm-sans mb-5">Price Poller & WebSocket</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-bold text-black font-dm-sans mb-3">WebSocket Connection</h4>
                  <p className="text-sm text-gray-600 font-dm-sans mb-3">Connects to Backpack Exchange for real-time BTC_USDC prices:</p>
                  <Code>{`const subscribeMessage = {
  method: "SUBSCRIBE",
  params: ["bookTicker.BTC_USDC"],
  id: 1
};`}</Code>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-black font-dm-sans mb-3">Price Processing</h4>
                  <p className="text-sm text-gray-600 font-dm-sans mb-3">Every tick triggers immediate liquidation checks:</p>
                  <MonoList items={[
                    "• Bid: used for long closings, short entries",
                    "• Ask: used for short closings, long entries",
                    "• Mid: (bid + ask) / 2 for display",
                    "• Spread: difference between bid and ask",
                  ]} />
                </div>
              </div>
            </div>

            {/* API Layer */}
            <div>
              <h3 className="text-lg font-extrabold text-black font-dm-sans mb-5">Web Server & API Layer</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-bold text-black font-dm-sans mb-3">Authentication & Middleware</h4>
                  <p className="text-sm text-gray-600 font-dm-sans mb-3">JWT-based auth with middleware protection:</p>
                  <MonoList items={[
                    "• Token generation on login",
                    "• Middleware validates JWT on protected routes",
                    "• User context injection for order association",
                    "• Session management for persistent auth",
                  ]} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-black font-dm-sans mb-3">Order Lifecycle</h4>
                  <p className="text-sm text-gray-600 font-dm-sans mb-3">Complete async order management:</p>
                  <MonoList items={[
                    "• Creates order in pending state",
                    "• Sends to engine via Redis stream",
                    "• Waits for callback confirmation",
                    "• Updates database with final status",
                  ]} />
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* API Reference */}
        <Section title="API Reference">
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "Authentication",
                routes: [
                  { method: "POST" as const, path: "/auth/register" },
                  { method: "POST" as const, path: "/auth/login" },
                  { method: "POST" as const, path: "/auth/logout" },
                  { method: "GET" as const,  path: "/auth/me" },
                ],
              },
              {
                title: "Trading",
                routes: [
                  { method: "POST" as const, path: "/trade/create" },
                  { method: "POST" as const, path: "/trade/close/:orderId" },
                  { method: "GET" as const,  path: "/trade/orders" },
                  { method: "GET" as const,  path: "/trade/orders/:orderId" },
                ],
              },
              {
                title: "Balance",
                routes: [{ method: "GET" as const, path: "/balance" }],
              },
              {
                title: "Candles",
                routes: [{ method: "GET" as const, path: "/candles" }],
              },
            ].map((group) => (
              <div key={group.title} className="bg-white rounded-2xl p-5">
                <p className="text-xs font-bold text-black font-dm-sans uppercase tracking-wider mb-3">{group.title}</p>
                {group.routes.map((r) => (
                  <ApiRow key={r.path} method={r.method} path={r.path} />
                ))}
              </div>
            ))}
          </div>
        </Section>

        {/* Database Schema */}
        <Section title="Database Schema">
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { name: "Users", fields: ["id", "email", "password", "name"] },
              { name: "Assets", fields: ["symbol", "balance", "decimals", "userId"] },
              {
                name: "Orders",
                fields: [
                  "id, userId, side, qty",
                  "openingPrice, closingPrice",
                  "status, leverage",
                  "takeProfit, stopLoss",
                  "pnl, closeReason",
                ],
              },
            ].map((table) => (
              <div key={table.name} className="bg-white rounded-2xl p-5">
                <p className="text-xs font-bold text-black font-dm-sans uppercase tracking-wider mb-3">{table.name}</p>
                <div className="space-y-1.5">
                  {table.fields.map((f, i) => (
                    <p key={i} className="font-ibm-plex-mono text-xs text-gray-600">{f}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Technical Deep Dive */}
        <Section title="Technical Deep Dive">
          <div className="space-y-10">

            {/* Data flow */}
            <div>
              <h3 className="text-lg font-extrabold text-black font-dm-sans mb-5">Real-time Data Flow</h3>
              <div className="space-y-4">
                <div className="bg-white rounded-2xl p-6">
                  <h4 className="text-sm font-bold text-black font-dm-sans mb-4">Price Update Sequence</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {["Backpack Exchange\nWebSocket feed", "Price Poller\nParse & validate", "Redis Stream\nQueue updates", "Trading Engine\nProcess liquidations"].map((s, i) => (
                      <div key={i} className="text-center">
                        <div className="bg-[#e8e8e8] rounded-xl p-3 mb-2">
                          <p className="font-ibm-plex-mono text-xs whitespace-pre-line text-gray-700">{s}</p>
                        </div>
                        {i < 3 && <div className="hidden md:block text-gray-400 text-lg">→</div>}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6">
                  <h4 className="text-sm font-bold text-black font-dm-sans mb-4">Order Creation Sequence</h4>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {["Web UI\nUser places order", "API Server\nValidate & auth", "Redis Stream\nQueue request", "Trading Engine\nProcess & execute", "Callback\nConfirm to API"].map((s, i) => (
                      <div key={i} className="text-center">
                        <div className="bg-[#e8e8e8] rounded-xl p-3 mb-2">
                          <p className="font-ibm-plex-mono text-xs whitespace-pre-line text-gray-700">{s}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Request-Response */}
            <div>
              <h3 className="text-lg font-extrabold text-black font-dm-sans mb-5">Request-Response Architecture</h3>
              <div className="space-y-4">

                <div className="bg-white rounded-2xl p-6">
                  <h4 className="text-sm font-bold text-black font-dm-sans mb-4">Core Communication Pattern</h4>
                  <p className="text-sm text-gray-600 font-dm-sans mb-4 leading-relaxed">
                    The system implements an async request-response pattern using Redis streams as a message bus
                    and an in-memory callback registry — enabling non-blocking communication while maintaining
                    request-response semantics.
                  </p>
                  <Code>{`// 1. Trade controller builds payload
const orderId = generateUniqueId();
const payload = { userId, side: "long", qty: 1, leverage: 10, takeProfit: 100000, stopLoss: 90000 };

// 2. Send request and wait for callback
const result = await sendRequestAndWait(orderId, { kind: "create-order", payload });`}</Code>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-2xl p-6">
                    <h4 className="text-sm font-bold text-black font-dm-sans mb-4">Publishing to Engine Stream</h4>
                    <Code>{`async function addToStream(id: string, request: Request) {
  await redis.xadd(
    "engine-stream", "*",
    "id", id,
    "request", JSON.stringify(request)
  );
}`}</Code>
                  </div>
                  <div className="bg-white rounded-2xl p-6">
                    <h4 className="text-sm font-bold text-black font-dm-sans mb-4">Callback Registration</h4>
                    <Code>{`waitForMessage(id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    this.callbacks[id] = resolve;
    setTimeout(() => {
      if (this.callbacks[id]) {
        delete this.callbacks[id];
        reject(new Error("Timeout"));
      }
    }, 5000);
  });
}`}</Code>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6">
                  <h4 className="text-sm font-bold text-black font-dm-sans mb-4">Engine Processing Loop</h4>
                  <Code>{`while (true) {
  const messages = await redis.xread("BLOCK", 0, "STREAMS", "engine-stream", lastId);
  for (const [, entries] of messages) {
    for (const [id, data] of entries) {
      const request = JSON.parse(data.request);
      switch (request.kind) {
        case "create-order": await processCreateOrder(request.payload); break;
        case "close-order":  await processCloseOrder(request.payload);  break;
        case "price-update": await processPriceUpdate(request.payload); break;
      }
      await redis.xadd("callback-queue", "*", "id", data.id, "status", "created");
      lastId = id;
    }
  }
}`}</Code>
                </div>

                {/* Flow summary */}
                <div className="bg-white rounded-2xl p-6">
                  <h4 className="text-sm font-bold text-black font-dm-sans mb-5">Complete Flow Summary</h4>
                  <div className="space-y-3">
                    {[
                      <>Trade controller calls <code className="font-ibm-plex-mono text-xs bg-[#e8e8e8] px-1 rounded">createOrder</code>, generates unique ID, builds payload</>,
                      <>Calls <code className="font-ibm-plex-mono text-xs bg-[#e8e8e8] px-1 rounded">sendRequestAndWait(id, payload)</code> — executes publish + wait in parallel</>,
                      <><code className="font-ibm-plex-mono text-xs bg-[#e8e8e8] px-1 rounded">addToStream</code> publishes message to engine-stream via XADD</>,
                      <><code className="font-ibm-plex-mono text-xs bg-[#e8e8e8] px-1 rounded">waitForMessage</code> creates Promise, registers callback in memory map with 5s timeout</>,
                      <>Engine consumes message, validates balance, executes order, stores in DB</>,
                      <>Engine publishes callback to callback-queue with original correlation ID and status</>,
                      <>Subscriber's <code className="font-ibm-plex-mono text-xs bg-[#e8e8e8] px-1 rounded">runLoop</code> receives callback, finds matching Promise in map</>,
                      <>Calls <code className="font-ibm-plex-mono text-xs bg-[#e8e8e8] px-1 rounded">this.callbacks[id]()</code> to resolve, deletes entry from map</>,
                      <>API request unblocks, returns confirmed response to client</>,
                    ].map((text, i) => (
                      <FlowStep key={i} n={i + 1} text={text} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Risk Management */}
            <div>
              <h3 className="text-lg font-extrabold text-black font-dm-sans mb-5">Risk Management & Liquidation</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl p-6">
                  <h4 className="text-sm font-bold text-black font-dm-sans mb-4">Margin Calculation</h4>
                  <Code>{`// Required margin
const requiredMargin = (openingPrice * qty) / leverage;

// Current PnL
const currentPnl = side === 'long'
  ? (currentPrice - openingPrice) * qty
  : (openingPrice - currentPrice) * qty;

const remainingMargin = initialMargin + currentPnl;`}</Code>
                </div>
                <div className="bg-white rounded-2xl p-6">
                  <h4 className="text-sm font-bold text-black font-dm-sans mb-4">Liquidation Triggers</h4>
                  <MonoList items={[
                    "• Remaining margin ≤ 5% of initial margin",
                    "• Take profit price is reached",
                    "• Stop loss price is triggered",
                    "• Manual closure by user",
                  ]} />
                </div>
              </div>
            </div>

            {/* Performance */}
            <div>
              <h3 className="text-lg font-extrabold text-black font-dm-sans mb-5">Performance & Scalability</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  {
                    title: "In-Memory Processing",
                    items: [
                      "Open orders stored in memory",
                      "Price updates trigger instant calculations",
                      "DB snapshots every 10 seconds",
                      "Recovery from DB on restart",
                    ],
                  },
                  {
                    title: "Async Communication",
                    items: [
                      "Redis streams for decoupled services",
                      "Non-blocking order processing",
                      "Promise-based callback system",
                      "Timeout handling for failures",
                    ],
                  },
                  {
                    title: "Error Handling",
                    items: [
                      "Graceful WebSocket reconnection",
                      "Database transaction rollbacks",
                      "Redis connection recovery",
                      "Comprehensive logging system",
                    ],
                  },
                ].map((card) => (
                  <div key={card.title} className="bg-white rounded-2xl p-5">
                    <p className="text-xs font-bold text-black font-dm-sans uppercase tracking-wider mb-3">{card.title}</p>
                    <div className="space-y-1.5">
                      {card.items.map((item, i) => (
                        <p key={i} className="text-xs text-gray-600 font-dm-sans">• {item}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* Docker Setup */}
        <Section title="Docker Setup">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-bold text-black font-dm-sans mb-4">Infrastructure Services</h3>
              <Code>{`# docker-compose.yml
services:
  redis:
    image: redis:latest
    ports:
      - "6379:6379"

  postgres:
    image: postgres:latest
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=xenova_db
    ports:
      - "5433:5432"`}</Code>
            </div>
            <div>
              <h3 className="text-sm font-bold text-black font-dm-sans mb-4">Service Roles</h3>
              <div className="space-y-4">
                {[
                  { name: "Redis", desc: ["Manages engine-stream and callback-queue", "Handles async inter-service messaging"] },
                  { name: "PostgreSQL", desc: ["Persistent storage for users, orders, balances", "Accessed via Prisma ORM from the API"] },
                ].map((s) => (
                  <div key={s.name} className="bg-white rounded-xl p-4">
                    <p className="text-xs font-bold text-black font-dm-sans mb-2">{s.name}</p>
                    {s.desc.map((d, i) => <p key={i} className="text-xs text-gray-600 font-dm-sans">• {d}</p>)}
                  </div>
                ))}
                <div className="bg-black text-white rounded-xl p-4">
                  <p className="text-xs font-bold font-dm-sans mb-1">Quick Start</p>
                  <p className="font-ibm-plex-mono text-xs">docker compose up -d</p>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* CTA */}
        <div className="bg-black rounded-3xl px-8 py-14 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white font-dm-sans mb-3">
            Ready to get started?
          </h2>
          <p className="text-sm text-gray-400 font-dm-sans mb-8">
            Set up your environment and start trading on Xenova.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/marketplace"
              className="bg-white text-black text-sm font-dm-sans font-bold px-7 py-3 rounded-xl hover:bg-gray-100 transition-colors"
            >
              Try the Platform
            </Link>
            <a
              href="#"
              className="border-2 border-white text-white text-sm font-dm-sans font-bold px-7 py-3 rounded-xl hover:bg-white hover:text-black transition-colors"
            >
              View on GitHub
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Docs;
