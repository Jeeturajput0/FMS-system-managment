import React from "react";
import { Outlet } from "react-router-dom";
import TeacherSidebar from "./TeacherSidebar";
import TeacherHeader from "./TeacherHeader";


const TeacherLayout = () => {
  return (
    <div className="min-h-screen bg-slate-100">

      {/* Sidebar */}
      <TeacherSidebar />

      {/* Main Area */}
      <div className="min-h-screen md:ml-64">

        {/* Header */}
        <TeacherHeader />

        {/* Page Content */}
        <main className="p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default TeacherLayout;