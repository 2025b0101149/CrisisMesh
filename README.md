# CrisisMesh: AI-Powered Emergency Response & Resource Coordination Platform

CrisisMesh is a mission-critical platform designed to coordinate disaster relief, emergency responder routing, automated citizen triage, and logistics allocation using Google Gemini AI and geospatial mesh mapping.

---

## Project Structure

```text
CrisisMesh/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js                 # Mongoose connection with graceful offline handling
│   │   │   └── env.js                # Centralized environment variable loader
│   │   ├── controllers/
│   │   │   └── health.controller.js  # System health, uptime, and diagnostics handler
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js    # JWT authorization stub
│   │   │   └── error.middleware.js   # Global 404 & centralized error handlers
│   │   ├── models/
│   │   │   └── user.model.js         # User/responder schema stub
│   │   ├── routes/
│   │   │   ├── api.routes.js         # Master API router (/api/...)
│   │   │   └── health.routes.js      # Health check router (/api/health)
│   │   ├── services/
│   │   │   └── gemini.service.js     # Google Gemini AI triage service stub
│   │   ├── app.js                    # Express app configuration & middleware
│   │   └── server.js                 # HTTP listener & process lifecycle management
│   ├── .env.example                  # Environment variable template
│   ├── .env                          # Local dev config
│   ├── .gitignore
│   └── package.json
│
├── frontend/
│   ├── public/                       # Static public assets
│   ├── src/
│   │   ├── assets/                   # Emergency icons & logos
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Button.jsx        # Reusable button with variants & loading state
│   │   │   │   └── StatusBadge.jsx   # Live ping indicator badge
│   │   │   └── layout/
│   │   │       ├── Navbar.jsx        # Navigation bar with live backend status indicator
│   │   │       ├── Footer.jsx        # Footer with architecture indicators
│   │   │       └── AppLayout.jsx     # Master page layout wrapper
│   │   ├── pages/
│   │   │   ├── HomePage.jsx          # Mission control & health diagnostic dashboard
│   │   │   └── NotFoundPage.jsx      # 404 sector error page
│   │   ├── routes/
│   │   │   └── AppRoutes.jsx         # React Router configuration
│   │   ├── services/
│   │   │   ├── api.js                # Axios client with interceptors
│   │   │   └── healthService.js      # Health check consumer & latency tracker
│   │   ├── App.jsx                   # Root application component
│   │   ├── index.css                 # Tailwind CSS styles & design tokens
│   │   └── main.jsx                  # React DOM mount point
│   ├── .env.example                  # Frontend environment template
│   ├── .env                          # Local dev config
│   ├── .gitignore
│   ├── index.html                    # HTML entry point with emergency theme
│   ├── vite.config.js                # Vite build config with Tailwind v4 & proxy
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## Getting Started

### Prerequisites
- **Node.js**: v18+ (tested on Node v24)
- **npm**: v9+ (tested on npm v11)
- **MongoDB** *(Optional for initial health-check, required for data persistence)*

---

## Commands to Run the Project

### 1. Backend Service
```bash
# Navigate to the backend directory
cd backend

# Install dependencies (already installed during foundation setup)
npm install

# Start development server with auto-reload (Nodemon)
npm run dev
# OR run in production mode
npm start
```
- **Backend API**: `http://localhost:5000`
- **Health Check**: `http://localhost:5000/api/health`

### 2. Frontend Application
```bash
# Open a second terminal and navigate to the frontend directory
cd frontend

# Install dependencies (already installed during foundation setup)
npm install

# Start Vite development server
npm run dev
```
- **Frontend App**: `http://localhost:5173`

---

## Health Check Verification
The system comes with an integrated health check endpoint:
- **API**: `GET /api/health`
- **Frontend View**: When you open `http://localhost:5173`, the dashboard automatically executes the health check, measuring network latency, process uptime, and subsystem status (database and AI integration readiness).
