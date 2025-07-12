import React, { useState, useMemo } from "react";
import { useLanguage } from "../context/LanguageContext";

const SplitAmountModal = ({ total, paymentMethods = [], onClose, onConfirm }) => {
  const { t, lang } = useLanguage();

  const [entries, setEntries] = useState([
    { amount: "", methodId: "", ref: "", taxPercent: "", service: "", tips: "" },
  ]);

  const handleChange = (index, field, value) => {
    const updated = [...entries];
    updated[index][field] = value;
    setEntries(updated);
  };

  const addEntry = () => {
    setEntries([
      ...entries,
      { amount: "", methodId: "", ref: "", taxPercent: "", service: "", tips: "" },
    ]);
  };

  const baseTotal = useMemo(
    () => entries.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0),
    [entries]
  );

  const actualTotalPaid = useMemo(() =>
    entries.reduce((sum, e) => {
      const base = parseFloat(e.amount || 0);
      const tax = (parseFloat(e.taxPercent || 0) / 100) * base;
      const service_charge = parseFloat(e.service || 0);
      const tips = parseFloat(e.tips || 0);
      return sum + base + tax + service_charge + tips; // ✅ corrected
    }, 0),
    [entries]
  );

 
  const isValid =
    parseFloat(baseTotal.toFixed(2)) === parseFloat(parseFloat(total || 0).toFixed(2)) &&
    entries.every((e) => e.amount && e.methodId);

  const handleConfirm = () => {
    const structured = entries.map((e) => {
      const amount = parseFloat(e.amount);
      const taxRate = parseFloat(e.taxPercent || 0) / 100;
      return {
        amount,
        method: parseInt(e.methodId),
        ref: e.ref || "",
        tax: parseFloat((amount * taxRate).toFixed(2)),
        service_charge: parseFloat(e.service || 0),
        tips: parseFloat(e.tips || 0),
      };
    });
    onConfirm(structured);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded shadow-lg w-full max-w-xl p-6 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-bold mb-4">{t("split_payment")}</h3>

        <div className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full mb-4">
          {t("split_total")}: {parseFloat(total).toFixed(2)} EGP
        </div>

        {entries.map((entry, idx) => {
          const amount = parseFloat(entry.amount || 0);
          const taxRate = parseFloat(entry.taxPercent || 0);
          const taxValue = (amount * taxRate) / 100;

          return (
            <div key={idx} className="mb-4 border p-3 rounded">
              <div className="flex flex-wrap gap-2 items-center mb-2">
                <input
                  type="number"
                  value={entry.amount}
                  onChange={(e) => handleChange(idx, "amount", e.target.value)}
                  placeholder={t("amount")}
                  className="border rounded px-2 py-1 w-[30%]"
                />

                <select
                  value={entry.methodId}
                  onChange={(e) => handleChange(idx, "methodId", e.target.value)}
                  className="border rounded px-2 py-1 w-[35%]"
                >
                  <option value="">{t("select_payment_method")}</option>
                  {paymentMethods.map((pm) => (
                    <option key={pm.id} value={pm.id}>
                      {lang === "ar" ? pm.name_ar : pm.name}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  value={entry.ref}
                  onChange={(e) => handleChange(idx, "ref", e.target.value)}
                  placeholder={t("reference_optional")}
                  className="border rounded px-2 py-1 w-[30%]"
                />
              </div>

              <div className="flex flex-wrap gap-2 items-center">
                <div className="w-[30%]">
                  <input
                    type="number"
                    value={entry.taxPercent}
                    onChange={(e) => handleChange(idx, "taxPercent", e.target.value)}
                    placeholder={`${t("tax")} (%)`}
                    className="border rounded px-2 py-1 w-full"
                  />
                  {amount > 0 && taxRate > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      {t("calculated_tax")}: {taxValue.toFixed(2)} EGP
                    </p>
                  )}
                </div>

                <input
                  type="number"
                  value={entry.service}
                  onChange={(e) => handleChange(idx, "service", e.target.value)}
                  placeholder={t("service_charge")}
                  className="border rounded px-2 py-1 w-[30%]"
                />
                <input
                  type="number"
                  value={entry.tips}
                  onChange={(e) => handleChange(idx, "tips", e.target.value)}
                  placeholder={t("tips")}
                  className="border rounded px-2 py-1 w-[30%]"
                />
              </div>
            </div>
          );
        })}

        <div className="text-sm mb-2 flex justify-between items-center">
          <div>
            {t("total_paid")}: <strong>{baseTotal.toFixed(2)} EGP</strong>
            {!isValid && (
              <span className="text-red-600 ml-2">
                ({t("check_entries_total_method")})
              </span>
            )}
            <p className="text-xs text-gray-500">
              {t("with_extras")}: {actualTotalPaid.toFixed(2)} EGP
            </p>
          </div>

          <div className="text-xs bg-gray-100 px-3 py-1 rounded-full text-gray-700 font-medium">
            {t("expected_total")}: {parseFloat(total).toFixed(2)} EGP
          </div>
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={addEntry}
            className="text-sm text-blue-600 hover:underline"
          >
            + {t("add_payment")}
          </button>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded text-gray-600"
            >
              {t("cancel")}
            </button>
            <button
              disabled={!isValid}
              onClick={handleConfirm}
              className={`px-4 py-2 rounded text-white ${isValid ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"
                }`}
            >
              {t("confirm")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplitAmountModal;
