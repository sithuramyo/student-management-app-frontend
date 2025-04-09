export const navbarItems: NavbarMenuItem[] = [
    {
        id: 1,
        label: "Dashboard",
        path: "/admin/dashboard",
    },
    {
        id: 2,
        label: "Academics",
        isDropdown: true,
        children: [
            { id: 1, label: "Department", path: "/admin/departments" }
        ]
    }

]