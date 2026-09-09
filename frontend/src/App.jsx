import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import { AdminLayout } from "../src/feature/admin/layout/AdminLayout";

// =========================
// ADMIN PAGES
// =========================
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
import AdminReportsPage from "./feature/admin/pages/AdminReportsPage";
import AdminNotificationsPage from "./feature/admin/pages/AdminNotificationsPage";
import AdminProfilePage from "./feature/admin/pages/AdminProfilePage";
import AdminManagementPage from "./feature/admin/pages/AdminManagementPage";
import AdminSearchPage from "./feature/admin/pages/AdminSearchPage";

import { CourseAdd } from "./feature/admin/pages/CourseAdd";
import CourseModules from "./feature/admin/pages/CourseModule";
import ModuleAdd from "./feature/admin/pages/ModuleAdd";
import ModuleTopics from "./feature/admin/pages/ModuleTopics";
import TopicView from "./feature/admin/pages/TopicView";
import TopicAdd from "./feature/admin/pages/TopicAdd";

// =========================
// STUDENT ADMIN
// =========================
import { StudentDirectory } from "./feature/admin/pages/StudentDirectory";
import { StudentDetail } from "./feature/admin/pages/StudentDetail";

// =========================
// PORTAL LOGIN
// =========================
import { PortalLoginPage } from "./feature/portal/PortalLoginPage";

// =========================
// FRANCHISE
// =========================
import { FranchiseLayout } from "./feature/franchise/layout/FranchiseLayout";
import { FranchiseTeachers } from "./feature/franchise/pages/FranchiseTeachers";
import { FranchiseStudents } from "./feature/franchise/pages/FranchiseStudents";
import { FranchiseDashboard } from "./feature/franchise/pages/FranchiseDashboard";
import { FranchiseCourses } from "./feature/franchise/pages/FranchiseCourses";
import { FranchiseBatches } from "./feature/franchise/pages/FranchiseBatches";
import FranchiseBatchForm from "./feature/franchise/pages/FranchiseBatchForm";
import FranchiseAttendance from "./feature/franchise/pages/FranchiseAttendance";
import FranchiseFees from "./feature/franchise/pages/FranchiseFees";
import FranchiseSchedule from "./feature/franchise/pages/FranchiseSchedule";
import FranchiseReports from "./feature/franchise/pages/FranchiseReports";
import FranchiseSettings from "./feature/franchise/pages/FranchiseSettings";
import FranchiseStudentAdd from "./feature/franchise/pages/FranchiseStudentAdd";

// =========================
// TEACHER
// =========================
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

// =========================
// STUDENT PORTAL
// =========================
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

// ============================================================
// PROTECTED ADMIN ROUTE
// ============================================================

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
      <Navigate
        to="/login/admin"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  return <AdminLayout />;
};

// ============================================================
// PROTECTED PORTAL ROUTE
// ============================================================

const ProtectedPortalRoute = ({ role }) => {
  const location = useLocation();

  const token = localStorage.getItem("ai_scholars_token");

  const user = JSON.parse(localStorage.getItem("ai_scholars_user") || "null");

  if (!token || !user || user.role !== role) {
    return (
      <Navigate
        to="/log"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  const layouts = {
    STUDENT: StudentLayout,
    TEACHER: TeacherLayout,
    FRANCHISE: FranchiseLayout,
  };

  const Layout = layouts[role];

  return <Layout />;
};

// ============================================================
// APP
// ============================================================

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ======================================================
            PUBLIC ROUTES
        ====================================================== */}

        <Route path="/" element={<LandingPage />} />

        <Route path="/landing" element={<LandingPage />} />

        <Route path="/courses" element={<CourseCatalog />} />

        <Route path="/courses/:id" element={<CourseDetail />} />

        <Route path="/login/admin" element={<LoginPage />} />

        <Route path="/login" element={<Navigate to="/login/admin" replace />} />

        <Route path="/log" element={<PortalLoginPage />} />

        {/* ======================================================
            ADMIN ROUTES
        ====================================================== */}

        <Route path="/admin" element={<ProtectedAdminRoute />}>
          {/* Dashboard */}

          <Route index element={<DashboardOverview />} />

          <Route path="dashboard" element={<DashboardOverview />} />

          {/* ----------------------------------------------------
              FRANCHISE MANAGEMENT
          ---------------------------------------------------- */}

          <Route path="franchises" element={<FranchiseList />} />

          <Route path="franchises/add" element={<FranchiseForm />} />

          <Route path="franchises/:id" element={<FranchiseDetail />} />

          <Route path="franchises/:id/edit" element={<FranchiseForm />} />

          <Route path="franchises/batches" element={<FranchiseBatches />} />

          <Route path="franchises/teachers" element={<FranchiseTeachers />} />

          {/* ----------------------------------------------------
              COURSES
          ---------------------------------------------------- */}

          <Route path="courses" element={<CourseCatalog />} />

          <Route path="course-add" element={<CourseAdd />} />

          <Route path="courses/modules" element={<CourseModules />} />

          <Route path="courses/:courseId/modules" element={<CourseModules />} />

          <Route path="courses/modules/add" element={<ModuleAdd />} />

          <Route path="courses/:courseId/modules/add" element={<ModuleAdd />} />

          <Route path="modules/:id" element={<ModuleAdd />} />

          <Route path="modules/:id/topics" element={<ModuleTopics />} />

          <Route path="modules/:id/edit" element={<ModuleAdd />} />

          <Route path="topics/:topicId" element={<TopicView />} />

          <Route path="topics/:topicId/edit" element={<TopicAdd />} />

          <Route path="topics/add" element={<TopicAdd />} />

          <Route path="courses/edit/:id" element={<CourseAdd />} />

          <Route path="courses/:id" element={<CourseDetail />} />

          <Route path="course/:id" element={<CourseDetail />} />

          {/* ----------------------------------------------------
              STUDENTS
          ---------------------------------------------------- */}

          <Route path="students" element={<StudentDirectory />} />

          <Route path="students/:id" element={<StudentDetail />} />

          <Route path="students/:id/certificate" element={<StudentCertificate />} />

          {/* ----------------------------------------------------
              FEES
          ---------------------------------------------------- */}

          <Route path="fees" element={<FeesOverview />} />

          {/* ----------------------------------------------------
              OTHER ADMIN PAGES
          ---------------------------------------------------- */}

          <Route
            path="certificates"
            element={<AdminPlaceholderPage title="Certificates" />}
          />

          <Route
            path="notifications"
            element={<AdminNotificationsPage />}
          />

          <Route path="admins" element={<AdminManagementPage />} />

          <Route
            path="reports"
            element={<AdminReportsPage />}
          />

          <Route path="settings" element={<AdminProfilePage />} />

          <Route path="search" element={<AdminSearchPage />} />

          <Route path="profile" element={<AdminProfilePage />} />
        </Route>

        {/* ======================================================
            STUDENT ROUTES
        ====================================================== */}

        <Route
          path="/student"
          element={<ProtectedPortalRoute role="STUDENT" />}
        >
          <Route index element={<Navigate to="dashboard" replace />} />

          <Route path="dashboard" element={<StudentDashboard />} />

          <Route path="courses" element={<StudentCourses />} />

          <Route path="courses/modules" element={<StudentModules />} />

          <Route path="courses/topics" element={<StudentTopics />} />

          <Route path="courses/material" element={<StudentStudyMaterial />} />

          <Route path="courses/:id" element={<StudentCourseDetail />} />

          <Route path="assignments" element={<StudentAssignments />} />

          <Route path="assignments/pending" element={<StudentAssignments />} />

          <Route
            path="assignments/submitted"
            element={<StudentAssignments />}
          />

          <Route path="assignments/:id" element={<StudentAssignmentDetail />} />

          <Route path="tests" element={<StudentTests />} />

          <Route path="tests/attempt" element={<StudentTestAttempt />} />

          <Route path="tests/results" element={<StudentTestResults />} />

          <Route path="progress" element={<StudentProgress />} />

          <Route path="attendance" element={<StudentAttendance />} />

          <Route path="performance" element={<StudentPerformance />} />

          <Route path="fees" element={<StudentFees />} />

          <Route path="fees/history" element={<StudentPaymentHistory />} />

          <Route path="fees/pending" element={<StudentPendingFees />} />

          <Route
            path="certificate/eligibility"
            element={<StudentCertificateEligibility />}
          />

          <Route path="certificate" element={<StudentCertificate />} />

          <Route path="certificate/verify" element={<StudentCertificate />} />

          <Route path="notifications" element={<StudentNotifications />} />

          <Route path="profile" element={<StudentProfile />} />

          <Route path="settings" element={<StudentSettings />} />
        </Route>

        {/* ======================================================
            TEACHER ROUTES
        ====================================================== */}

        <Route path="/teacher" element={<TeacherLayout />}>
          <Route index element={<TeacherDashboard />} />

          <Route path="students" element={<TeacherStudents />} />

          <Route path="students/:id/certificate" element={<StudentCertificate />} />

          <Route path="courses" element={<TeacherCourses />} />

          <Route path="batches" element={<TeacherBatches />} />

          <Route path="attendance" element={<TeacherAttendance />} />

          <Route path="assignments" element={<TeacherAssignments />} />

          <Route path="exams" element={<TeacherExams />} />

          <Route path="results" element={<TeacherResults />} />

          <Route path="fees" element={<TeacherFees />} />

          <Route path="profile" element={<TeacherProfile />} />
        </Route>

        {/* ======================================================
            FRANCHISE ROUTES
        ====================================================== */}

        <Route
          path="/franchise"
          element={<ProtectedPortalRoute role="FRANCHISE" />}
        >
          <Route index element={<FranchiseDashboard />} />

          {/* STUDENTS */}

          <Route path="students" element={<FranchiseStudents />} />

          <Route path="students/:id" element={<FranchiseStudents />} />

          <Route path="students/:id/certificate" element={<StudentCertificate />} />

          <Route path="students/add" element={<FranchiseStudentAdd />} />

          <Route path="students/:id/edit" element={<FranchiseStudentAdd />} />

          {/* TEACHERS */}

          <Route path="teachers" element={<FranchiseTeachers />} />

          {/* COURSES */}

          <Route path="courses" element={<FranchiseCourses />} />

          {/* BATCHES */}

          <Route path="batches" element={<FranchiseBatches />} />

          <Route path="batches/add" element={<FranchiseBatchForm />} />

          <Route path="batches/:id" element={<FranchiseBatches />} />

          <Route path="batches/:id/edit" element={<FranchiseBatchForm />} />

          {/* ATTENDANCE */}

          <Route path="attendance" element={<FranchiseAttendance />} />

          {/* FEES */}

          <Route path="fees" element={<FranchiseFees />} />

          {/* SCHEDULE */}

          <Route path="schedule" element={<FranchiseSchedule />} />

          {/* REPORTS */}

          <Route path="reports" element={<FranchiseReports />} />

          {/* SETTINGS */}

          <Route path="settings" element={<FranchiseSettings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
