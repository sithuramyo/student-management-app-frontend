import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { AdminSidebar } from "@/components/ui/admins/sidebar";
import Navbar from "@/components/ui/admins/navbar";
import { Toaster } from "sonner";
import { useErrorStore } from "@/store/errorStore";
import ApiNotFound from "@/pages/clients/ApiNotFound";
import Chat from "@/components/ui/chat";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const AdminLayout: React.FC = () => {
  const { showNotFound, notFoundMessage, clearNotFound } = useErrorStore();
  const [showChat, setShowChat] = useState(false);
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
        <main className="flex-1 overflow-y-auto p-6 relative">
          <Outlet />

          {/* Chat toggle button (floating bottom right) */}
          <div className="fixed bottom-6 right-6 z-50">
            <Button
              onClick={() => setShowChat((prev) => !prev)}
              className="rounded-full shadow-lg w-12 h-12 p-0"
              variant="secondary"
            >
              <MessageCircle className="w-6 h-6" />
            </Button>
          </div>

          {/* Conditionally show chat */}
          {showChat && (
            <div className="fixed bottom-20 right-6 z-50">
              <Chat />
            </div>
          )}
        </main>

        {showNotFound && (
          <ApiNotFound message={notFoundMessage} onClose={clearNotFound} />
        )}
      </div>
    </div>
  );
};

export default AdminLayout;
