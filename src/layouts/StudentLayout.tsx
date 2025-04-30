import Navbar from '@/components/ui/students/navbar';
import React from 'react';
import { Outlet } from 'react-router-dom';

const StudentLayout: React.FC = () => (
  <div className="min-h-screen bg-gray-50">
    <Navbar />
    <main className="p-6">
      <Outlet />
    </main>
  </div>
);

export default StudentLayout;
