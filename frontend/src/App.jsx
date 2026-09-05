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
import { FeesOverview } from "./feature/admin/pages/FeesOverview";
import { AdminPlaceholderPage } from "./feature/admin/pages/AdminPlaceholderPage";
import AdminProfilePage from "./feature/admin/pages/AdminProfilePage";
import { CourseAdd } from "./feature/admin/pages/CourseAdd";
import CourseModules from "./feature/admin/pages/CourseModule";
import ModuleAdd from "./feature/admin/pages/ModuleAdd";
import TopicView from "./feature/admin/pages/TopicView";
import TopicAdd from "./feature/admin/pages/TopicAdd";
import { PortalLoginPage } from "./feature/portal/PortalLoginPage";

import { FranchiseLayout } from "./feature/franchise/layout/FranchiseLayout";
import { FranchiseStudents } from "./feature/franchise/pages/FranchiseStudents";
import { FranchiseDashboard } from "./feature/franchise/pages/FranchiseDashboard";
import { FranchiseCourses } from "./feature/franchise/pages/FranchiseCourses";
import { FranchiseBatches } from "./feature/franchise/pages/FranchiseBatches";
import FranchiseAttendance from "./feature/franchise/pages/FranchiseAttendance";
import TeacherLayout from "./feature/teacher/layout/TeacherLayout";
import TeacherDashboard from "./feature/teacher/pages/TeacherDashboard";
import TeacherStudents from "./feature/teacher/pages/TeacherStudents";
import TeacherCourses from "./feature/teacher/pages/TeacherCourses";
import TeacherBatches from "./feature/teacher/pages/TeacherBatches";
import TeacherAttendance from "./feature/teacher/pages/TeacherAttendance";
import TeacherAssignments from "./feature/teacher/pages/TeacherAssignments";
import TeacherExams from "./feature/teacher/pages/TeacherExams";
import TeacherResults from "./feature/teacher/pages/TeacherResults";
import TeacherProfile from "./feature/teacher/pages/TeacherProfile";
import TeacherFees from "./feature/teacher/pages/TeacherFees";
import FranchiseFees from "./feature/franchise/pages/FranchiseFees";
import FranchiseSchedule from "./feature/franchise/pages/FranchiseSchedule";
import FranchiseReports from "./feature/franchise/pages/FranchiseReports";
import FranchiseStudentAdd from "./feature/franchise/pages/FranchiseStudentAdd";
import StudentLayout from "./feature/student/layout/StudentLayout";
import StudentDashboard from "./feature/student/pages/StudentDashboard";
import StudentAssignments from "./feature/student/pages/StudentAssignments";
import StudentTests from "./feature/student/pages/StudentTests";
import StudentProgress from "./feature/student/pages/StudentProgress";
import StudentFees from "./feature/student/pages/StudentFees";
import StudentCourses from "./feature/student/pages/StudentCourses";
import StudentModules from "./feature/student/pages/StudentModules";
import StudentTopics from "./feature/student/pages/StudentTopics";
import StudentStudyMaterial from "./feature/student/pages/StudentStudyMaterial";
import StudentAttendance from "./feature/student/pages/StudentAttendance";
import StudentPerformance from "./feature/student/pages/StudentPerformance";
import StudentCourseDetail from "./feature/student/pages/StudentCourseDetail";
import StudentPaymentHistory from "./feature/student/pages/StudentPaymentHistory";
import StudentPendingFees from "./feature/student/pages/StudentPendingFees";
import StudentCertificate from "./feature/student/pages/StudentCertificate";
import StudentCertificateEligibility from "./feature/student/pages/StudentCertificateEligibility";
import StudentTestAttempt from "./feature/student/pages/StudentTestAttempt";
import StudentTestResults from "./feature/student/pages/StudentTestResults";
import StudentAssignmentDetail from "./feature/student/pages/StudentAssignmentDetail";
import StudentProfile from "./feature/student/pages/StudentProfile";
import StudentSettings from "./feature/student/pages/StudentSettings";
import StudentNotifications from "./feature/student/pages/StudentNotifications";

const ProtectedAdminRoute = () => {
  const location = useLocation();
  const token = localStorage.getItem("ai_scholars_token");
  const user = JSON.parse(localStorage.getItem("ai_scholars_user") || "null");

  if (
    !token ||
    !user ||
    (user.role !== "SUPER_ADMIN" && user.role !== "ADMIN")
  ) {
    return (
      <Navigate to="/login/admin" replace state={{ from: location.pathname }} />
    );
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

  const layouts = {
    STUDENT: StudentLayout,
    TEACHER: TeacherLayout,
    FRANCHISE: FranchiseLayout,
  };
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
          <Route path="settings" element={<AdminProfilePage />} />
          <Route path="profile" element={<AdminProfilePage />} />
        </Route>

        <Route path="/student" element={<ProtectedPortalRoute role="STUDENT" />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="courses" element={<StudentCourses />} />
          <Route path="courses/modules" element={<StudentModules />} />
          <Route path="courses/topics" element={<StudentTopics />} />
          <Route path="courses/material" element={<StudentStudyMaterial />} />
          <Route path="courses/:id" element={<StudentCourseDetail />} />
          <Route path="assignments" element={<StudentAssignments />} />
          <Route path="assignments/:id" element={<StudentAssignmentDetail />} />
          <Route path="assignments/pending" element={<StudentAssignments />} />
          <Route path="assignments/submitted" element={<StudentAssignments />} />
          <Route path="tests" element={<StudentTests />} />
          <Route path="tests/attempt" element={<StudentTestAttempt />} />
          <Route path="tests/results" element={<StudentTestResults />} />
          <Route path="progress" element={<StudentProgress />} />
          <Route path="attendance" element={<StudentAttendance />} />
          <Route path="performance" element={<StudentPerformance />} />
          <Route path="fees" element={<StudentFees />} />
          <Route path="fees/history" element={<StudentPaymentHistory />} />
          <Route path="fees/pending" element={<StudentPendingFees />} />
          <Route path="certificate/eligibility" element={<StudentCertificateEligibility />} />
          <Route path="certificate" element={<StudentCertificate />} />
          <Route path="certificate/verify" element={<StudentCertificate />} />
          <Route path="notifications" element={<StudentNotifications />} />
          <Route path="profile" element={<StudentProfile />} />
          <Route path="settings" element={<StudentSettings />} />
        </Route>
      {/* =========================
            TEACHER
        ========================= */}

        <Route path="/teacher" element={<TeacherLayout />}>
          <Route index element={<TeacherDashboard />} />
          <Route path="students" element={<TeacherStudents />} />
          <Route path="courses" element={<TeacherCourses />} />
          <Route path="batches" element={<TeacherBatches />} />
          <Route path="attendance" element={<TeacherAttendance />} />
          <Route path="assignments" element={<TeacherAssignments />} />
          <Route path="exams" element={<TeacherExams />} />
          <Route path="results" element={<TeacherResults />} />
          <Route path="fees" element={<TeacherFees />} />
          <Route path="profile" element={<TeacherProfile />} />
        </Route>
        <Route path="/franchise" element={<FranchiseLayout />}>
          <Route index element={<FranchiseDashboard />} />

          <Route path="students" element={<FranchiseStudents />} />
          <Route path="students/add" element={<FranchiseStudentAdd />} />
          <Route path="students/:id/edit" element={<FranchiseStudentAdd />} />
          <Route path="students/:id" element={<StudentDetail />} />
          <Route path="courses" element={<FranchiseCourses />} />
          <Route path="batches" element={<FranchiseBatches />} />
          <Route path="attendance" element={<FranchiseAttendance />} />
          <Route path="fees" element={<FranchiseFees />} />
          <Route path="schedule" element={<FranchiseSchedule />} />
          <Route path="reports" element={<FranchiseReports />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
