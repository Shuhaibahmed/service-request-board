# GlobalTNA — Service Request Board

A full-stack mini service request board where homeowners can post service requests and tradespeople can browse, update, and manage them.

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 14 (App Router) + Tailwind CSS |
| Backend | Node.js + Express |
| Database | MongoDB Atlas |
| ODM | Mongoose |

---

## Project Structure

```
service-request-board/
├── server/          # Express backend API
│   ├── models/      # Mongoose schemas
│   ├── routes/      # API route handlers
│   ├── middleware/  # Error handling
│   ├── server.js    # Entry point
│   ├── seed.js      # Sample data seeder
│   └── .env         # Environment variables (see below)
│
└── client/          # Next.js frontend
    ├── app/         # App Router pages
    ├── components/  # Reusable UI components
    ├── lib/         # API utility functions
    └── .env.local   # Frontend env (see below)
```

---

## Environment Variables

### Backend (`server/.env`)

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.bwdeaf3.mongodb.net/serviceboard?retryWrites=true&w=majority&appName=Cluster0
PORT=5000
NODE_ENV=development
```

> ⚠️ Replace `<username>` and `<password>` with your MongoDB Atlas credentials.

### Frontend (`client/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## Setup & Run Instructions

### Prerequisites

- Node.js v18 or above
- A MongoDB Atlas account with a cluster (free tier is fine)

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd service-request-board
```

### 2. Setup the Backend

```bash
cd server
npm install
```

Create your `.env` file in `server/`:

```bash
# Windows
copy .env.example .env

# Mac/Linux
cp .env.example .env
```

Edit `.env` and paste your MongoDB Atlas connection string.

Start the backend:

```bash
npm run dev
```

You should see:
```
✅ MongoDB connected successfully
🚀 Server listening on port 5000
```

### 3. Seed Sample Data (Optional but recommended)

```bash
# From inside server/
npm run seed
```

This inserts 7 sample job requests so the app has data to show.

### 4. Setup the Frontend

Open a **new terminal**:

```bash
cd client
npm install
npm run dev
```

Frontend runs at: **http://localhost:3000**

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/jobs` | List all jobs |
| GET | `/api/jobs?category=Plumbing` | Filter by category |
| GET | `/api/jobs?status=Open` | Filter by status |
| GET | `/api/jobs?search=tap` | Keyword search |
| GET | `/api/jobs/:id` | Get single job |
| POST | `/api/jobs` | Create new job |
| PATCH | `/api/jobs/:id` | Update status only |
| DELETE | `/api/jobs/:id` | Delete a job |

---

## Features

- ✅ Post service requests with title, description, category, location, contact
- ✅ Browse all jobs with category + status filters
- ✅ Keyword search across title and description
- ✅ View full job details
- ✅ Update job status (Open → In Progress → Closed)
- ✅ Delete jobs with confirmation
- ✅ Input validation (client + server side)
- ✅ Global error handling
- ✅ Seed script with 7 sample jobs
- ✅ Clean, responsive dark UI

---

## Common Issues

**MongoDB connection error (querySrv ECONNREFUSED)**

This is a DNS issue, not a code issue. Fix:
1. Change your DNS to Google: `8.8.8.8` / `8.8.4.4`
2. Restart your WiFi
3. Run `npm run dev` again

If DNS change doesn't work, go to MongoDB Atlas → Cluster → Connect → Drivers and use the standard (non-SRV) connection string.

**MONGO_URI is not set**

Make sure:
- `.env` file is inside the `server/` folder (not `server/.env.txt`)
- `dotenv.config()` is at the very top of `server.js`
- No spaces around `=` in the `.env` file
