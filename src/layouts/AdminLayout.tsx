import React from 'react';
import { Outlet } from 'react-router-dom';

const AdminLayout: React.FC = () => (
  <div>
    <header>Admin Header</header>
    <main><Outlet/></main>
  </div>
);

export default AdminLayout;
