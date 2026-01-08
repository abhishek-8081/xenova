# Xenova — Real-Time Options Trading Platform

A full-stack options trading platform inspired by Exness. Trade BTC/USDC perpetuals with live prices, leverage, take-profit/stop-loss controls, and real-time PnL tracking — all in your browser.

---

## What It Looks Like

### Landing Page
<!-- Screenshot: home page with header and hero section -->
![Landing Page](./docs/screenshots/landing.png)

### Trading Dashboard
<!-- Screenshot: marketplace page with chart, order book, and trade panel -->
![Trading Dashboard](./docs/screenshots/dashboard.png)

### Order History
<!-- Screenshot: orders section showing open/closed positions with PnL -->
![Order History](./docs/screenshots/orders.png)

### Login & Register
<!-- Screenshot: auth pages -->
![Auth Pages](./docs/screenshots/auth.png)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15, React 19, Tailwind CSS v4, TanStack Query |
| API Server | Node.js, Express, TypeScript |
| Trading Engine | Node.js, TypeScript, Redis Streams |
| Price Feed | WebSocket → Backpack Exchange |
| Database | PostgreSQL, Prisma ORM |
| Messaging | Redis Streams |
| Monorepo | Turborepo, pnpm workspaces |
| Containers | Docker, Docker Compose |

---

## Project Structure

```
Xenova-v2/
├── apps/
│   ├── web/                  # Next.js frontend (port 3200)
│   ├── api-service/          # REST API server (port 3001)
│   ├── engine-service/       # Trading engine (internal, port 3002)
│   └── price-poller-service/ # Price feed via WebSocket (internal, port 3003)
├── packages/
│   ├── prisma/               # Database schema and migrations
│   ├── redis/                # Shared Redis client
│   ├── types/                # Shared TypeScript types
│   ├── ui/                   # Shared UI component library
│   ├── eslint-config/        # Shared ESLint config
│   └── typescript-config/    # Shared tsconfig base
└── docker-compose.yml
```

---

## How It Works

The platform is split into three backend microservices that talk to each other through **Redis Streams**:

1. **API Service** — handles all HTTP requests from the frontend: user auth (JWT + cookies), opening/closing trades, fetching balance and candle data. When a user places or closes an order, it writes to the `engine-stream` Redis stream and waits for a response on `callback-queue`.

2. **Engine Service** — the core of the platform. It listens on `engine-stream` for price updates and order events, processes trades, applies leverage, checks take-profit and stop-loss conditions, updates user balances in real time, and persists everything to PostgreSQL.

3. **Price Poller Service** — maintains a persistent WebSocket connection to Backpack Exchange and streams live BTC/USDC prices into `engine-stream` every tick.

---

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (`npm install -g pnpm`)
- Docker Desktop

### 1. Clone and install

```bash
git clone <your-repo-url>
cd Xenova-v2
pnpm install
```

### 2. Set up environment variables

Each service needs its own `.env` file. Create these files:

**`apps/api-service/.env`**
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/trading_db"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="your-secret-key-here"
PORT=3001
```

**`apps/engine-service/.env`**
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/trading_db"
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

### 3. Start infrastructure (PostgreSQL + Redis)

```bash
docker compose up -d redis
```

Or start everything via Docker:

```bash
docker compose up -d
```

### 4. Run database migrations

```bash
cd packages/prisma
npx prisma migrate dev
npx prisma generate
```

### 5. Start development servers

```bash
# Start all services at once
pnpm run dev
```

Or start individually:

```bash
pnpm run dev:api          # API Service on :3001
pnpm run dev:engine       # Engine Service on :3002
pnpm run dev:price-poller # Price Poller on :3003
```

Then open `http://localhost:3200` in your browser.

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Create a new account |
| POST | `/auth/login` | Log in, sets HTTP-only cookie |
| POST | `/auth/logout` | Clear session |
| GET | `/auth/me` | Get current user info |

### Trading
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/trade/create` | Open a new position |
| POST | `/trade/close/:orderId` | Close an open position |
| GET | `/trade/orders` | List all your orders |
| GET | `/trade/orders/:orderId` | Get a single order |

### Balance & Prices
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/balance` | Get your current balance |
| GET | `/candles` | Get OHLCV candle data |

---

## Database Schema

```
Users        → id, email, password, name
Assets       → symbol, balance, decimals, userId
Orders       → id, userId, side, qty, openingPrice, closingPrice,
               status, leverage, takeProfit, stopLoss, pnl, closeReason
```

---

## Available Scripts

```bash
pnpm run dev          # Start all apps in dev mode
pnpm run build        # Build all packages and apps
pnpm run check-types  # TypeScript type check across the whole monorepo
pnpm run lint         # ESLint across all packages
pnpm run format       # Prettier format all TS/TSX files
```

---

## Production Deployment

```bash
# Build everything
pnpm run build

# Start each service
pnpm run start:api
pnpm run start:engine
pnpm run start:price-poller
```

Or use Docker Compose for a fully containerized deployment:

```bash
docker compose up --build
```

---

## Architecture Overview

<!-- Screenshot or diagram: service communication flow -->
![Architecture Diagram](./docs/screenshots/architecture.png)

```
Browser → Next.js Frontend
            ↓ HTTP
        API Service (3001)
            ↓ Redis Stream (engine-stream)
        Engine Service (3002)
            ↑ Redis Stream (engine-stream)
        Price Poller (3003) ← WebSocket ← Backpack Exchange
            ↓ PostgreSQL
        Database
```

---

## License

MIT
