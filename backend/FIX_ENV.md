# IMPORTANT: Update Your .env File

I've created a template `.env` file, but you **MUST** update it with your actual PostgreSQL credentials.

## Current .env (Template):
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/student_delivery?schema=public"
```

## What You Need to Change:

1. **Username**: If your PostgreSQL username is NOT `postgres`, change it
2. **Password**: Replace `postgres` (the second one) with your actual PostgreSQL password
3. **Port**: If your PostgreSQL is on a different port (not 5432), change it
4. **Database Name**: The database `student_delivery` must exist (see below)

## Steps:

### 1. Edit the .env file:
Open `backend/.env` in a text editor and update:
```env
DATABASE_URL="postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/student_delivery?schema=public"
```

### 2. Create the Database:

**Using pgAdmin (GUI):**
1. Open pgAdmin
2. Connect to your PostgreSQL server
3. Right-click "Databases" → "Create" → "Database"
4. Name: `student_delivery`
5. Click "Save"

**Using Command Line:**
```bash
psql -U postgres
CREATE DATABASE student_delivery;
\q
```

### 3. Then Run:
```bash
npx prisma migrate dev --name init
```

## Example:
If your PostgreSQL:
- Username: `postgres`
- Password: `mypassword123`
- Port: `5432` (default)

Your DATABASE_URL should be:
```
DATABASE_URL="postgresql://postgres:mypassword123@localhost:5432/student_delivery?schema=public"
```

