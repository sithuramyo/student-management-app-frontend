import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link, useLocation } from "react-router-dom";
import { navbarItems } from "@/constants/admins/navbar";
import { useMemo } from "react";

const capitalize = (text: string) =>
  text.charAt(0).toUpperCase() + text.slice(1);

const Navbar = () => {
  const location = useLocation();

  const breadcrumbs = useMemo(() => {
    const path = location.pathname;
    const segments = path.split("/").filter(Boolean); // e.g., ["admin", "departments", "edit", "123"]
    const matched: { label: string; path?: string }[] = [];

    for (const item of navbarItems) {
      if (item.isDropdown && item.children) {
        const child = item.children.find((c) => path.startsWith(c.path));
        if (child) {
          matched.push({ label: item.label });
          matched.push({ label: child.label, path: child.path });

          const tail = segments[segments.length - 1];
          const secondLast = segments[segments.length - 2];

          if (secondLast === "edit") {
            matched.push({ label: "Edit" });
          } else if (tail === "create") {
            matched.push({ label: "Create" });
          }

          return matched;
        }
      } else if (item.path && path.startsWith(item.path)) {
        matched.push({ label: item.label, path: item.path });

        const tail = segments[segments.length - 1];
        const secondLast = segments[segments.length - 2];

        if (secondLast === "edit") {
          matched.push({ label: "Edit" });
        } else if (tail === "create") {
          matched.push({ label: "Create" });
        }

        return matched;
      }
    }

    return matched;
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-40 bg-white/20 backdrop-blur-md border-b border-white/30 shadow-sm w-full">
      <div className="px-6 py-3 flex items-center justify-between h-16">
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((item, index) => (
              <div key={index} className="flex items-center">
                {index > 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem>
                  {index === breadcrumbs.length - 1 ? (
                    <BreadcrumbPage className="text-sm font-semibold text-gray-900 dark:text-white">
                      {item.label}
                    </BreadcrumbPage>
                  ) : item.path ? (
                    <Link
                      to={item.path}
                      className="hover:underline text-sm text-gray-800 dark:text-gray-200"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {item.label}
                    </span>
                  )}
                </BreadcrumbItem>
              </div>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
};

export default Navbar;
