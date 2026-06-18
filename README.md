# ManageIt Backend

A task management REST API built with NestJS, TypeORM, and PostgreSQL. Handles authentication, task CRUD with filtering and pagination, role-based access control, activity logging, and file attachment metadata.

## Live

- **API base:** https://manageit-backend-production.up.railway.app/api/v1
- **Swagger docs:** https://manageit-backend-production.up.railway.app/api/docs

> The backend runs on Railway's free tier and may take up to 60 seconds to wake from idle on the first request.

## Tech Stack

- **Runtime:** Node.js 20, TypeScript
- **Framework:** NestJS 11
- **Database:** PostgreSQL (Neon in production, Dockerized Postgres locally)
- **ORM:** TypeORM with migrations (no `synchronize`)
- **Auth:** JWT in httpOnly cookies (access + refresh tokens), Passport
- **Validation:** class-validator + class-transformer
- **API docs:** OpenAPI / Swagger UI
- **Tests:** Jest unit tests on the service layer

## Features

**Authentication**
- Email/password signup and login with bcrypt password hashing
- JWT access tokens (15 min) and refresh tokens (7 days), both as httpOnly cookies
- Stateless refresh flow with a dedicated `/auth/refresh` endpoint
- Backend accepts tokens via cookie OR Authorization header (cookie wins) so Postman/curl testing works without juggling cookie jars
- `GET /auth/me` for session hydration

**Tasks**
- Full CRUD with user scoping (users only see their own tasks)
- List endpoint with combinable filter (status), search (title ILIKE), sort (createdAt, dueDate, priority, status), and pagination
- Priority and status sort use ordinal CASE expressions so `desc` produces the intuitive ordering (HIGH/PENDING first)
- Mark-as-complete handled via the generic PATCH endpoint with `{ status: 'COMPLETED' }`

**Activity log**
- Every mutation (create, update, status change, delete, attachment add/remove) writes an entry to a per-task activity table
- `GET /tasks/:id/activities` returns the chronological history
- `changes` field is JSONB capturing field-level diffs

**Role-based access**
- Two roles: USER and ADMIN
- Admin endpoint `GET /admin/tasks` returns all tasks across all users (read-only, no edit/delete)
- Seed script for creating an initial admin: `npm run seed:admin -- <email> <password>`

**File attachments**
- Metadata-only on the backend (URL, name, type, size, uploadedBy)
- Actual files live on Cloudinary; frontend uploads direct, backend just persists the resulting URL
- Activity log captures attachment add/remove events

**API design**
- Consistent response envelope: `{ success: true, data: ... }` or `{ success: false, error: { code, message, details? } }`
- URI versioning: all routes live under `/api/v1`
- Global exception filter formats every error into the same envelope
- Per-route Swagger decorators using a small library of envelope-aware response helpers

## Prerequisites

- Node 20+ and npm
- PostgreSQL 16 (or use the included Docker setup)
- Docker + Docker Compose if you want the one-command local setup

## Setup — With Docker (recommended)

The fastest path. Spins up Postgres + the backend together.

```bash
git clone https://github.com/HaiderAli-Ravian/manageit-backend.git
cd manageit-backend
cp .env.example .env
# fill in real values — at minimum generate two random JWT secrets:
#   openssl rand -base64 32   (run twice)
docker-compose up -d --build
```

The backend will be available at `http://localhost:4000` and Swagger docs at `http://localhost:4000/api/docs`.

Migrations run automatically on container start.

## Setup — Without Docker

```bash
git clone https://github.com/HaiderAli-Ravian/manageit-backend.git
cd manageit-backend
npm install

cp .env.example .env
# edit .env with your local Postgres credentials and real JWT secrets

# ensure your Postgres instance has the configured database created
createdb manageit

npm run migration:run
npm run start:dev
```

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| `PORT` | Port the API listens on | `4000` |
| `NODE_ENV` | `development`, `test`, or `production` | `development` |
| `FRONTEND_URL` | Frontend origin (used for CORS) | `http://localhost:3000` |
| `DB_HOST` | Postgres host | `localhost` |
| `DB_PORT` | Postgres port | `5432` |
| `DB_USERNAME` | Postgres user | `postgres` |
| `DB_PASSWORD` | Postgres password | `postgres` |
| `DB_NAME` | Postgres database name | `manageit` |
| `JWT_ACCESS_SECRET` | Signing secret for access tokens | Generate with `openssl rand -base64 32` |
| `JWT_ACCESS_EXPIRES_IN` | Access token lifetime | `15m` |
| `JWT_REFRESH_SECRET` | Signing secret for refresh tokens | Generate with `openssl rand -base64 32` (different from access secret) |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token lifetime | `7d` |

## Database

Migrations live in `src/database/migrations/`. Useful commands:

```bash
npm run migration:run        # apply pending migrations
npm run migration:revert     # revert the most recent migration
npm run migration:generate src/database/migrations/<Name>   # auto-generate from entity changes
npm run migration:create src/database/migrations/<Name>     # create an empty migration
```

`synchronize: false` is enforced — migrations are the only path to schema changes.

### Seeding an admin user

```bash
npm run seed:admin -- admin@example.com YourStrongPassword123
```

The script creates a user with `role = ADMIN` and exits.

## Available Scripts

| Script | What it does |
|---|---|
| `npm run start:dev` | Run with hot reload |
| `npm run start:prod` | Run the compiled build |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm test` | Run the Jest unit test suite |
| `npm run migration:run` | Apply pending migrations |
| `npm run seed:admin` | Seed an admin user |

## API Documentation

Swagger UI is served at `/api/docs` in every environment. It documents every endpoint with request/response schemas, error codes, and a working "Try it out" tool. Cookie auth and bearer auth are both registered, so you can authorize from inside Swagger UI and exercise authenticated routes directly.

## Tests

Unit tests covering the highest-value business logic:

- `signup` hashes the password before storing
- `signup` with a duplicate email throws `ConflictException`
- `login` with a wrong password throws `UnauthorizedException`
- `Task.findOne` throws `NotFoundException` when a user accesses another user's task (user isolation)
- `Task.update` with a status change logs a `STATUS_CHANGED` activity (not generic `UPDATED`)

```bash
npm test
```

The tests use mocked repositories and Jest spies. Real bcrypt is exercised (not mocked) so password hashing is verified end-to-end.

## Project Structure

```
src/
├── api/v1/
│   ├── auth/                    # signup, login, refresh, /me, JWT strategies, guards
│   ├── users/                   # user entity + service
│   ├── tasks/                   # task CRUD + list features
│   ├── task-activities/         # activity log service
│   ├── task-attachments/        # attachment metadata endpoints
│   └── admin/                   # admin-only endpoints (RBAC)
├── common/
│   ├── decorators/              # @CurrentUser, @Roles, @Public, Swagger helpers
│   ├── guards/                  # RolesGuard
│   ├── filters/                 # AllExceptionsFilter (response envelope)
│   ├── interceptors/            # TransformInterceptor (response envelope)
│   ├── interfaces/              # API response types
│   ├── enums/                   # Role, TaskStatus, TaskPriority, TaskActivityAction
│   └── entities/                # BaseEntity (id, createdAt, updatedAt)
├── database/
│   ├── database.module.ts       # TypeORM configuration
│   ├── data-source.ts           # TypeORM CLI data source for migrations
│   ├── migrations/              # versioned schema migrations
│   └── seeds/seed-admin.ts      # admin user seeding script
├── app.module.ts
└── main.ts
```

## Architecture Notes

A few design choices worth knowing if you're reading the code.

The response envelope is enforced by a global interceptor and exception filter, not by manual wrapping in each controller. Controllers return raw data and the interceptor wraps it. Controllers `throw` standard NestJS exceptions and the filter formats them into the error envelope. This keeps controllers thin and impossible to accidentally bypass.

Auth is a global guard. Every route requires authentication by default. The `@Public()` decorator opts specific routes out (signup, login, refresh, logout). Role checks layer on top via `@Roles(Role.ADMIN)` + `RolesGuard` applied per-route, not globally.

DTOs are auto-validated by a global `ValidationPipe` configured to throw the custom validation envelope so the frontend always sees the same error shape.

Database schema lives in TypeORM entities under each module's `entities/` folder. A `BaseEntity` provides shared `id`, `createdAt`, and `updatedAt` columns to all four entities.

## Assumptions and Trade-offs

A few decisions made deliberately, with the reasoning.

**JWT cookies over localStorage.** Tokens live in httpOnly cookies so JavaScript can't read them, mitigating XSS impact. The trade-off is more deployment complexity (CORS with `credentials: true`, exact origin required, environment-aware `SameSite` config) but the security improvement is worth it for an auth-bearing app.

**Stateless refresh tokens.** No DB table for active refresh tokens. Simpler and faster, but the downside is you can't invalidate a single user's refresh token without rotating the global secret. For an assessment scope this is acceptable; for a production app handling sensitive data, server-side token tracking would be the next step.

**Hard delete with cascade.** Deleting a task removes its activities and attachments via DB cascades. This means the activity log doesn't preserve deletion history (the record gets nuked along with the task). For an audit-heavy product, soft deletes with retained activity rows would be the better pattern, but the added complexity wasn't worth it for this scope.

**Search uses ILIKE, not full-text search.** Simple case-insensitive partial match on `title`. Works fine for small task lists. At scale, a Postgres `tsvector` column with a GIN index would replace it.

**Priority and status sort use CASE WHEN ordinals.** So `?sortBy=priority&sortOrder=desc` returns HIGH first, which matches the more intuitive user expectation ("show me my most important tasks first"). Inverting the enum string ordering this way is a small but real piece of UX polish.

**Uppercase enum string values end-to-end.** `'PENDING'`, `'HIGH'`, `'ADMIN'` — same values in the database, on the wire, and in the frontend code. No mapping layer between layers. Display labels are humanized in the UI components. Trade-off: URLs look like `?status=PENDING` (slightly less polished), but the simplicity is worth it.

**Cookie SSL: environment-aware.** Development uses `SameSite=Lax` + `Secure=false`. Production uses `SameSite=None` + `Secure=true` because the frontend (Vercel) and backend (Railway) are on different domains, requiring cross-site cookies which the browser only allows over HTTPS.

**API versioning under `/api/v1` from day one.** Cheap to add upfront, very awkward to retrofit later if a v2 ever needs to coexist with v1.

**Admin role is view-only.** Admins can list all tasks via `GET /admin/tasks` but can't edit or delete other users' tasks. Modeling admin as a "compliance / oversight" role rather than a "superuser" role. A real product might want both.

## Known Limitations

These are conscious omissions, not bugs.

- WebSockets / real-time updates were on the bonus list but skipped. TanStack Query's refetch-on-window-focus on the frontend provides a "semi-live" experience that's enough for this use case.
- Activity log doesn't preserve deletion records (cascade nukes them with the deleted task).
- No rate limiting on auth endpoints. A real app would add `@nestjs/throttler`.
- Cloudinary file cleanup isn't wired up. Deleting an attachment row in the DB doesn't delete the underlying file from Cloudinary, so orphaned blobs accumulate. A production app would call Cloudinary's destroy API in the same transaction or run a scheduled cleanup job.
- Free tier services (Railway backend, Neon DB) have spin-down behavior. First request after idle may take up to 60s.
- Tests cover the service layer's highest-value paths but don't test controllers, guards, or integration scenarios end-to-end.

## Frontend Repo

The Next.js frontend that consumes this API lives at:
https://github.com/HaiderAli-Ravian/manageit-frontend

## Author

Built by **Haider Ali**.

GitHub: [HaiderAli-Ravian](https://github.com/HaiderAli-Ravian)
