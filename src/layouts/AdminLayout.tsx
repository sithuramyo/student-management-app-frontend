import React from "react";
import { Outlet } from "react-router-dom";
import { AdminSidebar } from "@/components/ui/admins/sidebar";
import Navbar from "@/components/ui/admins/navbar";
import { Toaster } from "sonner";
import { useErrorStore } from "@/store/errorStore";
import ApiNotFound from "@/pages/clients/ApiNotFound";

const AdminLayout: React.FC = () => {
  const { showNotFound, notFoundMessage, clearNotFound } = useErrorStore();
  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-b from-[#b2afaf] via-[#f0f0f0] to-white">
      {/* Sidebar stays fixed */}
      <AdminSidebar />
      <Toaster />
      {/* Main content container */}
      <div className="flex flex-col flex-1">
        {/* Navbar stays fixed */}
        <div className="sticky top-0 z-40">
          <Navbar />
        </div>

        {/* Scrollable main content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>

        {showNotFound && (
          <ApiNotFound message={notFoundMessage} onClose={clearNotFound} />
        )}
      </div>
    </div>
  );
};

export default AdminLayout;
