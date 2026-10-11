# 04 - Backend Integration Specification

## 1. Overview of Backend API Architecture
The backend is an Express.js TypeScript application listening on `http://localhost:5000` with the primary API namespace mounted at `/api/v1`.

### Core Backend Behaviors
- **Transport & Format:** JSON payloads (`application/json`) with maximum payload size of `50mb`.
- **CORS Configuration:** `credentials: true` allowing cookies across origins (`http://localhost:3000`).
- **Session Management:** On successful authentication, the server:
  1. Issues an `accessToken` (short-lived, 15m default).
  2. Issues a `refreshToken` (long-lived, 7d default).
  3. Writes session data to Redis (`redis.set(user._id, JSON.stringify(user))`).
  4. Sets HTTP-only cookies (`accessToken`, `refreshToken`).
  5. Returns `{ success: true, accessToken, refreshToken }` in the response body.

---

## 2. API Endpoint Matrix

### A. Authentication & User Account (`/api/v1/users`)

| Endpoint | Method | Auth Req. | Payload / Params | Response Structure | Backend Controller | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `/api/v1/users/register` | `POST` | None | `{ name, email, password }` | `{ success: true, message: string, activationToken: string }` | `registerUser` | Implemented |
| `/api/v1/users/activate` | `POST` | None | `{ activationToken, activationCode }` | `{ success: true, message: string }` | `activateUser` | Implemented |
| `/api/v1/users/login` | `POST` | None | `{ email, password }` | `{ success: true, accessToken: string, refreshToken: string }` | `loginUser` | Implemented |
| `/api/v1/users/logout` | `GET` | Logged In | Cookies or Header | `{ success: true, message: string }` | `logoutUser` | In Progress (Route fix needed) |
| `/api/v1/users/me` | `GET` | Logged In | Cookies or Header | `{ success: true, user: IUser }` | `getUserInfo` | Required for Auth Hydration |
| `/api/v1/users/update-user-info` | `PUT` | Logged In | `{ name, email }` | `{ success: true, user: IUser }` | `updateUserInfo` | Required for Profile editing |
| `/api/v1/users/update-user-password` | `PUT` | Logged In | `{ oldPassword, newPassword }` | `{ success: true, user: IUser }` | `updatePassword` | Required for Profile security |
| `/api/v1/users/update-user-avatar` | `PUT` | Logged In | `{ avatar }` | `{ success: true, user: IUser }` | `updateAvatar` | Required for Avatar upload |

### B. Course Management (`/api/v1/courses`)

| Endpoint | Method | Auth Req. | Payload / Params | Response Structure | Backend Controller | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `/api/v1/courses/get-courses` | `GET` | None | None | `{ success: true, courses: ICourse[] }` | `getAllCourses` | Required for Catalog & Homepage |
| `/api/v1/courses/get-course/:id` | `GET` | None | Course ID param | `{ success: true, course: ICourse }` | `getSingleCourse` | Required for Course Details page |
| `/api/v1/courses/create-course` | `POST` | Admin | Complete course data | `{ success: true, course: ICourse }` | `createCourse` | Required for Admin Course Creation |
| `/api/v1/courses/get-course-content/:id`| `GET` | Enrolled | Course ID param | `{ success: true, content: any }` | `getCourseByUser` | Required for Learning Room |

---

## 3. Discovered Backend Discrepancies & Resolutions

1. **Unfinished Route in `server/routes/userRoute.ts`**:
   - *Discovery:* Line 9 had a dangling `router.post` with no endpoint or handler, and `logoutUser` was not registered on the router.
   - *Resolution:* Connect `router.get("/logout", isAuthenticated, logoutUser)` and `router.post("/logout", isAuthenticated, logoutUser)`.
2. **Missing Auth Middleware (`server/middleware/auth.ts`)**:
   - *Discovery:* File was 0 bytes.
   - *Resolution:* Implement `isAuthenticated` (verifying token from cookies or `Authorization: Bearer <token>` and resolving user from Redis/MongoDB) and `authorizeRoles("admin")`.
3. **Missing Request User Type in `server/@types/custom.ts`**:
   - *Discovery:* File was empty, preventing `req.user` TypeScript resolution.
   - *Resolution:* Augment Express `Request` type with `user?: IUser`.
4. **Session Hydration Endpoint (`/me`)**:
   - *Discovery:* When the frontend boots or page refreshes, RTK Query needs to know who is logged in. Without a `/me` endpoint, the user appears logged out after refresh.
   - *Resolution:* Provide `/api/v1/users/me` endpoint that returns the authenticated user.
5. **CORS Origin Array Parsing in `server/app.ts`**:
   - *Discovery:* `server/.env` contains `ORIGIN = ['http://localhost:3000','http://localhost:5173']`. If parsed with `split(',')`, the brackets and single quotes break CORS matching.
   - *Resolution:* Ensure origin handler sanitizes quotes and brackets so `http://localhost:3000` is cleanly accepted with credentials.
