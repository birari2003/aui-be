# AUI Backend (MVP)

Node.js + Express + Sequelize + MySQL backend for AUI.

## Tech Stack
- Node.js
- Express
- Sequelize ORM
- MySQL
- sequelize-cli migrations

## Project Structure

```text
aui-workspace-be/
  config/
    config.js
  migrations/
  models/
  seeders/
  src/
    app.js
    controllers/
    middlewares/
    routes/
    services/
    utils/
    validators/
  .env
  .env.example
  .sequelizerc
  server.js
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment:
- Update `.env` with DB credentials.

3. Run migrations:
```bash
npm run migrate
```

4. Run development server:
```bash
npm run dev
```

5. Health check:
```bash
curl http://127.0.0.1:5000/health
```

## Authentication Flow (MVP)
- Register user with role (`professional`, `studio`, `institute`)
- Admin approves user (`status = approved`)
- Request OTP
- Verify OTP and receive JWT token

## Core API Prefix
`/api/v1`

## Routes

### Auth
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/request-otp`
- `POST /api/v1/auth/verify-otp`
- `GET /api/v1/auth/me`

### Professional
- `POST /api/v1/professionals/profile`
- `GET /api/v1/professionals/profile`
- `PUT /api/v1/professionals/availability`

### Studio
- `POST /api/v1/studios/profile`
- `POST /api/v1/studios/engagements`
- `PATCH /api/v1/studios/engagements/:engagementId/status`
- `GET /api/v1/studios/engagements`
- `POST /api/v1/studios/talent-bench`
- `GET /api/v1/studios/talent-bench`
- `POST /api/v1/studios/hiring-requests`

### Institute
- `POST /api/v1/institutes/profile`
- `POST /api/v1/institutes/bookings`
- `PATCH /api/v1/institutes/bookings/:bookingId/status`
- `GET /api/v1/institutes/bookings`

### Search
- `GET /api/v1/search/professionals`

### Reels
- `GET /api/v1/reels`
- `POST /api/v1/reels`

### Admin
- `GET /api/v1/admin/users`
- `PATCH /api/v1/admin/users/:userId/status`
- `PATCH /api/v1/admin/professionals/:professionalId/verify`
- `PATCH /api/v1/admin/studios/:studioId/verify`
- `PATCH /api/v1/admin/institutes/:instituteId/verify`
- `GET /api/v1/admin/engagements`
- `GET /api/v1/admin/bookings`
- `GET /api/v1/admin/analytics`

## Business Rules Implemented
- User registration defaults to `status = pending`.
- Only `approved` users can access protected role features.
- Professional `level` is auto-calculated from `experienceYears`:
  - 0 => `fresher`
  - 1-2 => `junior`
  - 3-6 => `mid`
  - 7+ => `senior`
- Work ledger entries are created when:
  - engagement status changes to `completed`
  - booking status changes to `completed`
- Talent ID format auto-generated as `AUI-000001`.
