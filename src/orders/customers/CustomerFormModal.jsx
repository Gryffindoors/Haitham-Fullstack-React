import React, { useState } from "react";
import { createCustomer } from "../../api/orders/customers";
import { useLanguage } from "../../context/LanguageContext";
import FormattedInput from "../../utils/FormattedInput";

const CustomerFormModal = ({ onClose, onSuccess }) => {
  const { t, lang } = useLanguage();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone_number: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);
    try {
      const saved = await createCustomer(form);
      onSuccess(saved); // pass back the saved customer object
      onClose();
    } catch (err) {
      setError(err.message || t("unknown_error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div
        className="bg-white w-full max-w-md p-6 rounded shadow"
        dir={lang === "ar" ? "rtl" : "ltr"}
      >
        <h2 className="text-xl font-bold mb-4 text-center">
          {t("add_new_customer")}
        </h2>

        <div className="space-y-3">
          <FormattedInput
            name="first_name"
            value={form.first_name}
            onChange={handleChange}
            placeholder={lang === "ar" ? "الاسم الأول" : "First Name"}
          />
          <FormattedInput
            name="last_name"
            value={form.last_name}
            onChange={handleChange}
            placeholder={lang === "ar" ? "اسم العائلة" : "Last Name"}
          />
          <FormattedInput
            name="phone_number"
            value={form.phone_number}
            onChange={handleChange}
            placeholder={lang === "ar" ? "رقم الهاتف" : "Phone Number"}
          />
          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}
        </div>

        <div className="mt-6 flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            {t("cancel")}
          </button>
          <button
            onClick={handleSubmit}
            className={`px-4 py-2 rounded text-white ${
              loading ? "bg-yellow-300" : "bg-yellow-500 hover:bg-yellow-600"
            }`}
            disabled={loading}
          >
            {loading ? t("loading") : t("save")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerFormModal;
