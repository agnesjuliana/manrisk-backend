# BE Playground - Backend API

A modern Express.js backend boilerplate with TypeScript, Prisma ORM, and Node 24 support.

## 🚀 Tech Stack

- **Runtime**: Node.js 24+
- **Framework**: Express.js 5.2.1
- **Language**: TypeScript 5.9.3
- **ORM**: Prisma 7.1.0
- **Database**: PostgreSQL 16
- **Cache/Queue**: Redis 7
- **Authentication**: Passport JWT
- **Email**: Mailgun + Bull Queue
- **Validation**: Joi
- **Package Manager**: pnpm 10.23.0
- **Code Quality**: ESLint 9 + Prettier

## 📋 Prerequisites

- Node.js >= 24.0.0
- pnpm >= 10.0.0
- Docker & Docker Compose (for local database)
- PostgreSQL 16+ (or use Docker)
- Redis 7+ (or use Docker)

## 🏗️ Project Structure

```
src/
├── config/          # Configuration files (DB, JWT, Email)
├── controllers/     # Request handlers
├── middleware/      # Express middleware (auth, validation, errors)
├── models/          # Request/response DTOs
├── repositories/    # Database operations
├── routers/         # Route definitions
├── services/        # Business logic
├── strategies/      # Passport strategies
├── utils/           # Utility functions
└── validators/      # Joi validation schemas
```

## 🔧 Environment Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Environment Variables

Create `.env.development` from `.env.sample`:

```bash
cp .env.sample .env.development
```

Update the following variables:

```env
# Database
DATABASE_NAME=your_db_name
DATABASE_USER=your_db_user
DATABASE_PASS=your_password
DATABASE_PORT=5432
DATABASE_HOST=localhost
DATABASE_URL=postgresql://user:pass@localhost:5432/dbname

# Cache/Queue
CACHE_HOST=localhost
CACHE_PORT=6379
CACHE_URL=redis://localhost:6379

# Server
PORT=4000

# JWT
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# Email (Mailgun)
MAIL_USER=your-mailgun-domain@example.com
MAIL_API_KEY=your-mailgun-api-key
MAIL_DOMAIN=your-mailgun-domain.mailgun.org
MAIL_EXPIRES_IN=24h

# Node Environment
NODE_ENV=development
```

### 3. Start Docker Services

```bash
pnpm run setup:dev
```

This starts PostgreSQL and Redis containers.

### 4. Run Database Migrations

```bash
pnpm run migrate:dev
```

### 5. Seed Database (Optional)

```bash
pnpm run seed:dev
```

## 📦 Available Scripts

### Development

```bash
# Start dev server with hot reload
pnpm run dev

# Watch and recompile TypeScript
pnpm run start:watch

# Start services (PostgreSQL + Redis)
pnpm run setup:dev

# Stop services
pnpm run db:down

# View service logs
pnpm run db:logs
```

### Database

```bash
# Generate Prisma Client
pnpm run prisma:generate

# Validate schema
pnpm run prisma:validate

# Create migration
pnpm run migrate:dev

# Deploy migrations
pnpm run migrate:deploy:dev
pnpm run migrate:deploy:prod

# Reset database
pnpm run migrate:reset:dev

# Open Prisma Studio
pnpm run studio:dev
```

### Seeding

```bash
# Seed development database
pnpm run seed:dev

# Seed production database
pnpm run seed:prod
```

### Production

```bash
# Build for production
pnpm run build

# Start production server
pnpm run start:prod
```

### Code Quality

```bash
# Run linting
pnpm run lint

# Fix linting issues
pnpm run lint:fix

# Format code with Prettier
pnpm run format
```

## 🔌 API Endpoints

### Authentication

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user (requires JWT)

### Email Verification

- `POST /mailer/verify-email` - Send verification email
- `POST /mailer/resend-verify-email` - Resend verification email
- `GET /mailer/verify-email/:mailToken` - Verify email token

### File Management

- `POST /upload-file` - Upload file (requires JWT)
- `GET /file/storage/file/:file_name` - Download file
- `POST /upload-image` - Upload image (requires JWT)
- `GET /image/storage/file/:file_name` - Download image

### Health Check

- `GET /health` - Server health status

## 🔐 Authentication

Uses Passport JWT strategy. Protected routes require Bearer token:

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" http://localhost:4000/auth/me
```

## 📧 Email Service

Async email processing using Bull Queue + Mailgun:

1. Email request queued in Redis
2. Bull worker processes queue
3. Mailgun sends email
4. Failed jobs retry up to 2 times

## 🐳 Docker Setup

Services defined in `docker-compose.yml`:

- **PostgreSQL 16-alpine**: Main database
- **Redis 7-alpine**: Cache & job queue

Start services:

```bash
docker-compose up -d
```

Stop services:

```bash
docker-compose down
```

View logs:

```bash
docker-compose logs -f
```

## 🧪 Testing

REST client file: `api.rest`

Use in VS Code with REST Client extension:

```
### Login
POST http://localhost:4000/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

## 📝 Code Standards

- **Linting**: ESLint 9 with strict configuration
- **Formatting**: Prettier (printWidth: 100)
- **TypeScript**: Strict mode enabled
- **Naming**: camelCase for variables, PascalCase for classes
- **Imports**: Organized in 11 groups with auto-sorting

All code must pass linting before committing:

```bash
pnpm run lint      # Check
pnpm run lint:fix  # Auto-fix
pnpm run format    # Format
```

## 🚨 Error Handling

Custom error middleware with standard responses:

```json
{
  "code": 400,
  "message": "Error message",
  "status": false,
  "data": null
}
```

## 🔄 Request/Response Flow

1. **Request** → Express middleware
2. **Validation** → Joi schemas
3. **Authentication** → Passport JWT (if required)
4. **Authorization** → Role-based access
5. **Controller** → Route handler
6. **Service** → Business logic
7. **Repository** → Database query
8. **Response** → Custom middleware formats response

## 📚 Dependencies

### Key Packages

- `express` - Web framework
- `@prisma/client` - ORM
- `passport` - Authentication
- `joi` - Schema validation
- `bull` - Job queue
- `nodemailer` - Email client
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT tokens

### Dev Dependencies

- `typescript` - Type safety
- `eslint` - Linting
- `prettier` - Code formatting
- `nodemon` - Auto-reload
- `ts-node` - TypeScript execution

## 🔄 CI/CD

GitHub Actions workflow disabled. To re-enable, remove `if: false` from `.github/workflows/main.yml`.


## 👨‍💻 Development

### Adding a New Feature

1. Create route in `src/router/`
2. Create controller in `src/controllers/`
3. Create service in `src/services/`
4. Create repository in `src/repositories/` (if DB needed)
5. Create validator in `src/validators/`
6. Run linting and tests

### Database Changes

1. Update `prisma/schema.prisma`
2. Run `pnpm run migrate:dev`
3. Review generated migration
4. Regenerate types: `pnpm run prisma:generate`

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Find process using port 4000
lsof -i :4000

# Kill process
kill -9 <PID>
```

### Redis Connection Error

```bash
# Check Redis is running
docker-compose ps

# Restart Redis
docker-compose restart redis
```

### Database Migration Issues

```bash
# Reset database (⚠️ WARNING: Deletes all data)
pnpm run migrate:reset:dev

# Then re-seed
pnpm run seed:dev
```

### TypeScript Errors

```bash
# Regenerate Prisma types
pnpm run prisma:generate

# Rebuild project
pnpm run build
```

## 📞 Support

For issues and questions, please open an issue on the repository.

---

**Last Updated**: December 2025  
**Node Version**: 24+  
**Prisma Version**: 7.1.0
