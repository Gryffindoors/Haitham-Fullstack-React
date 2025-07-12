// ✅ PaymentConfirmation.jsx
import React, { useMemo, useState, useEffect } from "react";
import { useLocation } from "react-router";
import { useLanguage } from "../context/LanguageContext";
import { payBill } from "../api/payment/paymentApi";
import toast from "react-hot-toast";

import ReceiptButtons from "../billing/ReceiptButtons";
import BillingPreloader from "../billing/BillingPreloader";

const PaymentConfirmation = () => {
  const { state } = useLocation();
  const { t } = useLanguage();
  const paymentCount = state?.paymentCount || "single";
  const selectedOrderIds =
    state?.selectedOrderIds || JSON.parse(sessionStorage.getItem("selectedOrderIds") || "[]");

  const [entries, setEntries] = useState([]);
  const [paymentComplete, setPaymentComplete] = useState(false);

  const updateEntry = (index, field, value) => {
    const updated = [...entries];
    updated[index][field] = value;
    setEntries(updated);
  };

  const addEntry = () => {
    setEntries([...entries, { amount: "", methodId: "", transactionNumber: "" }]);
  };

  return (
    <BillingPreloader selectedOrderIds={selectedOrderIds}>
      {({ bill, paymentMethods }) => {
        useEffect(() => {
          if (!bill || entries.length > 0) return;

          if (paymentCount === "single") {
            setEntries([
              {
                amount: bill.total || 0,
                methodId: paymentMethods[0]?.id || "",
                transactionNumber: "",
              },
            ]);
          } else {
            setEntries([
              { amount: "", methodId: "", transactionNumber: "" },
              { amount: "", methodId: "", transactionNumber: "" },
            ]);
          }
        }, [bill, paymentCount]);

        const totalPaid = useMemo(
          () => entries.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0),
          [entries]
        );

        const isTotalMatching = bill && totalPaid === bill.total;

        const handleSubmit = async () => {
          if (!isTotalMatching) {
            toast.error(t("payment_total_mismatch"));
            return;
          }

          try {
            const enhancedEntries = entries.map((e) => ({
              ...e,
              methodName:
                paymentMethods.find((m) => m.id === parseInt(e.methodId))?.name || `Method`,
            }));

            for (const entry of enhancedEntries) {
              await payBill(bill.id, {
                amount: parseFloat(entry.amount),
                payment_method_id: entry.methodId,
                transaction_number: entry.transactionNumber || undefined,
              });
            }

            setEntries(enhancedEntries); // for receipt
            setPaymentComplete(true);
          } catch (err) {
            console.error("❌ Payment failed", err);
            toast.error(t("error_occurred"));
          }
        };

        return (
          <div className="p-4 max-w-3xl mx-auto">
            <h2 className="text-xl font-bold mb-4">{t("confirm_payment")}</h2>

            {paymentComplete && <ReceiptButtons bill={bill} entries={entries} />}

            {!paymentComplete && (
              <>
                <p className="mb-2">
                  {t("bill_total")}: <strong>{bill.total} EGP</strong>
                </p>

                <div className="space-y-4">
                  {entries.map((entry, idx) => (
                    <div
                      key={idx}
                      className="border rounded p-4 flex flex-col sm:flex-row sm:items-center gap-4"
                    >
                      <input
                        type="number"
                        placeholder={t("amount")}
                        className="border px-2 py-1 rounded w-full sm:w-1/4"
                        value={entry.amount}
                        onChange={(e) => updateEntry(idx, "amount", e.target.value)}
                      />

                      <select
                        className="border px-2 py-1 rounded w-full sm:w-1/4"
                        value={entry.methodId}
                        onChange={(e) => updateEntry(idx, "methodId", e.target.value)}
                      >
                        <option value="">{t("select_payment_method")}</option>
                        {paymentMethods.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name}
                          </option>
                        ))}
                      </select>

                      <input
                        type="text"
                        placeholder={t("transaction_number_optional")}
                        className="border px-2 py-1 rounded w-full sm:w-1/2"
                        value={entry.transactionNumber}
                        onChange={(e) => updateEntry(idx, "transactionNumber", e.target.value)}
                      />
                    </div>
                  ))}
                </div>

                {paymentCount === "multiple" && (
                  <div className="mt-4">
                    <button
                      onClick={addEntry}
                      className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                    >
                      + {t("add_payment")}
                    </button>
                  </div>
                )}

                <div className="mt-6 text-right">
                  <p className="mb-2 text-sm text-gray-700">
                    {t("total_paid")}: <strong>{totalPaid.toFixed(2)} EGP</strong>
                    {!isTotalMatching && (
                      <span className="text-red-600 ml-2">({t("total_mismatch")})</span>
                    )}
                  </p>

                  <button
                    onClick={handleSubmit}
                    disabled={!isTotalMatching}
                    className={`px-4 py-2 rounded ${
                      isTotalMatching
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "bg-gray-300 text-gray-600 cursor-not-allowed"
                    }`}
                  >
                    {t("submit")}
                  </button>
                </div>
              </>
            )}
          </div>
        );
      }}
    </BillingPreloader>
  );
};

export default PaymentConfirmation;