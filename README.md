# Coach Booking System

A full-stack web application for managing coaching sessions. Built with **NestJS**, **Next.js**, and **MongoDB**.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | NestJS (Node.js) |
| Frontend | Next.js 16 (App Router) |
| Database | MongoDB |
| Authentication | JWT (JSON Web Tokens) |
| Styling | Tailwind CSS + shadcn/ui |
| Email | Nodemailer (SMTP) |

---

## Project Structure

```
Coach-Booking-System/
├── backend/          # NestJS API
│   ├── src/
│   │   ├── auth/           # Authentication (JWT, Passport)
│   │   ├── users/          # User management
│   │   ├── services/       # Coaching services
│   │   ├── bookings/       # Booking management
│   │   ├── mail/           # Email notifications
│   │   └── common/         # Shared enums, guards, decorators
│   └── .env
└── frontend/         # Next.js App
    ├── app/
    │   ├── auth/           # Login & Register pages
    │   └── dashboard/      # Protected dashboard pages
    ├── components/         # Reusable UI components
    ├── contexts/           # React contexts (Auth)
    ├── lib/                # API client, types, utilities
    └── .env.local
```

---

## Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- npm or pnpm
- Gmail account (for email notifications)

---

## Running the Backend

### 1. Install dependencies
```bash
cd backend
npm install
```

### 2. Create `.env` file
```env
MONGODB_URI=mongodb://localhost:27017/coach_booking
JWT_SECRET=your_super_secret_key_here
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_gmail_app_password
PORT=3001
```

> **Gmail App Password:** Go to Google Account → Security → 2-Step Verification → App Passwords → Generate

### 3. Start the backend
```bash
npm run start:dev
```

The backend runs on `http://localhost:3001`

---

## Running the Frontend

### 1. Install dependencies
```bash
cd frontend
pnpm install
```

### 2. Create `.env.local` file
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 3. Start the frontend
```bash
pnpm run dev
```

The frontend runs on `http://localhost:3000`

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and get JWT token |

### Users
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/users` | Get all users |
| GET | `/api/users/:id` | Get user by ID |
| PUT | `/api/users/:id` | Update user profile |
| DELETE | `/api/users/:id` | Delete user |

### Services
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/services` | Get all services (with coach details) |
| GET | `/api/services/:id` | Get service by ID |
| POST | `/api/services` | Create a service (coach only) |

### Bookings
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/bookings` | Get all bookings |
| GET | `/api/bookings/:id` | Get booking by ID |
| POST | `/api/bookings` | Create a booking (coach only) |
| PUT | `/api/bookings/:id` | Update booking status |
| POST | `/api/bookings/:id/pay-deposit` | Pay 50% deposit (confirms booking) |

---

## Features

- **Authentication** — JWT-based login and registration with role selection (coach or customer)
- **Services** — Coaches create services with name, description, duration, price and weekly availability
- **Bookings** — Coaches create bookings for customers, selecting a service and time slot
- **Deposit Payment** — Customers pay 50% deposit via a dummy button, changing status to confirmed
- **Email Notifications** — Confirmation emails sent to both coach and customer on deposit payment
- **Dashboard Stats** — Coaches see total services, bookings, confirmed and completed sessions
- **Protected Routes** — Unauthenticated users are redirected to login

---

## Assumptions Made

1. **Role separation** — Coaches create services and bookings; customers view services and pay deposits
2. **Deposit payment** — Implemented as a dummy button (no real payment gateway) for demonstration purposes
3. **Availability** — Stored as a map of day → [startTime, endTime] e.g. `{ monday: ["09:00", "17:00"] }`
4. **Booking time** — End time is automatically calculated from the service duration
5. **Email** — Uses Gmail SMTP; requires an App Password (not the account password)
6. **Single currency** — All prices are in USD

---

## Improvements With More Time

1. **Real payment integration** — Integrate Stripe or PayPal for actual deposit processing
2. **Booking calendar view** — Visual calendar showing available and booked slots
3. **Coach availability calendar** — More granular availability with specific date exceptions
4. **Reviews and ratings** — Allow customers to rate coaches after completed sessions
5. **Search and filtering** — Filter services by price, duration, coach name
6. **Notifications** — In-app notifications in addition to emails
7. **Recurring bookings** — Allow weekly/monthly recurring session bookings
8. **Admin panel** — Admin role to manage all users, services and bookings
9. **Pagination** — Add pagination to bookings and services lists
10. **Refresh tokens** — Implement refresh token rotation for better security
11. **File uploads** — Allow coaches to upload profile photos
12. **Unit test coverage** — Increase test coverage to 80%+

---

## Running Tests

```bash
cd backend
npm run test           # Run all unit tests
npm run test:watch     # Run tests in watch mode
npm run test:cov       # Run tests with coverage report
```
