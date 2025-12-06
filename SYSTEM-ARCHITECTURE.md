# System Architecture

This document provides a comprehensive overview of the Faculty Appraisal System's architecture, design patterns, data flow, and technical implementation details.

## 📋 Table of Contents

- [Architecture Overview](#architecture-overview)
- [System Components](#system-components)
- [Data Flow](#data-flow)
- [Component Hierarchy](#component-hierarchy)
- [State Management](#state-management)
- [Routing Structure](#routing-structure)
- [API Integration](#api-integration)
- [Authentication Flow](#authentication-flow)
- [Role-Based Access Control](#role-based-access-control)
- [Form Submission Workflow](#form-submission-workflow)

## Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Browser                          │
│  ┌─────────────────────────────────────────────────────┐  │
│  │         React Application (Vite + React)            │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌───────────┐ │  │
│  │  │   Context    │  │  Components  │  │  Router    │ │  │
│  │  │   Providers  │  │              │  │            │ │  │
│  │  └──────────────┘  └──────────────┘  └───────────┘ │  │
│  └─────────────────────────────────────────────────────┘  │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ HTTP/REST API
                        │
┌───────────────────────┴─────────────────────────────────────┐
│                  Backend API Server                          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Authentication │ Database │ Business Logic │ APIs  │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **UI Framework** | React 19.0.0 | Component-based UI |
| **Build Tool** | Vite 6.1.0 | Fast build and dev server |
| **Routing** | React Router DOM 7.1.5 | Client-side routing |
| **Styling** | Tailwind CSS 4.0.5 | Utility-first CSS |
| **State Management** | React Context API | Global state |
| **HTTP Client** | Axios 1.7.9 | API communication |
| **Storage** | localStorage | Session persistence |

## System Components

### 1. Application Entry Point

**File**: `src/main.jsx`

```javascript
React App Entry
    ↓
StrictMode Wrapper
    ↓
App Component
    ↓
AuthProvider + Router
    ↓
AppContent (Main Application)
```

### 2. Core Providers

#### AuthProvider (`src/context/AuthContext.jsx`)
- Manages authentication state
- Handles login/logout
- Stores user data in localStorage
- Provides authentication context to all components
- **Provides**: `isAuthenticated`, `userData`, `userRole`, `login()`, `logout()`
- **State Source**: localStorage `userData` key
- **Updates**: On login/logout actions

#### FormProvider (`src/context/FormContext.jsx`)
- Manages form data state
- Tracks form progress
- Provides form update functions

#### CourseProvider (`src/context/CourseContext.jsx`)
- Manages course-related data
- Fetches course information from API
- Caches course data

### 3. Layout Components

#### Sidebar (`src/components/layout/Sidebar.jsx`)
- Navigation menu
- Role-based menu items
- Collapsible sections
- Status indicators

#### Navbar (`src/components/layout/Navbar.jsx`)
- Top navigation bar
- User information display
- Logout functionality
- Status notifications

## Data Flow

### Authentication Flow

```
User Login
    ↓
POST /login (Backend API)
    ↓
Receive User Data + Token
    ↓
Store in localStorage
    ↓
Update AuthContext
    ↓
Redirect to Dashboard
```

### Form Submission Flow

```
User Fills Form
    ↓
Form Data Stored in Component State
    ↓ (optional: also in FormContext)
User Clicks Submit
    ↓
Validate Form Data (client-side)
    ↓
Show Loading State
    ↓
POST /{department}/{userId}/{formPart}
    ├── Headers: Content-Type: application/json
    └── Body: JSON.stringify(formData)
    ↓
Backend Validates & Stores
    ↓
Response Received
    ├── Success (200/201)
    │   ├── Show Success Toast
    │   ├── Update Local State
    │   └── Redirect to Status Page
    └── Error (400/500)
        ├── Show Error Toast
        ├── Display Error Message
        └── Keep User on Form
```

### Detailed Form Submission Sequence

```
1. Component Mounts
   ├── useEffect triggers
   ├── Fetch existing data: GET /{dept}/{userId}/{formPart}
   └── Populate form fields

2. User Interaction
   ├── Input changes update component state
   ├── Validation on blur/change
   └── Real-time feedback

3. Form Submission
   ├── Prevent default form submission
   ├── Validate all required fields
   ├── Show loading spinner
   ├── POST /{dept}/{userId}/{formPart}
   │   └── Body: Complete form data object
   ├── Handle response
   │   ├── Success: Toast + Redirect
   │   └── Error: Toast + Stay on form
   └── Update submission status
```

### Data Fetching Flow

```
Component Mounts
    ↓
useEffect Hook Triggers
    ↓
Check localStorage for cached data
    ├── If cached & valid
    │   ├── Use cached data
    │   └── Render UI immediately
    └── If not cached or expired
        ├── Show Loading State
        ├── GET /{endpoint}
        │   ├── Headers: (if auth required)
        │   └── Query params: (if applicable)
        ├── Handle Response
        │   ├── Success
        │   │   ├── Parse JSON
        │   │   ├── Update Component State
        │   │   ├── Cache in localStorage (optional)
        │   │   └── Render UI
        │   └── Error
        │       ├── Show Error Message
        │       ├── Use fallback data (if available)
        │       └── Log error for debugging
        └── Cleanup (if component unmounts)
```

### API Request Lifecycle

```
Request Initiation
    ├── Component calls fetch/axios
    ├── Construct URL: VITE_BASE_URL + endpoint
    └── Prepare request options
        ├── Method: GET/POST/PUT/DELETE
        ├── Headers: Content-Type, etc.
        └── Body: JSON.stringify(data) for POST/PUT

Network Layer
    ├── Browser sends HTTP request
    ├── Backend receives request
    ├── Backend processes request
    └── Backend sends response

Response Handling
    ├── Check response.ok
    ├── Parse response.json()
    ├── Update component state
    └── Trigger UI re-render
```

## Component Hierarchy

### Main Application Structure

```
App (src/App.jsx)
├── AuthProvider (src/context/AuthContext.jsx)
│   └── Router (react-router-dom)
│       └── AppContent
│           ├── FormProvider (src/context/FormContext.jsx)
│           │   └── Main Layout
│           │       ├── Sidebar (conditional, src/components/layout/Sidebar.jsx)
│           │       │   └── Role-based navigation items
│           │       ├── Navbar (conditional, src/components/layout/Navbar.jsx)
│           │       │   └── User info, logout, status
│           │       └── Routes (Protected & Public)
│           │           ├── Public Routes
│           │           │   ├── /login → LoginPage
│           │           │   └── /admin/* → Admin routes
│           │           └── Protected Routes
│           │               ├── /dashboard → Dashboard
│           │               ├── /profile → Profile
│           │               ├── /teaching → TempTeachingPerfomance (Part A)
│           │               ├── /research → Research (Part B)
│           │               ├── /selfdevelopment → SelfDevelopment (Part C)
│           │               ├── /portfolio → Portfolio (Part D)
│           │               ├── /extra → Extra (Part E)
│           │               ├── /review → Review
│           │               ├── /submission-status → SubmissionStatus
│           │               └── Role-specific routes
│           │                   ├── HOD routes
│           │                   ├── Dean routes
│           │                   ├── Director routes
│           │                   └── External routes
│           └── SplashScreen (on initial load)
```

### Detailed Component Relationships

#### Authentication Flow Components

```
LoginPage
    ↓ (on success)
    ├── Calls AuthContext.login(userData)
    ├── Stores in localStorage
    └── Navigates to /dashboard

AuthContext
    ├── Provides: isAuthenticated, userData, userRole
    ├── Consumed by: All protected routes
    └── Updates: On login/logout

ProtectedRoute
    ├── Checks: isAuthenticated from AuthContext
    ├── Redirects: /login if not authenticated
    └── Renders: children if authenticated
```

#### Form Submission Components

```
Form Component (e.g., Research.jsx)
    ├── Uses: FormContext (optional)
    ├── Fetches: Existing data from API (GET)
    ├── Updates: Local component state
    ├── Submits: Form data to API (POST)
    └── Updates: SubmissionStatus via API

FormContext
    ├── Manages: Form data state across components
    ├── Provides: formData, updateFormData, getSectionProgress
    └── Used by: Multiple form components (optional)

SubmissionStatus
    ├── Fetches: Status from API (GET /get-status)
    └── Displays: Current submission status for all parts
```

#### Role-Based Component Flow

```
Sidebar
    ├── Reads: userData from localStorage
    ├── Determines: userRole (role or desg)
    ├── Renders: Role-specific menu items
    └── Navigation: React Router Links

Role-Specific Components
    ├── HOD Components
    │   ├── FacultyFormsList → Lists department faculty
    │   ├── HODverify → Verifies faculty forms
    │   └── FinalMarks → Calculates final marks
    ├── Dean Components
    │   ├── AssociateDeansList → Lists associate deans
    │   └── DeanEvaluationForm → Evaluates faculty
    ├── Director Components
    │   ├── HODForms → Reviews HOD forms
    │   ├── DeanForms → Reviews Dean forms
    │   └── FacultyForms → Reviews faculty forms
    └── External Components
        ├── ExternalDashboard → Lists assignments
        └── EvaluateFacultyPage → Evaluates assigned faculty
```

### Form Components Structure

```
Forms/
├── Dashboard.jsx (Overview)
├── TempTeachingPerfomance.jsx (Part A)
├── Research.jsx (Part B)
├── SelfDevelopment.jsx (Part C)
├── Portfolio.jsx (Part D)
├── Extra.jsx (Part E)
├── Review.jsx (Final Review)
└── SubmissionStatus.jsx (Status Display)
```

### Role-Based Component Structure

```
Role Components/
├── adminpage/
│   ├── AddFaculty.jsx
│   ├── FacultyList.jsx
│   ├── VerificationTeam.jsx
│   └── Summary.jsx
├── HOD/
│   ├── FacultyFormsList.jsx
│   ├── HODverify.jsx
│   ├── FinalMarks.jsx
│   └── VerificationPanel.jsx
├── Dean/
│   ├── AssociateDeansList.jsx
│   ├── DeanEvaluationForm.jsx
│   └── Interactionevaluation.jsx
├── Director/
│   ├── HODForms.jsx
│   ├── DeanForms.jsx
│   ├── FacultyForms.jsx
│   └── DirectorVerify.jsx
└── External/
    ├── ExternalDashboard.jsx
    └── EvaluateFacultyPage.jsx
```

## State Management

### Context API Usage

#### 1. Authentication Context

```javascript
AuthContext provides:
- isAuthenticated: boolean
  - Derived from: localStorage.getItem('userData')
  - Updates: On login/logout
- userData: object (from localStorage)
  - Structure: { _id, name, email, role, dept, desg, ... }
  - Source: localStorage.getItem('userData')
  - Updates: On login, cleared on logout
- userRole: string | null
  - Derived from: userData.role || userData.desg?.toLowerCase()
  - Used for: Role-based rendering and routing
- login: function(userData)
  - Stores: userData in localStorage
  - Updates: isAuthenticated state
  - Triggers: Component re-renders
- logout: function()
  - Removes: userData from localStorage
  - Updates: isAuthenticated state
  - Redirects: To login page
```

#### 2. Form Context

```javascript
FormContext provides:
- formData: object
  - profile: {}
  - teaching: {}
  - research: {}
  - administrative: {}
  - development: {}
- updateFormData: function
- getSectionProgress: function
```

#### 3. Course Context

```javascript
CourseContext provides:
- courses: array
- isInitialized: boolean
- initializeCourses: function
```

### Local Storage Usage

**Stored Data:**
- `userData`: Complete user object with role, department, ID
- `courseData`: Cached course information

**Storage Pattern:**
```javascript
// Save
localStorage.setItem('userData', JSON.stringify(userData));

// Retrieve
const userData = JSON.parse(localStorage.getItem('userData'));

// Remove
localStorage.removeItem('userData');
```

## Routing Structure

### Route Configuration

**File**: `src/App.jsx`

#### Public Routes (Unauthenticated)
- `/login` - Login page
- `/admin/*` - Admin routes (special access)
- `/*` - Redirect to login

#### Protected Routes (Authenticated)
- `/dashboard` - Main dashboard
- `/profile` - User profile
- `/teaching` - Part A form
- `/research` - Part B form
- `/selfdevelopment` - Part C form
- `/portfolio` - Part D form
- `/extra` - Part E form
- `/review` - Final review
- `/submission-status` - Submission status

#### Role-Specific Routes

**HOD Routes:**
- `/hod/faculty-forms-list`
- `/hod/final-marks`
- `/hodverify`
- `/hodcnfverify`

**Dean Routes:**
- `/dean/associate-dean-list`
- `/dean-evaluation/:department/:facultyId`
- `/dean/give-interaction-marks`

**Director Routes:**
- `/director/hod-forms`
- `/director/dean-forms`
- `/director/faculty-forms`
- `/DirectorVerify`

**External Routes:**
- `/external/give-marks`
- `/evaluate-faculty/:facultyId`

### Protected Route Implementation

```javascript
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return children;
};
```

## API Integration

### API Base Configuration

**Environment Variable**: `VITE_BASE_URL`

**Usage Pattern**:
```javascript
const response = await fetch(
  `${import.meta.env.VITE_BASE_URL}/endpoint`
);
```

### API Endpoint Categories

#### 1. Authentication Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/login` | User authentication |
| POST | `/send-otp` | Send OTP for password reset |
| POST | `/verify-otp` | Verify OTP |
| POST | `/reset-user-password` | Reset password |
| POST | `/forgot-password` | Request password reset |

#### 2. User Management Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/users` | Get all users |
| GET | `/users/:id` | Get specific user |
| POST | `/users` | Create new user |
| PUT | `/users/:id` | Update user |
| DELETE | `/users/:id` | Delete user |
| GET | `/all-faculties` | Get all faculty members |
| GET | `/faculty/:department` | Get faculty by department |

#### 3. Form Submission Endpoints

| Method | Endpoint Pattern | Purpose |
|--------|-----------------|---------|
| GET | `/{dept}/{userId}/A` | Get Part A data |
| POST | `/{dept}/{userId}/A` | Submit Part A |
| GET | `/{dept}/{userId}/B` | Get Part B data |
| POST | `/{dept}/{userId}/B` | Submit Part B |
| GET | `/{dept}/{userId}/C` | Get Part C data |
| POST | `/{dept}/{userId}/C` | Submit Part C |
| GET | `/{dept}/{userId}/D` | Get Part D data |
| POST | `/{dept}/{userId}/D` | Submit Part D |
| GET | `/{dept}/{userId}/E` | Get Part E data |
| POST | `/{dept}/{userId}/E` | Submit Part E |

#### 4. Status and Workflow Endpoints

| Method | Endpoint Pattern | Purpose |
|--------|-----------------|---------|
| GET | `/{dept}/{userId}/get-status` | Get form status |
| POST | `/{dept}/{userId}/submit-form` | Final form submission |
| GET | `/{dept}/{userId}/generate-doc` | Generate PDF document |
| GET | `/{dept}/all_faculties_final_marks` | Get final marks |
| POST | `/{dept}/send-to-director` | Send to director |

#### 5. Verification Endpoints

| Method | Endpoint Pattern | Purpose |
|--------|-----------------|---------|
| GET | `/faculty_to_verify/:verifierId` | Get faculty to verify |
| POST | `/{dept}/{facultyId}/B` | Submit verification |
| POST | `/{dept}/{userId}/{verifierId}/verify-research` | Verify research |

#### 6. Evaluation Endpoints

| Method | Endpoint Pattern | Purpose |
|--------|-----------------|---------|
| POST | `/{dept}/hod_interaction_marks/:externalId/:facultyId` | HOD interaction marks |
| GET | `/external_interaction_marks/:externalId` | Get external marks |
| GET | `/total_marks/:dept/:facultyId` | Get total marks |

#### 7. External Evaluator Endpoints

| Method | Endpoint Pattern | Purpose |
|--------|-----------------|---------|
| GET | `/{dept}/external-assignments/:externalId` | Get assignments |
| GET | `/{dept}/get-externals` | Get external evaluators |
| POST | `/{dept}/assign-externals` | Assign externals |

### API Request/Response Patterns

#### Request Pattern
```javascript
const response = await fetch(`${VITE_BASE_URL}/endpoint`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(data),
});
```

#### Response Handling
```javascript
if (response.ok) {
  const data = await response.json();
  // Handle success
} else {
  const error = await response.json();
  // Handle error
}
```

## Authentication Flow

### Login Process

```
1. User enters credentials
   ↓
2. POST /login with {_id, password}
   ↓
3. Backend validates credentials
   ↓
4. Returns user data object:
   {
     _id, name, email, role, dept, desg, ...
   }
   ↓
5. Store in localStorage
   ↓
6. Update AuthContext
   ↓
7. Redirect based on role
```

### Session Management

- **Storage**: localStorage (persists across sessions)
- **Validation**: Check localStorage on app load
- **Expiration**: Handled by backend (no explicit frontend expiration)
- **Logout**: Clear localStorage and redirect to login

### Password Reset Flow

```
1. User clicks "Forgot Password"
   ↓
2. Enter User ID
   ↓
3. POST /send-otp
   ↓
4. Receive OTP via email/SMS
   ↓
5. Enter OTP
   ↓
6. POST /verify-otp
   ↓
7. Enter new password
   ↓
8. POST /reset-user-password
   ↓
9. Redirect to login
```

## Role-Based Access Control

### User Roles

| Role | Designation | Permissions |
|------|-------------|-------------|
| **Admin** | admin | Full system access, user management |
| **Faculty** | Professor/Assoc. Prof./Asst. Prof. | Submit forms, view own data |
| **HOD** | HOD | Review department forms, assign externals |
| **Dean** | Dean | Evaluate faculty, provide interaction marks |
| **Director** | Director/Deputy Director | Final approval, view all forms |
| **External** | External | Evaluate assigned faculty |
| **Verification Team** | Faculty (assigned) | Verify research data |

### Role-Based UI Rendering

```javascript
// Example: Conditional rendering based on role
const userData = JSON.parse(localStorage.getItem('userData'));
const userRole = userData.desg?.toLowerCase();

if (userRole === 'hod') {
  // Show HOD-specific menu items
}
```

### Route Protection by Role

Routes are protected at component level:
- Check user role from localStorage
- Conditionally render components
- Redirect unauthorized users

## Form Submission Workflow

### Complete Workflow

```
Faculty Member
    ↓
[Part A] Teaching Performance
    ↓ Submit
Backend Storage
    ↓
[Part B] Research & Development
    ↓ Submit
Backend Storage
    ↓
[Part C] Self Development
    ↓ Submit
Backend Storage
    ↓
[Part D] Portfolio
    ↓ Submit
Backend Storage
    ↓
[Part E] Extra Contribution
    ↓ Submit
Backend Storage
    ↓
[Review] Final Review
    ↓
Generate PDF Document
    ↓
Submit Final Form
    ↓
Status: Submitted
    ↓
Verification Team
    ↓ Verify
    ↓
HOD Review
    ↓ Evaluate
    ↓
Dean Evaluation
    ↓ Evaluate
    ↓
Director Approval
    ↓ Approve
    ↓
Status: Approved
```

### Form Data Structure

Each form part has a structured payload:

**Part A (Teaching)**:
```javascript
{
  1: { courses: {...}, marks: ... },
  2: { courses: {...}, marks: ... },
  4: { courses: {...}, marks: ... },
  7: { courses: {...}, marks: ... },
  total_marks: ...
}
```

**Part B (Research)**:
```javascript
{
  1: { papers: {...}, marks: ... },
  2: { conferences: {...}, marks: ... },
  // ... more sections
  total_marks: ...
}
```

## Performance Considerations

### Optimization Strategies

1. **Code Splitting**: React Router lazy loading
2. **Asset Optimization**: Vite automatic optimization
3. **Caching**: localStorage for user data and courses
4. **Lazy Loading**: Components loaded on demand
5. **Memoization**: React.memo for expensive components

### Bundle Size

- Main bundle: Optimized by Vite
- Route-based splitting: Automatic
- Asset compression: Automatic in production build

## Security Considerations

1. **Authentication**: Token-based (handled by backend)
2. **Authorization**: Role-based access control
3. **Data Validation**: Backend validation required
4. **XSS Protection**: React automatic escaping
5. **CORS**: Configured on backend
6. **Sensitive Data**: Never stored in frontend code

## Error Handling

### Error Patterns

```javascript
try {
  const response = await fetch(url);
  if (!response.ok) throw new Error('Request failed');
  const data = await response.json();
} catch (error) {
  console.error('Error:', error);
  // Show user-friendly error message
  toast.error('An error occurred');
}
```

### Error Boundaries

- Component-level error handling
- Toast notifications for user feedback
- Console logging for debugging

## Component Interaction Patterns

### Parent-Child Communication

```
Parent Component
    ├── Passes: Props (data, callbacks)
    ├── Manages: State for child components
    └── Receives: Events from children

Child Component
    ├── Receives: Props from parent
    ├── Calls: Callback functions (onClick, onChange)
    └── Updates: Parent state via callbacks
```

### Context-Based Communication

```
Context Provider (e.g., AuthProvider)
    ├── Wraps: Application tree
    ├── Manages: Global state
    └── Provides: Context value

Consumer Components
    ├── Use: useContext hook
    ├── Access: Context value
    └── Re-render: When context updates
```

### Cross-Component Communication

```
Component A
    ├── Updates: Context/Global State
    └── Triggers: Re-render of consumers

Component B
    ├── Subscribes: To same context
    └── Receives: Updated state automatically
```

## Data Flow Patterns

### Unidirectional Data Flow

```
User Action
    ↓
Event Handler
    ↓
State Update (setState/Context)
    ↓
Component Re-render
    ↓
UI Update
```

### API Data Flow

```
User Action
    ↓
API Call (fetch/axios)
    ↓
Backend Processing
    ↓
Response Received
    ↓
State Update
    ↓
UI Update
```

### Form Data Flow

```
User Input
    ↓
onChange Handler
    ↓
Local State Update
    ↓
Form Validation
    ↓
Submit Handler
    ↓
API Call
    ↓
Success/Error Handling
    ↓
State Update
    ↓
UI Feedback
```

## File Organization Patterns

### Component Structure

```
src/components/
├── layout/           # Shared layout components
│   ├── Navbar.jsx
│   └── Sidebar.jsx
├── forms/            # Form components (A-E)
│   ├── Dashboard.jsx
│   ├── TempTeachingPerfomance.jsx
│   └── ...
├── adminpage/       # Admin-specific components
├── HOD/             # HOD-specific components
├── Dean/            # Dean-specific components
├── Director/        # Director-specific components
├── External/        # External evaluator components
└── Verification/    # Verification team components
```

### Context Organization

```
src/context/
├── AuthContext.jsx      # Authentication state
├── FormContext.jsx       # Form data state
└── CourseContext.jsx    # Course data state
```

### Asset Organization

```
src/assets/
├── logo.png          # Application logo
└── react.svg          # React logo

public/
└── vite.svg          # Vite logo
```

## Build and Runtime Architecture

### Development Mode

```
Vite Dev Server
    ├── Serves: Source files directly
    ├── Transforms: JSX, TypeScript on-the-fly
    ├── Hot Module Replacement: Updates without refresh
    └── Port: 5173 (default)
```

### Production Build

```
npm run build
    ├── Transpiles: JSX to JavaScript
    ├── Bundles: All code into optimized chunks
    ├── Minifies: JavaScript and CSS
    ├── Tree-shakes: Removes unused code
    └── Output: dist/ directory
        ├── index.html
        ├── assets/
        │   ├── index-[hash].js
        │   └── index-[hash].css
        └── Other assets
```

### Runtime Execution

```
Browser loads index.html
    ↓
Loads JavaScript bundle
    ↓
React initializes
    ↓
App component renders
    ↓
Context providers initialize
    ↓
Router determines initial route
    ↓
Component tree renders
    ↓
API calls made (if needed)
    ↓
UI updates with data
```

---

For deployment information, see [DEPLOYMENT.md](./DEPLOYMENT.md).  
For installation, see [INSTALLATION.md](./INSTALLATION.md).  
For API details, see [API-DOCUMENTATION.md](./API-DOCUMENTATION.md).

