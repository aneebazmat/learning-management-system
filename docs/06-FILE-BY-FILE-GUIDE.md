# 06 - File-by-File Learning & Review Guide

This guide explains the exact purpose, inputs, logic, and dependencies of every important file created or updated in the project.

---

## 1. Backend Core Files (`server/`)

### `server/app.ts`
- **What it does:** Initializes Express application, configures body parsers (50MB JSON limit for images), parses cookies, applies CORS with credentials, mounts API routes, and provides a global error handling middleware.
- **Why it is needed:** Central entry point for request routing and middleware pipeline.
- **Inputs:** Incoming HTTP requests from clients.
- **Key Logic:** Configures `allowedOrigins` dynamically and handles origin sanitation so localhost:3000 and 5173 can send cookies with credentials.
- **Interactions:** Consumes `userRoutes`, `courseRoutes`, and `errorHandler`. Started by `server.ts`.

### `server/middleware/auth.ts`
- **What it does:** Provides `isAuthenticated` and `authorizeRoles` route guards.
- **Why it is needed:** Protects sensitive endpoints (session hydration `/me`, profile modification, admin operations).
- **How it works step-by-step:**
  1. Checks for JWT in `req.cookies.accessToken` or `Authorization: Bearer <token>` header.
  2. Verifies token signature with `process.env.ACCESS_TOKEN_SECRET`.
  3. Checks Redis session cache; if Redis is down or cache missing, queries MongoDB via `User.findById(decoded.id)`.
  4. Attaches user object to `req.user` and calls `next()`.
  5. `authorizeRoles(...roles)` verifies whether `req.user.role` matches (e.g., `'admin'`).

### `server/controllers/userController.ts`
- **What it does:** Manages user account lifecycle: registration, OTP activation, login, logout, profile updates, password modification, and avatar changes.
- **Key Functions:**
  - `registerUser`: Validates duplicate emails, creates user document in MongoDB, generates 6-digit OTP and JWT activation token, attempts email delivery with graceful fallback, and returns token.
  - `activateUser`: Verifies activation token, compares 6-digit code, marks `isVerified: true`.
  - `loginUser`: Verifies email and password using bcrypt `comparePassword`, calls `sendTokens`.
  - `logoutUser`: Clears HTTP-only cookies, invalidates session in Redis.
  - `getUserInfo`: Returns `req.user` for session hydration on client refresh.
  - `updateUserInfo`: Updates user's name or email and synchronizes MongoDB and Redis.
  - `updatePassword`: Verifies old password, hashes and updates new password.
  - `updateProfilePicture`: Updates Cloudinary avatar URL for the user.

### `server/models/courseModel.ts`
- **What it does:** Mongoose schema defining the Course document structure.
- **Fields:** `name`, `description`, `price`, `estimatedPrice`, `thumbnail`, `tags`, `level`, `demoUrl`, `benefits`, `prerequisites`, `reviews`, `courseData` (curriculum lectures), `ratings`, `purchased`.

### `server/controllers/courseController.ts`
- **What it does:** Manages course authoring and access.
- **Functions:**
  - `createCourse`: Admin-only endpoint creating new course documents in MongoDB and invalidating course cache.
  - `editCourse`: Updates course details by ID.
  - `getAllCourses`: Public catalog query omitting sensitive lecture video links.
  - `getSingleCourse`: Public single course details query with caching and resilient MongoDB fallback.
  - `getCourseByUser`: Enrolled student endpoint returning complete curriculum including private lecture video URLs.

### `server/utils/redis.ts`
- **What it does:** Initializes `ioredis` client with resilience options (`enableOfflineQueue: false`, `retryStrategy`).
- **Why it is needed:** Ensures that if Upstash Redis hits network latency or rate limits, Express HTTP requests do not hang, seamlessly falling back to MongoDB Atlas.

---

## 2. Frontend Core Files (`client/`)

### `client/app/layout.tsx`
- **What it does:** Root layout for the Next.js App Router application.
- **Why it is needed:** Loads Google Fonts (`Poppins` and `Josefin_Sans`), initializes HTML/body tags, mounts `Providers`, and mounts the global `Toaster`.
- **Interactions:** Wraps all pages in `Providers` and `Toaster`.

### `client/app/Provider.tsx`
- **What it does:** Client component wrapping the component tree in:
  1. `<Provider store={store}>` (Redux Toolkit store).
  2. `<ThemeProvider attribute="class" defaultTheme="system" enableSystem>` (`next-themes` dark/light mode engine).

### `client/app/page.tsx`
- **What it does:** Main landing page composing the hero, featured course cards, reviews, FAQ, and global footer.
- **Interactions:** Houses state for authentication modals (`open`, `setOpen`, `route`, `setRoute`).

### `client/app/components/Header.tsx`
- **What it does:** Responsive navigation bar with scroll state, theme toggle, mobile navigation drawer, profile link / login trigger, and auth modal portal.
- **Interactions:** Uses `useLoadUserQuery` to display the active user's avatar when logged in.

### `client/app/components/ThemeSwitcher.tsx`
- **What it does:** Toggles between Dark and Light themes using `useTheme` from `next-themes`.
- **Special implementation detail:** Waits for client-side mounting (`mounted === true`) before rendering theme icons to eliminate SSR hydration mismatch warnings.

### `client/app/components/Auth/Login.tsx`
- **What it does:** Login modal form.
- **Logic:** Uses Formik + Yup for validation, calls `useLoginMutation`, dispatches session storage, shows toast notifications, and refetches user data on success.

### `client/app/components/Auth/SignUp.tsx`
- **What it does:** User registration form.
- **Logic:** Uses Formik + Yup for validation, dispatches `useRegisterMutation`, saves activation token to Redux store, and switches view to `Verification`.

### `client/app/components/Auth/Verification.tsx`
- **What it does:** 6-digit OTP verification interface.
- **Logic:** Provides 6 auto-advancing digit inputs with `useRef` focus shifting, reads `token` from Redux `auth.token`, calls `useActivationMutation`, and switches view to `Login` upon activation.

### `client/app/components/Course/CourseCard.tsx`
- **What it does:** Reusable presentation card for courses.
- **Visuals:** Shows thumbnail, title, star ratings, enrolled student count, lecture count, and price comparison badge.

### `client/app/components/Course/CourseDetails.tsx`
- **What it does:** Full course details view featuring video preview player, What You'll Learn benefits, prerequisites, curriculum accordion, and sticky purchase card.

### `client/app/components/Course/CoursePlayer.tsx`
- **What it does:** Responsive 16:9 video player supporting YouTube embeds, Vimeo, and direct video files.

### `client/app/components/Course/CourseContent.tsx`
- **What it does:** Enrolled student classroom interface featuring lecture playback, previous/next controls, lecture playlist sidebar, and interactive discussion tabs (Overview, Resources, Q&A, Reviews).

### `client/app/components/Admin/Course/CreateCourse.tsx`
- **What it does:** 4-step wizard guiding administrators through course publishing:
  - Step 1 (`CourseInformation`): Title, description, price, tags, level, demoUrl, thumbnail.
  - Step 2 (`CourseOptions`): Dynamic benefits and prerequisites lists.
  - Step 3 (`CourseContentData`): Dynamic curriculum sections and lecture video URLs.
  - Step 4 (`CoursePreview`): Final summary preview and submit button calling `useCreateCourseMutation`.

### `client/redux/store.ts` & `redux/features/**`
- **`store.ts`:** Redux Toolkit store configured with `apiSlice` and `authSlice`.
- **`apiSlice.ts`:** Base RTK Query slice configuring `baseUrl`, `credentials: "include"`, and automatic `Authorization: Bearer <token>` attachment.
- **`authApi.ts`:** RTK Query endpoints for register, activation, login, loadUser (`/me`), updateProfile, updatePassword, updateAvatar, and logout.
- **`coursesApi.ts`:** RTK Query endpoints for `getAllCourses`, `getCourseDetails`, `createCourse`, and `getCourseContent`.
