# ⚡ ClutchRIT

> **The official web platform for an esports club** — featuring event management, member profiles, announcements, and a full-featured admin dashboard.

---

## 🎮 Overview

**ClutchRIT** is a full-stack esports club management platform built with a cyberpunk-inspired UI. It serves as the public face of the club while providing admins with a powerful backend dashboard to manage members, events, and announcements — all in one place.

The platform features a cinematic dark aesthetic with scanline overlays, glowing neon effects, animated cursors, and a scrolling game ticker — built to feel like it belongs in the esports world.

---

## ✨ Features

### 🌐 Public Pages
- **Home** — Hero section, club highlights, and an immersive landing experience
- **Events** — Browse upcoming and past tournaments with filters by game & status
- **Event Detail** — Full details: banner, prize pool, venue, tags, and registration link
- **Members** — Showcase of all club members with roles, games, bios, and social links
- **Announcements** — Pinned and general club announcements
- **About** — Club story, mission, and leadership

### 🔐 Authentication
- JWT-based auth with **access + refresh token** strategy (cookies)
- Invite-only registration via secure email invite links
- Admin-only protected routes

### 🛠️ Admin Dashboard
| Module | Capabilities |
|---|---|
| **Events** | Create, edit, delete events; upload banners via Cloudinary; set game, venue, prize pool, tags |
| **Announcements** | Post, pin, and delete announcements by type (general, urgent, etc.) |
| **Members** | Add members with photos, roles, year, branch, game list, bio, and social links; mark as executive |
| **Invite Users** | Generate and send invite emails to new admin accounts |

---

## 🏗️ Tech Stack

### Frontend
| Technology | Role |
|---|---|
| **React 19** | UI framework |
| **Vite 8** | Build tool & dev server |
| **Tailwind CSS 3** | Utility-first styling |
| **Framer Motion** | Animations & transitions |
| **React Router v6** | Client-side routing |
| **Axios** | HTTP client |
| **Lucide React / React Icons** | Icon library |

### Backend
| Technology | Role |
|---|---|
| **Node.js + Express 5** | REST API server |
| **Supabase (PostgreSQL)** | Database & storage |
| **JWT (jsonwebtoken)** | Authentication |
| **Bcryptjs** | Password hashing |
| **Cloudinary** | Image uploads (banners, member photos) |
| **Nodemailer** | Invite email delivery |
| **Multer** | Multipart file upload handling |
| **Express Validator** | Input validation |
| **express-rate-limit** | API rate limiting |

### Infrastructure & DevOps
| Technology | Role |
|---|---|
| **Docker** | Containerized backend |
| **GitHub Actions** | CI/CD pipeline (self-hosted runner) |
| **Vercel** | Frontend + serverless API deployment |

---

## 📁 Project Structure

```
clutchrit/
├── client/                  # React frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/      # Navbar, Footer
│   │   │   └── ui/          # Cursor, Ticker, reusable UI
│   │   ├── context/         # AuthContext (global auth state)
│   │   ├── hooks/           # Custom React hooks
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Events.jsx
│   │   │   ├── EventDetail.jsx
│   │   │   ├── Members.jsx
│   │   │   ├── Announcements.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── admin/       # Dashboard, ManageEvents, ManageMembers, etc.
│   │   ├── routes/          # ProtectedRoute component
│   │   └── services/        # Axios API service layer
│   └── package.json
│
├── server/                  # Express.js backend
│   ├── config/              # Supabase, Cloudinary config
│   ├── controllers/         # Route handler logic
│   ├── middleware/          # Auth middleware, validators
│   ├── models/              # DB query abstractions
│   ├── routes/              # API route definitions
│   │   ├── authRoutes.js
│   │   ├── eventRoutes.js
│   │   ├── announcementRoutes.js
│   │   ├── memberRoutes.js
│   │   └── inviteRoutes.js
│   ├── utils/               # Helpers (email, tokens, etc.)
│   ├── schema.sql           # PostgreSQL schema (Supabase)
│   ├── server.js            # App entry point
│   └── package.json
│
├── api/
│   └── index.js             # Vercel serverless entry point
├── Dockerfile               # Docker config for backend
├── vercel.json              # Vercel deployment rewrites
└── .github/
    └── workflows/
        └── deploy.yml       # GitHub Actions CI/CD pipeline
```

---

## 🗃️ Database Schema

```sql
users           -- Admin accounts (UUID, username, password, role)
members         -- Club members (name, photo, role, year, branch, games, bio, socials, is_executive)
events          -- Tournament/events (title, description, banner, game, date, venue, prize_pool, tags, status)
announcements   -- Club announcements (title, content, type, is_pinned)
```

> Hosted on **Supabase** (managed PostgreSQL). Run `schema.sql` to initialize tables.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+
- **npm** v9+
- A **Supabase** project with the schema applied
- A **Cloudinary** account for image uploads
- An SMTP provider for **Nodemailer** (email invites)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/clutchrit.git
cd clutchrit
```

### 2. Configure Environment Variables

Create `server/.env` based on the following:

```env
PORT=5000
NODE_ENV=development

# Supabase
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key

# JWT
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# CORS
CLIENT_URL=http://localhost:5173
```

### 3. Install Dependencies

```bash
# Install all (root, server, and client)
npm run install-all
```

### 4. Initialize the Database

Run `server/schema.sql` in your Supabase SQL editor to create all tables.

### 5. Run the Development Servers

```bash
# Start backend (from /server)
cd server && npm run dev     # Runs on http://localhost:5000

# Start frontend (from /client)
cd client && npm run dev     # Runs on http://localhost:5173
```

---

## 🐳 Docker (Backend)

```bash
# Build the image
docker build -t clutchrit-api-image:latest .

# Run the container
docker run -d -p 3000:3000 --name clutchrit-backend clutchrit-api-image:latest
```

---

## 🔄 CI/CD Pipeline

The project uses a **GitHub Actions self-hosted runner** for automated backend deployment on every push to `main`:

1. ✅ Checkout code  
2. 🛑 Stop & remove the old Docker container  
3. 🔨 Build a new Docker image  
4. 🚀 Start the new container  
5. 🧹 Prune old Docker data  

Frontend is deployed automatically via **Vercel** on every push.

---

## 🔌 API Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/auth/login` | Admin login | Public |
| `POST` | `/api/auth/register` | Register via invite | Invite token |
| `POST` | `/api/auth/refresh` | Refresh access token | Cookie |
| `GET` | `/api/events` | List all events | Public |
| `POST` | `/api/events` | Create an event | Admin |
| `PUT` | `/api/events/:id` | Update event | Admin |
| `DELETE` | `/api/events/:id` | Delete event | Admin |
| `GET` | `/api/members` | List all members | Public |
| `POST` | `/api/members` | Add a member | Admin |
| `PUT` | `/api/members/:id` | Update member | Admin |
| `DELETE` | `/api/members/:id` | Delete member | Admin |
| `GET` | `/api/announcements` | List announcements | Public |
| `POST` | `/api/announcements` | Create announcement | Admin |
| `DELETE` | `/api/announcements/:id` | Delete announcement | Admin |
| `POST` | `/api/invites/send` | Send invite email | Admin |

---

## 🚢 Deployment (Vercel)

The `vercel.json` config routes all `/api/*` requests to the serverless backend entry (`api/index.js`) and serves the built client from `/public`:

```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/index.js" },
    { "source": "/(.*)",     "destination": "/public/$1" }
  ]
}
```

Build the client before deploying:
```bash
npm run build
```

---

## 🎨 Design System

ClutchRIT uses a **cyberpunk / dark esports** visual language:

- **Color palette**: Deep void black, cyan glow accents, neon highlights
- **Effects**: Scanline overlay, perspective floor grid, noise texture, animated ticker
- **Typography**: Modern sans-serif with glowing text effects
- **Cursor**: Custom animated cursor component
- **Animations**: Framer Motion page transitions and micro-interactions

---

## 📄 License

This project is for internal club use. All rights reserved © ClutchRIT.
