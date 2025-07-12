// src/layouts/DashboardLayout.jsx
import Sidebar from "./sidebar";
import FloatingAuthButton from "./floatingAuthButton";
import { useLanguage } from "../context/LanguageContext";
import { Outlet } from "react-router";

const DashboardLayout = () => {
    const { lang } = useLanguage();

    return (
        <div className="flex h-screen w-full overflow-hidden bg-gray-50 dark:bg-gray-900" dir="ltr">
            <div dir="ltr">
                <Sidebar />
            </div>
            <main
                className={`flex-1 overflow-y-auto px-4 py-6 transition-all duration-300 ${lang === "ar" ? "text-right" : "text-left"
                    }`}
            >
                <div className="flex justify-end">
                    <FloatingAuthButton />
                </div>
                <div className="mt-6">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
