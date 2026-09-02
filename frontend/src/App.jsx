import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import { AdminLayout } from "./components/AdminLayout";
import { DashboardOverview } from "./pages/DashboardOverview";

// Add these imports according to your actual file locations
import CourseCatalog from "./pages/CourseCatalog";
import CourseDetail from "./pages/CourseDetail";
import LoginPage from "./pages/LoginPage";
import LandingPage from "./pages/LandingPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Home />} />

        <Route path="/courses" element={<CourseCatalog />} />
        <Route path="/courses/:courseId" element={<CourseDetail />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/profile" element={<ProfilePage />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>

          {/* /admin */}
          <Route index element={<DashboardOverview />} />

          {/* /admin/dashboard */}
          <Route
            path="dashboard"
            element={<DashboardOverview />}
          />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;