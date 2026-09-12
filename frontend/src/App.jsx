import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import { useEffect, useState } from "react";

import { sanitizeNameInput } from "./utils/name";
import { apiFetch } from "./utils/api";

// ============================================================
// ADMIN LAYOUT
// ============================================================

import { AdminLayout } from "../src/feature/admin/layout/AdminLayout";

// ============================================================
// ADMIN PAGES
// ============================================================

import { CourseCatalog } from "./feature/admin/pages/CourseCatalog";
import { LoginPage } from "./feature/admin/pages/LoginPage";
import LandingPage from "./feature/admin/pages/LandingPage";

import { CourseDetail } from "./feature/admin/pages/CourseDetail";

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

// ============================================================
// STUDENT ADMIN
// ============================================================

import { StudentDirectory } from "./feature/admin/pages/StudentDirectory";
import { StudentDetail } from "./feature/admin/pages/StudentDetail";

// ============================================================
// PORTAL LOGIN
// ============================================================

import { PortalLoginPage } from "./feature/portal/PortalLoginPage";
import PortalCourseDetail from "./feature/portal/PortalCourseDetail";
import PortalModuleTopics from "./feature/portal/PortalModuleTopics";
import PortalTopicDetail from "./feature/portal/PortalTopicDetail";

// ============================================================
// FRANCHISE
// ============================================================

import { FranchiseLayout } from "./feature/franchise/layout/FranchiseLayout";
import { FranchiseTeachers } from "./feature/franchise/pages/FranchiseTeachers";
import FranchiseTeacherView from "./feature/franchise/pages/FranchiseTeacherView";
import { FranchiseStudents } from "./feature/franchise/pages/FranchiseStudents";
import { FranchiseDashboard } from "./feature/franchise/pages/FranchiseDashboard";
import { FranchiseCourses } from "./feature/franchise/pages/FranchiseCourses";
import { FranchiseBatches } from "./feature/franchise/pages/FranchiseBatches";

import FranchiseBatchStudents from "./feature/franchise/pages/FranchiseBatchStudents";
import FranchiseBatchForm from "./feature/franchise/pages/FranchiseBatchForm";
import FranchiseBatchView from "./feature/franchise/pages/FranchiseBatchView";

import FranchiseAttendance from "./feature/franchise/pages/FranchiseAttendance";
import FranchiseFees from "./feature/franchise/pages/FranchiseFees";
import FranchiseSchedule from "./feature/franchise/pages/FranchiseSchedule";
import FranchiseReports from "./feature/franchise/pages/FranchiseReports";
import FranchiseSettings from "./feature/franchise/pages/FranchiseSettings";

import FranchiseStudentAdd from "./feature/franchise/pages/FranchiseStudentAdd";
import FranchiseStudentView from "./feature/franchise/pages/FranchiseStudentView";

// ============================================================
// TEACHER
// ============================================================

import TeacherLayout from "./feature/teacher/layout/TeacherLayout";
import TeacherDashboard from "./feature/teacher/pages/TeacherDashboard";
import TeacherStudents from "./feature/teacher/pages/TeacherStudents";
import TeacherBatches from "./feature/teacher/pages/TeacherBatches";
import TeacherAttendance from "./feature/teacher/pages/TeacherAttendance";
import TeacherAssignments from "./feature/teacher/pages/TeacherAssignments";
import TeacherExams from "./feature/teacher/pages/TeacherExams";
import TeacherResults from "./feature/teacher/pages/TeacherResults";
import TeacherProfile from "./feature/teacher/pages/TeacherProfile";
import TeacherCourses from "./feature/teacher/pages/TeacherCourses";

// ============================================================
// STUDENT PORTAL
// ============================================================

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

import { DashboardOverview } from "./feature/admin/pages/DashboardOverview";

/* ============================================================
   PROTECTED ADMIN ROUTE
============================================================ */

const ProtectedAdminRoute = () => {
  const location = useLocation();

  const token = localStorage.getItem("ai_scholars_token");

  const user = JSON.parse(
    localStorage.getItem("ai_scholars_user") || "null"
  );

  if (
    !token ||
    !user ||
    (user.role !== "SUPER_ADMIN" &&
      user.role !== "ADMIN")
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

/* ============================================================
   PROTECTED PORTAL ROUTE
============================================================ */

const ProtectedPortalRoute = ({ role }) => {
  const location = useLocation();

  const token = localStorage.getItem("ai_scholars_token");

  const user = JSON.parse(
    localStorage.getItem("ai_scholars_user") || "null"
  );

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

  if (!Layout) {
    return <Navigate to="/log" replace />;
  }

  return <Layout />;
};

/* ============================================================
   NAME INPUT GUARD
============================================================ */

function NameInputGuard() {
  useEffect(() => {
    const nameFields = new Set([
      "name",
      "ownerName",
      "fatherName",
      "motherName",
      "franchiseName",
      "studentName",
      "teacherName",
      "adminName",
    ]);

    const handleInput = (event) => {
      const input = event.target;

      if (
        !input?.matches?.("input, textarea") ||
        !nameFields.has(input.name)
      ) {
        return;
      }

      const sanitized = sanitizeNameInput(input.value);

      if (sanitized !== input.value) {
        input.value = sanitized;
      }
    };

    document.addEventListener(
      "input",
      handleInput,
      true
    );

    return () => {
      document.removeEventListener(
        "input",
        handleInput,
        true
      );
    };
  }, []);

  return null;
}

/* ============================================================
   RESPONSIVE DATA TABLES

   Existing dashboard tables remain the desktop source of truth.
   This adapter reads their column headings and attaches labels to
   each cell, allowing the shared mobile CSS to present every row as
   an accessible, labelled card without duplicating data or actions.
============================================================ */

function ResponsiveTableCards() {
  useEffect(() => {
    const enhanceTables = () => {
      document.querySelectorAll("table").forEach((table) => {
        const headings = Array.from(table.tHead?.querySelectorAll("th") || [])
          .map((heading) => heading.textContent.replace(/\s+/g, " ").trim());

        if (!headings.length || !table.tBodies.length) return;

        table.classList.add("responsive-data-table");

        Array.from(table.tBodies).flatMap((body) => Array.from(body.rows)).forEach((row) => {
          const cells = Array.from(row.querySelectorAll(":scope > td"));
          const isEmptyState = cells.length === 1 && Number(cells[0].colSpan) > 1;

          row.toggleAttribute("data-mobile-empty", isEmptyState);
          cells.forEach((cell, index) => {
            cell.dataset.label = isEmptyState ? "" : headings[index] || "Details";
          });
        });
      });
    };

    enhanceTables();
    const observer = new MutationObserver(enhanceTables);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return null;
}

/* ============================================================
   APP
============================================================ */

function App() {
  const [, setAuthVersion] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("ai_scholars_token");
    if (!token) return undefined;
    let active = true;
    apiFetch("/api/auth/me")
      .then((response) => {
        if (active && response.user) {
          localStorage.setItem("ai_scholars_user", JSON.stringify(response.user));
          setAuthVersion((version) => version + 1);
        }
      })
      .catch(() => active && setAuthVersion((version) => version + 1));
    const onExpired = () => setAuthVersion((version) => version + 1);
    window.addEventListener("ai-scholars-auth-expired", onExpired);
    return () => {
      active = false;
      window.removeEventListener("ai-scholars-auth-expired", onExpired);
    };
  }, []);

  return (
    <BrowserRouter>
      <NameInputGuard />
      <ResponsiveTableCards />

      <Routes>

        {/* ======================================================
            PUBLIC ROUTES
        ====================================================== */}

        <Route
          path="/"
          element={<LandingPage />}
        />

        <Route
          path="/landing"
          element={<LandingPage />}
        />

        <Route
          path="/courses"
          element={<CourseCatalog />}
        />

        {/* Public course detail disabled */}
        <Route
          path="/courses/:id"
          element={<Navigate to="/log" replace />}
        />

        {/* Admin Login */}
        <Route
          path="/login/admin"
          element={<LoginPage />}
        />

        {/* Admin Registration */}
        <Route
          path="/register/admin"
          element={<LoginPage isRegister />}
        />

        {/* Main login */}
        <Route
          path="/login"
          element={
            <Navigate
              to="/login/admin"
              replace
            />
          }
        />

        {/* Portal Login */}
        <Route
          path="/log"
          element={<PortalLoginPage />}
        />


        {/* ======================================================
            ADMIN ROUTES
        ====================================================== */}

        <Route
          path="/admin"
          element={<ProtectedAdminRoute />}
        >

          {/* Dashboard */}

          <Route
            index
            element={<DashboardOverview />}
          />

          <Route
            path="dashboard"
            element={<DashboardOverview />}
          />


          {/* ==================================================
              FRANCHISE MANAGEMENT
          ================================================== */}

          <Route
            path="franchises"
            element={<FranchiseList />}
          />

          <Route
            path="franchises/add"
            element={<FranchiseForm />}
          />

          <Route
            path="franchises/:id"
            element={<FranchiseDetail />}
          />

          <Route
            path="franchises/:id/edit"
            element={<FranchiseForm />}
          />

          <Route
            path="franchises/batches"
            element={<FranchiseBatches />}
          />

          <Route
            path="franchises/teachers"
            element={<FranchiseTeachers />}
          />


          {/* ==================================================
              COURSES
          ================================================== */}

          <Route
            path="courses"
            element={<CourseCatalog />}
          />

          <Route
            path="course-add"
            element={<CourseAdd />}
          />

          <Route
            path="courses/modules"
            element={<CourseModules />}
          />

          <Route
            path="courses/:courseId/modules"
            element={<CourseModules />}
          />

          <Route
            path="courses/modules/add"
            element={<ModuleAdd />}
          />

          <Route
            path="courses/:courseId/modules/add"
            element={<ModuleAdd />}
          />

          <Route
            path="modules/:id"
            element={<ModuleAdd />}
          />

          <Route
            path="modules/:id/topics"
            element={<ModuleTopics />}
          />

          <Route
            path="modules/:id/edit"
            element={<ModuleAdd />}
          />

          <Route
            path="topics/:topicId"
            element={<TopicView />}
          />

          <Route
            path="topics/:topicId/edit"
            element={<TopicAdd />}
          />

          <Route
            path="topics/add"
            element={<TopicAdd />}
          />

          <Route
            path="courses/edit/:id"
            element={<CourseAdd />}
          />

          {/* Admin Course Detail */}
          <Route
            path="courses/:id"
            element={<CourseDetail />}
          />

          <Route
            path="course/:id"
            element={<CourseDetail />}
          />


          {/* ==================================================
              STUDENTS
          ================================================== */}

          <Route
            path="students"
            element={<StudentDirectory />}
          />

          <Route
            path="students/:id"
            element={<StudentDetail />}
          />

          <Route
            path="students/:id/certificate"
            element={<StudentCertificate />}
          />


          {/* ==================================================
              FEES
          ================================================== */}

          <Route
            path="fees"
            element={<FeesOverview />}
          />


          {/* ==================================================
              OTHER ADMIN PAGES
          ================================================== */}

          <Route
            path="certificates"
            element={
              <AdminPlaceholderPage
                title="Certificates"
              />
            }
          />

          <Route
            path="notifications"
            element={<AdminNotificationsPage />}
          />

          <Route
            path="admins"
            element={<AdminManagementPage />}
          />

          <Route
            path="reports"
            element={<AdminReportsPage />}
          />

          <Route
            path="settings"
            element={<AdminProfilePage />}
          />

          <Route
            path="search"
            element={<AdminSearchPage />}
          />

          <Route
            path="profile"
            element={<AdminProfilePage />}
          />

        </Route>


        {/* ======================================================
            STUDENT ROUTES
        ====================================================== */}

        <Route
          path="/student"
          element={
            <ProtectedPortalRoute
              role="STUDENT"
            />
          }
        >

          <Route
            index
            element={
              <Navigate
                to="dashboard"
                replace
              />
            }
          />

          <Route
            path="dashboard"
            element={<StudentDashboard />}
          />

          <Route
            path="courses"
            element={<StudentCourses />}
          />

          <Route
            path="courses/modules"
            element={<StudentModules />}
          />

          <Route
            path="courses/topics"
            element={<StudentTopics />}
          />

          <Route
            path="courses/material"
            element={<StudentStudyMaterial />}
          />

          <Route
            path="courses/:id"
            element={<StudentCourseDetail />}
          />

          <Route path="courses/:courseId/modules/:moduleId/topics" element={<PortalModuleTopics />} />
          <Route path="courses/:courseId/modules/:moduleId/topics/:topicId" element={<PortalTopicDetail />} />

          <Route
            path="assignments"
            element={<StudentAssignments />}
          />

          <Route
            path="assignments/pending"
            element={<StudentAssignments />}
          />

          <Route
            path="assignments/submitted"
            element={<StudentAssignments />}
          />

          <Route
            path="assignments/:id"
            element={<StudentAssignmentDetail />}
          />

          <Route
            path="tests"
            element={<StudentTests />}
          />

          <Route
            path="tests/attempt"
            element={<StudentTestAttempt />}
          />

          <Route
            path="tests/results"
            element={<StudentTestResults />}
          />

          <Route
            path="progress"
            element={<StudentProgress />}
          />

          <Route
            path="attendance"
            element={<StudentAttendance />}
          />

          <Route
            path="performance"
            element={<StudentPerformance />}
          />

          <Route
            path="fees"
            element={<StudentFees />}
          />

          <Route
            path="fees/history"
            element={<StudentPaymentHistory />}
          />

          <Route
            path="fees/pending"
            element={<StudentPendingFees />}
          />

          <Route
            path="certificate/eligibility"
            element={
              <StudentCertificateEligibility />
            }
          />

          <Route
            path="certificate"
            element={<StudentCertificate />}
          />

          <Route
            path="certificate/verify"
            element={<StudentCertificate />}
          />

          <Route
            path="notifications"
            element={<StudentNotifications />}
          />

          <Route
            path="profile"
            element={<StudentProfile />}
          />

          <Route
            path="settings"
            element={<StudentSettings />}
          />

        </Route>


        {/* ======================================================
            TEACHER ROUTES
        ====================================================== */}

        <Route
          path="/teacher"
          element={<ProtectedPortalRoute role="TEACHER" />}
        >

          {/* Dashboard */}

          <Route
            index
            element={<TeacherDashboard />}
          />


          {/* Students */}

          <Route
            path="students"
            element={<TeacherStudents />}
          />

          <Route
            path="students/:id/certificate"
            element={<StudentCertificate />}
          />


          {/* ==================================================
              TEACHER COURSES
          ================================================== */}

          <Route
            path="courses"
            element={<TeacherCourses />}
          />

          {/* ⭐ FULL COURSE DETAIL WITH TEACHER SIDEBAR */}

          <Route
            path="courses/:id"
            element={<PortalCourseDetail />}
          />

          <Route path="courses/:courseId/modules/:moduleId/topics" element={<PortalModuleTopics />} />
          <Route path="courses/:courseId/modules/:moduleId/topics/:topicId" element={<PortalTopicDetail />} />


          {/* Batches */}

          <Route
            path="batches"
            element={<TeacherBatches />}
          />


          {/* Attendance */}

          <Route
            path="attendance"
            element={<TeacherAttendance />}
          />


          {/* Assignments */}

          <Route
            path="assignments"
            element={<TeacherAssignments />}
          />


          {/* Exams */}

          <Route
            path="exams"
            element={<TeacherExams />}
          />


          {/* Results */}

          <Route
            path="results"
            element={<TeacherResults />}
          />


          {/* Profile */}

          <Route
            path="profile"
            element={<TeacherProfile />}
          />

        </Route>


        {/* ======================================================
            FRANCHISE ROUTES
        ====================================================== */}

        <Route
          path="/franchise"
          element={
            <ProtectedPortalRoute
              role="FRANCHISE"
            />
          }
        >

          {/* Dashboard */}

          <Route
            index
            element={<FranchiseDashboard />}
          />


          {/* ==================================================
              STUDENTS
          ================================================== */}

          <Route
            path="students"
            element={<FranchiseStudents />}
          />

          <Route
            path="students/:id"
            element={<FranchiseStudentView />}
          />

          <Route
            path="students/:id/certificate"
            element={<StudentCertificate />}
          />

          <Route
            path="students/add"
            element={<FranchiseStudentAdd />}
          />

          <Route
            path="students/:id/edit"
            element={<FranchiseStudentAdd />}
          />


          {/* ==================================================
              TEACHERS
          ================================================== */}

          <Route
            path="teachers"
            element={<FranchiseTeachers />}
          />

          <Route
            path="teachers/:id"
            element={<FranchiseTeacherView />}
          />


          {/* ==================================================
              COURSES
          ================================================== */}

          <Route
            path="courses"
            element={<FranchiseCourses />}
          />

          <Route
            path="courses/:id"
            element={<PortalCourseDetail />}
          />

          <Route path="courses/:courseId/modules/:moduleId/topics" element={<PortalModuleTopics />} />
          <Route path="courses/:courseId/modules/:moduleId/topics/:topicId" element={<PortalTopicDetail />} />


          {/* ==================================================
              BATCHES
          ================================================== */}

          <Route
            path="batches"
            element={<FranchiseBatches />}
          />

          <Route
            path="batches/students"
            element={<FranchiseBatchStudents />}
          />

          <Route
            path="batches/add"
            element={<FranchiseBatchForm />}
          />

          <Route
            path="batches/:id"
            element={<FranchiseBatchView />}
          />

          <Route
            path="batches/:id/edit"
            element={<FranchiseBatchForm />}
          />


          {/* ==================================================
              ATTENDANCE
          ================================================== */}

          <Route
            path="attendance"
            element={<FranchiseAttendance />}
          />


          {/* ==================================================
              FEES
          ================================================== */}

          <Route
            path="fees"
            element={<FranchiseFees />}
          />


          {/* ==================================================
              SCHEDULE
          ================================================== */}

          <Route
            path="schedule"
            element={<FranchiseSchedule />}
          />


          {/* ==================================================
              REPORTS
          ================================================== */}

          <Route
            path="reports"
            element={<FranchiseReports />}
          />


          {/* ==================================================
              SETTINGS
          ================================================== */}

          <Route
            path="settings"
            element={<FranchiseSettings />}
          />

        </Route>


        {/* ======================================================
            FALLBACK
        ====================================================== */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
