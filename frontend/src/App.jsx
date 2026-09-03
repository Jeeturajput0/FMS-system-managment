import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { AdminLayout } from "../src/feature/admin/layout/AdminLayout";

import { DashboardOverview } from "./feature/admin/pages/DashboardOverview";
import { CourseCatalog } from "./feature/admin/pages/CourseCatalog";
import { CourseDetail } from "./feature/admin/pages/CourseDetail";
import { LoginPage } from "./feature/admin/pages/LoginPage";
import LandingPage from "./feature/admin/pages/LandingPage";
import { FranchiseList } from "./feature/admin/pages/FranchiseList";
import { FranchiseDetail } from "./feature/admin/pages/FranchiseDetail";
import FranchiseForm from "./feature/admin/pages/FranchiseForm";
import { StudentDirectory } from "./feature/admin/pages/StudentDirectory";
import { StudentDetail } from "./feature/admin/pages/StudentDetail";
import { FeesOverview } from "./feature/admin/pages/FeesOverview";
import { AdminPlaceholderPage } from "./feature/admin/pages/AdminPlaceholderPage";
import { CourseAdd } from "./feature/admin/pages/CourseAdd";
import CourseModules from "./feature/admin/pages/CourseModule";
import ModuleAdd from "./feature/admin/pages/ModuleAdd";
import TopicView from "./feature/admin/pages/TopicView";
import TopicAdd from "./feature/admin/pages/TopicAdd";

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
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/landing" element={<LandingPage />} />

        <Route path="/admin" element={<ProtectedAdminRoute />}>
          <Route index element={<DashboardOverview />} />
          <Route path="dashboard" element={<DashboardOverview />} />
          <Route path="franchises" element={<FranchiseList />} />
          <Route path="franchises/add" element={<FranchiseForm />} />
          <Route path="franchises/:id" element={<FranchiseDetail />} />
          <Route path="franchises/:id/edit" element={<FranchiseForm />} />
          <Route path="courses" element={<CourseCatalog />} />
          <Route path="course-add" element={<CourseAdd />} />
          <Route path="courses/modules" element={<CourseModules />} />
          <Route path="courses/:courseId/modules" element={<CourseModules />} />
          <Route path="courses/modules/add" element={<ModuleAdd />} />
          <Route path="courses/:courseId/modules/add" element={<ModuleAdd />} />
          <Route path="modules/:id" element={<ModuleAdd />} />
          <Route path="modules/:id/edit" element={<ModuleAdd />} />
          <Route path="topics/:topicId" element={<TopicView />} />
          <Route path="topics" element={<TopicAdd />} />
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
