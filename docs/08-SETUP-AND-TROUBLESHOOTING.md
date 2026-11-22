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
# Gmail SMTP Configuration
SMTP_HOST = smtp.gmail.com
SMTP_PORT = 465
SMTP_SERVICE = gmail
SMTP_MAIL = your_email@gmail.com
SMTP_USER = your_email@gmail.com
SMTP_PASSWORD = your_16_digit_app_password
SMTP_FROM_NAME = "E-Learning"
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

### Issue 4: Activation Email Notice / Email Could Not Be Sent
- **Symptom:** `Activation email notice: Email could not be sent to user@gmail.com`.
- **Causes:**
  1. Typo in environment variables (`SMPT_*` instead of `SMTP_*` or `SMTP_USER` missing).
  2. Wrong port (e.g. `2525` is for Mailtrap sandbox, whereas Gmail requires `465` with SSL or `587` with TLS).
  3. Google App Password formatted with spaces or using standard account password instead of a dedicated 16-character Google App Password (requires 2-Step Verification).
  4. Missing sender header (`SMTP_FROM_NAME`).
- **Fix:**
  - In `server/utils/sendMail.ts`, implement automatic normalization of `SMTP_*` and `SMPT_*`, default Gmail port to `465` (SSL), auto-strip spaces from App Passwords, and provide a valid `from` sender.
  - In `server/.env`, ensure `SMTP_HOST = smtp.gmail.com`, `SMTP_PORT = 465`, `SMTP_SERVICE = gmail`, `SMTP_MAIL = your_email@gmail.com`, and `SMTP_PASSWORD = your_app_password`.

