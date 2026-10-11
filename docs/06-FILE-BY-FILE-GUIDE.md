# 06 - File-by-File Learning Guide

This guide explains the exact purpose, inputs, logic, and dependencies of every important file created or updated in the project.

---

## 1. Backend Core Files

### `server/app.ts`
- **Purpose:** Initializes Express application, registers body parsers, cookie parser, CORS middleware, API route namespaces, and global error handling.
- **Inputs:** HTTP requests from clients.
- **Logic:** Enables JSON parsing up to 50MB for avatar/image payloads, configures CORS with credentials, mounts `/api/v1/users` routes.
- **Interactions:** Used by `server/server.ts`.

### `server/controllers/userController.ts`
- **Purpose:** Handles business logic for user registration, OTP activation, authentication, tokens, and session termination.
- **Key Functions:**
  - `registerUser`: Validates duplicate email, hashes password, generates 6-digit OTP activation token, sends email via Nodemailer.
  - `activateUser`: Verifies activation token JWT, checks OTP match, activates user flag `isVerified: true`.
  - `loginUser`: Verifies credentials, compares bcrypt password hash, calls `sendTokens`.
  - `logoutUser`: Clears auth cookies and invalidates session.

### `server/middleware/auth.ts`
- **Purpose:** Express route guards that verify authentication tokens and authorize role-based access.
- **Functions:**
  - `isAuthenticated`: Inspects request cookies or `Authorization` header for `accessToken`, verifies signature, retrieves session from Redis or MongoDB.
  - `authorizeRoles(...roles)`: Verifies if `req.user.role` has the required privilege (e.g. `admin`).

---

## 2. Frontend Core Files (Populated during implementation)
*(Will be expanded file-by-file as components and slices are constructed)*
