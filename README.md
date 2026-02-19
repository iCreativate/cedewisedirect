# Cedewise Direct — Insurance Risk Management System (IRMS)

A secure, role-based platform for managing commercial and corporate insurance risks.

## Tech Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- NextAuth (Credentials, JWT)
- Prisma + PostgreSQL
- tRPC + React Query
- Zod, Zustand

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory with the following:

```bash
DATABASE_URL="postgresql://USER:PASS@HOST:5432/DB"
NEXTAUTH_URL="http://localhost:3005"
NEXTAUTH_SECRET="replace-with-a-strong-random-string"
DEV_AUTOPROVISION=true
```

**Important Notes:**
- Replace `DATABASE_URL` with your actual PostgreSQL connection string
- Use a strong random string for `NEXTAUTH_SECRET` (generate with: `openssl rand -base64 32`)
- `DEV_AUTOPROVISION=true` is optional but recommended for local development (auto-creates users on first login)
- Set `NEXTAUTH_URL` to match your dev server port (default: 3005)

### 3. Set Up Database

```bash
npx prisma generate
npx prisma db push
```

### 4. Dummy login (instant access)

You can sign in **without a database** in development (or in production if `DEMO_MODE=true`). On the login page use:

| Role | Email | Password |
|------|--------|----------|
| Broker | `broker.demo@cedewise.test` | `Password123!` |
| Underwriting Manager | `manager.demo@cedewise.test` | `Password123!` |
| Co-insurer | `coinsurer.demo@cedewise.test` | `Password123!` |
| Insurer | `insurer.demo@cedewise.test` | `Password123!` |

For production (e.g. Netlify), set env vars `DEMO_MODE=true` and `NEXT_PUBLIC_DEMO_MODE=true` to allow these logins without running the seed.

### 5. (Optional) Seed database demo users

If you use the database and want the same users stored in DB:

```bash
npm run seed:demo
```

This creates the same four users above in PostgreSQL.

### 6. Start Development Server

```bash
npm run dev -- -p 3005
```

The app will be available at `http://localhost:3005`

## Troubleshooting Login Issues

If you encounter a **401 Unauthorized** error when logging in, follow these steps in order:

### Step 1: Verify Environment Variables

1. Ensure `.env` file exists in the root directory
2. Check that all required variables are set:
   - `DATABASE_URL` - Valid PostgreSQL connection string
   - `NEXTAUTH_URL` - Must match your dev server URL (http://localhost:3005)
   - `NEXTAUTH_SECRET` - Must be set (cannot be empty)
   - `DEV_AUTOPROVISION` - Optional, but helpful for development
3. **Fully restart the dev server** after making any `.env` changes

### Step 2: Verify Database Connection and Schema

1. Ensure PostgreSQL is running and accessible
2. Verify the database exists:
   ```bash
   npx prisma db push
   ```
3. Check that the schema is applied correctly

### Step 3: Seed Demo Users

If demo users don't exist or you're unsure:

```bash
npm run seed:demo
```

This creates users with the following credentials:
- Email: `broker.demo@cedewise.test` / Password: `Password123!`
- Email: `manager.demo@cedewise.test` / Password: `Password123!`
- Email: `coinsurer.demo@cedewise.test` / Password: `Password123!`
- Email: `insurer.demo@cedewise.test` / Password: `Password123!`

### Step 4: Verify Users Exist in Database

Check the database directly:

```bash
npx prisma studio
```

1. Open the `User` table
2. Verify that demo users exist
3. Check that email addresses are lowercase

### Step 5: Debug Login Attempt

1. Open browser DevTools → Network tab
2. Attempt to log in
3. Find the `POST /api/auth/callback/credentials` request
4. Check the response:
   - **401** with JSON body: Check error message (e.g., "CredentialsSignin")
   - **404**: NextAuth route not found - check server logs
   - **500**: Server error - check server logs and database connection

### Common Issues and Solutions

**Issue: "CredentialsSignin" error**
- **Cause**: Email not found or password doesn't match
- **Solution**: 
  - Verify user exists in database (use `npx prisma studio`)
  - Ensure email is entered correctly (case-insensitive, but check for typos)
  - If using `DEV_AUTOPROVISION=true`, try logging in again - it will create the user
  - Re-run `npm run seed:demo` to recreate users

**Issue: Email not found**
- **Cause**: User doesn't exist in database or email mismatch
- **Solution**:
  - Run `npm run seed:demo` to create demo users
  - Check database with `npx prisma studio`
  - Ensure email is lowercase (server normalizes, but double-check)

**Issue: Password hash mismatch**
- **Cause**: Password hash in database doesn't match entered password
- **Solution**:
  - Re-run `npm run seed:demo` to reset password hashes
  - Or manually update password hash in database using bcrypt:
    ```bash
    node -e "console.log(require('bcryptjs').hashSync('Password123!', 10))"
    ```
  - Copy the hash and update the user in Prisma Studio

**Issue: Middleware blocking requests**
- **Cause**: Middleware intercepting auth API routes
- **Solution**: Ensure middleware allows `/api/auth/**` paths (already configured)

### Using Dev Auto-Provisioning

If `DEV_AUTOPROVISION=true` is set in `.env`:

1. You can log in with any email/password combination
2. If the user doesn't exist, it will be automatically created as a BROKER
3. The password will be hashed and stored
4. Useful for quick testing without seeding

**Note**: Only works in development mode. Never enable in production!

## Structure
- `app/` App Router routes (auth, dashboards, api)
- `lib/` Prisma, auth, tRPC, validators
- `components/` UI and layout
- `prisma/` Prisma schema

## Notes
- Middleware enforces auth and basic RBAC dashboard routing.
- Submission wizard is an MVP; uploads/notifications/realtime are stubs.
- Ready for Vercel deployment.
