// ✅ PaymentOptionsModal.jsx
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useLanguage } from "../context/LanguageContext";
import BillingPreloader from "../billing/BillingPreloader";

const PaymentOptionsModal = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const selectedOrderIds =
    state?.selectedOrderIds || JSON.parse(sessionStorage.getItem("selectedOrderIds") || "[]");

  const [paymentCount, setPaymentCount] = useState("single");
  const [splitMode, setSplitMode] = useState("all");

  if (!selectedOrderIds.length) return <p>{t("no_data")}</p>;

  return (
    <BillingPreloader selectedOrderIds={selectedOrderIds}>
      {({ bill }) => {
        const handleNext = () => {
          if (!bill?.id) return;

          if (paymentCount === "single" && splitMode === "items") {
            navigate("/billing/split", { state: { selectedOrderIds } });
          } else {
            navigate("/billing/pay", { state: { selectedOrderIds, paymentCount } });
          }
        };

        return (
          <div className="p-4 max-w-2xl mx-auto">
            <h2 className="text-xl font-bold mb-4">{t("payment")}</h2>

            <div className="bg-white rounded shadow p-4 space-y-4">
              <p className="text-sm text-gray-600">
                {t("selected_orders")}: {selectedOrderIds.join(", ")}
              </p>

              <div>
                <label className="block font-medium mb-1">{t("payment_method_count")}</label>
                <select
                  value={paymentCount}
                  onChange={(e) => setPaymentCount(e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                >
                  <option value="single">{t("single_payment")}</option>
                  <option value="multiple">{t("multiple_payments")}</option>
                </select>
              </div>

              {selectedOrderIds.length === 1 && (
                <div>
                  <label className="block font-medium mb-1">{t("split_mode")}</label>
                  <select
                    value={splitMode}
                    onChange={(e) => setSplitMode(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                  >
                    <option value="all">{t("all_items_together")}</option>
                    <option value="items">{t("split_by_items")}</option>
                  </select>
                </div>
              )}

              <div className="text-right pt-4">
                <button
                  onClick={handleNext}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  {t("next")}
                </button>
              </div>
            </div>
          </div>
        );
      }}
    </BillingPreloader>
  );
};

export default PaymentOptionsModal;
