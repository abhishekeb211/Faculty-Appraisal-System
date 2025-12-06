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

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.0.0 | UI Framework |
| Vite | 6.1.0 | Build Tool & Dev Server |
| React Router DOM | 7.1.5 | Client-side Routing |
| Tailwind CSS | 4.0.5 | Styling Framework |
| Axios | 1.7.9 | HTTP Client |
| Framer Motion | 12.5.0 | Animation Library |
| Lucide React | 0.475.0 | Icon Library |
| React Icons | 5.5.0 | Additional Icons |
| React Hot Toast | 2.5.2 | Toast Notifications |
| js-cookie | 3.0.5 | Cookie Management |

### Development Tools
- ESLint 9.20.0 - Code Linting
- Prettier 3.5.0 - Code Formatting
- PostCSS 8.5.1 - CSS Processing
- Autoprefixer 10.4.20 - CSS Vendor Prefixing

## 📁 Project Structure

```
Faculty-Appraisal-System/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/
│   │   ├── logo.png
│   │   └── react.svg
│   ├── components/
│   │   ├── adminpage/          # Admin panel components
│   │   ├── CollegeExternal/     # College external evaluator views
│   │   ├── Dean/                # Dean-specific components
│   │   ├── Director/            # Director-specific components
│   │   ├── External/             # External evaluator views
│   │   ├── forms/                # Main appraisal forms (A-E)
│   │   ├── HOD/                  # HOD-specific components
│   │   ├── layout/               # Layout components (Navbar, Sidebar)
│   │   ├── profile/              # User profile management
│   │   ├── Verification/         # Verification team components
│   │   ├── verfication_team/     # Alternative verification components
│   │   ├── LoginPage.jsx         # Authentication page
│   │   ├── ResetPassword.jsx     # Password reset functionality
│   │   └── SplashScreen.jsx     # Application splash screen
│   ├── context/
│   │   ├── AuthContext.jsx       # Authentication state management
│   │   ├── FormContext.jsx       # Form data state management
│   │   └── CourseContext.jsx     # Course data management
│   ├── App.jsx                   # Main application component
│   ├── main.jsx                  # Application entry point
│   └── index.css                 # Global styles
├── .gitignore
├── eslint.config.js              # ESLint configuration
├── index.html                    # HTML template
├── package.json                  # Dependencies and scripts
├── tailwind.config.js            # Tailwind CSS configuration
└── vite.config.js                # Vite configuration
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
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint to check code quality |

## 🔐 Authentication

### Default Admin Credentials
- **Username**: `admin2025`
- **Password**: `admin2025`

### User Login
Regular users authenticate via the backend API using their user ID and password. The system supports:
- Standard login
- OTP-based password reset
- Session management via localStorage

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

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_BASE_URL=http://localhost:5000
```

**Important**: 
- All Vite environment variables must be prefixed with `VITE_`
- Environment variables are embedded at build time
- Never commit sensitive data in environment variables
- See `.env.example` for template

### API Endpoint Patterns
- Authentication: `POST /login`
- Form Submission: `POST /{department}/{userId}/{formPart}`
- Status Check: `GET /{department}/{userId}/get-status`
- Document Generation: `GET /{department}/{userId}/generate-doc`

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

