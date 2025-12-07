# Faculty Appraisal System

A comprehensive web-based application for managing faculty performance appraisals in educational institutions. This system facilitates multi-part form submissions, role-based evaluations, and automated workflow management for faculty assessment processes.

## 📋 Overview

The Faculty Appraisal System is a React-based single-page application designed to streamline the faculty evaluation process. It supports multiple user roles including Faculty, HOD (Head of Department), Dean, Director, External Evaluators, and Administrators. The system manages a structured appraisal workflow with five distinct form parts covering academic involvement, research, self-development, portfolio, and extraordinary contributions.

## 🚀 Features

### Core Functionality
- **Multi-Part Form System**: Five comprehensive appraisal forms (Parts A-E)
- **Role-Based Access Control**: Different interfaces and permissions for each user role
- **Real-time Status Tracking**: Monitor form submission and verification status
- **Document Generation**: Automatic PDF generation for completed appraisals
- **Verification Workflow**: Multi-level verification system (Verification Team → HOD → Dean → Director)
- **External Evaluation**: Support for external evaluators and college external reviewers
- **Interactive Dashboards**: Role-specific dashboards with progress indicators

### User Roles
- **Faculty**: Submit and manage their appraisal forms
- **HOD**: Review department faculty forms, assign external evaluators
- **Dean**: Evaluate faculty and associate deans
- **Director**: Final review and approval authority
- **External Evaluator**: Evaluate assigned faculty members
- **Verification Team**: Verify research and academic data
- **Admin**: Manage users, departments, and system configuration

## 🛠️ Tech Stack

### Frontend Framework
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.0.0 | UI Framework |
| TypeScript | 5.5.0 | Type Safety |
| Vite | 6.1.0 | Build Tool & Dev Server |
| React Router DOM | 7.1.5 | Client-side Routing |

### Styling & UI
| Technology | Version | Purpose |
|------------|---------|---------|
| Tailwind CSS | 4.0.5 | Utility-first CSS Framework |
| Framer Motion | 12.5.0 | Animation Library |
| Lucide React | 0.475.0 | Icon Library |
| React Icons | 5.5.0 | Additional Icons |
| React Hot Toast | 2.5.2 | Toast Notifications |
| React Toastify | 11.0.3 | Alternative Toast System |
| React Spinners | 0.15.0 | Loading Spinners |

### Data & State Management
| Technology | Version | Purpose |
|------------|---------|---------|
| Axios | 1.7.9 | HTTP Client with Interceptors |
| React Context API | Built-in | Global State Management |
| js-cookie | 3.0.5 | Cookie Management |
| localStorage | Browser API | Session Persistence |

### Development Tools
| Technology | Version | Purpose |
|------------|---------|---------|
| ESLint | 9.20.0 | Code Linting |
| Prettier | 3.5.0 | Code Formatting |
| Vitest | 2.0.0 | Unit Testing Framework |
| Testing Library | 16.0.0 | Component Testing |
| PostCSS | 8.5.1 | CSS Processing |
| Autoprefixer | 10.4.20 | CSS Vendor Prefixing |

### Architecture
- **Type**: Single Page Application (SPA)
- **State Management**: React Context API
- **API Communication**: RESTful API via Axios
- **Authentication**: Token-based (stored in localStorage)
- **Routing**: Client-side routing with React Router

## 📁 Project Structure

```
Faculty-Appraisal-System/
├── public/                       # Static public assets
│   └── vite.svg
├── src/
│   ├── __tests__/                # Test files (proper location)
│   │   ├── components/
│   │   ├── context/
│   │   └── services/
│   ├── assets/                   # Application assets
│   │   ├── logo.png
│   │   └── react.svg
│   ├── components/               # React components
│   │   ├── adminpage/           # Admin panel components
│   │   ├── CollegeExternal/      # College external evaluator views
│   │   ├── common/              # Shared components (LoadingSpinner, RouteLoader)
│   │   ├── Dean/                # Dean-specific components
│   │   ├── Director/            # Director-specific components
│   │   ├── External/            # External evaluator views
│   │   ├── forms/               # Main appraisal forms (Parts A-E)
│   │   ├── HOD/                 # HOD-specific components
│   │   ├── layout/              # Layout components (Navbar, Sidebar)
│   │   ├── profile/             # User profile management
│   │   ├── Verification/        # Verification team components
│   │   ├── verfication_team/    # Alternative verification components
│   │   ├── ErrorBoundary.tsx    # Error boundary component
│   │   ├── ErrorFallback.tsx    # Error fallback UI
│   │   ├── LoginPage.jsx        # Authentication page
│   │   ├── ResetPassword.jsx    # Password reset functionality
│   │   └── SplashScreen.jsx     # Application splash screen
│   ├── context/                  # React Context providers
│   │   ├── AuthContext.tsx      # Authentication state management
│   │   ├── FormContext.tsx      # Form data state management
│   │   └── CourseContext.tsx    # Course data management
│   ├── hooks/                    # Custom React hooks
│   │   └── useErrorHandler.ts   # Error handling hook
│   ├── services/                 # API service layer
│   │   └── api/
│   │       ├── client.ts         # Axios client with interceptors
│   │       ├── authService.ts   # Authentication services
│   │       ├── formService.ts   # Form submission services
│   │       ├── userService.ts   # User management services
│   │       ├── verificationService.ts
│   │       ├── evaluationService.ts
│   │       └── index.ts          # Centralized exports
│   ├── types/                    # TypeScript type definitions
│   │   ├── api.types.ts
│   │   ├── common.types.ts
│   │   ├── form.types.ts
│   │   └── user.types.ts
│   ├── utils/                    # Utility functions
│   │   ├── errorHandler.ts
│   │   └── test-utils.tsx
│   ├── App.tsx                   # Main application component
│   ├── main.tsx                  # Application entry point
│   ├── index.css                 # Global styles
│   └── vite-env.d.ts            # Vite type definitions
├── Configuration Files
│   ├── eslint.config.js         # ESLint configuration
│   ├── tailwind.config.js       # Tailwind CSS configuration
│   ├── tsconfig.json             # TypeScript configuration
│   ├── tsconfig.node.json       # TypeScript config for Node
│   ├── vite.config.ts            # Vite configuration
│   └── vitest.config.ts          # Vitest testing configuration
├── Documentation
│   ├── README.md                 # This file
│   ├── INSTALLATION.md           # Installation guide
│   ├── DEPLOYMENT.md             # Deployment guide
│   ├── SYSTEM-ARCHITECTURE.md    # Architecture documentation
│   ├── API-DOCUMENTATION.md      # API reference
│   ├── TROUBLESHOOTING.md        # Troubleshooting guide
│   ├── PROJECT-NOTES.md          # Development notes
│   └── CHANGELOG.md              # Version history
├── index.html                    # HTML template
└── package.json                   # Dependencies and scripts
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher) or yarn
- Backend API server running (see backend repository)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Faculty-Appraisal-System
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and set your backend API URL:
   ```
   VITE_BASE_URL=http://localhost:5000
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to `http://localhost:5173` (or the port shown in terminal)

### Build for Production

```bash
npm run build
```

The production build will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 📝 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload (accessible on network) |
| `npm run build` | Build for production (TypeScript check + Vite build) |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint to check code quality |
| `npm run type-check` | Run TypeScript compiler to check for type errors |
| `npm run test` | Run unit tests with Vitest |
| `npm run test:ui` | Run tests with Vitest UI |
| `npm run test:coverage` | Run tests with coverage report |

## 🔐 Authentication

### Authentication Flow
The application uses token-based authentication with the following features:
- **Login**: User ID and password authentication via backend API
- **Session Management**: User data stored in localStorage
- **Token Handling**: Automatic token injection via Axios interceptors
- **Auto-logout**: Automatic redirect on 401 Unauthorized responses
- **Password Reset**: OTP-based password reset flow

### Default Admin Credentials
- **Username**: `admin2025`
- **Password**: `admin2025`

### User Login
Regular users authenticate via the backend API using their user ID and password. The system supports:
- Standard login with user ID and password
- OTP-based password reset (send OTP → verify OTP → reset password)
- Session persistence across browser sessions
- Automatic token refresh handling

## 📊 Form Parts Overview

### Part A: Academic Involvement
- Course teaching records
- Student feedback
- Course outcomes (CO) data
- Academic performance metrics

### Part B: Research and Development
- Research publications (papers, conferences, books)
- Citations and impact metrics
- Patents and intellectual property
- Research grants and funding
- Industry collaborations

### Part C: Self Development
- Training and workshops attended
- Certifications obtained
- Professional development activities
- Skill enhancement records

### Part D: Portfolio (Departmental & Central)
- Administrative responsibilities
- Departmental contributions
- Central committee memberships
- Leadership roles

### Part E: Extra-ordinary Contribution
- Special achievements
- Awards and recognitions
- Exceptional service contributions
- Innovation and entrepreneurship

## 🔄 Workflow

1. **Faculty Submission**: Faculty members complete and submit forms (Parts A-E)
2. **Verification**: Verification team reviews and verifies submitted data
3. **HOD Review**: Head of Department reviews and evaluates faculty
4. **Dean Evaluation**: Dean provides evaluation and interaction marks
5. **Director Approval**: Director performs final review and approval
6. **External Evaluation**: External evaluators assess assigned faculty (if applicable)
7. **Final Documentation**: System generates PDF documents for records

## 🌐 API Integration

The application connects to a backend API. Ensure the backend server is running and accessible at the URL specified in `VITE_BASE_URL`.

### API Architecture
- **HTTP Client**: Axios with interceptors for automatic token injection
- **Base URL**: Configured via `VITE_BASE_URL` environment variable
- **Error Handling**: Centralized error handling with automatic retry for transient failures
- **Request Interceptors**: Automatically adds Authorization header from localStorage
- **Response Interceptors**: Handles 401 errors with automatic logout and redirect

### Environment Variables

Create a `.env` file in the root directory:

```env
# Backend API Base URL
# Development: http://localhost:5000
# Production: https://api.yourdomain.com
VITE_BASE_URL=http://localhost:5000
```

**Important**: 
- All Vite environment variables must be prefixed with `VITE_`
- Environment variables are embedded at build time (not runtime)
- Never commit `.env` file to version control
- See `.env.example` for template (if available)

### API Service Layer
The application uses a centralized API service layer located in `src/services/api/`:
- `client.ts` - Axios instance with interceptors
- `authService.ts` - Authentication endpoints
- `formService.ts` - Form submission endpoints
- `userService.ts` - User management endpoints
- `verificationService.ts` - Verification endpoints
- `evaluationService.ts` - Evaluation endpoints

### API Endpoint Patterns
- **Authentication**: `POST /login`, `POST /send-otp`, `POST /verify-otp`, `POST /reset-user-password`
- **Form Submission**: `POST /{department}/{userId}/{formPart}` (A, B, C, D, E)
- **Status Check**: `GET /{department}/{userId}/get-status`
- **Document Generation**: `GET /{department}/{userId}/generate-doc`
- **User Management**: `GET /users`, `POST /users`, `PUT /users/:id`, `DELETE /users/:id`

For complete API documentation, see [API-DOCUMENTATION.md](./API-DOCUMENTATION.md).

## 🐛 Troubleshooting

For detailed troubleshooting information, see [TROUBLESHOOTING.md](./TROUBLESHOOTING.md).

### Quick Fixes

**Issue**: Cannot connect to backend API
- **Solution**: Verify `VITE_BASE_URL` in `.env` matches your backend server URL
- **Solution**: Ensure backend server is running and CORS is configured

**Issue**: Build fails with module errors
- **Solution**: Delete `node_modules` and `package-lock.json`, then run `npm install` again

**Issue**: Styles not loading
- **Solution**: Verify Tailwind CSS is properly configured in `tailwind.config.js`
- **Solution**: Check that `@tailwindcss/vite` plugin is included in `vite.config.js`

## 📚 Documentation

- [Installation Guide](./INSTALLATION.md) - Detailed setup instructions
- [Deployment Guide](./DEPLOYMENT.md) - Production deployment options
- [System Architecture](./SYSTEM-ARCHITECTURE.md) - Technical architecture details
- [API Documentation](./API-DOCUMENTATION.md) - Complete API endpoint reference
- [Troubleshooting Guide](./TROUBLESHOOTING.md) - Common issues and solutions
- [Project Notes](./PROJECT-NOTES.md) - Development notes and recommendations
- [Local Deployment Review](./LOCAL-DEPLOYMENT-REVIEW.md) - Architecture, design & security review for local deployment
- [Security Enhancements](./SECURITY-ENHANCEMENTS.md) - Security improvements and implementation guide

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👥 Authors

Faculty Appraisal System Development Team

## 🙏 Acknowledgments

- React team for the excellent framework
- Vite for the fast build tool
- Tailwind CSS for the utility-first CSS framework
- All contributors and testers

---

For detailed setup and deployment instructions, please refer to the [Installation Guide](./INSTALLATION.md) and [Deployment Guide](./DEPLOYMENT.md).

