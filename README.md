# DevPath — Free Learning Resource & Roadmap Organizer

A full-stack MERN application that organizes free learning resources (YouTube playlists,
docs, sheets) into ordered roadmaps for DSA, Web Development, AI/ML, and Cybersecurity —
so students stop wasting time hunting for the right tutorial.

**Stack:** MongoDB · Express · React (Vite) · Node.js
**Auth:** JWT (JSON Web Tokens) with bcrypt password hashing
**Styling:** Tailwind CSS, custom "trail map" visual theme

---

## 1. What this project does

- Browse curated **roadmaps** for 4 domains, each broken into ordered **topics** ("waypoints")
- Each topic links to real, free **resources** (YouTube playlists, official docs, practice sheets)
- **Sign up / log in** with JWT-based authentication
- Logged-in users can **add new resources** to any topic (CRUD in action)
- **Search** resources by keyword or type across all domains

This gives you a project with: authentication, protected routes, relational MongoDB data
(Domain → Topic → Resource), full CRUD, and a search feature — enough to demonstrate a real
full-stack skillset without overengineering a 2-day build.

---

## 2. Project structure

```
devpath-mern/
├── backend/
│   ├── config/db.js          # MongoDB connection
│   ├── models/                # User, Domain, Topic, Resource (Mongoose schemas)
│   ├── controllers/            # Route logic
│   ├── routes/                 # Express routers
│   ├── middleware/             # JWT auth guard + error handler
│   ├── seed/seed.js            # Populates the DB with real, curated resources
│   └── server.js                # App entry point
└── frontend/
    ├── src/
    │   ├── pages/               # Home, DomainPage, Login, Register, AddResource, Search
    │   ├── components/          # Navbar, DomainCard, TrailWaypoint, ResourceIcon, etc.
    │   ├── context/AuthContext.jsx
    │   └── api/axios.js
    └── index.html
```

---

## 3. Setup instructions

### Prerequisites
- Node.js (v18 or later) — check with `node -v`
- A MongoDB database. Two options:
  - **Easiest for a submission**: free cloud database at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) (no local install needed)
  - **Local**: install MongoDB Community Server and run `mongod`

### Step 1 — Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Open `.env` and set:
```
MONGO_URI=mongodb://127.0.0.1:27017/devpath   # or your Atlas connection string
JWT_SECRET=any_long_random_string_here
```

Seed the database with real, curated resources:
```bash
npm run seed
```

Start the backend:
```bash
npm run dev
```
The API runs at `http://localhost:5000`. Visit `http://localhost:5000` in a browser —
you should see `{"message":"DevPath API is running"}`.

### Step 2 — Frontend setup

Open a **new terminal**:
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```
The app runs at `http://localhost:5173`.

### Step 3 — Try it out
1. Open `http://localhost:5173` — you should see 4 domain cards (DSA, Web Development, AI & ML, Cybersecurity)
2. Click a domain to see its roadmap trail with real resources
3. Click **Sign up**, create an account
4. Click **Add resource** to add your own resource to any topic
5. Use **Search** to find resources by keyword

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

Built as a MERN full-stack college submission project.
