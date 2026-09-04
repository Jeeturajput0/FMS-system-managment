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
import { PortalLoginPage } from "./feature/portal/PortalLoginPage";
import { StudentLayout } from "./feature/student/layout/StudentLayout";
import { TeacherLayout } from "./feature/teacher/layout/TeacherLayout";
import { FranchiseLayout } from "./feature/franchise/layout/FranchiseLayout";
import { StudentDashboard } from "./feature/student/pages/StudentDashboard";
import { TeacherDashboard } from "./feature/teacher/pages/TeacherDashboard";
import { FranchiseDashboard } from "./feature/franchise/pages/FranchiseDashboard";
import { StudentCourses as StudentCoursePage, StudentFees as StudentFeePage, StudentProfile as StudentProfilePage, StudentPlaceholder as StudentModulePage } from "./feature/student/pages/StudentSections";
import { TeacherCourses, TeacherStudents, TeacherPlaceholder } from "./feature/teacher/pages/TeacherSections";
import { FranchiseStudents, FranchiseCourses, FranchiseFees, FranchisePlaceholder } from "./feature/franchise/pages/FranchiseSections";

const ProtectedAdminRoute = () => {
  const location = useLocation();
  const token = localStorage.getItem("ai_scholars_token");
  const user = JSON.parse(localStorage.getItem("ai_scholars_user") || "null");

  if (
    !token ||
    !user ||
    (user.role !== "SUPER_ADMIN" && user.role !== "ADMIN")
  ) {
    return <Navigate to="/login/admin" replace state={{ from: location.pathname }} />;
  }

  return <AdminLayout />;
};

const ProtectedPortalRoute = ({ role }) => {
  const location = useLocation();
  const token = localStorage.getItem("ai_scholars_token");
  const user = JSON.parse(localStorage.getItem("ai_scholars_user") || "null");

  if (!token || !user || user.role !== role) {
    return <Navigate to="/log" replace state={{ from: location.pathname }} />;
  }

  const layouts = { STUDENT: StudentLayout, TEACHER: TeacherLayout, FRANCHISE: FranchiseLayout };
  const Layout = layouts[role];
  return <Layout />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/courses" element={<CourseCatalog />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/login/admin" element={<LoginPage />} />
        <Route path="/login" element={<Navigate to="/login/admin" replace />} />
        <Route path="/log" element={<PortalLoginPage />} />
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

        <Route path="/student" element={<ProtectedPortalRoute role="STUDENT" />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="courses/*" element={<StudentCoursePage />} />
          <Route path="assignments/*" element={<StudentModulePage title="Assignments" />} />
          <Route path="tests/*" element={<StudentModulePage title="Tests & Exams" />} />
          <Route path="progress/*" element={<StudentModulePage title="My Progress" />} />
          <Route path="fees/*" element={<StudentFeePage />} />
          <Route path="certificate/*" element={<StudentModulePage title="Certificate" />} />
          <Route path="notifications" element={<StudentModulePage title="Notifications" />} />
          <Route path="profile" element={<StudentProfilePage />} />
          <Route path="settings" element={<StudentModulePage title="Settings" />} />
        </Route>
        <Route path="/teacher" element={<ProtectedPortalRoute role="TEACHER" />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<TeacherDashboard />} />
          <Route path="courses/*" element={<TeacherCourses />} />
          <Route path="batches/*" element={<TeacherPlaceholder title="My Batches" />} />
          <Route path="students/*" element={<TeacherStudents />} />
          <Route path="attendance/*" element={<TeacherPlaceholder title="Attendance" />} />
          <Route path="assignments/*" element={<TeacherPlaceholder title="Assignments" />} />
          <Route path="tests/*" element={<TeacherPlaceholder title="Tests" />} />
          <Route path="performance/*" element={<TeacherPlaceholder title="Performance" />} />
          <Route path="announcements" element={<TeacherPlaceholder title="Announcements" />} />
          <Route path="profile" element={<TeacherPlaceholder title="My Profile" />} />
          <Route path="settings" element={<TeacherPlaceholder title="Settings" />} />
        </Route>
        <Route path="/franchise" element={<ProtectedPortalRoute role="FRANCHISE" />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<FranchiseDashboard />} />
          <Route path="students/*" element={<FranchiseStudents />} />
          <Route path="teachers/*" element={<FranchisePlaceholder title="Teachers" />} />
          <Route path="courses/*" element={<FranchiseCourses />} />
          <Route path="batches/*" element={<FranchisePlaceholder title="Batches" />} />
          <Route path="attendance/*" element={<FranchisePlaceholder title="Attendance" />} />
          <Route path="fees/*" element={<FranchiseFees />} />
          <Route path="reports" element={<FranchisePlaceholder title="Reports" />} />
          <Route path="notifications" element={<FranchisePlaceholder title="Notifications" />} />
          <Route path="profile" element={<FranchisePlaceholder title="My Profile" />} />
          <Route path="settings" element={<FranchisePlaceholder title="Settings" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
