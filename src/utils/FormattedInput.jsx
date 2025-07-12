import React from "react";
import useHelpers from "../hooks/useHelpers";

const FormattedInput = ({
    value, // This is the value from the parent's state
    onChange, // This is the handler from the parent (e.g., handleInputChange)
    capitalizeText = false,
    cleanDigits = true,
    detectType = true,
    error = null,
    className = "",
    ...props
}) => {
    const { toEnglishDigits, capitalize } = useHelpers();

    const handleChange = (e) => {
        let val = e.target.value;

        if (cleanDigits) val = toEnglishDigits(val);
        if (capitalizeText) val = capitalize(val);

        onChange({
            target: {
                name: props.name,
                value: val,
            }
        });

    };


    // Auto type handling based on props.name
    const inferredType =
        detectType && props.name?.toLowerCase().includes("price") ? "number" :
            detectType && props.name?.toLowerCase().includes("date") ? "date" :
                detectType && props.name?.toLowerCase().includes("phone") ? "tel" :
                    detectType && props.name?.toLowerCase().includes("email") ? "email" :
                        props.type || "text";

    return (
        <div className="w-full">
            <input
                {...props}
                type={inferredType}
                value={value} // The input's value is controlled by the 'value' prop from parent
                onChange={handleChange} // Call the local handleChange
                className={`
          w-full px-4 py-2 rounded-md border shadow-sm
          focus:outline-none focus:ring-2
          focus:ring-yellow-500 focus:border-yellow-400
          transition
          ${error ? "border-red-500 ring-red-200" : "border-gray-300"}
          ${className}
        `}
            />
            {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
        </div>
    );
};

export default FormattedInput;