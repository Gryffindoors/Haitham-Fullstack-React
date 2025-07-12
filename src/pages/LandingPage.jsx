import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import config from "../../config";
import FormattedText from "../utils/FormattedText";
import { Link } from "react-router";
import SwiperStaffCarousel from "../staff/SwiperStaffCarousel";
import { useEffect } from "react";

const LandingPage = () => {
    const { t, lang } = useLanguage();
    const { user, role } = useAuth(); // ✅ Now you have access to role

    const logoUrl = `${config.assetBaseUrl}/images/bg/logo.jpeg`;

    console.time("🏠 LandingPage load");

    useEffect(() => {
        console.timeEnd("🏠 LandingPage load");
    }, []);


    return (
        <div className="flex flex-col items-center justify-center text-center py-10 gap-6">
            {/* Logo */}
            <img
                src={logoUrl}
                alt="Le Monde Logo"
                className="w-52 h-auto drop-shadow-lg rounded-md"
            />

            {/* Welcome */}
            <FormattedText capitalizeText className="text-xl text-gray-700">
                {lang === "ar" ? "مرحبًا بعودتك!" : "Welcome back!"}
            </FormattedText>

            {/* User name */}
            <FormattedText capitalizeText className="text-lg font-semibold text-gray-800">
                {lang === "ar"
                    ? `${user?.first_name_ar || ""} ${user?.last_name_ar || ""}`.trim()
                    : `${user?.first_name || ""} ${user?.last_name || ""}`.trim()}
            </FormattedText>
            <SwiperStaffCarousel />

        </div>
    );
};

export default LandingPage;
