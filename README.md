# Bob's Corn - Rate Limiting System

A real-time rate limiting demonstration built as an interactive farming game. Features dynamic tier-based cooldowns, WebSocket communication, and visual feedback.

## Tech Stack

**Backend:** Node.js, Express, Socket.IO, TypeScript  
**Frontend:** React, Vite, Tailwind CSS, Framer Motion, TypeScript

## Quick Start

### Prerequisites
- Node.js 18+
- npm 9+

### Installation

```bash
# Backend
cd backend
npm install
cp .env.example .env

# Frontend
cd frontend
npm install
cp .env.example .env
```

### Development

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Access at `http://localhost:5173`

## Core Features

### Rate Limiting
- Base cooldown: 60 seconds
- Client identification via UUID (localStorage)
- In-memory state management
- Real-time validation

### Loyalty Tiers

| Tier | Purchases | Cooldown |
|------|-----------|----------|
| New Client | 0-4 | 60s |
| Regular | 5-14 | 50s |
| VIP | 15-29 | 40s |
| Legend | 30+ | 30s |

### Growth Phases
- **Planting** (0-33%): Initial stage
- **Growing** (33-66%): Active growth
- **Ready** (66-100%): Harvestable

## Key WebSocket Events

**Client → Server:**
- `user:connected` - Register client
- `corn:buy` - Purchase attempt

**Server → Client:**
- `corn:initial-state` - Full state on connect
- `corn:state` - Growth phase updates
- `corn:harvested` - Successful purchase
- `corn:error` - Rate limit hit (429)
- `tier:upgraded` - Tier progression

## Environment Variables

**Backend** (`.env`):
```env
PORT=3000
FRONTEND_URL=http://localhost:5173
```

**Frontend** (`.env`):
```env
VITE_API_URL=http://localhost:3000
```

## Architecture

```
Frontend (React)  ←→  WebSocket  ←→  Backend (Express)
      ↓                                      ↓
  localStorage                         In-Memory Map
   (clientId)                         (User States)
```

## License

MIT

---
