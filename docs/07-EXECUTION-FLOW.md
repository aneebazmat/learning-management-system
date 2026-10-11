# 07 - Execution Flow & User Journeys

This document details key end-to-end user journeys through the application, tracing the path from UI interactions through Redux, HTTP transport, Express middleware, database, and back to UI updates.

---

## 1. User Registration & Activation Flow

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Frontend as Next.js (SignUp Form)
    participant RTK as Redux Toolkit (authApi)
    participant Backend as Express (/api/v1/users)
    participant DB as MongoDB Atlas
    participant Email as Gmail SMTP Service

    User->>Frontend: Enters name, email, password
    Frontend->>Frontend: Formik & Yup validation passes
    Frontend->>RTK: Dispatches register mutation
    RTK->>Backend: POST /register {name, email, password}
    Backend->>DB: Checks if user exists
    Backend->>DB: Creates unverified user record
    Backend->>Backend: Generates 6-digit OTP & JWT activation token
    Backend->>Email: Sends activation email with OTP
    Backend-->>RTK: 201 Created {activationToken}
    RTK-->>Frontend: Success response
    Frontend->>Frontend: Stores activationToken, opens Verification Modal
    User->>Frontend: Enters 6-digit OTP code
    Frontend->>RTK: Dispatches activate mutation
    RTK->>Backend: POST /activate {activationToken, activationCode}
    Backend->>Backend: Verifies activation JWT & matches code
    Backend->>DB: Updates user isVerified = true
    Backend-->>RTK: 200 OK {success: true}
    RTK-->>Frontend: Success toast, switches modal to Login
```

---

## 2. User Authentication & Session Hydration Flow

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Frontend as Next.js (Login Modal)
    participant RTK as Redux Toolkit (authApi)
    participant Backend as Express (/api/v1/users)
    participant Redis as Upstash Redis Cache

    User->>Frontend: Submits email & password
    Frontend->>RTK: Dispatches login mutation
    RTK->>Backend: POST /login {email, password}
    Backend->>Backend: Validates credentials & bcrypt comparison
    Backend->>Backend: Generates accessToken & refreshToken
    Backend->>Redis: Caches user session by user._id
    Backend-->>RTK: 200 OK + Sets cookies (accessToken, refreshToken)
    RTK->>RTK: Stores user & token in authSlice
    RTK-->>Frontend: Closes modal, updates Header with user avatar
```

---

## 3. Course Exploration & Details Flow

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Frontend as Course Details Page
    participant RTK as Redux Toolkit (coursesApi)
    participant Backend as Express (/api/v1/courses)
    participant DB as MongoDB

    User->>Frontend: Clicks on Course Card (/course/:id)
    Frontend->>RTK: Calls useGetCourseDetailsQuery(id)
    RTK->>Backend: GET /api/v1/courses/get-course/:id
    Backend->>DB: Queries course document
    Backend-->>RTK: Returns course details (summary, curriculum, preview link)
    RTK-->>Frontend: Renders Course Player, Overview, Prerequisites, Reviews
```
