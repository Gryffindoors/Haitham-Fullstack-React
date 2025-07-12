import React from "react";
import { useLanguage } from "../context/LanguageContext";

const BillingOrderSelectTable = ({
  orders,
  selectedIds,
  onToggle,
  onConfirmClick,
  isSubmitting,
}) => {
  const { lang, t } = useLanguage();

  const formatDate = (datetime) => {
    const d = new Date(datetime);
    return d.toLocaleString(lang === "ar" ? "ar-EG" : "en-US", {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  return (
    <div className="overflow-x-auto">
      {onConfirmClick && (
        <div className="flex justify-end mb-3">
          <button
            disabled={selectedIds.length === 0 || isSubmitting}
            aria-disabled={selectedIds.length === 0 || isSubmitting}
            onClick={onConfirmClick}
            className={`px-4 py-2 rounded flex items-center justify-center gap-2 transition-all duration-200 ${
              selectedIds.length && !isSubmitting
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}
          >
            {isSubmitting && (
              <svg
                className="w-4 h-4 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 11-8 8z"
                ></path>
              </svg>
            )}
            <span>{isSubmitting ? t("loading") : t("confirm")}</span>
          </button>
        </div>
      )}

      <table className="min-w-full table-auto border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-2">{t("select")}</th>
            <th className="border px-2 py-2">{t("table")}</th>
            <th className="border px-2 py-2">{t("order_type")}</th>
            <th className="border px-2 py-2">{t("customer")}</th>
            <th className="border px-2 py-2">{t("ordered_at")}</th>
            <th className="border px-2 py-2">{t("status")}</th>
            <th className="border px-2 py-2">{t("total")}</th>
            <th className="border px-2 py-2">{t("billed")}</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-center py-4 text-gray-500">
                {t("no_data")}
              </td>
            </tr>
          ) : (
            orders.map((order) => {
              const isChecked = selectedIds.includes(order.id);
              const orderType =
                lang === "ar"
                  ? order.order_type?.type_ar
                  : order.order_type?.type;
              const statusLabel =
                lang === "ar"
                  ? order.status?.status_ar
                  : order.status?.status;

              return (
                <tr
                  key={order.id}
                  className="text-center hover:bg-gray-50 transition"
                >
                  <td className="border px-2 py-2">
                    <input
                      type="checkbox"
                      aria-label={`Select order #${order.id}`}
                      checked={isChecked}
                      onChange={() => onToggle(order.id)}
                    />
                  </td>
                  <td className="border px-2 py-2">
                    {order.table_id || "-"}
                  </td>
                  <td className="border px-2 py-2">{orderType || "-"}</td>
                  <td className="border px-2 py-2">
                    {(order.customer?.first_name || "-") +
                      " " +
                      (order.customer?.last_name || "")}
                  </td>
                  <td className="border px-2 py-2">
                    {formatDate(order.ordered_at)}
                  </td>
                  <td className="border px-2 py-2">
                    <span className="px-2 py-1 rounded text-white text-xs bg-blue-500">
                      {statusLabel || "-"}
                    </span>
                  </td>
                  <td className="border px-2 py-2">
                    {parseFloat(order.total || 0).toFixed(2)} EGP
                  </td>
                  <td className="border px-2 py-2">
                    {order.bill_id ? (
                      <span className="text-green-600 font-medium">
                        {t("yes")}
                      </span>
                    ) : (
                      <span className="text-gray-400">{t("no")}</span>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BillingOrderSelectTable;
