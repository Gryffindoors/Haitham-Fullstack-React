import React from "react";
import useHelpers from "../hooks/useHelpers";
import { useLanguage } from "../context/LanguageContext";

const FormattedText = ({
  children,
  id = null,
  cleanDigits = true,
  capitalizeText = false,
  rtl = false,
  className = "",
}) => {
  const { toEnglishDigits, capitalize } = useHelpers();
  const { t } = useLanguage();

  const content = id ? t(id) : children;

  const format = (text) => {
    let result = String(text);
    if (cleanDigits) result = toEnglishDigits(result);
    if (capitalizeText) result = capitalize(result);
    return result;
  };

  const processed = React.Children.map(content, (child) => {
    if (typeof child === "string" || typeof child === "number") {
      return format(child);
    } else if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        children: format(child.props.children),
      });
    }
    return child;
  });

  return (
    <div className={className}>
      {processed}
    </div>
  );
};

export default FormattedText;
