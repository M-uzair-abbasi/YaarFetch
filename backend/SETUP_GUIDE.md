# Backend Setup Guide - Fixing Database Connection

## Issue: Database Connection Error

If you're seeing:
```
Can't reach database server at `localhost:XXXX`
```

## Solution Steps:

### 1. Check Your PostgreSQL Installation

Make sure PostgreSQL is installed and running:
- Windows: Check Services (services.msc) for "postgresql" service
- Or open pgAdmin and verify you can connect

### 2. Update Your .env File

Open `backend/.env` and make sure your DATABASE_URL is correct:

```env
DATABASE_URL="postgresql://USERNAME:PASSWORD@localhost:5432/student_delivery?schema=public"
```

**Important:**
- Replace `USERNAME` with your PostgreSQL username (usually `postgres`)
- Replace `PASSWORD` with your PostgreSQL password
- Port should be `5432` (default PostgreSQL port)
- Database name should be `student_delivery`

### 3. Create the Database

If the database doesn't exist, create it:

**Option A: Using pgAdmin (GUI)**
1. Open pgAdmin
2. Right-click on "Databases"
3. Select "Create" > "Database"
4. Name it: `student_delivery`
5. Click "Save"

**Option B: Using Command Line (psql)**
```bash
psql -U postgres
CREATE DATABASE student_delivery;
\q
```

### 4. Test the Connection

After updating .env, try again:
```bash
npx prisma migrate dev --name init
```

### 5. Common Issues

**Wrong Port:**
- Default PostgreSQL port is `5432`
- Check your .env file has `:5432` not `:51214` or other ports

**Database Doesn't Exist:**
- Create it first (see step 3)

**Wrong Password:**
- Double-check your PostgreSQL password in the DATABASE_URL

**PostgreSQL Not Running:**
- Start the PostgreSQL service
- Windows: Services > PostgreSQL > Start

### Example .env File

```env
DATABASE_URL="postgresql://postgres:mypassword@localhost:5432/student_delivery?schema=public"
JWT_SECRET="dev-secret-key-change-in-production"
JWT_EXPIRES_IN="7d"
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

Replace `mypassword` with your actual PostgreSQL password!

