## QuickBite (MERN Food Delivery App)

Monorepo structure:

- `server/`: Node.js + Express + MongoDB (Mongoose)
- `client/`: React (Vite) + Tailwind + Redux Toolkit

### Prerequisites

- Node.js LTS
- MongoDB connection string (local or Atlas)

### Setup

1) Backend

- Copy env:
  - `server/.env.example` → `server/.env`
- Required envs:
  - `MONGO_URI`
  - `JWT_ACCESS_SECRET`
  - `CLOUDINARY_CLOUD_NAME`
  - `CLOUDINARY_API_KEY`
  - `CLOUDINARY_API_SECRET`
  - `RAZORPAY_KEY_ID` (test key)
  - `RAZORPAY_KEY_SECRET` (test key secret)
- Install and run:
  - `cd server`
  - `npm install`
  - `npm run dev`

### Admin login (development)

- Demo admin is auto-seeded on server start (dev only):
  - Email: `admin@quickbite.com`
  - Password: `Admin@12345`
- You can override via env:
  - `DEMO_ADMIN_EMAIL`
  - `DEMO_ADMIN_PASSWORD`
  - `AUTO_SEED_DEMO_ADMIN=true|false`

### MongoDB Atlas note

If Atlas is not reachable (common cause: **IP not whitelisted**), the backend will automatically fall back to an **in-memory MongoDB** in development so you can still log in and use admin screens.

2) Frontend (later modules)

- `cd client`
- `npm install`
- `npm run dev`
- Copy env:
  - `client/.env.example` → `client/.env`
- Required envs:
  - `VITE_API_URL`
  - `VITE_RAZORPAY_KEY_ID` (optional fallback; key is also returned by backend)

### Payments (Razorpay + COD)

- Checkout supports two payment methods:
  - `ONLINE` (Razorpay)
  - `COD` (Cash on Delivery)
- Payment APIs:
  - `POST /api/payments/create-order`
  - `POST /api/payments/verify`
- Security:
  - Razorpay signature verification happens only on backend (`crypto` HMAC).
  - Frontend payment callback is never trusted by itself.
- Order records include:
  - `paymentMethod`
  - `paymentStatus` (`pending` | `paid` | `failed`)
  - `razorpayOrderId`
  - `razorpayPaymentId`
- Admin Orders table shows payment method + payment status badges.

### Razorpay test mode

- Use Razorpay **TEST** keys only during development.
- Example test card in Razorpay checkout:
  - Card: `4111 1111 1111 1111`
  - Expiry: any future date
  - CVV: any 3 digits
  - OTP: as prompted by Razorpay test flow

### Production Build

- Backend:
  - `cd server`
  - `npm run lint`
  - `npm run start`
- Frontend:
  - `cd client`
  - `npm run lint`
  - `npm run build`

### Scripts

- Backend:
  - `npm run dev`: start API in watch mode
  - `npm run start`: start API (prod)
  - `npm run lint`: lint

