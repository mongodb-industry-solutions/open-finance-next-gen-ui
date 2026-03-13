# Leafy Bank — Open Finance Frontend

Demonstrates how MongoDB Atlas powers a modern Open Finance banking interface — multi-bank account aggregation, AI-assisted consent management, real-time streaming chat, and MongoDB Queryable Encryption visualization, all built with Next.js 15 and MongoDB's LeafyGreen design system.

## Where MongoDB Shines

- **Multi-Bank Account Aggregation**: The dashboard merges internal Leafy Bank accounts with external bank data (fetched via consent) into a unified view. MongoDB's flexible document model handles heterogeneous account structures from different institutions without schema conflicts.
- **MongoDB Atlas Charts Integration**: Embedded Atlas Charts render personalized spending analytics and financial visualizations directly in the dashboard — no charting library to maintain, data stays in Atlas.
- **Queryable Encryption Visualization**: The bank login consent flow includes a side-by-side comparison showing how MongoDB Queryable Encryption stores consent fields — the app sees decrypted values while the server only sees encrypted binary.
- **Real-Time Streaming from Agentic Backend**: The AI assistant streams tool calls, progress updates, and responses via SSE from a LangGraph multi-agent backend backed by MongoDB checkpointing — every conversation persists across sessions.

## High-Level Architecture

<!-- TODO: Add architecture diagram -->
![Architecture Diagram](placeholder-architecture-diagram.png)

```text
┌──────────────────────────────────────────────┐
│         Next.js 15 Frontend (port 3000)      │
├──────────────────────────────────────────────┤
│  Pages                                       │
│  ├─ / (Dashboard)     → Global position,     │
│  │                       spending charts,     │
│  │                       product cards        │
│  ├─ /accounts         → Internal + external  │
│  │                       accounts & txns      │
│  ├─ /credit-cards     → Credit card overview │
│  ├─ /loans            → External loan data   │
│  └─ /bank-login       → Consent approval +   │
│                          QE visualization     │
│                                              │
│  Components                                  │
│  ├─ LeafyBankAssistant → AI chat (SSE)       │
│  ├─ NavBar             → Navigation          │
│  ├─ OverlapCards       → Stacked card display│
│  └─ Login              → User persona select │
├──────────────────────────────────────────────┤
│  Route Handlers (API Proxy)                  │
│  ├─ /api/backend/*  → Core Backend (:8003)   │
│  └─ /api/chatbot/*  → Chatbot Backend (:8080)│
└──────────┬───────────────────┬───────────────┘
           │                   │
           ▼                   ▼
┌──────────────────┐ ┌────────────────────────┐
│ Open Finance     │ │ Agentic Chatbot        │
│ Backend (:8003)  │ │ Backend (:8080)        │
│ • Accounts       │ │ • LangGraph agents     │
│ • Consents (QE)  │ │ • SSE streaming        │
│ • Transactions   │ │ • Human-in-the-loop    │
│ • Products       │ │ • MongoDB checkpoints  │
└──────────────────┘ └────────────────────────┘
```

## Tech Stack

- **[Next.js 15](https://nextjs.org/)** App Router for the frontend framework
- **[React 19](https://react.dev/)** for the UI layer
- **[LeafyGreen UI](https://github.com/mongodb/leafygreen-ui)** (MongoDB's design system) for core components
- **[React Bootstrap](https://react-bootstrap.github.io/)** + **[Bootstrap 5](https://getbootstrap.com/)** for layout and modals
- **[Tailwind CSS](https://tailwindcss.com/)** for utility classes
- **[CSS Modules](https://github.com/css-modules/css-modules)** for component-scoped styling
- **[MongoDB Atlas Charts](https://www.mongodb.com/products/charts)** for embedded data visualizations
- **[marked](https://marked.js.org/)** for rendering markdown in chatbot responses

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js** 22 or higher
- **Open Finance Backend** (`open-finance-next-gen` repo) running on port 8003
- **Agentic Chatbot Backend** (`leafy-bank-backend-openfinance-react-agent-chatbot` repo) running on port 8080
- **Docker & Docker Compose** (optional, for containerized deployment)

## Initial Configuration

### Clone the Repository

1. Open your terminal and navigate to the directory where you want to store the project:

   ```bash
   cd /path/to/your/desired/directory
   ```

2. Clone the repository:

   ```bash
   git clone <repository-url>
   ```

3. Navigate into the cloned project:

   ```bash
   cd open-finance-next-gen-ui
   ```

### Start the Backend Services

The frontend proxies all API calls to two backend services. Both must be running before the UI will function:

1. **Open Finance Backend** on port 8003 — provides accounts, consents, transactions, products, and authentication
2. **Agentic Chatbot Backend** on port 8080 — provides the AI assistant with SSE streaming

> Without these services running, the dashboard will show loading states and the chatbot will be unavailable.

### Environment Variables

Create a `frontend/.env.local` file (optional — defaults work for local development):

```bash
CORE_BACKEND_URL=http://localhost:8003
CHATBOT_BACKEND_URL=http://localhost:8080
```

> These are resolved at **runtime** by Next.js Route Handlers, not at build time. No rebuild needed when changing backend URLs.

## Run it Locally

### Setup

1. Ensure you are in the root project directory where the `makefile` is located.

2. Install dependencies:

   ```bash
   make install
   ```

   Or manually:

   ```bash
   cd frontend && npm install
   ```

### Running Locally

Start the development server with:

```bash
make dev
```

The frontend will be available at <http://localhost:3000>.

You can also use other make targets:

```bash
make build      # Production build
make start      # Start production server
make lint       # Run ESLint
make clean      # Remove node_modules + .next
make fresh      # Clean install + start dev
make kill       # Kill process on port 3000
make restart    # Kill + restart dev server
```

## Run with Docker

Make sure to run this from the root directory.

To run with Docker:

```bash
docker-compose up --build
```

The frontend will be available at <http://localhost:3000>.

To manage the container:

```bash
docker-compose start    # Start existing container
docker-compose stop     # Stop container
docker-compose down     # Remove container
```

> **Note:** The production Docker image (Dockerfile.frontend) runs on port 8080 for Kubernetes deployment.

## Core Features

### Dashboard (Home Page)

<!-- TODO: Add dashboard screenshot -->
![Dashboard](placeholder-dashboard.png)

The home page provides a unified financial overview:

- **Global Position** — Total balance, total debt, and credit score aggregated across all institutions
- **Spending Analytics** — MongoDB Atlas Charts embedded as iframes, personalized per user
- **Product Cards** — Quick navigation to Accounts, Credit Cards, and Loans
- **Rotating Content** — Carousel with financial tips, loan offers, and advice
- **AI Assistant** — Floating button to open the LeafyBankAssistant chat modal

### Multi-Bank Account View

<!-- TODO: Add accounts page screenshot -->
![Accounts Page](placeholder-accounts-page.png)

After granting consent via the chatbot, external bank accounts appear alongside internal Leafy Bank accounts:

- **OverlapCards** — Stacked card display for all accounts (internal + external)
- **Transaction Table** — Recent 20 transactions with color-coded spending categories
- **Automatic Refresh** — Data updates when new consents are approved

### AI Assistant (LeafyBankAssistant)

<!-- TODO: Add chatbot screenshot -->
![AI Assistant](placeholder-ai-assistant.png)

A streaming chat modal powered by the agentic chatbot backend:

- **SSE Streaming** — Real-time display of tool calls, progress updates, and agent responses
- **Step Indicator** — Expandable view showing tool inputs/outputs for transparency
- **Suggestion Chips** — Quick-start prompts on first open
- **Markdown Rendering** — Agent responses rendered as rich markdown
- **Interrupt Handling**:
  - **Consent Approval** — Inline approval/decline within the chat
  - **Bank Login** — Opens a new tab for the bank login flow
- **Thread Persistence** — Conversation history maintained across page navigation

### Bank Login & Consent Flow

<!-- TODO: Add bank login flow screenshot -->
![Bank Login Flow](placeholder-bank-login.png)

When the chatbot triggers a bank login interrupt, a new tab opens with a guided flow:

1. **Token Fetch** — Automatically retrieves a bearer token from the external institution
2. **Bank Login** — SSE stream monitors the consent process
3. **Consent Approval** — Displays full consent details with a Queryable Encryption proof table showing encrypted vs. decrypted field values
4. **Completion** — Sends the bearer token and consent ID back to the chatbot tab via `BroadcastChannel`

### Loans Page

External loan products from consented institutions:

- Loan cards with outstanding balances and interest rates
- Detailed loan table
- Prompts to connect via chatbot if no consent exists

## Demo Users

Two pre-configured personas are available in the login modal:

| User | Name | Role | Description |
| ---- | ---- | ---- | ----------- |
| `fridaklo` | Frida Klo | Accountant at Deloitte | Banked customer with existing accounts |
| `hellyrig` | Helly Rig | Freelance Designer | Unbanked customer, new to Leafy Bank |

## API Proxy Architecture

The frontend uses Next.js Route Handlers as runtime proxies instead of `next.config.mjs` rewrites. This ensures:

- **Runtime URL resolution** — Backend URLs read from environment variables at request time, not build time
- **SSE streaming support** — Response bodies are piped directly without buffering
- **Deployment flexibility** — Same build artifact works across staging and production with different backend URLs

| Frontend Path | Backend Target |
| ------------- | -------------- |
| `/api/backend/*` | `CORE_BACKEND_URL/api/v1/*` (default: `http://localhost:8003`) |
| `/api/chatbot/*` | `CHATBOT_BACKEND_URL/*` (default: `http://localhost:8080`) |

## Data Flow

### Three-Layer Hook Architecture

```text
Raw Hooks (lib/api/hooks.js)
├── useAccounts()           → Internal bank accounts
├── useTransactions()       → Transaction history
├── useCreditScore()        → Credit bureau score
├── useExternalAccounts()   → External accounts (consent-gated)
└── useExternalProducts()   → External loans/products (consent-gated)
        ↓
Composed Hooks (lib/api/hooks.js)
├── useHomeData()           → Dashboard: balance, debt, score, cards, loans
├── useAccountsPageData()   → Accounts: merged accounts + transactions
├── useCreditCardsPageData()→ Credit Cards: cards + filtered transactions
└── useLoansPageData()      → Loans: external products + consent status
        ↓
Pages (app/*/page.js)
├── / (Home)                → useHomeData()
├── /accounts               → useAccountsPageData()
├── /credit-cards           → useCreditCardsPageData()
└── /loans                  → useLoansPageData()
```

### Complex Component Hooks

| Hook | Component | Purpose |
| ---- | --------- | ------- |
| `useChatbot()` | LeafyBankAssistant | SSE streaming, message state, interrupt handling, thread management |
| `useBankLogin()` | bank-login/page | Token fetch, consent SSE, encryption demo, BroadcastChannel |

## State Management

**UserContext** (`lib/context/UserContext.js`) provides global state:

| State | Purpose |
| ----- | ------- |
| `selectedUser` | Current demo user + bearer token |
| `consents` | Map of consent IDs → status and institution |
| `authorizedConsents` | Filtered array of approved consents |
| `profile` | Spending profile: `balanced` (default), `overspender`, `saver` |
| `chatMessages` + `chatThreadId` | Chat history persisted across page navigation |

User selection is stored in `localStorage` so the bank-login tab (opened in a new window) can access the session.

## Common Errors

### Frontend Errors

- **Dashboard shows loading forever** — Ensure the Open Finance backend is running on port 8003.
- **Chatbot shows error** — Ensure the Chatbot backend is running on port 8080.
- **LeafyGreen components fail to load** — Delete `node_modules` and run `npm install` again.
- **Port 3000 already in use** — Run `make kill` to free the port, then `make dev`.
- **Ensure Node.js version is 22 or higher** (`node --version`).

### Bank Login Errors

- **Token fetch fails** — The Open Finance backend must be running and the user must exist.
- **Consent tab doesn't communicate back** — Check that both tabs are on the same origin (`localhost:3000`). `BroadcastChannel` requires same-origin.
- **Encryption demo table empty** — The consent must use Queryable Encryption. Check that the backend has `encrypted_consents` collection set up.

## Additional Resources

### MongoDB Resources

- [MongoDB for Financial Services](https://www.mongodb.com/solutions/industries/financial-services)
- [MongoDB Atlas](https://www.mongodb.com/atlas)
- [MongoDB Atlas Charts](https://www.mongodb.com/products/charts)
- [MongoDB LeafyGreen UI](https://github.com/mongodb/leafygreen-ui)

### Frameworks and Services

- [Next.js 15](https://nextjs.org/) — React framework with App Router
- [React 19](https://react.dev/) — UI library
- [React Bootstrap](https://react-bootstrap.github.io/) — Bootstrap components for React
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first CSS framework
- [marked](https://marked.js.org/) — Markdown parser

### Related Repositories

- **[Open Finance Backend](../open-finance-next-gen/)** — FastAPI backend for accounts, consents, transactions, and Queryable Encryption (port 8003)
- **[Agentic Chatbot Backend](../leafy-bank-backend-openfinance-react-agent-chatbot/)** — LangGraph multi-agent chatbot for consent management and financial advice (port 8080)
