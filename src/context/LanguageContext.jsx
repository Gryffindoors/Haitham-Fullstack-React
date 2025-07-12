import React, { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

const getStoredLang = () => localStorage.getItem("lang") || "en";

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(getStoredLang());
  const [translations, setTranslations] = useState({});
  const [dir, setDir] = useState("ltr");

  useEffect(() => {
    const loadLangFile = async () => {
      const loaded = await import(`../../${lang}.json`);
      setTranslations(loaded.default || loaded);
      setDir(lang === "ar" ? "rtl" : "ltr");
      localStorage.setItem("lang", lang);
      document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    };

    loadLangFile();
  }, [lang]);

  const t = (key) => translations[key] || key;

  return (
    <LanguageContext.Provider value={{ lang, setLang, dir, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
