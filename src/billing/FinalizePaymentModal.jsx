import React, { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import toast from "react-hot-toast";
import {
  createEmptyBill,
  attachItemsToBill,
  payBill,
  createStripeSession,
  isOnlinePayment,
} from "../api/payment/paymentApi";

const FinalizePaymentModal = ({ payloads = [], onClose }) => {
  const { t, lang } = useLanguage();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!Array.isArray(payloads) || payloads.length === 0) {
      toast.error(t("invalid_payment_data"));
      return;
    }

    setLoading(true);
    try {
      for (let i = 0; i < payloads.length; i++) {
        const payload = payloads[i];
        const {
          order_ids = [],
          item_ids = [],
          amount,
          payment_method_id,
          tax = 0,
          service_charge = 0,
          tips = 0,
          transaction_number,
        } = payload;

        if (!amount || !payment_method_id || !order_ids.length) {
          throw new Error("Missing required payment data");
        }

        // Step 1: Create empty bill
        const total_cost = parseFloat(amount) + parseFloat(tax) + parseFloat(service_charge) + parseFloat(tips);

        const billRes = await createEmptyBill({
          order_ids,
          payment_method_id,
          tax,
          service_charge,
          tips,
          total_cost,
        });

        const billId = billRes?.bill_id;
        if (!billId) throw new Error("Bill creation failed");

        console.log(`🧾 Created Bill #${billId}`);

        // Step 2: Attach items and pay (merged API)
        await attachItemsToBill(billId, {
          order_ids,
          item_ids,
          amount,
          payment_method_id,
          tax,
          service_charge,
          tips,
          transaction_number,
        });

        // Step 3: If online payment, redirect to Stripe
        if (isOnlinePayment(payment_method_id)) {
          const stripeRes = await createStripeSession(billId);
          if (stripeRes?.url) {
            window.location.href = stripeRes.url;
            return;
          } else {
            throw new Error("Stripe session creation failed");
          }
        }

        toast.success(`${t("payment_success")} #${billId}`);
      }

      onClose();
    } catch (err) {
      console.error("❌ Finalize payment error", err);
      toast.error(t("error_occurred"));
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    console.log("🧾 payloads inside FinalizePaymentModal:", payloads);
  }, [payloads]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded shadow-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-bold mb-4">{t("finalize_payment")}</h3>

        <div className="text-sm mb-4 space-y-3">
          {payloads.map((p, idx) => (
            <div key={idx} className="bg-gray-50 p-3 rounded border">
              <p className="font-semibold mb-1">
                #{idx + 1} {t("bill_preview")}
              </p>
              <p><strong>{t("Orders")}:</strong> {p.order_ids?.join(", ") || "-"}</p>
              <p><strong>{t("Items")}:</strong> {p.item_ids?.join(", ") || t("all")}</p>
              <p><strong>{t("Method")}:</strong> {p.payment_method_id ?? "-"}</p>
              <p><strong>{t("Tax")}:</strong> {p.tax ?? 0} {t("egp")}</p>
              <p><strong>{t("Service Charge")}:</strong> {p.service_charge ?? 0} {t("egp")}</p>
              <p><strong>{t("Tips")}:</strong> {p.tips ?? 0} {t("egp")}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded text-gray-600"
            disabled={loading}
          >
            {t("cancel")}
          </button>
          <button
            onClick={handlePayment}
            className={`px-4 py-2 rounded text-white ${loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"}`}
            disabled={loading}
          >
            {loading ? t("processing") : t("confirm_payment")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinalizePaymentModal;
