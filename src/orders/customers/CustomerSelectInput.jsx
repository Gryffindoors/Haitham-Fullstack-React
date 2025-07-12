import { useState, useMemo, useContext } from "react";
import FormattedInput from "../../utils/FormattedInput";
import { useLanguage } from "../../context/LanguageContext"; // adjust path

const CustomerSelectInput = ({ customers, value, onSelect, onAddNew }) => {
    const { t, lang } = useLanguage();
    const [searchTerm, setSearchTerm] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);

    const filteredCustomers = useMemo(() => {
        const term = searchTerm.toLowerCase();
        return customers.filter((c) => {
            const fullName = `${c.first_name} ${c.last_name}`.toLowerCase();
            return fullName.includes(term) || c.phone_number?.includes(term);
        });
    }, [customers, searchTerm]);

    const selectedCustomer = customers.find((c) => c.id === value);

    return (
        <div className="relative w-full" dir={lang === "ar" ? "rtl" : "ltr"}>
            <div
                className="border rounded px-4 py-2 bg-white cursor-pointer"
                onClick={() => setShowDropdown(!showDropdown)}
            >
                {selectedCustomer
                    ? `${selectedCustomer.first_name} ${selectedCustomer.last_name}`
                    : t("select_customer")}
            </div>

            {showDropdown && (
                <div className="absolute z-10 w-full bg-white border mt-1 rounded shadow max-h-60 overflow-y-auto">
                    <div className="p-2 border-b">
                        <FormattedInput
                            name="search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder={t("search_customer")}
                            detectType={false}
                        />
                    </div>

                    {filteredCustomers.map((cust) => (
                        <div
                            key={cust.id}
                            className="px-4 py-2 hover:bg-blue-100 cursor-pointer text-right"
                            onClick={() => {
                                onSelect(cust.id);
                                setShowDropdown(false);
                                setSearchTerm("");
                            }}
                        >
                            <div className="flex flex-col items-center">
                                <span className="block font-medium truncate">
                                    {cust.first_name} {cust.last_name}
                                </span>
                                <span className="text-sm text-gray-500">{cust.phone_number}</span>
                            </div>
                        </div>
                    ))}

                    <div
                        className="px-4 py-2 bg-gray-100 text-center text-blue-600 hover:underline cursor-pointer"
                        onClick={() => {
                            setShowDropdown(false);
                            onAddNew?.();
                        }}
                    >
                        {t("add_new_customer")}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerSelectInput;
