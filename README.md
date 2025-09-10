# Nath IT Solutions — Fullstack Demo (Express + MongoDB)

This project is a demo fullstack website for **Nath IT Solutions** with a responsive frontend and a simple Node/Express backend connected to MongoDB Atlas.

## What's included
- Express server (server.js) with session support (connect-mongo)
- Mongoose user model and auth routes (signup/login/logout)
- Static responsive frontend under `/public` (index.html, about.html, how.html)
- Frontend login & signup forms (modal) that talk to the backend
- `.env` included with the MongoDB URI and session secret (as you provided)

## Quick start (locally)
1. Install dependencies:
```bash
cd nath_it_fullstack
npm install
```

2. Start server (dev):
```bash
npm run dev
```

3. Open http://localhost:5000

## Notes
- The project uses the following env vars (file `.env` included):
```
PORT=5000
MONGO_URI=... (your provided URI)
SESSION_SECRET=...
```

- Sessions are stored in MongoDB (connect-mongo). Passwords are hashed with bcrypt.

## Security
This is a demo. For production, rotate credentials, use HTTPS, and follow standard security best practices.

