import React, { useContext, useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { BillingContext } from "../context/BillingContext";
import BillingOrderSelectTable from "../billing/BillingOrderSelectTable";
import TodayBillsTable from "../billing/TodayBillsTable";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

const BillingStartPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { orders, bills, loading, error } = useContext(BillingContext);
  const [selectedIds, setSelectedIds] = useState([]);


  const { refresh } = useContext(BillingContext);

  const refreshData = () => {
    toast.loading(t("loading"));
    refresh()
      .then(() => toast.success(t("refreshed_successfully")))
      .catch(() => toast.error(t("error_occurred")))
      .finally(() => toast.dismiss());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleToggle = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleProceed = () => {

    if (selectedIds.length === 0) {
      console.warn("⚠️ No orders selected");
      toast.error(t("please_select_orders"));
      return;
    }


    try {
      toast.loading(t("loading"));
      sessionStorage.setItem("selectedOrderIds", JSON.stringify(selectedIds));

      setIsSubmitting(true);

      setTimeout(() => {
        toast.dismiss();
        navigate("/billing/create", {
          state: { selectedOrderIds: selectedIds },
        });
      }, 400);
    } catch (err) {
      toast.dismiss();
      console.error("❌ Error during confirm flow:", err);
      toast.error(t("error_occurred"));
    }
  };


  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{t("bills")}</h2>
        <button
          onClick={refreshData}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {t("refresh")}
        </button>
      </div>
      {loading ? (
        <div className="text-gray-400 animate-pulse">{t("loading")}</div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          {/* Top: Today’s Orders */}
          <div className="mb-10">
            <h3 className="text-lg font-semibold mb-2">{t("today_orders")}</h3>

            <BillingOrderSelectTable
              orders={orders}
              selectedIds={selectedIds}
              onToggle={handleToggle}
              onConfirmClick={handleProceed}
              isSubmitting={isSubmitting}
            />
          </div>

          {/* Bottom: Today’s Bills */}
          <div>
            <h3 className="text-lg font-semibold mb-2">{t("today_bills")}</h3>
            <TodayBillsTable bills={bills} />
          </div>
        </>
      )}
    </div>
  );
};

export default BillingStartPage;
