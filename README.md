# Storefront Backend Project

This is a RESTful API for an online storefront built with Node.js, Express, and PostgreSQL. The API supports user authentication, product management, and order processing.

---

## Technologies Used

- **Node.js** - JavaScript runtime
- **Express** - Web application framework
- **PostgreSQL** - Relational database
- **TypeScript** - Type-safe JavaScript
- **db-migrate** - Database migration tool
- **jsonwebtoken** - JWT authentication
- **bcrypt** - Password hashing
- **Jasmine** - Testing framework
- **Docker** - Container platform for PostgreSQL

---

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Docker and Docker Compose
- npm or yarn package manager

---

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the project root with the following variables:

```
ENV=dev
POSTGRES_HOST=127.0.0.1
POSTGRES_PORT=5433
POSTGRES_DB=store
POSTGRES_DB_TEST=test
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
SALT=10
PEPPER=your-pepper-string
JWT_SECRET=your-jwt-secret
```

### 3. Database Setup

**Start PostgreSQL with Docker:**

```bash
docker-compose up -d
```

**Run Database Migrations:**

```bash
npm run db:migrate
```

**Seed the Database (Optional):**

```bash
npm run db:seed
```

### 4. Start the Application

**Development Mode:**

```bash
npm run server
```

**Production Mode:**

```bash
npm run build
npm start
```

### 4. Postman Collection

Added postman collection which can be imported to test the routes.
It can be found in the root directory.
Create a new environment variable in postman as follows: 
```bash
base_URL=localhost:3000
```

---

## Port Configuration

| Service                 | Port |
| ----------------------- | ---- |
| **Backend API**         | 3000 |
| **PostgreSQL Database** | 5433 |

---

## Database Connection

The application connects to PostgreSQL using the following configuration:

- **Host:** 127.0.0.1
- **Port:** 5433
- **Database:** store
- **User:** postgres
- **Password:** postgres

The database runs in a Docker container. Make sure Docker is running before starting the application.

The test database: 

- **Host:** 127.0.0.1
- **Port:** 5433
- **Database:** test
- **User:** postgres
- **Password:** postgres

---

## Available Scripts

| Script                    | Description                           |
| ------------------------- | ------------------------------------- |
| `npm run server`          | Start development server with ts-node |
| `npm start`               | Start production server               |
| `npm test`                | Run Jasmine test suite                |
| `npm run db:migrate`      | Run database migrations               |
| `npm run db:migrate:down` | Rollback last migration               |
| `npm run db:reset`        | Reset all migrations                  |
| `npm run db:seed`         | Seed database with sample data        |
| `npm run db:setup`        | Run migrations and seed data          |

---

## Testing


Before running the tests, run the server:

```bash
npm run server
```

Then, in another terminal, run the test suite::

```bash
npm test
```

Tests include:

- User model tests
- Product model tests
- Order model tests
- API endpoint tests

---

## Project Structure

```
├── migrations/           # Database migration files
├── spec/                # Jasmine configuration
├── src/
│   ├── api/            # Express route handlers
│   ├── data/           # Database models
│   ├── helpers/        # Utility functions
│   ├── middleware/     # Authentication middleware
│   ├── tests/          # Test files
│   └── server.ts       # Application entry point
├── .env                # Environment variables (not in repo)
├── docker-compose.yml  # Docker configuration
├── database.json       # Database connection config
├── package.json        # Project dependencies
└── tsconfig.json       # TypeScript configuration
```

---

## API Documentation

For detailed API endpoint documentation, see [REQUIREMENTS.md](REQUIREMENTS.md).
