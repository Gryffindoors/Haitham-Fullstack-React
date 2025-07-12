import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { FiMenu, FiX } from "react-icons/fi";
import Logo from "../layout/Logo";
import { useLanguage } from "../context/LanguageContext";
import FormattedText from "../utils/FormattedText";
const Navbar = () => {
  const { t, lang } = useLanguage();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const sidebarRef = useRef(null);

  const toggleSidebar = () => setOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (open && sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const menuItems = [
    { label: t("home") || "Home", path: "/" },
    { label: t("dashboard"), path: "/dashboard" },
    { label: t("orders"), path: "/orders" },
    { label: t("bills"), path: "/billing" },
    { label: t("reservation"), path: "/reservations" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="relative z-50 w-full">
      {/* Desktop Navbar */}
      <div
        dir="ltr"
        className="hidden md:flex w-[95%] max-w-screen-xl mx-auto h-16 items-center justify-between bg-white shadow-sm rounded-full px-4"
      >
        <div className="flex items-center gap-3">
          <Logo />
        </div>

        <nav className="flex items-center justify-center gap-6 mx-auto">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-sm font-medium transition ${isActive(item.path)
                  ? "text-yellow-600 border-b-2 border-yellow-600"
                  : "text-gray-700 hover:text-yellow-600"
                }`}
            >
              <FormattedText capitalizeText>
                {item.label}
              </FormattedText>
            </Link>
          ))}
        </nav>
      </div>

      {/* Mobile Toggle Button */}
      <div className="md:hidden fixed left-4 top-4 z-[1000]">
        <button
          onClick={toggleSidebar}
          className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-yellow-700"
        >
          {open ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Sidebar */}
      <aside
        ref={sidebarRef}
        dir={lang === "ar" ? "rtl" : "ltr"}
        className={`fixed top-0 left-0 h-full w-64 bg-white/95 shadow-xl z-[999] transform transition-transform duration-300 md:hidden ${open ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <Logo />
          <button
            onClick={() => setOpen(false)}
            className="text-yellow-700 focus:outline-none"
          >
            <FiX size={24} />
          </button>
        </div>
        <nav className="flex flex-col p-4 gap-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setOpen(false)}
              className={`text-base transition ${isActive(item.path)
                  ? "text-yellow-700 font-semibold"
                  : "text-gray-700 hover:text-yellow-700"
                }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
    </header>
  );
};

export default Navbar;
