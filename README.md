# 🏋️ FitForge

> Forge Your Strongest Self

A premium cross-platform fitness app built with React Native (Expo) and Node.js/Express/MongoDB.

## Tech Stack

- **Frontend:** React Native (Expo), React Navigation, Redux Toolkit
- **Backend:** Node.js, Express.js, MongoDB + Mongoose
- **Auth:** JWT with secure token storage
- **Payments:** Stripe subscriptions

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Docker)
- Expo CLI

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your values
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npx expo start
```

### Docker (MongoDB)
```bash
docker-compose up -d
```

## Project Structure

See `docs/` for detailed architecture documentation.
