# DevPath — Free Learning Resource & Roadmap Organizer

A full-stack MERN application that organizes free learning resources (YouTube playlists,
docs, sheets) into ordered roadmaps for DSA, Web Development, AI/ML, and Cybersecurity —
so students stop wasting time hunting for the right tutorial.

**Stack:** MongoDB · Express · React (Vite) · Node.js  
**Auth:** JWT (httpOnly cookies) + bcrypt password hashing + OTP email verification  
**Styling:** Tailwind CSS, custom "trail map" visual theme

---

## Features

- **Curated Roadmaps**: 4 domains (DSA, Web Dev, AI/ML, Cybersecurity) broken into ordered **waypoints**
- **Interactive Progress Tracking**: Check off completed waypoints with real-time animated percentage bars (saved to DB for users, `localStorage` for guests)
- **User Dashboard (`/profile`)**: Overview of learning milestones, completed topics by domain, and personal contributed resources
- **Live Search & Multi-Filtering**: Instant debounced search with case-insensitive substring matching, domain filtering, and format filtering
- **Resource Management**: Delete and manage personal contributions directly from roadmaps and search results
- **Contributor Attribution**: Clear badges identifying curated official resources vs community contributions
- **Quick Add from Waypoint**: "+ Add" buttons directly on roadmap waypoints that auto-fill the target domain and topic
- **JWT & OTP Auth**: httpOnly cookie authentication with 6-digit OTP verification (with dev auto-fill helper in development mode)
- **Design System & Toasts**: Built with Lucide SVG iconography, accessible form controls, floating toast notifications, and responsive mobile navigation drawer
- **404 Page**: Custom illustrated error page with base camp navigation

---

## Security

| Area | Implementation |
|------|---------------|
| Authentication | httpOnly cookies (not localStorage) — immune to XSS token theft |
| Passwords | bcrypt salted hashing (10 rounds), 6–72 char validation |
| OTP | Hashed before storage (bcrypt), 10-min TTL, max 5 attempts, 1-min resend cooldown |
| NoSQL injection | `express-mongo-sanitize` strips `$`/`.` from user input |
| Rate limiting | `express-rate-limit` — 50 req/15 min on auth, 300 req/15 min globally |
| HTTP headers | `helmet` — sets security headers (CSP, X-Frame-Options, etc.) |
| CORS | Whitelisted origin (`CLIENT_URL`), credentials enabled |
| Error handling | Stack traces hidden in production (`NODE_ENV=production`) |

---

## Project structure

```
devpath/
├── backend/
│   ├── config/db.js              # MongoDB connection
│   ├── controllers/              # Route logic
│   │   ├── authController.js     # Register, login, OTP verify/resend, profile
│   │   ├── domainController.js   # Domain listing, roadmap retrieval
│   │   └── resourceController.js # Resource CRUD, search
│   ├── middleware/
│   │   ├── auth.js               # JWT guard (cookie + header support)
│   │   ├── errorHandler.js       # Centralized error handler
│   │   └── rateLimiter.js        # Auth & API rate limiters
│   ├── models/
│   │   ├── User.js               # User + OTP fields
│   │   ├── Domain.js             # Domain (DSA, Web Dev, etc.)
│   │   ├── Topic.js              # Waypoints within a domain
│   │   └── Resource.js           # Learning resources
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth/*
│   │   ├── domainRoutes.js       # /api/domains/*
│   │   └── resourceRoutes.js     # /api/resources/*
│   ├── seed/seed.js              # Populate DB with curated resources
│   ├── utils/otp.js              # OTP generation, hashing, verification
│   ├── .env.example
│   └── server.js                 # Express app entry point
└── frontend/
    ├── src/
    │   ├── api/axios.js          # Axios instance (withCredentials)
    │   ├── components/
    │   │   ├── Navbar.jsx        # Responsive nav with mobile hamburger
    │   │   ├── DomainCard.jsx
    │   │   ├── TrailWaypoint.jsx
    │   │   ├── ResourceIcon.jsx
    │   │   ├── Footer.jsx
    │   │   └── PrivateRoute.jsx  # Auth guard wrapper
    │   ├── context/AuthContext.jsx # Auth state (cookie-based, server-hydrated)
    │   ├── pages/
    │   │   ├── Home.jsx          # Hero + domain grid
    │   │   ├── DomainPage.jsx    # Roadmap trail view
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── VerifyOTP.jsx     # 6-digit OTP input
    │   │   ├── AddResource.jsx
    │   │   ├── Search.jsx
    │   │   └── NotFound.jsx      # 404 page
    │   ├── App.jsx               # Router
    │   └── main.jsx              # React root
    └── tailwind.config.js
```

---

## Quickstart (Single Command)

From the main root directory:

```bash
# Install dependencies for both root, backend, and frontend
npm run install:all

# Seed database (if running for the first time)
npm run seed

# Run both backend & frontend concurrently
npm run dev
```

- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000`

---

## Setup instructions

### Prerequisites

- **Node.js** v18+ (`node -v`)
- **MongoDB** — either local (`mongod`) or a cloud [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) cluster

### Environment Setup

1. **Backend** `.env` in `backend/.env`:
   ```bash
   cp backend/.env.example backend/.env
   ```
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/devpath
   JWT_SECRET=any_long_random_string_here
   CLIENT_URL=http://localhost:5173
   NODE_ENV=development
   ```

2. **Frontend** `.env` in `frontend/.env`:
   ```bash
   cp frontend/.env.example frontend/.env
   ```
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

### Running the App

- **Both together (Recommended)**:
  ```bash
  npm run dev
  ```
- **Separately (Optional)**:
  ```bash
  npm run dev:backend   # or cd backend && npm run dev
  npm run dev:frontend  # or cd frontend && npm run dev
  ```

### 3 — Try it out

1. Open `http://localhost:5173` — you'll see 4 domain cards
2. Click a domain to see its roadmap trail with real resources
3. Click **Sign up**, create an account
4. A 6-digit OTP code is printed to the **backend terminal** (console.log — no SMTP needed)
5. Enter the code on the verification page
6. Log in and click **Add resource** to contribute your own
7. Use **Search** to find resources across all domains

---

## API endpoints

### Auth

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/register` | — | Create account, triggers OTP |
| POST | `/api/auth/verify-otp` | — | Verify 6-digit OTP |
| POST | `/api/auth/resend-otp` | — | Resend OTP code |
| POST | `/api/auth/login` | — | Log in (requires verified email) |
| POST | `/api/auth/logout` | — | Clear auth cookie |
| GET | `/api/auth/me` | ✓ | Get current user profile |

### Domains & Resources

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/domains` | — | List all domains |
| GET | `/api/domains/:slug` | — | Domain with full roadmap |
| POST | `/api/resources` | ✓ | Add a resource to a topic |
| GET | `/api/resources/search?q=&type=` | — | Search resources |
| DELETE | `/api/resources/:id` | ✓ | Delete own resource |

---

## How OTP works

1. **Register** → server generates a 6-digit code, hashes it with bcrypt, stores it on the user document with a 10-min TTL
2. **Code delivery** → in development, the OTP is printed to the server console (in production, plug in Nodemailer or any SMTP provider in `utils/otp.js`)
3. **Verify** → user enters the 6 digits; server compares against the hash, sets `isVerified = true`, and issues a session cookie
4. **Resend** → rate-limited to once per minute; previous code is replaced
5. **Brute-force protection** → max 5 wrong attempts per code before a resend is required
6. **Login blocked** → unverified users see "Please verify your email first" and are redirected to the OTP page

---

## 4. Data model (for your viva / report)

```
User        { name, email, password (hashed) }
Domain      { name, slug, description, icon, color }
Topic       { domain (ref), title, description, order }
Resource    { topic (ref), title, url, type, description, addedBy (ref User) }
```

- One **Domain** has many **Topics** (ordered by `order` field)
- One **Topic** has many **Resources**
- A **Resource** optionally references the **User** who added it (seeded resources have `addedBy: null`)

## 5. Key concepts you can explain in your viva

- **JWT authentication**: on login/register, the server signs a token containing the
  user's ID; the frontend stores it and attaches it as a `Bearer` token on every
  request that needs auth (see `middleware/auth.js` and `src/api/axios.js`)
- **Password security**: passwords are never stored in plain text — `bcryptjs` hashes
  them before saving (see the `pre('save')` hook in `models/User.js`)
- **Protected routes**: `POST /api/resources` and `DELETE /api/resources/:id` require
  a valid token; the frontend also blocks the `/add-resource` page for logged-out users
  via `PrivateRoute.jsx`
- **RESTful API design**: routes are grouped by resource (`/api/auth`, `/api/domains`, `/api/resources`)
  following standard REST conventions
- **MongoDB text search**: the search feature uses a MongoDB text index (`resourceSchema.index({ title: "text", ... })`)

## 6. If something breaks during your demo

- **"Couldn't load domains"** on the homepage → your backend isn't running, or you
  forgot to run `npm run seed`
- **CORS errors in the browser console** → check `CLIENT_URL` in backend `.env` matches
  where your frontend is actually running
- **Login/signup fails silently** → open browser DevTools → Network tab to see the
  actual error response from the backend

## 7. Ideas to extend (if you have extra time before submission)

- Progress tracking (mark topics as completed) — schema is easy to add: a
  `Progress { user, topic, completed }` collection
- Admin approval queue for user-submitted resources
- Upvote/downvote on resources
- More domains (Mobile Dev, DevOps, System Design)

---

## Deploy to Vercel

DevPath includes native Vercel support (`vercel.json` and `api/index.js` serverless bridge) allowing full-stack deployment directly from your GitHub repository:

### 1. Import Repository
1. Go to [Vercel Dashboard](https://vercel.com/new) and click **"Add New"** → **"Project"**.
2. Select your `dev-path` GitHub repository.
3. Leave **Root Directory** as `./` (or leave default).

### 2. Configure Environment Variables
In the Vercel project configuration, add:
- `MONGO_URI`: Your MongoDB connection string (e.g. from [MongoDB Atlas](https://www.mongodb.com/atlas/database) free tier: `mongodb+srv://<user>:<password>@cluster0.mongodb.net/devpath?retryWrites=true&w=majority`).
- `JWT_SECRET`: A strong random string for signing auth tokens.
- `NODE_ENV`: `production`

### 3. Deploy
Click **"Deploy"**. Vercel will:
- Build the Vite React frontend into `frontend/dist`
- Mount `/api/*` to the Express serverless function via `api/index.js`
- Route all SPA client paths (`/trails/*`, `/profile`, `/login`) to `index.html` without 404s

---

Built as a modern MERN full-stack learning platform.
