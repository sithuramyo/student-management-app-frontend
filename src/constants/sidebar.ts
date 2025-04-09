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
      { id: 1, label: "Users", path: "/admin/users" },
      { id: 2, label: "Settings", path: "/admin/settings" },
    ],
  },
  {
    id: 3,
    label: "Academics",
    icon: GraduationCap,
    isDropdown: true,
    children: [
      { id: 1, label: "Department", path: "/admin/departments" }
    ]
  }
];
