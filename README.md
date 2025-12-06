# UZI - Student-to-Student Delivery App MVP

A web-based MVP for a student-to-student delivery app where students can request items to be delivered from off-campus locations, and other students going out can offer to deliver them.

## Features

- **User Authentication**: Email-based registration and login with JWT tokens
- **Order Management**: Students can create orders for items they need
- **Delivery Offers**: Students can create offers when they're going out
- **Matching System**: Manual matching between orders and delivery offers
- **Real-time Messaging**: Socket.io-based chat for communication
- **Order Tracking**: Status updates and completion flow
- **Review System**: Rating and reviews after order completion
- **Profile Management**: User profiles with ratings and preferences

## Technology Stack

### Frontend
- React 19 with TypeScript
- Vite
- React Router
- Tailwind CSS
- Axios
- Socket.io Client

### Backend
- Node.js with Express
- TypeScript
- PostgreSQL with Prisma ORM
- JWT Authentication
- Socket.io for real-time features
- Multer for file uploads

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/student_delivery?schema=public"
JWT_SECRET="your-secret-key-change-this-in-production"
JWT_EXPIRES_IN="7d"
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

4. Generate Prisma client:
```bash
npx prisma generate
```

5. Run database migrations:
```bash
npx prisma migrate dev
```

6. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory (optional):
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Project Structure

```
UZI/
├── backend/
│   ├── src/
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/     # Auth, validation
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Helpers
│   │   └── server.ts       # Entry point
│   ├── prisma/
│   │   └── schema.prisma   # Database schema
│   └── uploads/            # Uploaded files
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Route pages
│   │   ├── services/       # API services
│   │   ├── context/        # React context
│   │   └── utils/          # Helpers
│   └── public/
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify-email` - Verify email

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `POST /api/users/profile/picture` - Upload profile picture

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get order details
- `GET /api/orders/my-orders` - Get user's orders
- `PUT /api/orders/:id` - Update order
- `DELETE /api/orders/:id` - Delete order

### Offers
- `POST /api/offers` - Create delivery offer
- `GET /api/offers` - Get all offers
- `GET /api/offers/:id` - Get offer details
- `GET /api/offers/my-offers` - Get user's offers
- `PUT /api/offers/:id` - Update offer
- `DELETE /api/offers/:id` - Delete offer

### Matches
- `POST /api/matches` - Create match
- `GET /api/matches` - Get user's matches
- `GET /api/matches/:id` - Get match details
- `PUT /api/matches/:id/status` - Update match status

### Messages
- `POST /api/messages` - Send message
- `GET /api/messages/match/:matchId` - Get messages for match

### Reviews
- `POST /api/reviews` - Create review
- `GET /api/reviews/user/:userId` - Get user reviews

## Database Schema

- **User**: User accounts with profiles
- **Order**: Orders created by students
- **DeliveryOffer**: Delivery offers by students going out
- **Match**: Matches between orders and offers
- **Message**: Chat messages between users
- **Review**: Reviews and ratings

## MVP Limitations

- Cash payments only (no in-app payment processing)
- Manual location entry (no GPS tracking)
- Basic matching algorithm (no ML-based matching)
- Email verification is simplified (auto-verified in MVP)
- Web responsive only (no mobile app)

## Security Considerations

- Passwords are hashed using bcrypt
- JWT tokens with expiration
- Input validation and sanitization
- SQL injection prevention (Prisma)
- CORS configuration
- Protected routes with authentication middleware

## Development

### Running in Development Mode

Backend:
```bash
cd backend
npm run dev
```

Frontend:
```bash
cd frontend
npm run dev
```

### Database Migrations

```bash
cd backend
npx prisma migrate dev
```

### View Database

```bash
cd backend
npx prisma studio
```

## License

This project is an MVP for educational purposes.

