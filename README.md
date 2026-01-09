# Xenova

Xenova is a real-time perpetuals trading platform where you can open leveraged BTC/USDC positions, set take-profit and stop-loss targets, and track your PnL as prices move — live, in the browser.

Built as a full-stack TypeScript monorepo using Turborepo and pnpm workspaces.

---

## Screenshots

### Home
<!-- Add screenshot of the landing page here -->
![Home](./docs/screenshots/home.png)

### Trading View
<!-- Add screenshot of the trading dashboard here -->
![Trading View](./docs/screenshots/trading.png)

### Positions & History
<!-- Add screenshot of the orders/positions panel here -->
![Positions](./docs/screenshots/positions.png)

### Auth
<!-- Add screenshot of login/register pages here -->
![Auth](./docs/screenshots/auth.png)

---

## Stack

**Frontend**
- Next.js 15 (App Router) + React 19
- Tailwind CSS v4
- TanStack Query v5
- lightweight-charts for candlestick chart
- Axios with cookie-based auth

**Backend**
- Node.js + Express (API Service)
- Node.js + Redis Streams (Engine + Price Poller)
- PostgreSQL with Prisma ORM
- Redis for inter-service messaging

**Infrastructure**
- Turborepo for monorepo orchestration
- Docker + Docker Compose
- pnpm workspaces

---

## How the system works

Three backend services run independently and talk through Redis Streams:

**API Service** (`apps/api-service` · port 3001)
Handles all client-facing HTTP traffic — registration, login (JWT stored in HTTP-only cookies), opening and closing positions, fetching balance, and serving candle data. When a trade action comes in, it writes an event to the `engine-stream` Redis stream and waits for the engine to respond on `callback-queue`.

**Engine Service** (`apps/engine-service` · port 3002)
The brain of the platform. Consumes events from `engine-stream`, processes orders against current market price, applies leverage, calculates unrealized PnL, checks take-profit and stop-loss conditions in real time, and writes confirmed results back to PostgreSQL and the callback queue.

**Price Poller** (`apps/price-poller-service` · port 3003)
Maintains a persistent WebSocket connection to Backpack Exchange and pushes live BTC/USDC price ticks into `engine-stream` so the engine always has an up-to-date price to work with.

---

## Monorepo layout

```
.
├── apps/
│   ├── api-service/           # Express REST API
│   ├── engine-service/        # Trading engine
│   ├── price-poller-service/  # Live price feed
│   └── web/                   # Next.js frontend
└── packages/
    ├── prisma/                # Shared DB client + schema
    ├── redis/                 # Shared Redis client
    ├── types/                 # Shared TypeScript types
    ├── ui/                    # Shared component library
    ├── eslint-config/         # ESLint presets
    └── typescript-config/     # tsconfig presets
```

---

## Local setup

### What you need

- Node.js 18 or later
- pnpm (`npm i -g pnpm`)
- Docker Desktop (for Postgres + Redis)

### Step 1 — Install dependencies

```bash
pnpm install
```

### Step 2 — Environment variables

Create `.env` files for each service before starting anything.

**`apps/api-service/.env`**
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/xenova_db"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="replace-with-a-strong-secret"
PORT=3001
```

**`apps/engine-service/.env`**
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/xenova_db"
REDIS_URL="redis://localhost:6379"
PORT=3002
```

**`apps/price-poller-service/.env`**
```env
REDIS_URL="redis://localhost:6379"
PORT=3003
```

**`apps/web/.env.local`**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Step 3 — Start Postgres and Redis

```bash
docker compose up -d redis
```

Or spin up the full stack with Docker:

```bash
docker compose up -d
```

### Step 4 — Migrate the database

```bash
cd packages/prisma
npx prisma migrate dev
npx prisma generate
```

### Step 5 — Run in development mode

Start everything at once:

```bash
pnpm dev
```

Or start services individually:

```bash
pnpm dev:api           # → http://localhost:3001
pnpm dev:engine        # → http://localhost:3002
pnpm dev:price-poller  # → http://localhost:3003
```

Frontend runs on `http://localhost:3200`

> All three backend services need to be running for trades to go through end-to-end.

---

## API reference

### Auth · `/auth`

| Method | Path | What it does |
|--------|------|--------------|
| `POST` | `/auth/register` | Create a new user account |
| `POST` | `/auth/login` | Authenticate and set session cookie |
| `POST` | `/auth/logout` | Clear the session |
| `GET` | `/auth/me` | Return the currently authenticated user |

### Trading · `/trade`

| Method | Path | What it does |
|--------|------|--------------|
| `POST` | `/trade/create` | Open a new leveraged position |
| `POST` | `/trade/close/:orderId` | Close an open position by ID |
| `GET` | `/trade/orders` | List all orders for the current user |
| `GET` | `/trade/orders/:orderId` | Get a single order by ID |

### Other

| Method | Path | What it does |
|--------|------|--------------|
| `GET` | `/balance` | Get asset balances for the current user |
| `GET` | `/candles` | Fetch OHLCV candle data for charting |

### Inter-service messaging

| Stream | Direction | Purpose |
|--------|-----------|---------|
| `engine-stream` | API → Engine, Price Poller → Engine | Trade requests and price ticks |
| `callback-queue` | Engine → API | Order confirmations and status updates |

---

## Database schema

```
User
  id, email, password (hashed), name

Asset
  symbol, balance, decimals, userId

Order
  id, userId, side, qty
  openingPrice, closingPrice
  status, leverage
  takeProfit, stopLoss
  pnl, closeReason
```

---

## Scripts

```bash
pnpm dev          # Start all apps in watch mode
pnpm build        # Production build across the monorepo
pnpm check-types  # TypeScript check for all packages
pnpm lint         # ESLint across the monorepo
pnpm format       # Prettier format all TS/TSX/MD files
```

---

## Production

Build and start individual services:

```bash
pnpm build

pnpm start:api
pnpm start:engine
pnpm start:price-poller
```

Or build and run the whole thing with Docker Compose:

```bash
docker compose up --build
```

---

## Architecture

<!-- Add architecture diagram here -->
![Architecture](./docs/screenshots/architecture.png)

```
Browser
  └─ HTTP ──► API Service (3001)
                └─ Redis Stream (engine-stream) ──► Engine Service (3002)
                                                         └─ PostgreSQL
Backpack Exchange
  └─ WebSocket ──► Price Poller (3003)
                     └─ Redis Stream (engine-stream) ──► Engine Service
```

---

## License

MIT
