import React from 'react';
import { Outlet } from 'react-router-dom';

const StudentLayout: React.FC = () => (
  <div>
    <header>Student Header</header>
    <main><Outlet/></main>
  </div>
);

export default StudentLayout;
