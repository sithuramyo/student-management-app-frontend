import React from 'react';
import { Outlet } from 'react-router-dom';

const FacultyLayout: React.FC = () => (
  <div>
    <header>Faculty Header</header>
    <main><Outlet/></main>
  </div>
);

export default FacultyLayout;
