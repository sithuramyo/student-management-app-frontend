import Navbar from '@/components/ui/students/navbar';
import React from 'react';
import { Outlet } from 'react-router-dom';

const FacultyLayout: React.FC = () => (
  <div>
    <Navbar />
    <main><Outlet/></main>
  </div>
);

export default FacultyLayout;
