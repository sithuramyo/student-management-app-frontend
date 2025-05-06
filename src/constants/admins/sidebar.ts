import { GraduationCap, LayoutDashboard, Users } from "lucide-react";

export const sidebarItems: SidebarMenuItem[] = [
  {
    id: 1,
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    id: 2,
    label: "Platform Users",
    icon: Users,
    isDropdown: true,
    children: [
      { id: 1, label: "System User", path: "/admin/system-user" },
      { id: 2, label: "Student", path: "/admin/student" },
      { id: 3, label: "Faculty", path: "/admin/faculty" }
    ],
  },
  {
    id: 3,
    label: "Academics",
    icon: GraduationCap,
    isDropdown: true,
    children: [
      { id: 1, label: "Academic Terms", path: "/admin/academic-term" },
      { id: 2, label: "Course", path: "/admin/course" },
      { id: 3, label: "Course Offering", path: "/admin/course-offering" },
      { id: 4, label: "Class Schedule", path: "/admin/class-schedule" },
      { id: 5, label: "Department", path: "/admin/department" },
      { id: 6, label: "Prerequisite", path: "/admin/prerequisite" },
    ]
  }
];
