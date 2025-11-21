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
    # Add your database connection string and a secret for JWT
    # DATABASE_URL="postgresql://user:password@localhost:5432/fortify?schema=public"
    # JWT_SECRET="your_super_secret_key"

    # Run migrations and seed the database with standard rudiments
    npx prisma migrate dev --name init
    node prisma/seed.js

    # Start the backend server
    npm run dev
    ```

## 🤝 Contributing

Contributions are welcome! Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
