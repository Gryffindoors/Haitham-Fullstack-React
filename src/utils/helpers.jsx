// Convert Arabic/Persian/Hindi digits to Latin (0–9)
export const toEnglishDigits = (input) => {
  const str = String(input);
  const map = {
    "٠": "0", "١": "1", "٢": "2", "٣": "3", "٤": "4",
    "٥": "5", "٦": "6", "٧": "7", "٨": "8", "٩": "9",
    "۰": "0", "۱": "1", "۲": "2", "۳": "3", "۴": "4",
    "۵": "5", "۶": "6", "۷": "7", "۸": "8", "۹": "9",
  };
  return str.replace(/[٠-٩۰-۹]/g, d => map[d] || d);
};

// Format number as EGP or custom currency
export const formatPrice = (amount, currency = "EGP") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);

// Get current time in Cairo timezone
export const getCurrentTimeCairo = () =>
  new Date().toLocaleString("en-US", { timeZone: "Africa/Cairo" });

// Capitalize the first letter of a string
export const capitalize = (str) =>
  str.charAt(0).toUpperCase() + str.slice(1);
