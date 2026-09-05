import React from "react";
import { Outlet } from "react-router-dom";
import StudentSidebar from "./StudentSidebar";
import StudentHeader from "./StudentHeader";


const StudentLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex">

      {/* Sidebar */}
      <StudentSidebar />

      {/* Main Area */}
      <div className="flex-1 min-w-0">

        {/* Header */}
        <StudentHeader />

        {/* Page Content */}
        <main className="p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default StudentLayout;