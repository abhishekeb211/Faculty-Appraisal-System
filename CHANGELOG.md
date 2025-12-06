# Changelog

All notable changes to the Faculty Appraisal System will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Comprehensive API documentation (API-DOCUMENTATION.md)
- Detailed troubleshooting guide (TROUBLESHOOTING.md)
- Enhanced system architecture documentation
- Environment variable template (.env.example)
- User role support in AuthContext
- Detailed component relationship diagrams
- Enhanced installation verification steps

### Fixed
- AuthContext now provides userRole from localStorage userData
- CourseContext now uses import.meta.env.VITE_BASE_URL instead of process.env.BASE_URL
- Missing userRole causing undefined errors in App.jsx
- Inconsistent API URL usage across components

### Changed
- Enhanced README.md with additional sections and documentation links
- Updated SYSTEM-ARCHITECTURE.md with detailed flow diagrams
- Improved INSTALLATION.md with comprehensive verification steps
- Updated PROJECT-NOTES.md with current analysis findings

### Documentation
- Added API-DOCUMENTATION.md with complete endpoint reference
- Added TROUBLESHOOTING.md with common issues and solutions
- Enhanced SYSTEM-ARCHITECTURE.md with component relationships
- Updated all documentation files with cross-references

## [0.0.0] - Initial Release

### Added
- Initial project setup with React 19.0.0 and Vite 6.1.0
- Authentication system with login/logout
- Multi-part form system (Parts A-E)
- Role-based access control
- Dashboard for all user roles
- Form submission workflow
- Verification system
- External evaluator support
- Admin panel
- HOD, Dean, Director interfaces
- Profile management
- Password reset functionality
- Document generation
- Status tracking

### Features
- **Form Parts:**
  - Part A: Teaching Performance
  - Part B: Research and Development
  - Part C: Self Development
  - Part D: Portfolio (Departmental & Central)
  - Part E: Extra-ordinary Contribution

- **User Roles:**
  - Faculty
  - HOD (Head of Department)
  - Dean
  - Director
  - External Evaluator
  - Verification Team
  - Admin

- **Technologies:**
  - React 19.0.0
  - Vite 6.1.0
  - React Router DOM 7.1.5
  - Tailwind CSS 4.0.5
  - Axios 1.7.9
  - Framer Motion 12.5.0
  - React Hot Toast 2.5.2

---

## Version History

### Version Format
- **Major.Minor.Patch** (e.g., 1.2.3)
- **Major**: Breaking changes
- **Minor**: New features (backward compatible)
- **Patch**: Bug fixes (backward compatible)

### Release Types
- **Unreleased**: Changes in development
- **Stable**: Production-ready releases
- **Beta**: Pre-release testing versions
- **Alpha**: Early development versions

---

## Notes

- This changelog is maintained manually
- All dates are in YYYY-MM-DD format
- Breaking changes are clearly marked
- Migration guides are provided for major version updates

---

**Last Updated**: Current Date  
**Maintained By**: Development Team

For detailed information about specific changes, refer to:
- [README.md](./README.md) - Project overview
- [PROJECT-NOTES.md](./PROJECT-NOTES.md) - Development notes
- [SYSTEM-ARCHITECTURE.md](./SYSTEM-ARCHITECTURE.md) - Technical details

