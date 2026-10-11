# 02 - Dependency Inventory

This document tracks all external libraries and dependencies across the frontend and backend of the Learning Management System.

---

## 1. Frontend Dependencies (`client/package.json`)

| Package Name | Target / Installed Version | Purpose | Usage Location | Reason for Inclusion | Compatibility Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`next`** | `^14.2.15` | Core React full-stack framework | `client/app/**` | Tutorial's framework with App Router, SSR, and dynamic route routing. | Fully compatible with React 18 and Node 18-24. |
| **`react`** | `^18.3.1` | UI library | Entire application | Required by Next.js and React ecosystem. | Version 18 provides stable hooks and concurrent features. |
| **`react-dom`** | `^18.3.1` | React DOM renderer | Root rendering | Companion to React. | Matches React 18. |
| **`@reduxjs/toolkit`** | `^2.2.8` | Central state management & RTK Query | `redux/store.ts`, `redux/features/**` | Used in tutorial for caching, mutations, auth state, and API state. | Modern standard for Redux. |
| **`react-redux`** | `^9.1.2` | React bindings for Redux | `redux/Provider.tsx`, component hooks | Bridges Redux store to React components. | Matches `@reduxjs/toolkit` v2. |
| **`next-themes`** | `^0.3.0` | Theme management (Light / Dark mode) | `app/Provider.tsx`, `ThemeSwitcher.tsx` | Tutorial's core styling feature for dark/light theme switching. | Works seamlessly with Tailwind `class` mode. |
| **`react-hot-toast`** | `^2.4.1` | Toast notifications | All forms, API responses, auth modals | Provides non-intrusive UI alerts for success, error, and loading states. | Lightweight and zero-config. |
| **`react-icons`** | `^5.3.0` | Icon set library | Header, Hero, CourseCard, Profile, Admin | Provides icons (`BiSun`, `BiMoon`, `HiOutlineMenuAlt3`, `AiOutlineEye`, etc.). | Modular imports prevent bundle bloat. |
| **`formik`** | `^2.4.6` | Form state management | Login, SignUp, Password change, Course forms | Standard tutorial choice for clean form handling. | Compatible with Yup validation schemas. |
| **`yup`** | `^1.4.0` | Schema validation | Auth forms, Course creation schemas | Ensures strict input validation before dispatching requests. | Works directly with Formik. |
| **`tailwindcss`** | `^3.4.14` | Utility-first CSS styling framework | All UI components, `tailwind.config.ts` | Tutorial's designated styling framework. | Version 3.4 supports modern Tailwind utilities. |
| **`postcss`** | `^8.4.47` | CSS transformation pipeline | `postcss.config.js` | Required by Tailwind CSS. | Standard tooling. |
| **`autoprefixer`** | `^10.4.20` | CSS vendor prefixer | `postcss.config.js` | Required by Tailwind CSS. | Standard tooling. |
| **`typescript`** | `^5.6.3` | Static type system | Entire frontend codebase | Type safety and autocompletion matching tutorial. | Matches modern TS standards. |
| **`@types/react`** | `^18.3.11` | React type definitions | Build & linting | TS support for React. | Matches React 18. |
| **`@types/react-dom`** | `^18.3.1` | React DOM type definitions | Build & linting | TS support for React DOM. | Matches React 18. |
| **`@types/node`** | `^20.16.11` | Node type definitions | Next.js configuration & scripts | TS support for Node APIs. | Matches Node environment. |

---

## 2. Backend Dependencies (`server/package.json`)

| Package Name | Installed Version | Purpose | Usage Location | Reason for Inclusion | Compatibility Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`express`** | `^5.2.1` | Node.js web server framework | `server/app.ts`, `server/server.ts` | Existing backend REST framework. | Active in project. |
| **`mongoose`** | `^9.10.1` | MongoDB ODM | `models/**`, `utils/db.ts` | Existing database mapping layer. | Connected to MongoDB Atlas cluster. |
| **`ioredis`** | `^6.0.0` | Redis in-memory cache client | `utils/redis.ts`, `utils/jwt.ts` | Existing session storage & cache. | Connected to Upstash Redis. |
| **`jsonwebtoken`** | `^9.0.3` | JWT generation & verification | `utils/jwt.ts`, `controllers/userController.ts` | Access & refresh token auth. | Standard security tool. |
| **`bcryptjs`** | `^3.0.3` | Password hashing | `models/userModel.ts`, controllers | Protects user passwords at rest. | Existing dependency. |
| **`cors`** | `^2.8.6` | Cross-Origin Resource Sharing | `server/app.ts` | Allows frontend on localhost:3000 to call backend on port 5000. | Configured with credentials support. |
| **`cookie-parser`** | `^1.4.7` | HTTP cookie parsing | `server/app.ts` | Reads auth cookies from requests. | Existing dependency. |
| **`dotenv`** | `^17.4.2` | Environment variable loader | Configuration | Loads credentials from `.env`. | Existing dependency. |
| **`nodemailer`** | `^10.0.10` | Email transport client | `utils/sendMail.ts` | Sends account activation OTP emails. | Configured for Gmail SMTP. |
| **`ejs`** | `^6.0.1` | Embedded JavaScript templating | `mails/activationMail.ejs` | Renders HTML email templates. | Existing dependency. |
| **`ts-node-dev`** | `^2.0.0` | Development server with auto-reload | `npm run dev` | Rapid TypeScript backend development. | Existing script runner. |
| **`typescript`** | `^5.9.3` | TypeScript compiler | Backend code | Provides static typing for server code. | Existing dependency. |
