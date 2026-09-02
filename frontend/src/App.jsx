import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import { AdminLayout } from "./components/AdminLayout";
import { DashboardOverview } from "./pages/DashboardOverview";
import { CourseCatalog } from "./pages/CourseCatalog";
import { CourseDetail } from "./pages/CourseDetail";
import { LoginPage } from "./pages/LoginPage";
import LandingPage from "./pages/LandingPage";
import { FranchiseList } from "./pages/FranchiseList";
import { FranchiseDetail } from "./pages/FranchiseDetail";
import { StudentDirectory } from "./pages/StudentDirectory";
import { StudentDetail } from "./pages/StudentDetail";
import { FeesOverview } from "./pages/FeesOverview";
import { AdminPlaceholderPage } from "./pages/AdminPlaceholderPage";
import { CourseAdd } from "./pages/CourseAdd";
import CourseModules from "./pages/CourseModule";
import ModuleAdd from "./pages/ModuleAdd";

const ProtectedAdminRoute = () => {
  const location = useLocation();
  const token = localStorage.getItem("ai_scholars_token");
  const user = JSON.parse(localStorage.getItem("ai_scholars_user") || "null");

  if (
    !token ||
    !user ||
    (user.role !== "SUPER_ADMIN" && user.role !== "ADMIN")
  ) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <AdminLayout />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/courses" element={<CourseCatalog />} />
        <Route path="/courses/:courseId" element={<CourseDetail />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/landing" element={<LandingPage />} />

        <Route path="/admin" element={<ProtectedAdminRoute />}>
          <Route index element={<DashboardOverview />} />
          <Route path="dashboard" element={<DashboardOverview />} />
          <Route path="franchises" element={<FranchiseList />} />
          <Route path="franchises/:id" element={<FranchiseDetail />} />
          <Route path="courses" element={<CourseCatalog />} />
          <Route path="course-add" element={<CourseAdd />} />
          <Route path="courses/modules" element={<CourseModules />} />
          <Route path="courses/:courseId/modules/add" element={<ModuleAdd />} />
          <Route path="courses/:id/edit" element={<CourseAdd />} />
          <Route path="courses/:id" element={<CourseDetail />} />
          <Route path="students" element={<StudentDirectory />} />
          <Route path="students/:id" element={<StudentDetail />} />
          <Route path="fees" element={<FeesOverview />} />
          <Route
            path="certificates"
            element={<AdminPlaceholderPage title="Certificates" />}
          />
          <Route
            path="notifications"
            element={<AdminPlaceholderPage title="Notifications" />}
          />
          <Route
            path="admins"
            element={<AdminPlaceholderPage title="Admins" />}
          />
          <Route
            path="reports"
            element={<AdminPlaceholderPage title="Reports" />}
          />
          <Route
            path="settings"
            element={<AdminPlaceholderPage title="Settings" />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
