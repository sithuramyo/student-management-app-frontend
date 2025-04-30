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
import Student from './pages/admin/platformusers/student/Student';
import CreateStudent from './pages/admin/platformusers/student/CreateStudent';
import SystemUser from './pages/admin/platformusers/systemuser/SystemUser';
import CreateSystemUser from './pages/admin/platformusers/systemuser/CreateSystemUser';
import EditSystemUser from './pages/admin/platformusers/systemuser/EditSystemUser';
import AcademicTerm from './pages/admin/academics/academicterms/AcademicTerm';
import CreateAcademicTerm from './pages/admin/academics/academicterms/CreateAcademicTerm';
import EditAcademicTerm from './pages/admin/academics/academicterms/EditAcademicTerm';
import CreateFaculty from './pages/admin/academics/faculties/CreateFaculty';
import CourseOffering from './pages/admin/academics/courseofferings/CourseOffering';
import Faculty from './pages/admin/academics/faculties/Faculty';
import CreateCourseOffering from './pages/admin/academics/courseofferings/CreateCourseOffering';

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
      { path: 'academic-term', element: <AcademicTerm /> },
      { path: 'academic-term/create', element: <CreateAcademicTerm /> },
      { path: 'academic-term/edit/:id', element: <EditAcademicTerm /> },
      { path: 'department/create', element: <CreateDepartment /> },
      { path: 'department/edit/:id', element: <EditDepartment /> },
      { path: 'prerequisite', element: <Prerequisite /> },
      { path: 'prerequisite/create', element: <CreatePrerequisite /> },
      { path: 'prerequisite/edit/:id', element: <EditPrerequisite /> },
      { path: 'course', element: <Course /> },
      { path: 'course/create', element: <CreateCourse /> },
      { path: 'course/edit/:id', element: <EditCourse /> },
      { path: 'course-offering', element: <CourseOffering /> },
      { path: 'course-offering/create', element: <CreateCourseOffering /> },
      { path: 'system-user', element: <SystemUser /> },
      { path: 'system-user/create', element: <CreateSystemUser /> },
      { path: 'system-user/edit/:id', element: <EditSystemUser /> },
      { path: 'student', element: <Student /> },
      { path: 'student/create', element: <CreateStudent /> },
      { path: 'faculty', element: <Faculty /> },
      { path: 'faculty/create', element: <CreateFaculty /> }
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
