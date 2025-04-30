export const navbarItems: NavbarMenuItem[] = [
    {
        id: 1,
        label: "Dashboard",
        path: "/admin/dashboard",
    },
    {
        id: 2,
        label: "Platform Users",
        isDropdown: true,
        children: [
            { id: 1, label: "System User", path: "/admin/system-user" },
            { id: 2, label: "Student", path: "/admin/student" },
            { id: 3, label: "Faculty", path: "/admin/faculty" }
        ]
    },
    {
        id: 3,
        label: "Academics",
        isDropdown: true,
        children: [
            { id: 1, label: "Department", path: "/admin/department" },
            { id: 2, label: "Prerequisite", path: "/admin/prerequisite" },
            { id: 3, label: "Course", path: "/admin/course" },
            { id: 4, label: "Course Offering", path: "/admin/course-offering" },
            { id: 5, label: "Academic Terms", path: "/admin/academic-term" }
        ]
    }

]