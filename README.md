# Web-Tech-Project

A full-stack Formula 1 themed web project with:
- **Client:** React + Vite (runs on `http://localhost:5173`)
- **Server:** Express + MongoDB (API runs on `http://localhost:5001`)

## Project Structure

- `/client` → Frontend application
- `/server` → Backend API and database models

## Prerequisites

Make sure you have:
- **Node.js** (v18+ recommended)
- **npm**
- **MongoDB URI** (MongoDB Atlas or local MongoDB instance)

## 1) Clone the Repository

```bash
git clone https://github.com/NamanKmwt/Web-Tech-Project.git
cd Web-Tech-Project
```

## 2) Backend Setup (Server)

1. Move into the server folder:

   ```bash
   cd server
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in `/server` with:

   ```env
   MONGODB_URI=your_mongodb_connection_string
   PORT=5001
   ```

4. (Optional but recommended) Seed initial data:

   ```bash
   node seed.js
   ```

5. Start the backend server:

   ```bash
   node index.js
   ```

   You should see logs like:
   - `✅ Connected to MongoDB`
   - `🚀 Server running on port 5001`

## 3) Frontend Setup (Client)

Open a **new terminal**:

1. Move into the client folder:

   ```bash
   cd client
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the frontend development server:

   ```bash
   npm run dev
   ```

4. Open the app in your browser:

   ```text
   http://localhost:5173
   ```

## API Notes

- The frontend is configured to call:
  - `http://localhost:5001/api/articles`
  - `http://localhost:5001/api/drivers`
  - `http://localhost:5001/api/f1/current-grid`

So the backend should run on **port 5001** for local development.

## Useful Commands

### Client

```bash
cd client
npm run dev      # Start frontend dev server
npm run build    # Build production assets
npm run lint     # Run ESLint
```

### Server

```bash
cd server
node index.js    # Start backend server
node seed.js     # Seed database
```

## Troubleshooting

- **MongoDB connection error**
  - Verify `MONGODB_URI` in `server/.env`.
- **Frontend loads but data is missing**
  - Ensure backend is running on `http://localhost:5001`.
- **Port conflict**
  - Change `PORT` in `server/.env` and update API URLs in `client/src/utils/fetcher.js` and `client/src/components/Leaderboard.jsx` if needed.
