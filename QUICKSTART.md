# Quick Start Guide - UZI Delivery App

## Prerequisites

Before you begin, make sure you have:
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** database installed and running - [Download](https://www.postgresql.org/download/)
- **npm** (comes with Node.js)

## Step-by-Step Setup

### 1. Install PostgreSQL Database

If you don't have PostgreSQL installed:
- Download and install from [postgresql.org](https://www.postgresql.org/download/)
- During installation, remember your PostgreSQL password
- Default port is 5432

### 2. Create Database

Open PostgreSQL (pgAdmin or command line) and create a new database:

```sql
CREATE DATABASE student_delivery;
```

Or using command line:
```bash
psql -U postgres
CREATE DATABASE student_delivery;
\q
```

### 3. Backend Setup

Open a terminal and navigate to the backend folder:

```bash
cd backend
```

#### Install Dependencies
```bash
npm install
```

#### Create Environment File

Create a `.env` file in the `backend` folder with the following content:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/student_delivery?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**Important:** Replace `YOUR_PASSWORD` with your actual PostgreSQL password.

#### Generate Prisma Client
```bash
npx prisma generate
```

#### Run Database Migrations
```bash
npx prisma migrate dev --name init
```

This will create all the database tables.

#### Start Backend Server
```bash
npm run dev
```

You should see: `Server running on port 5000`

**Keep this terminal open!**

### 4. Frontend Setup

Open a **NEW** terminal window and navigate to the frontend folder:

```bash
cd frontend
```

#### Install Dependencies
```bash
npm install
```

#### (Optional) Create Environment File

Create a `.env` file in the `frontend` folder (optional, defaults work):

```env
VITE_API_URL=http://localhost:5000/api
```

#### Start Frontend Server
```bash
npm run dev
```

You should see: `Local: http://localhost:5173`

### 5. Access the Application

Open your browser and go to:
```
http://localhost:5173
```

## Running the Project

### Development Mode

You need **two terminal windows** running:

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

### First Time Setup Checklist

- [ ] PostgreSQL is installed and running
- [ ] Database `student_delivery` is created
- [ ] Backend `.env` file is created with correct DATABASE_URL
- [ ] Backend dependencies installed (`npm install` in backend folder)
- [ ] Prisma client generated (`npx prisma generate`)
- [ ] Database migrations run (`npx prisma migrate dev`)
- [ ] Frontend dependencies installed (`npm install` in frontend folder)
- [ ] Backend server running on port 5000
- [ ] Frontend server running on port 5173

## Troubleshooting

### Database Connection Error

If you see: `Can't reach database server`

1. Check PostgreSQL is running
2. Verify your DATABASE_URL in `.env` file
3. Check username/password are correct
4. Ensure database `student_delivery` exists

### Port Already in Use

If port 5000 or 5173 is already in use:

1. Change PORT in backend `.env` file
2. Update FRONTEND_URL accordingly
3. Or stop the process using that port

### Prisma Errors

If you see Prisma errors:

```bash
cd backend
npx prisma generate
npx prisma migrate reset  # WARNING: This deletes all data
npx prisma migrate dev
```

### Module Not Found Errors

If you see module errors:

```bash
# In backend folder
rm -rf node_modules
npm install

# In frontend folder
rm -rf node_modules
npm install
```

## Testing the Application

1. **Register a new account:**
   - Go to http://localhost:5173/register
   - Fill in the form and register

2. **Create an order:**
   - Click "Create Order"
   - Fill in order details

3. **Create a delivery offer:**
   - Click "Create Offer"
   - Fill in offer details

4. **Match orders and offers:**
   - View orders/offers on dashboard
   - Create matches between them

## Database Management

### View Database (Prisma Studio)
```bash
cd backend
npx prisma studio
```

This opens a web interface at http://localhost:5555 to view/edit your database.

### Reset Database (WARNING: Deletes all data)
```bash
cd backend
npx prisma migrate reset
```

## Production Build

### Build Backend
```bash
cd backend
npm run build
npm start
```

### Build Frontend
```bash
cd frontend
npm run build
```

Built files will be in `frontend/dist`

## Need Help?

- Check the main README.md for detailed documentation
- Verify all environment variables are set correctly
- Ensure PostgreSQL is running
- Check both servers are running (backend on 5000, frontend on 5173)

