import React, { useState, useMemo } from "react";
import { useLanguage } from "../context/LanguageContext";

const DEFAULT_TAX = 10;
const DEFAULT_SERVICE = 10;

const SplitAmountModal = ({ total, paymentMethods = [], onClose, onConfirm }) => {
  const { t, lang } = useLanguage();

  const [entry, setEntry] = useState({
    amountPaid: "",
    methodId: "",
    ref: "",
    taxPercent: DEFAULT_TAX,
    tax: 0,
    service: (total * DEFAULT_SERVICE) / 100,
    tips: 0,
  });

  const handleChange = (field, value) => {
    const updated = { ...entry, [field]: value };

    if (field === "amountPaid" || field === "taxPercent") {
      const paid = parseFloat(field === "amountPaid" ? value : updated.amountPaid || 0);
      const taxRate = parseFloat(field === "taxPercent" ? value : updated.taxPercent || 0);
      const tax = (total * taxRate) / 100;
      const service = (total * DEFAULT_SERVICE) / 100;
      const tips = paid - (total + tax + service);

      updated.tax = tax;
      updated.service = service;
      updated.tips = tips > 0 ? tips : 0;
    }

    setEntry(updated);
  };

  const isValid = entry.amountPaid && entry.methodId;

  const handleConfirm = () => {
    const structured = [{
      amount: parseFloat(total),
      method: parseInt(entry.methodId),
      ref: entry.ref || "",
      tax: parseFloat(entry.tax || 0),
      service_charge: parseFloat(entry.service || 0),
      tips: parseFloat(entry.tips || 0),
    }];
    onConfirm(structured);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded shadow-lg w-full max-w-xl p-6 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-bold mb-4">{t("split_payment")}</h3>

        <div className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full mb-4">
          {t("split_total")}: {parseFloat(total).toFixed(2)} EGP
        </div>

        {/* Row 1 */}
        <div className="flex flex-wrap gap-2 items-center mb-2">
          <select
            value={entry.methodId}
            onChange={(e) => handleChange("methodId", e.target.value)}
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
            onChange={(e) => handleChange("ref", e.target.value)}
            placeholder={t("reference_optional")}
            className="border rounded px-2 py-1 w-[30%]"
          />
        </div>

        {/* Row 2 */}
        <div className="flex flex-wrap gap-2 items-center mb-2">
          <input
            type="number"
            value={entry.taxPercent}
            onChange={(e) => handleChange("taxPercent", e.target.value)}
            placeholder={t("tax_percent")}
            className="border rounded px-2 py-1 w-[30%]"
          />
          <input
            type="number"
            value={entry.service.toFixed(2)}
            readOnly
            placeholder={t("service_charge")}
            className="border rounded px-2 py-1 w-[30%] bg-gray-100"
          />
          <input
            type="number"
            value={entry.amountPaid}
            onChange={(e) => handleChange("amountPaid", e.target.value)}
            placeholder={t("amount_paid")}
            className="border rounded px-2 py-1 w-[30%]"
          />
        </div>

        {/* Tip Display */}
        <div className="text-sm text-gray-700 ml-1 mb-4">
          {t("tip_amount")}: <strong>{entry.tips.toFixed(2)} EGP</strong>
        </div>

        {/* Summary */}
        <div className="text-sm mb-2 flex justify-between items-center">
          <div>
            {t("with_extras")}: {(total + entry.tax + entry.service).toFixed(2)} EGP
          </div>
          <div className="text-xs bg-gray-100 px-3 py-1 rounded-full text-gray-700 font-medium">
            {t("expected_total")}: {parseFloat(total).toFixed(2)} EGP
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end items-center gap-2">
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
  );
};

export default SplitAmountModal;
