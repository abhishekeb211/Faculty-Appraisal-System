import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Sidebar from "./components/layout/Sidebar";
import Navbar from "./components/layout/Navbar";
import ResearchPublications from "./components/forms/ResearchPublications";
import Profile from "./components/profile/Profile";
import { FormProvider } from "./context/FormContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Menu, Verified } from "lucide-react";
import LoginPage from "./components/LoginPage";
import SplashScreen from "./components/SplashScreen";
import TeachingPerformance from "./components/forms/TempTeachingPerfomance";
// import TeachingPerformanceWithProvider from "./components/forms/TeachingPerformance";
import FacultyAdminPanel from "./components/adminpage/FacultyAdminPanel";
import SelfDevelopment from "./components/forms/SelfDevelopment";
import Research from "./components/forms/Research";
import Portfolio from "./components/forms/Portfolio";
import Dashboard from "./components/forms/Dashboard";
import SubmissionStatus from "./components/forms/SubmissionStatus";
import Review from "./components/forms/Review";
import VerificationTeam from "./components/adminpage/VerificationTeam";
import AddFaculty from "./components/adminpage/AddFaculty";
import FacultyList from "./components/adminpage/FacultyList";
import FacultyFormsList from "./components/HOD/FacultyFormsList"; // Import the component

import HODverify from "./components/HOD/HODverify";
import HODcnfverify from "./components/HOD/ConfirmVerify";
import VerificationPanel from "./components/HOD/VerificationPanel";
import Verify from "./components/Verification/Verify";
import VerificationForm from "./components/Verification/VerificationForm";
import AssociateDeansList from "./components/Dean/AssociateDeansList";
import DeanEvaluationForm from "./components/Dean/DeanEvaluationForm";
// Import the new component
import AddExternalFaculty from "./components/HOD/AddExternalFaculty";
import AddExternal from "./components/Director/AddExternal";
// Import the new component
import AssignFacultyToExternal from "./components/HOD/AssignFacultyToExternal";
import AssignExternal from "./components/Director/AssignExternal";
// Import the external dashboard component

import CollegeExternalDashboard from "./components/CollegeExternal/CollegeExternalDashboard";
import Extra from "./components/forms/Extra";
import EvaluateFacultyPage from "./components/External/EvaluateFacultyPage";
import EvaluateAuthoritiesPage from "./components/CollegeExternal/EvaluateAuthoritiesPage";
import AssignFacultyToVerificationTeam from "./components/adminpage/AssignFacultyToVerificationTeam";
import HODForms from "./components/Director/HODForms";
import DeanForms from "./components/Director/DeanForms";
import FacultyForms from "./components/Director/FacultyForms";
import AssignDeanToDepartment from "./components/adminpage/AssignDeanToDepartment";
import Interactionmarks from "./components/Dean/Interactionmarks";
import Interactionevaluation from "./components/Dean/Interactionevaluation";
import HODInteractionEvaluation from "./components/HOD/HODInteractionEvaluation";
import DirectorInteractionEvaluation from "./components/Director/DirectorInteractionEvaluation";
import FinalMarks from "./components/HOD/FinalMarks";
import ConfirmDirectorVerify from "./components/Director/ConfirmVerifybyDirector";
import DirectorVerify from "./components/Director/DirectorVerify";
import ResetPassword from "./components/ResetPassword";
// Add this to your routes configuration
import Summary from "./components/adminpage/Summary";
import ExternalDashboard from "./components/External/ExternalDashboard";

// Protected Route component
// eslint-disable-next-line react/prop-types
// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, userRole } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Redirect to dashboard if role doesn't match
    return <Navigate to="/dashboard" />;
  }

  return children;
};

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated, userRole } = useAuth(); // Make sure you get userRole from your auth context
  const [showSplash, setShowSplash] = useState(!isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 3500); // Show splash screen for 3.5 seconds

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

  if (showSplash && !isAuthenticated) {
    return <SplashScreen />;
  }

  return (
    <FormProvider>
      <div className="min-h-screen bg-gray-50">
        {isAuthenticated && userRole !== "external" && (
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        )}
        <div
          className={
            isAuthenticated && userRole !== "external" ? "lg:ml-64" : ""
          }
        >
          {isAuthenticated && (
            <Navbar onMenuClick={() => setSidebarOpen(true)} />
          )}
          <main className={isAuthenticated ? "p-4 lg:p-6 mt-16" : ""}>
            {isAuthenticated ? (
              <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-sm p-4 lg:p-6">
                <Routes>
                  <Route path="/login" element={<Navigate to="/dashboard" />} />
                  <Route
                    path="/submission-status"
                    element={<SubmissionStatus />}
                  />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/teaching"
                    element={
                      <ProtectedRoute allowedRoles={['Faculty']}>
                        <TeachingPerformance />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/research"
                    element={
                      <ProtectedRoute allowedRoles={['Faculty']}>
                        <Research />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/selfdevelopment"
                    element={
                      <ProtectedRoute allowedRoles={['Faculty']}>
                        <SelfDevelopment />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/portfolio"
                    element={
                      <ProtectedRoute allowedRoles={['Faculty']}>
                        <Portfolio />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/extra"
                    element={
                      <ProtectedRoute allowedRoles={['Faculty']}>
                        <Extra />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/review"
                    element={
                      <ProtectedRoute allowedRoles={['Faculty']}>
                        <Review />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/hod/faculty-forms-list"
                    element={
                      <ProtectedRoute allowedRoles={['HOD', 'Dean', 'Director']}>
                        <FacultyFormsList />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/hodverify"
                    element={
                      <ProtectedRoute allowedRoles={['HOD', 'Dean', 'Director']}>
                        <HODverify />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/hodcnfverify"
                    element={
                      <ProtectedRoute allowedRoles={['HOD', 'Dean', 'Director']}>
                        <HODcnfverify />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/hod/final-marks"
                    element={
                      <ProtectedRoute allowedRoles={['HOD', 'Dean', 'Director']}>
                        <FinalMarks />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dean/associate-dean-list"
                    element={
                      <ProtectedRoute allowedRoles={['Dean', 'Director']}>
                        <AssociateDeansList />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/dean-evaluation/:department/:facultyId"
                    element={
                      <ProtectedRoute allowedRoles={['Dean', 'Director']}>
                        <DeanEvaluationForm />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dean/give-interaction-marks"
                    element={
                      <ProtectedRoute allowedRoles={['Dean', 'Director']}>
                        <Interactionmarks />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/dean-evaluate/:facultyId"
                    element={
                      <ProtectedRoute allowedRoles={['Dean', 'Director']}>
                        <Interactionevaluation />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/hod-evaluate/:facultyId"
                    element={
                      <ProtectedRoute allowedRoles={['HOD', 'Dean', 'Director']}>
                        <HODInteractionEvaluation />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/paper-verification/givemarks/:department/:facultyId"
                    element={
                      <ProtectedRoute allowedRoles={['Verification Team']}>
                        <VerificationForm />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/hod/department-review"
                    element={
                      <ProtectedRoute allowedRoles={['HOD', 'Dean', 'Director']}>
                        <VerificationPanel />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/paper-verification/verify"
                    element={
                      <ProtectedRoute allowedRoles={['Verification Team']}>
                        <Verify />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/hod/add-external-faculty"
                    element={
                      <ProtectedRoute allowedRoles={['HOD', 'Dean', 'Director']}>
                        <AddExternalFaculty />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/hod/assign-faculty-external"
                    element={
                      <ProtectedRoute allowedRoles={['HOD', 'Dean', 'Director']}>
                        <AssignFacultyToExternal />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/external/give-marks"
                    element={
                      <ProtectedRoute allowedRoles={['external']}>
                        <ExternalDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/evaluate-faculty/:facultyId"
                    element={
                      <ProtectedRoute allowedRoles={['external']}>
                        <EvaluateFacultyPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/director/hod-forms"
                    element={
                      <ProtectedRoute allowedRoles={['Director']}>
                        <HODForms />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/director/dean-forms"
                    element={
                      <ProtectedRoute allowedRoles={['Director']}>
                        <DeanForms />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/director/faculty-forms"
                    element={
                      <ProtectedRoute allowedRoles={['Director']}>
                        <FacultyForms />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/ConfirmVerifybyDirector"
                    element={
                      <ProtectedRoute allowedRoles={['Director']}>
                        <ConfirmDirectorVerify />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/DirectorVerify"
                    element={
                      <ProtectedRoute allowedRoles={['Director']}>
                        <DirectorVerify />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/director/add-external"
                    element={
                      <ProtectedRoute allowedRoles={['Director']}>
                        <AddExternal />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/director/assign-external"
                    element={
                      <ProtectedRoute allowedRoles={['Director']}>
                        <AssignExternal />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/director-evaluate/:facultyId"
                    element={
                      <ProtectedRoute allowedRoles={['Director']}>
                        <DirectorInteractionEvaluation />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/director/external/give-marks"
                    element={
                      <ProtectedRoute allowedRoles={['Director']}>
                        <CollegeExternalDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/evaluate-authority/:facultyId"
                    element={
                      <ProtectedRoute allowedRoles={['external']}>
                        <EvaluateAuthoritiesPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route
                    path="/admin/add-faculty"
                    element={
                      <ProtectedRoute allowedRoles={['Admin']}>
                        <AddFaculty />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/faculty-list"
                    element={
                      <ProtectedRoute allowedRoles={['Admin']}>
                        <FacultyList />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/summary"
                    element={
                      <ProtectedRoute allowedRoles={['Admin']}>
                        <Summary />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/verification-team"
                    element={
                      <ProtectedRoute allowedRoles={['Admin']}>
                        <VerificationTeam />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/assign-faculty-to-verification-team"
                    element={
                      <ProtectedRoute allowedRoles={['Admin']}>
                        <AssignFacultyToVerificationTeam />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/assign-dean-to-department"
                    element={
                      <ProtectedRoute allowedRoles={['Admin']}>
                        <AssignDeanToDepartment />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin"
                    element={<Navigate to="/admin/add-faculty" />}
                  />
                  <Route path="/" element={<Navigate to="/profile" />} />
                </Routes>
              </div>
            ) : (
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                {/* Admin routes moved to protected section */}
                <Route path="/*" element={<Navigate to="/login" />} />
              </Routes>
            )}
          </main>
        </div>
      </div>
    </FormProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
