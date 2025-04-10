import {
  ArrowLeftFromLine,
  ArrowRightFromLine,
  ChevronDown,
  ChevronRight,
  Dot,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { sidebarItems } from "@/constants/sidebar";

export const AdminSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const user = {
    name: "Martin Globe",
    email: "martin@example.com",
    image: null,
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  const getRandomColor = () => {
    const colors = [
      "bg-red-500",
      "bg-green-500",
      "bg-blue-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
    ];
    return colors[user.name.charCodeAt(0) % colors.length];
  };

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  const toggleDropdown = (id: number) =>
    setOpenDropdown(openDropdown === id ? null : id);

  useEffect(() => {
    setOpenDropdown(null);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const dropdownVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: { staggerChildren: 0.05, duration: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  const isActive = (path?: string) =>
    path && location.pathname.startsWith(path);

  return (
    <aside
      className={`bg-white/30 backdrop-blur-md shadow-inner border-r border-gray-300 text-black h-screen transition-[width] duration-300 flex flex-col justify-between ${
        isCollapsed ? "w-[80px]" : "w-64"
      } shrink-0 z-40`}
    >
      <div>
        {/* Logo/Header */}
        <div className="px-4 pt-4 pb-2">
          <div
            className={`flex items-center ${
              isCollapsed ? "justify-center" : "justify-between"
            }`}
          >
            <Link to="/" className="flex items-center gap-5">
              <div className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center overflow-hidden">
                <img
                  src="/studify.png"
                  alt="Studify"
                  className="w-8 h-8 object-contain"
                />
              </div>
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="text-lg font-semibold tracking-wide"
                  >
                    Studify
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
            <button
              onClick={toggleSidebar}
              className="text-gray-600 hover:text-black transition-colors ml-1"
            >
              {isCollapsed ? <ArrowRightFromLine size={24} /> : <ArrowLeftFromLine size={24} />}
            </button>
          </div>
        </div>

        <div className="border-b border-gray-200 my-3" />

        {/* Nav */}
        <nav>
          <ul className="space-y-2 relative px-2">
            {sidebarItems.map((item) => (
              <li key={item.id} className="relative">
                {item.isDropdown ? (
                  <>
                    <button
                      className={`flex items-center w-full gap-4 px-3 py-2 rounded transition group ${
                        openDropdown === item.id
                          ? "bg-[#9db582] text-green-900"
                          : "hover:bg-green-50"
                      }`}
                      onClick={() => toggleDropdown(item.id)}
                      aria-expanded={openDropdown === item.id}
                    >
                      <item.icon className="shrink-0" />
                      <AnimatePresence>
                        {!isCollapsed && (
                          <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                            className="flex-1 text-left"
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                      {!isCollapsed &&
                        (openDropdown === item.id ? (
                          <ChevronDown size={16} />
                        ) : (
                          <ChevronRight size={16} />
                        ))}
                    </button>

                    {/* Expanded dropdown */}
                    {!isCollapsed && openDropdown === item.id && (
                      <AnimatePresence>
                        <motion.ul
                          className="ml-4 pl-2 mt-1 border-l border-gray-300 space-y-1"
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          variants={dropdownVariants}
                        >
                          {item.children?.map((child) => (
                            <motion.li key={child.id} variants={itemVariants}>
                              <Link
                                to={child.path}
                                className={`flex items-center gap-2 px-3 py-2 rounded transition ${
                                  isActive(child.path)
                                    ? "bg-[#9db582] text-white"
                                    : "hover:bg-green-100 text-gray-800"
                                }`}
                              >
                                <Dot size={18} />
                                {child.label}
                              </Link>
                            </motion.li>
                          ))}
                        </motion.ul>
                      </AnimatePresence>
                    )}

                    {/* Collapsed dropdown */}
                    {isCollapsed && openDropdown === item.id && (
                      <AnimatePresence>
                        <motion.div
                          ref={dropdownRef}
                          initial={{ opacity: 0, x: -10, scale: 0.95 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          exit={{ opacity: 0, x: -10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute left-full top-1 z-50"
                        >
                          <div className="ml-2 bg-white border border-gray-300 shadow-xl rounded-lg w-56">
                            <ul className="p-2 space-y-1">
                              {item.children?.map((child) => (
                                <li key={child.id}>
                                  <Link
                                    to={child.path}
                                    className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-green-100 text-gray-800 transition-all whitespace-nowrap text-sm"
                                  >
                                    <Dot size={18} />
                                    <span>{child.label}</span>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </motion.div>
                      </AnimatePresence>
                    )}
                  </>
                ) : (
                  <Link
                    to={item.path || "#"}
                    className={`flex items-center gap-4 px-3 py-2 rounded transition ${
                      isActive(item.path)
                        ? "bg-[#9db582] text-white"
                        : "hover:bg-green-100 text-gray-800"
                    }`}
                    title={isCollapsed ? item.label : ""}
                  >
                    <item.icon className="shrink-0" />
                    <AnimatePresence>
                      {!isCollapsed && (
                        <motion.span
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* User Info Footer */}
      <div className="p-4 border-t border-gray-200 flex items-center gap-3">
        {user.image ? (
          <img
            src={user.image}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover shadow-md ring-2 ring-white"
          />
        ) : (
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white shadow-md ring-2 ring-white ${getRandomColor()}`}
          >
            {getInitials(user.name)}
          </div>
        )}
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="font-medium text-sm">{user.name}</div>
              <div className="text-xs text-gray-500 truncate">
                {user.email}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </aside>
  );
};
