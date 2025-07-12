import React from "react";
import { useLanguage } from "../context/LanguageContext";

const TodayBillsTable = ({ bills }) => {
  const { lang, t } = useLanguage();

  const formatDate = (datetime) => {
    const d = new Date(datetime);
    return d.toLocaleString(lang === "ar" ? "ar-EG" : "en-US", {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  return (
    <div className="mt-8 overflow-x-auto">
      <h2 className="text-lg font-bold mb-2">{t("today_bills")}</h2>

      <table className="min-w-full table-auto border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-2">#{t("bill")}</th>
            <th className="border px-2 py-2">{t("table")}</th>
            <th className="border px-2 py-2">{t("customer")}</th>
            <th className="border px-2 py-2">{t("orders")}</th>
            <th className="border px-2 py-2">{t("created_at")}</th>
            <th className="border px-2 py-2">{t("total")}</th>
            <th className="border px-2 py-2">{t("status")}</th>
            <th className="border px-2 py-2">{t("status")}</th>
          </tr>
        </thead>
        <tbody>
          {bills.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center py-4 text-gray-500">
                {t("no_data")}
              </td>
            </tr>
          ) : (
            bills.map((bill) => (
              <tr key={bill.id} className="text-center hover:bg-gray-50 transition">
                <td className="border px-2 py-2">{bill.id}</td>
                <td className="border px-2 py-2">{bill.table_id || "-"}</td>
                <td className="border px-2 py-2">
                  {bill.customer?.first_name || "-"} {bill.customer?.last_name || ""}
                </td>
                <td className="border px-2 py-2">{bill.orders?.length || 1}</td>
                <td className="border px-2 py-2">{formatDate(bill.created_at)}</td>
                <td className="border px-2 py-2">{parseFloat(bill.total || 0).toFixed(2)} EGP</td>
                <td>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded ${bill.status === "paid"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                      }`}
                  >
                    {t(bill.status)}
                  </span>
                </td>
                <td className="border px-2 py-2">
                  <span className="text-xs px-2 py-1 rounded text-white bg-green-600">
                    {lang === "ar" ? bill.status_ar || "تم الدفع" : bill.status || "Paid"}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TodayBillsTable;
