import { createBrowserRouter, Navigate } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import StudentLayout from './layouts/StudentLayout';
import FacultyLayout from './layouts/FacultyLayout';

import Dashboard from './pages/admin/Dashboard';
import Home from './pages/student/Home';
import Panel from './pages/faculty/Panel';
import ProtectedRoute from './components/clients/ProtectedRoute';
import Unauthorized from './pages/clients/Unauthorized';
import NotFound from './pages/clients/NotFound';
import AuthLayout from './layouts/AuthLayout';
import AuthClient from './components/clients/auth/AuthClient';
import { loginLoader } from './loaders/loginLoader';
import Department from './pages/admin/academics/departments/Department';
import CreateDepartment from './pages/admin/academics/departments/CreateDepartment';
import EditDepartment from './pages/admin/academics/departments/EditDepartment';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <AuthClient />, loader: loginLoader },
    ],
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute allowedRoles={['Admin', 'SuperAdmin']}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'departments', element: <Department /> },
      { path: 'departments/create', element: <CreateDepartment /> },
      { path: 'departments/edit/:id', element: <EditDepartment /> }
    ],
  },
  {
    path: '/student',
    element: (
      <ProtectedRoute allowedRoles={['Student']}>
        <StudentLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: 'home', element: <Home /> },
    ],
  },
  {
    path: '/faculty',
    element: (
      <ProtectedRoute allowedRoles={['Faculty']}>
        <FacultyLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: 'panel', element: <Panel /> },
    ],
  },
  {
    path: '/unauthorized',
    element: <Unauthorized />,
  },
  {
    path: '*',
    element: <NotFound />,
  }
]);
