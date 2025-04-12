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
import Department from './pages/admin/academics/department/Department';
import CreateDepartment from './pages/admin/academics/department/CreateDepartment';
import EditDepartment from './pages/admin/academics/department/EditDepartment';
import Prerequisite from './pages/admin/academics/prerequisite/Prerequisite';
import Course from './pages/admin/academics/course/Course';
import CreateCourse from './pages/admin/academics/course/CreateCourse';
import EditCourse from './pages/admin/academics/course/EditCourse';
import CreatePrerequisite from './pages/admin/academics/prerequisite/CreatePrerequisite';
import EditPrerequisite from './pages/admin/academics/prerequisite/EditPrerequisite';

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
      { path: 'department', element: <Department /> },
      { path: 'department/create', element: <CreateDepartment /> },
      { path: 'department/edit/:id', element: <EditDepartment /> },
      { path: 'prerequisite',element: <Prerequisite/>},
      { path: 'prerequisite/create',element: <CreatePrerequisite/>},
      { path: 'prerequisite/edit/:id', element: <EditPrerequisite /> },
      { path: 'course',element: <Course/>},
      { path: 'course/edit/:id', element: <EditCourse /> },
      { path: 'course/create',element: <CreateCourse/>}
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
