import { useAuth } from "../context/AuthContext";
import { useLocation } from "react-router";
import { useState, useEffect } from "react";
import config from "../../config";
import Navbar from "./Navbar";

const Background = ({ children }) => {
  const { pathname } = useLocation();
  const { authReady } = useAuth(); // ✅ use this
  const [index, setIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const images = [
    `${config.assetBaseUrl}/images/bg/exterior.jpeg`,
    `${config.assetBaseUrl}/images/bg/interior.jpeg`,
  ];

  useEffect(() => {
    let loaded = 0;
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loaded++;
        if (loaded === images.length) setImagesLoaded(true);
      };
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 30000);
    return () => clearInterval(interval);
  }, [images.length]);

  const isLogin = pathname === "/login";
  const isDashboard = pathname.startsWith("/dashboard");

  // ✅ Block display until auth + images are both ready
  if (!authReady || !imagesLoaded) {
    return <div className="p-6 text-gray-600">Loading interface...</div>;
  }

  return (
    <div
      className="relative min-h-screen w-full bg-no-repeat bg-cover bg-[center_center] transition-all duration-500"
      style={{ backgroundImage: `url('${images[index]}')` }}
    >
      <div className="min-h-screen w-full bg-white/80">
        <div className="w-[95%] max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div dir="ltr">{isLogin ? null : isDashboard ? "" : <Navbar />}</div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Background;