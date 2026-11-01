# 🏛️ CivicConnect — Frontend Portal Documentation

This is the official frontend for **CivicConnect**, built with React 19, TypeScript, Vite, and React Router. It connects directly to the Java Spring Boot backend and MySQL database without mock or fake data.

---

## 1. Directory Structure

```
frontend/
├── dist/                      # Production build output
├── public/                    # Static assets (favicons, icons)
├── src/
│   ├── assets/                # App styling and media
│   ├── components/            # Reusable UI components
│   │   ├── Alert.tsx          # Feedback alert banners
│   │   ├── Footer.tsx         # Municipal portal footer
│   │   ├── KpiStatsBar.tsx    # Citizen & department metric cards
│   │   ├── Navbar.tsx         # Responsive civic header with portal switcher
│   │   ├── PriorityBadge.tsx  # HIGH / MEDIUM / LOW badge
│   │   ├── ProtectedRoute.tsx # Route guard for authenticated citizens/officers
│   │   └── StatusBadge.tsx    # REPORTED / IN PROGRESS / RESOLVED badge
│   ├── pages/                 # Full application views
│   │   ├── HomePage.tsx               # Civic welcome page with live metrics
│   │   ├── CitizenLoginPage.tsx       # Citizen email/password login
│   │   ├── CitizenRegisterPage.tsx    # Citizen account registration with validation
│   │   ├── CitizenDashboardPage.tsx   # Citizen complaint dashboard & metrics
│   │   ├── SubmitComplaintPage.tsx    # Issue filing form with AI auto-routing preview
│   │   ├── ComplaintDetailsPage.tsx   # Detailed status timeline for an issue
│   │   ├── DepartmentLoginPage.tsx    # Department officer authentication
│   │   └── DepartmentDashboardPage.tsx # Officer triage, filter & status resolution
│   ├── services/              # Centralized API service layer
│   │   ├── api.ts             # Base HTTP client with unified error handling
│   │   ├── authService.ts     # Citizen & Department login/register endpoints
│   │   ├── issueService.ts    # Issue creation, listing, preview & status update
│   │   └── departmentService.ts # Department list & metadata
│   ├── types/                 # Strict TypeScript domain interfaces
│   │   └── index.ts           # User, Department, Issue, KPI & API models
│   ├── App.css                # Civic design system styles
│   ├── App.tsx                # Main Router layout & route definitions
│   ├── index.css              # Reset & typography styles
│   └── main.tsx               # Application entry point
├── .env                       # Local environment variables
├── .env.example               # Template environment configuration
├── package.json               # Node dependencies & build scripts
├── run-frontend.bat           # Windows quick-run script
├── tsconfig.json              # TypeScript compiler settings
└── vite.config.js             # Vite configuration with API proxy
```

---

## 2. Frontend Routes & Purposes

| Route | Page Component | Access | Purpose |
|---|---|---|---|
| `/` | `HomePage` | Public | Welcome portal, platform statistics, quick actions |
| `/register` | `CitizenRegisterPage` | Public | Citizen registration with client-side field validation |
| `/login` | `CitizenLoginPage` | Public | Citizen email & password authentication |
| `/dashboard` | `CitizenDashboardPage` | Citizen Only | Personal complaint history, status counts & quick links |
| `/submit` | `SubmitComplaintPage` | Citizen Only | File new complaint with live routing preview & photo dropzone |
| `/issues/:id` | `ComplaintDetailsPage` | Authenticated | Full details & resolution timeline for a specific issue |
| `/department/login` | `DepartmentLoginPage` | Public | Municipal officer login via `department_accounts` |
| `/department/dashboard` | `DepartmentDashboardPage` | Officer Only | Department-isolated issue triage, search, filter & status updates |

---

## 3. API Integration Map

| Frontend Action | Endpoint | Method | Backend Status | Purpose |
|---|---|---|---|---|
| Citizen Register | `/api/users/register` | `POST` | ✅ Implemented | Creates citizen record in `users` with BCrypt password hashing |
| Citizen Login | `/api/users/login` | `POST` | ✅ Implemented | Verifies email & password; returns user details |
| Get User Profile | `/api/users/{id}` | `GET` | ✅ Implemented | Fetches user info |
| Officer Login | `/api/departments/login` | `POST` | ✅ Implemented | Authenticates against `department_accounts` table |
| List Departments | `/api/departments` | `GET` | ✅ Implemented | Returns list of 10 municipal departments |
| Get Department | `/api/departments/{id}` | `GET` | ✅ Implemented | Returns specific department details |
| Live Routing Preview | `/api/issues/preview` | `POST` | ✅ Implemented | Real-time classification & priority preview as user types |
| Submit Complaint | `/api/issues` | `POST` | ✅ Implemented | Creates complaint in `issues` with automatic department routing |
| Get Citizen Complaints | `/api/issues/user/{id}` | `GET` | ✅ Implemented | Fetches all complaints submitted by a citizen |
| Get Department Issues | `/api/issues/department/{id}` | `GET` | ✅ Implemented | Returns complaints assigned to specific department |
| Update Issue Status | `/api/issues/{id}/status` | `PUT` | ✅ Implemented | Updates issue status (`REPORTED` → `IN PROGRESS` → `RESOLVED`) |
| Get Issue Details | `/api/issues/{id}` | `GET` | ✅ Implemented | Fetches full complaint details |
| Portal Stats | `/api/dashboard/stats` | `GET` | ✅ Implemented | Returns total, pending, and resolved complaint counts |

---

## 4. Setup & Running Instructions

### Prerequisites
- Node.js (v18+ or v20+)
- Java 17+ and MySQL running for the backend

### Starting the Frontend
```powershell
# From the frontend directory:
npm.cmd install    # (Already completed in workspace)
npm.cmd run dev    # Launches Vite dev server at http://localhost:5173
```
Or simply double-click `run-frontend.bat`.

### Building for Production
```powershell
npm.cmd run build  # Generates production files in dist/
```

---

## 5. Backend CORS Configuration
The Spring Boot backend includes `CorsConfig.java` in `com.civiconnect.config`:
- **Allowed Origins**: `http://localhost:5173`, `http://localhost:3000`
- **Allowed Methods**: `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`
- **Allowed Headers**: `*`
- **Allow Credentials**: `true`

---

## 6. Pending / Future Integrations
- **Multipart Image Storage**: The complaint submission form includes a modern drag-and-drop file upload UI. Once a dedicated `/api/issues/{id}/image` multipart endpoint (storing to S3 or local disk) is added, the photo upload can be persisted directly.
- **Push / SMS Notifications**: Real-time SMS status updates when an issue transitions from `IN PROGRESS` to `RESOLVED`.
