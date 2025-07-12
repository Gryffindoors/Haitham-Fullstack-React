import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router";
import {
  FiHome,
  FiCoffee,
  FiUsers,
  FiFileText,
  FiMenu,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import Logo from "./Logo";
import { useLanguage } from "../context/LanguageContext";
import FormattedText from "../utils/FormattedText";

const Sidebar = () => {
  const [open, setOpen] = useState(false); // mobile toggle
  const [collapsed, setCollapsed] = useState(false); // desktop collapse
  const sidebarRef = useRef(null);
  const { t, lang } = useLanguage();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (open && sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const links = [
    { label: "home", icon: <FiHome />, path: "/" },
    { label: "orders", icon: <FiCoffee />, path: "/dashboard/orders" },
    { label: "staff", icon: <FiUsers />, path: "/dashboard/staff" },
    { label: "reports", icon: <FiFileText />, path: "/dashboard/reports" },
  ];

  return (
    <div>
      {/* Mobile toggle button — always fixed top-left visually */}
      <button
        className="sm:hidden fixed top-4 [left:1rem] z-50 bg-white/90 backdrop-blur p-2 rounded-md shadow-md"
        onClick={() => setOpen(true)}
      >
        <FiMenu size={20} className="text-yellow-700" />
      </button>

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        dir="ltr" // keep layout fixed visually LTR
        className={`fixed top-0 [left:0] min-h-screen w-64 bg-white/90 backdrop-blur-md border-gray-200 rounded-r-xl shadow-xl z-40 transition-transform duration-300 ease-in-out
        ${open ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0 sm:static`}
      >
        <div className="h-16 flex items-center justify-between border-b px-4 border-gray-200">
          <Logo />
          <button
            className="hidden sm:block text-gray-600 hover:text-yellow-700"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed
              ? lang === "ar" ? <FiChevronRight /> : <FiChevronLeft />
              : lang === "ar" ? <FiChevronLeft /> : <FiChevronRight />}
          </button>
        </div>

        <nav className="mt-4 flex flex-col gap-1 px-2">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md transition text-sm font-medium
                ${isActive ? "bg-yellow-100 text-yellow-800 font-semibold" : "text-gray-700 hover:bg-yellow-50"}
                ${collapsed ? "justify-center" : ""}`
              } 
              onClick={() => setOpen(false)}
            >
              <span className="text-lg" title={collapsed ? t(link.label) : ""}>
                {link.icon}
              </span>
              {!collapsed && (
                <FormattedText capitalizeText>
                  <span
                    className={`flex-1 ${lang === "ar" ? "text-right pr-2" : "text-left pl-1"
                      }`}
                  >
                    {t(link.label)}
                  </span>
                </FormattedText>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>
    </div>
  );
};

export default Sidebar;
