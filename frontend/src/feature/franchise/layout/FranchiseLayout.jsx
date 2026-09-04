import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { FranchiseSidebar } from "./FranchiseSidebar";
import { FranchiseHeader } from "./FranchiseHeader";


export const FranchiseLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-800 antialiased">
      
      {/* Franchise Sidebar */}
      <FranchiseSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Area */}
      <div className="flex-1 min-w-0 flex flex-col lg:pl-64">

        {/* Header */}
        <FranchiseHeader
          onMenuClick={() => setSidebarOpen(true)}
        />

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>

      </div>

      {/* Toast */}
      {/* <ToastContainer /> */}

    </div>
  );
};