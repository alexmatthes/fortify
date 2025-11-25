# Fortify: Algorithmic Drumming Speed Trainer

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-active-success.svg)
![Stack](https://img.shields.io/badge/stack-PERN-orange.svg)

> **Master your hands. Own your data.**
> A full-stack application using linear regression to track drumming velocity and apply progressive overload to practice routines.

## 📸 Screenshots

_(Add a screenshot or GIF of the Dashboard charts animating or the Metronome toggling here)_

## 🚀 The Problem & Solution

**The Problem:** Drummers often hit speed plateaus because they lack objective data on their practice sessions. It is difficult to track incremental progress over weeks or months by feel alone.

**The Solution:** Fortify solves this by logging tempo and duration metrics to visualize velocity trajectories over time. This allows musicians to apply mathematical progressive overload rather than guessing, using linear regression to calculate the exact next step for their practice routine.

## 🛠 Technical Highlights

This is a **PERN stack** application (PostgreSQL, Express, React, Node.js) engineered for performance and type safety.

-   **Off-Main-Thread Timing:** The metronome implementation utilizes a dedicated **Web Worker** (`metronome.worker.js`) to handle ticking. This prevents timing drift caused by React's main thread rendering work, ensuring sample-accurate audio scheduling essential for musical training.
-   **Data Visualization:** Custom implementation of **Chart.js** with gradient fills and responsive scaling to visualize practice trends and progress.
-   **Relational Data Modeling:** A complex schema using **Prisma ORM** that handles one-to-many relations between Users, Rudiments, and Practice Sessions.
-   **Secure Authentication:** Robust security using JWT-based authentication with Bcrypt hashing and protected route middleware.

## 💻 Tech Stack

### Frontend

-   **Framework:** React 19
-   **Styling:** Tailwind CSS (Dark Mode First)
-   **State/API:** Axios with Interceptors for token management
-   **Tooling:** Webpack 5, PostCSS

### Backend

-   **Runtime:** Node.js & Express
-   **Database:** PostgreSQL
-   **ORM:** Prisma
-   **Validation:** Zod (Runtime schema validation)
-   **Language:** TypeScript

## ⚙️ Architecture

### Database Schema

The application utilizes a normalized PostgreSQL schema to maintain data integrity:

-   **User:** Manages authentication credentials and profile settings.
-   **Rudiment:** Stores drumming patterns, including both standard rudiments (seeded) and user-created custom patterns.
-   **PracticeSession:** A high-frequency log of practice instances linked to specific rudiments and users.

## 🏃‍♂️ Getting Started

Follow these steps to get a local copy up and running.

### Prerequisites

-   Node.js (v18+)
-   PostgreSQL (Running locally or via a cloud provider like Supabase/Neon)

### Installation

1.  **Clone the repository**

    ```bash
    git clone [https://github.com/yourusername/fortify.git](https://github.com/yourusername/fortify.git)
    cd fortify
    ```

2.  **Setup Backend**

    ```bash
    cd backend
    npm install

    # Create a .env file in the backend directory
    # Copy backend/.env.example to backend/.env and fill in your values
    # Required variables:
    # DATABASE_URL="postgresql://user:password@localhost:5432/fortify?schema=public"
    # JWT_SECRET="your_super_secret_key" (REQUIRED - use a strong random string)

    # Run migrations and seed the database with standard rudiments
    npx prisma migrate dev --name init
    npm run seed

    # Start the backend server
    npm run dev
    ```

3.  **Setup Frontend**

    ```bash
    cd frontend
    npm install

    # Optional: Create a .env file in the frontend directory
    # Copy frontend/.env.example to frontend/.env and configure if needed
    # REACT_APP_API_URL="http://localhost:8000/api" (defaults to this if not set)

    # Start the frontend development server
    npm start
    ```

## ⚙️ Configuration

### Backend Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

| Variable | Required | Description | Default |
|----------|----------|-------------|---------|
| `DATABASE_URL` | Yes | PostgreSQL connection string | - |
| `JWT_SECRET` | Yes | Secret key for JWT token signing | - |
| `PORT` | No | Server port number | `8000` |
| `NODE_ENV` | No | Environment (development/production) | `development` |
| `FRONTEND_URL` | No | Frontend URL for CORS configuration | - |

### Frontend Environment Variables

Create a `.env` file in the `frontend` directory (optional):

| Variable | Required | Description | Default |
|----------|----------|-------------|---------|
| `REACT_APP_API_URL` | No | Backend API URL | `http://localhost:8000/api` |
| `REACT_APP_POSTHOG_KEY` | No | PostHog analytics key | - |

**Note:** The backend will fail to start if `JWT_SECRET` is not set. This is a security feature to prevent using default secrets in production.

## 🧪 Testing

### Backend Tests

The backend includes a comprehensive test suite using Jest. To run tests:

```bash
cd backend
npm test
```

Tests are located in `backend/services/__tests__/` and `backend/tests/`. The test suite includes:
- Authentication service tests
- Routine service tests
- Rudiment service tests
- Session route integration tests

### Frontend Type Checking

To verify TypeScript types in the frontend:

```bash
cd frontend
npm run type-check
```

## 🏗️ Architecture Overview

### Project Structure

```
fortify/
├── backend/          # Express.js API server
│   ├── controllers/  # Request handlers
│   ├── services/     # Business logic
│   ├── middleware/   # Auth, validation, error handling
│   ├── routes/       # API route definitions
│   ├── prisma/       # Database schema and migrations
│   └── types/        # TypeScript type definitions
│
└── frontend/         # React application
    ├── components/   # Reusable UI components
    ├── pages/        # Route-level page components
    ├── hooks/        # Custom React hooks
    ├── services/     # API client and utilities
    └── types/        # TypeScript type definitions
```

### Key Architectural Decisions

1. **Web Worker for Metronome Timing**
   - The metronome uses a dedicated Web Worker (`metronome.worker.ts`) to handle precise timing intervals
   - This prevents timing drift caused by React's main thread rendering work
   - Ensures sample-accurate audio scheduling essential for musical training

2. **Prisma ORM**
   - Type-safe database access with automatic TypeScript type generation
   - Migrations managed through Prisma's migration system
   - Seeded with standard drumming rudiments on first setup

3. **JWT Authentication**
   - Stateless authentication using JSON Web Tokens
   - Tokens stored in localStorage on the frontend
   - Protected routes validate tokens via middleware

4. **Error Handling**
   - Centralized error handler in `backend/middleware/errorHandler.ts`
   - Consistent error response format across all API endpoints
   - Frontend error utility (`frontend/src/utils/errorHandler.ts`) for user-friendly messages

5. **Type Safety**
   - Full TypeScript coverage on both frontend and backend
   - Shared type definitions where appropriate
   - Runtime validation using Zod schemas

### Data Flow

1. **User Authentication**
   - User logs in → Frontend sends credentials → Backend validates → Returns JWT → Frontend stores token

2. **Practice Session Logging**
   - User completes session → Frontend sends session data → Backend validates → Stores in database → Returns success

3. **Routine Building**
   - User creates routine → Frontend sends routine data → Backend validates and stores → Returns routine with nested data

4. **Dashboard Data**
   - Frontend requests stats → Backend queries database → Aggregates data → Returns formatted statistics

## 🔧 Development Workflow

1. **Start Development Servers**
   ```bash
   # From root directory
   npm run dev
   ```
   This runs both backend and frontend concurrently.

2. **Database Migrations**
   ```bash
   cd backend
   npx prisma migrate dev --name your_migration_name
   ```

3. **View Database**
   ```bash
   cd backend
   npx prisma studio
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

## 🐛 Troubleshooting

### Backend won't start
- Ensure `JWT_SECRET` is set in `backend/.env`
- Check that PostgreSQL is running and `DATABASE_URL` is correct
- Verify port 8000 is not in use

### Frontend can't connect to backend
- Check `REACT_APP_API_URL` in `frontend/.env` matches backend URL
- Ensure backend is running on the expected port
- Check CORS configuration in backend

### Database connection errors
- Verify PostgreSQL is running: `pg_isready` or check service status
- Confirm `DATABASE_URL` format is correct
- Run migrations: `npx prisma migrate dev`

### Type errors
- Run `npm run type-check` in frontend to see all TypeScript errors
- Ensure all dependencies are installed: `npm install` in both directories

## 🤝 Contributing

Contributions are welcome! Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
