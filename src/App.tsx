import { useState, useEffect, lazy, Suspense, ReactNode } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Sidebar from "./components/layout/Sidebar";
import Navbar from "./components/layout/Navbar";
import { FormProvider } from "./context/FormContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ErrorBoundary from "./components/ErrorBoundary";
import RouteLoader from "./components/common/RouteLoader";

// Lazy load all route components
const LoginPage = lazy(() => import("./components/LoginPage"));
const SplashScreen = lazy(() => import("./components/SplashScreen"));
const Dashboard = lazy(() => import("./components/forms/Dashboard"));
const Profile = lazy(() => import("./components/profile/Profile"));
const TeachingPerformance = lazy(() => import("./components/forms/TempTeachingPerfomance"));
const Research = lazy(() => import("./components/forms/Research"));
const SelfDevelopment = lazy(() => import("./components/forms/SelfDevelopment"));
const Portfolio = lazy(() => import("./components/forms/Portfolio"));
const Extra = lazy(() => import("./components/forms/Extra"));
const Review = lazy(() => import("./components/forms/Review"));
const SubmissionStatus = lazy(() => import("./components/forms/SubmissionStatus"));
const ResetPassword = lazy(() => import("./components/ResetPassword"));

// Admin components
const AddFaculty = lazy(() => import("./components/adminpage/AddFaculty"));
const FacultyList = lazy(() => import("./components/adminpage/FacultyList"));
const Summary = lazy(() => import("./components/adminpage/Summary"));
const VerificationTeam = lazy(() => import("./components/adminpage/VerificationTeam"));
const AssignFacultyToVerificationTeam = lazy(() => import("./components/adminpage/AssignFacultyToVerificationTeam"));
const AssignDeanToDepartment = lazy(() => import("./components/adminpage/AssignDeanToDepartment"));

// HOD components
const FacultyFormsList = lazy(() => import("./components/HOD/FacultyFormsList"));
const HODverify = lazy(() => import("./components/HOD/HODverify"));
const HODcnfverify = lazy(() => import("./components/HOD/ConfirmVerify"));
const VerificationPanel = lazy(() => import("./components/HOD/VerificationPanel"));
const AddExternalFaculty = lazy(() => import("./components/HOD/AddExternalFaculty"));
const AssignFacultyToExternal = lazy(() => import("./components/HOD/AssignFacultyToExternal"));
const HODInteractionEvaluation = lazy(() => import("./components/HOD/HODInteractionEvaluation"));
const FinalMarks = lazy(() => import("./components/HOD/FinalMarks"));

// Dean components
const AssociateDeansList = lazy(() => import("./components/Dean/AssociateDeansList"));
const DeanEvaluationForm = lazy(() => import("./components/Dean/DeanEvaluationForm"));
const Interactionmarks = lazy(() => import("./components/Dean/Interactionmarks"));
const Interactionevaluation = lazy(() => import("./components/Dean/Interactionevaluation"));

// Director components
const HODForms = lazy(() => import("./components/Director/HODForms"));
const DeanForms = lazy(() => import("./components/Director/DeanForms"));
const FacultyForms = lazy(() => import("./components/Director/FacultyForms"));
const AddExternal = lazy(() => import("./components/Director/AddExternal"));
const AssignExternal = lazy(() => import("./components/Director/AssignExternal"));
const DirectorInteractionEvaluation = lazy(() => import("./components/Director/DirectorInteractionEvaluation"));
const ConfirmDirectorVerify = lazy(() => import("./components/Director/ConfirmVerifybyDirector"));
const DirectorVerify = lazy(() => import("./components/Director/DirectorVerify"));

// External components
const ExternalDashboard = lazy(() => import("./components/External/ExternalDashboard"));
const EvaluateFacultyPage = lazy(() => import("./components/External/EvaluateFacultyPage"));
const CollegeExternalDashboard = lazy(() => import("./components/CollegeExternal/CollegeExternalDashboard"));
const EvaluateAuthoritiesPage = lazy(() => import("./components/CollegeExternal/EvaluateAuthoritiesPage"));

// Verification components
const Verify = lazy(() => import("./components/Verification/Verify"));
const VerificationForm = lazy(() => import("./components/Verification/VerificationForm"));

// Protected Route component
interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
};

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated, userRole } = useAuth();
  const [showSplash, setShowSplash] = useState(!isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 3500);

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

  if (showSplash && !isAuthenticated) {
    return (
      <Suspense fallback={<RouteLoader />}>
        <SplashScreen />
      </Suspense>
    );
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
            <Suspense fallback={<RouteLoader />}>
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
                        <ProtectedRoute>
                          <TeachingPerformance />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/research"
                      element={
                        <ProtectedRoute>
                          <Research />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/selfdevelopment"
                      element={
                        <ProtectedRoute>
                          <SelfDevelopment />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/portfolio"
                      element={
                        <ProtectedRoute>
                          <Portfolio />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/extra"
                      element={
                        <ProtectedRoute>
                          <Extra />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/review"
                      element={
                        <ProtectedRoute>
                          <Review />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/hod/faculty-forms-list"
                      element={
                        <ProtectedRoute>
                          <FacultyFormsList />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/hodverify"
                      element={
                        <ProtectedRoute>
                          <HODverify />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/hodcnfverify"
                      element={
                        <ProtectedRoute>
                          <HODcnfverify />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/hod/final-marks"
                      element={
                        <ProtectedRoute>
                          <FinalMarks />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/dean/associate-dean-list"
                      element={
                        <ProtectedRoute>
                          <AssociateDeansList />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/dean-evaluation/:department/:facultyId"
                      element={
                        <ProtectedRoute>
                          <DeanEvaluationForm />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/dean/give-interaction-marks"
                      element={
                        <ProtectedRoute>
                          <Interactionmarks />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/dean-evaluate/:facultyId"
                      element={
                        <ProtectedRoute>
                          <Interactionevaluation />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/hod-evaluate/:facultyId"
                      element={
                        <ProtectedRoute>
                          <HODInteractionEvaluation />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/paper-verification/givemarks/:department/:facultyId"
                      element={
                        <ProtectedRoute>
                          <VerificationForm />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/hod/department-review"
                      element={
                        <ProtectedRoute>
                          <VerificationPanel />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/paper-verification/verify"
                      element={
                        <ProtectedRoute>
                          <Verify />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/hod/add-external-faculty"
                      element={
                        <ProtectedRoute>
                          <AddExternalFaculty />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/hod/assign-faculty-external"
                      element={
                        <ProtectedRoute>
                          <AssignFacultyToExternal />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/external/give-marks"
                      element={
                        <ProtectedRoute>
                          <ExternalDashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/evaluate-faculty/:facultyId"
                      element={
                        <ProtectedRoute>
                          <EvaluateFacultyPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/director/hod-forms"
                      element={
                        <ProtectedRoute>
                          <HODForms />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/director/dean-forms"
                      element={
                        <ProtectedRoute>
                          <DeanForms />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/director/faculty-forms"
                      element={
                        <ProtectedRoute>
                          <FacultyForms />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/ConfirmVerifybyDirector"
                      element={
                        <ProtectedRoute>
                          <ConfirmDirectorVerify />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/DirectorVerify"
                      element={
                        <ProtectedRoute>
                          <DirectorVerify />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/director/add-external"
                      element={
                        <ProtectedRoute>
                          <AddExternal />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/director/assign-external"
                      element={
                        <ProtectedRoute>
                          <AssignExternal />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/director-evaluate/:facultyId"
                      element={
                        <ProtectedRoute>
                          <DirectorInteractionEvaluation />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/director/external/give-marks"
                      element={
                        <ProtectedRoute>
                          <CollegeExternalDashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/evaluate-authority/:facultyId"
                      element={
                        <ProtectedRoute>
                          <EvaluateAuthoritiesPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/" element={<Navigate to="/profile" />} />
                  </Routes>
                </div>
              ) : (
                <Routes>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/admin/add-faculty" element={<AddFaculty />} />
                  <Route path="/admin/faculty-list" element={<FacultyList />} />
                  <Route path="/admin/summary" element={<Summary />} />
                  <Route
                    path="/admin/verification-team"
                    element={<VerificationTeam />}
                  />
                  <Route
                    path="/admin/assign-faculty-to-verification-team"
                    element={<AssignFacultyToVerificationTeam />}
                  />
                  <Route
                    path="/admin/assign-dean-to-department"
                    element={<AssignDeanToDepartment />}
                  />
                  <Route
                    path="/admin"
                    element={<Navigate to="/admin/add-faculty" />}
                  />
                  <Route path="" element={<FacultyFormsList />} />
                  <Route path="/*" element={<Navigate to="/login" />} />
                </Routes>
              )}
            </Suspense>
          </main>
        </div>
      </div>
    </FormProvider>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;

