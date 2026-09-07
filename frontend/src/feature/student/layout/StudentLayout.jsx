import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import StudentSidebar from "./StudentSidebar";
import StudentHeader from "./StudentHeader";
import { StudentDataProvider } from "../context/StudentDataContext";


const StudentLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <StudentDataProvider>
      <div className="min-h-screen bg-slate-50 flex">
        <StudentSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 min-w-0">
          <StudentHeader onMenuClick={() => setSidebarOpen(true)} />
          <main className="p-4 md:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </StudentDataProvider>
  );
};

export default StudentLayout;