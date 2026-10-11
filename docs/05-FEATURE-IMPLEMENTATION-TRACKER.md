# 05 - Feature Implementation Tracker

This tracker monitors every feature demonstrated across Part 1 and Part 2 of the reference LMS series.

**Statuses:**
- 🔴 `Not started`
- 🟡 `In progress`
- 🟢 `Implemented`
- 🔵 `Tested successfully`
- ⛔ `Blocked`

---

## Feature Matrix

| ID | Feature Name | Origin | Status | Related Files | API Requirements | Test Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **FE-01** | Next.js 13 Setup & Global Layout | Part 1 | 🟡 In progress | `client/app/layout.tsx`, `client/app/page.tsx` | N/A | Pending setup |
| **FE-02** | Theme Switcher (Dark / Light) | Part 1 | 🔴 Not started | `client/app/components/ThemeSwitcher.tsx`, `client/app/Provider.tsx` | N/A | Pending |
| **FE-03** | Global Navigation Header & Mobile Drawer | Part 1 | 🔴 Not started | `client/app/components/Header.tsx`, `client/app/components/NavItems.tsx` | N/A | Pending |
| **FE-04** | Hero Section with Search & Avatars | Part 1 | 🔴 Not started | `client/app/components/Route/Hero.tsx` | N/A | Pending |
| **FE-05** | Custom Auth Modal Container | Part 1 | 🔴 Not started | `client/app/components/Auth/AuthModal.tsx` | N/A | Pending |
| **FE-06** | User Registration Form & Validation | Part 1 | 🔴 Not started | `client/app/components/Auth/SignUp.tsx` | `POST /api/v1/users/register` | Pending |
| **FE-07** | OTP Account Verification UI & Logic | Part 1 | 🔴 Not started | `client/app/components/Auth/Verification.tsx` | `POST /api/v1/users/activate` | Pending |
| **FE-08** | User Login Form & Validation | Part 1 | 🔴 Not started | `client/app/components/Auth/Login.tsx` | `POST /api/v1/users/login` | Pending |
| **FE-09** | Redux Toolkit Store & RTK Query Setup | Part 1 | 🔴 Not started | `client/redux/store.ts`, `client/redux/features/api/apiSlice.ts` | All API endpoints | Pending |
| **FE-10** | Auth State Hydration & Protected Routes | Part 1 | 🔴 Not started | `client/app/hooks/useProtected.tsx`, `client/redux/features/auth/authSlice.ts` | `GET /api/v1/users/me` | Pending |
| **FE-11** | User Profile Dashboard & Sidebar Navigation | Part 1 | 🔴 Not started | `client/app/profile/page.tsx`, `client/app/components/Profile/**` | `GET /api/v1/users/me` | Pending |
| **FE-12** | User Profile Update & Password Change | Part 1 | 🔴 Not started | `client/app/components/Profile/ProfileInfo.tsx`, `ChangePassword.tsx` | `PUT /api/v1/users/update-user-info`, `PUT /api/v1/users/update-user-password` | Pending |
| **FE-13** | User Logout Flow & Cookie Invalidation | Part 1 | 🔴 Not started | `client/app/components/Profile/SidebarProfile.tsx` | `GET /api/v1/users/logout` | Pending |
| **FE-14** | Admin Dashboard Layout & Navigation | Part 1 | 🔴 Not started | `client/app/admin/page.tsx`, `client/app/components/Admin/**` | Role check `admin` | Pending |
| **FE-15** | Admin Multi-Step Course Creation Wizard | Part 1 | 🔴 Not started | `client/app/components/Admin/Course/CreateCourse.tsx` | `POST /api/v1/courses/create-course` | Pending |
| **FE-16** | Course Catalog & Course Card Grid | Part 2 | 🔴 Not started | `client/app/courses/page.tsx`, `client/app/components/Course/CourseCard.tsx` | `GET /api/v1/courses/get-courses` | Pending |
| **FE-17** | Dynamic Course Details & Video Preview | Part 2 | 🔴 Not started | `client/app/course/[id]/page.tsx`, `client/app/components/Course/CourseDetails.tsx` | `GET /api/v1/courses/get-course/:id` | Pending |
| **FE-18** | Course Prerequisites & Benefits Checklist | Part 2 | 🔴 Not started | `client/app/components/Course/CourseDetails.tsx` | Course object | Pending |
| **FE-19** | Student Learning Room & Video Player | Part 2 | 🔴 Not started | `client/app/course-access/[id]/page.tsx`, `client/app/components/Course/CourseContent.tsx` | `GET /api/v1/courses/get-course-content/:id` | Pending |
| **FE-20** | Global Footer & Static Informational Pages | Part 2 | 🔴 Not started | `client/app/components/Footer.tsx`, `client/app/about/page.tsx`, `client/app/faq/page.tsx`, `client/app/policy/page.tsx` | N/A | Pending |
