import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { getAllStaff } from "../api/staff/staff";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const SwiperStaffCarousel = () => {
  const { role } = useAuth();
  const { lang } = useLanguage();
  const [staffList, setStaffList] = useState([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (role === "owner") {
      getAllStaff()
        .then(setStaffList)
        .catch((err) => console.error("Failed to fetch staff:", err));
    }
  }, [role]);

  useEffect(() => {
    if (staffList.length > 0) {
      const timeout = setTimeout(() => setVisible(true), 100);
      return () => clearTimeout(timeout);
    }
  }, [staffList]);

  if (role !== "owner" || staffList.length === 0 || !visible) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full h-[30vh] bg-none z-40 border-gray-300">
      <Swiper
        modules={[Autoplay]}
        slidesPerView="auto"
        spaceBetween={24} // Reduced for better mobile spacing
        loop={true}
        speed={6000} // Slightly slower for better visibility
        autoplay={{
          delay: 0,
          disableOnInteraction: true, // Changed to true for better UX
          pauseOnMouseEnter: true, // Added for better interaction
        }}
        centeredSlides={true} // Better focus on mobile
        allowTouchMove={true}
        grabCursor={true}
        className="h-full w-full px-4 md:px-8 py-6" // Responsive padding
        breakpoints={{
          // Responsive breakpoints
          640: {
            spaceBetween: 32,
          },
          1024: {
            spaceBetween: 40,
          },
        }}
      >
        {staffList.map((staff) => (
          <SwiperSlide
            key={staff.id}
            style={{ width: "140px" }} // Smaller for mobile
            className="flex flex-col items-center justify-center text-center rounded-2xl shadow-lg hover:shadow-xl shadow-gray-300/50 dark:shadow-gray-700/50 transition-all hover:scale-[1.05] duration-300 ease-in-out bg-white/50 dark:bg-gray-800 p-3 hover:z-10" // Added dark mode support
          >
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full mx-auto overflow-hidden shadow-inner shadow-gray-400/30 mb-3 border-2 border-gray-200 dark:border-gray-600 relative group">
              <img
                src={staff.image_url || "/default-user.png"}
                onError={(e) => (e.target.src = "/default-user.png")}
                alt={staff.first_name}
                className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500 ease-in-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
            </div>
            <p
              className={`text-sm md:text-base font-medium md:font-semibold text-gray-800 dark:text-gray-200 leading-tight ${lang === "ar" ? "text-center" : "text-center"
                }`}
              dir={lang === "ar" ? "rtl" : "ltr"}
            >
              {lang === "ar"
                ? [staff.first_name_ar, staff.last_name_ar].filter(Boolean).join(" ")
                : [staff.first_name, staff.last_name].filter(Boolean).join(" ")}
            </p>
            {staff.position && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {lang === "ar" ? staff.position_ar : staff.position}
              </p>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default SwiperStaffCarousel;
