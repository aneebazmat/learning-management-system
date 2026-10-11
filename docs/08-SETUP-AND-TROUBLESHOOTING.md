# 08 - Setup & Troubleshooting Guide

## 1. Prerequisites
- **Node.js**: v18.x or newer (Tested on Node v24.15.0)
- **npm**: v9.x or newer (Tested on npm 12.0.2)
- **MongoDB**: MongoDB Atlas Cluster connection URI
- **Redis**: Upstash Redis or local Redis URI

---

## 2. Backend Setup (`server/`)

### 1. Configuration
Ensure `server/.env` is properly configured:
```env
PORT = 5000
ORIGIN = ['http://localhost:3000','http://localhost:5173']
MONGODB_URI = 'your_mongodb_connection_string'
REDIS_URL = 'rediss://default:your_redis_token@your_instance.upstash.io:6379'
ACTIVATION_SECRET = your_jwt_activation_secret
ACCESS_TOKEN_SECRET = your_jwt_access_secret
REFRESH_TOKEN_SECRET = your_jwt_refresh_secret
ACCESS_TOKEN_EXPIRES = 15
REFRESH_TOKEN_EXPIRES = 7
RESET_PASSWORD_SECRET = your_jwt_reset_secret
SMPT_HOST = smtp.gmail.com
SMPT_PORT = 465
SMPT_SERVICE = gmail
SMPT_MAIL = your_email@gmail.com
SMPT_PASSWORD = your_app_password
```

### 2. Running Backend
```bash
cd server
npm install
npm run dev
```

---

## 3. Frontend Setup (`client/`)

### 1. Configuration
Create `client/.env.local`:
```env
NEXT_PUBLIC_SERVER_URI=http://localhost:5000/api/v1
```

### 2. Running Frontend
```bash
cd client
npm install
npm run dev
```
Open `http://localhost:3000` in your web browser.

---

## 4. Common Errors & Troubleshooting

### Issue 1: CORS Policy Error when Frontend calls Backend
- **Symptom:** `Access to fetch at 'http://localhost:5000/...' from origin 'http://localhost:3000' has been blocked by CORS policy`.
- **Cause:** `process.env.ORIGIN` in `.env` contains literal quotes or brackets: `['http://localhost:3000']`.
- **Fix:** In `server/app.ts`, parse and clean origin entries or support explicit `http://localhost:3000`.

### Issue 2: Redis Connection Loop or Error
- **Symptom:** `Redis reconnecting in Xms` in console.
- **Cause:** Network latency to Upstash or Redis credentials.
- **Fix:** Ensure `REDIS_URL` uses `rediss://` for TLS connections and has proper credentials.

### Issue 3: Hydration Mismatch in Next.js
- **Symptom:** React warning about server vs client rendered markup for theme or icons.
- **Fix:** Ensure components using `useTheme` or browser-only features wait for `mounted === true` before rendering theme-dependent icons.
