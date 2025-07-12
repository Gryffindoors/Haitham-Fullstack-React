import { createContext, useContext, useEffect, useState } from "react";
import { fetchMe } from "../api/api";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const deriveRole = (u) => (u && typeof u.role === "string" ? u.role : null);

  const [role, setRole] = useState(() => {
    const saved = localStorage.getItem("user");
    const parsed = saved ? JSON.parse(saved) : null;
    return deriveRole(parsed);
  });



  const [isLoading, setIsLoading] = useState(true);   // for internal auth check
  const [authReady, setAuthReady] = useState(false);  // ✅ for UI/layout preloading sync


  useEffect(() => {
    const loadUser = async () => {
      console.time("🔁 Auth Init");

      const token = localStorage.getItem("token");

      if (!token) {
        localStorage.removeItem("user");
        setUser(null);
        setRole(null);
        setIsLoading(false);
        setAuthReady(true);
        console.timeEnd("🔁 Auth Init");
        return;
      }

      try {
        console.time("⏳ fetchMe");
        const userData = await fetchMe();
        console.timeEnd("⏳ fetchMe");

        setUser(userData);
        setRole(deriveRole(userData));
        localStorage.setItem("user", JSON.stringify(userData));
      } catch (err) {
        console.error("❌ Auth verification failed:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setRole(null);
      } finally {
        setIsLoading(false);
        setAuthReady(true);
        console.timeEnd("🔁 Auth Init");
      }
    };

    loadUser();
  }, []);



  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setRole(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isLoading,
        authReady,
        logout,
        isLoggedIn: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
