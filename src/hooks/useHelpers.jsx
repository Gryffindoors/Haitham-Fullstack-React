import { useMemo } from "react";
import {
  toEnglishDigits,
  formatPrice,
  getCurrentTimeCairo,
  capitalize,
} from "../utils/helpers";

const useHelpers = () => {
  const currency = "EGP"; // can be dynamic later (based on user settings)

  return useMemo(() => ({
    toEnglishDigits,
    formatPrice: (value) => formatPrice(value, currency),
    getCurrentTimeCairo,
    capitalize,
  }), [currency]);
};

export default useHelpers;
