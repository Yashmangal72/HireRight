# HireRight

A full-stack job platform where recruiters post jobs and candidates apply — built with Spring Boot, React, and MySQL, and deployed to production with a custom domain.

**Live demo:** [myhireright.me](https://myhireright.me)

---

## Overview

HireRight is a two-sided job board with real authentication, role-based authorization enforced on the backend (not just hidden in the UI), and a production deployment pipeline — custom domain, verified transactional email, and proper environment-variable-based configuration.

| Layer | Tech |
|---|---|
| Frontend | React + Vite |
| Backend | Spring Boot (Java 21) |
| Database | MySQL + Spring Data JPA / Hibernate |
| Auth | JWT (Spring Security) |
| Email | Resend (custom verified domain) |
| Hosting | Vercel (frontend) · Railway (backend + MySQL) |

---

## Features

### Authentication & Security
- Candidate and recruiter registration with BCrypt password hashing
- JWT-based login (1-hour expiration), attached automatically to API requests via Axios interceptors
- Role-based authorization enforced on **both** frontend routes and backend endpoints
- Email OTP verification for account confirmation, sent through a verified custom domain (not a sandbox/test address)
- Automatic logout on token expiration (401 handling)

### Job Management
- Recruiters can create, edit, and delete job postings
- Safe deletion — a job with existing applications can't be deleted, protecting application history and referential integrity
- Job search and filtering (keyword, location, employment type, experience level, salary range) via backend JPA Specifications
- Backend-powered pagination and sorting

### Applications
- Candidates can apply to jobs and track their application history
- Duplicate application prevention (returns a proper conflict response instead of silently failing)
- Recruiters can view applicants and move applications through a status pipeline: `APPLIED → SHORTLISTED → INTERVIEW → HIRED` (or `REJECTED`)

### UI/UX
- Light and dark mode with persistent theme preference
- Responsive layout, protected routes, password visibility toggles
- Centralized error handling with meaningful HTTP status codes (400/401/403/404/409)

---

## Architecture

```
             ┌───────────────┐
             │    Vercel     │
             │ React + Vite  │
             └───────┬───────┘
                     │
                  HTTPS
                     │
             ┌───────▼───────┐
             │    Railway    │
             │ Spring Boot   │
             │ REST API      │
             └───────┬───────┘
                     │
             ┌───────▼───────┐
             │ Railway MySQL │
             └───────────────┘
```

The backend follows a layered structure: `Controller → Service → Repository → MySQL`, with dedicated layers for DTOs, exceptions, security, and JPA specifications.

---

## Getting Started (Local Development)

### Prerequisites
- Java 21
- Node.js 18+
- MySQL 8

### Backend

```bash
cd backend
# Set the required environment variables (see below)
./mvnw spring-boot:run
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Required Environment Variables

**Backend** (`application.properties` or environment):

```properties
MYSQLHOST=localhost
MYSQLPORT=3306
MYSQLDATABASE=hireright
MYSQLUSER=root
MYSQLPASSWORD=your_password

JWT_SECRET=your_jwt_secret

RESEND_API_KEY=your_resend_api_key
RESEND_FROM_ADDRESS=HireRight <otp@yourdomain.com>
```

**Frontend** (`.env`):

```
VITE_API_URL=http://localhost:8080
```

---

## Known Limitations / Roadmap

This project is under active development. Planned additions:

- [ ] Automated test suite (JUnit + Mockito for the service layer)
- [ ] Forgot password flow (reusing the existing OTP infrastructure)
- [ ] Resume/file upload for applications
- [ ] Rate limiting on OTP endpoints
- [ ] API documentation via Swagger/OpenAPI
- [ ] Refresh token rotation (JWT currently expires hourly with no refresh)
- [ ] Admin role for platform moderation
- [ ] Recruiter analytics dashboard

---

## Author

Built by [Yash Mangal](https://github.com/Yashmangal72)
