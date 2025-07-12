import { FiLogOut, FiLogIn } from "react-icons/fi";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";

const parseUserProfile = (user, lang = "en") => ({
  name:
    lang === "ar"
      ? `${user.first_name_ar || ""} ${user.last_name_ar || ""}`.trim()
      : `${user.first_name || ""} ${user.last_name || ""}`.trim(),
  image: user.image,
  username: user.username,
});

const FloatingAuthButton = () => {
  const { lang, setLang } = useLanguage();
  const { user, logout, isLoggedIn } = useAuth();

  const profile = isLoggedIn && user ? parseUserProfile(user, lang) : null;

  return (
    <div
      className="fixed top-6 right-6 z-[999] bg-white/90 backdrop-blur-md shadow-xl rounded-full px-5 py-[1rem] flex items-center gap-4"
      dir="ltr"
    >
      {profile ? (
        <>
          {profile.image ? (
            <img
              src={profile.image}
              alt="User"
              className="w-8 h-8 rounded-full object-cover border border-gray-300"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-yellow-500 text-white flex items-center justify-center text-xs font-semibold">
              {profile.name.charAt(0)}
            </div>
          )}

          <span className="text-sm text-gray-700 hidden sm:inline">
            {lang === "ar" ? "مرحبًا،" : "Hello,"} {profile.name}
          </span>

          <button
            onClick={logout}
            className="text-red-600 hover:text-red-800 transition"
            title="Logout"
          >
            <FiLogOut size={20} />
          </button>
        </>
      ) : (
        <button
          onClick={() => (window.location.href = "/login")}
          className="text-green-700 hover:text-green-900 transition flex items-center gap-2"
        >
          <FiLogIn size={20} />
          <span className="text-sm hidden sm:inline">Login</span>
        </button>
      )}

      <button
        onClick={() => setLang(lang === "en" ? "ar" : "en")}
        className="px-3 py-1 text-sm rounded-full border border-blue-500 text-blue-700 hover:bg-blue-100 transition"
      >
        {lang === "en" ? "AR" : "EN"}
      </button>
    </div>
  );
};

export default FloatingAuthButton;
