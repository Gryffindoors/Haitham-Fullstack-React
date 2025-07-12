// src/pages/dashboard/reports.jsx

import React, { useState } from "react";
import { useReports } from "../../context/ReportsContext";
import { useLanguage } from "../../context/LanguageContext";
import dayjs from "dayjs";

const reportOptions = [
  { key: "profit", label: "monthly_profit" },
  { key: "trend", label: "profit_trend" },
  { key: "topMenu", label: "top_menu_items" },
  { key: "lowStock", label: "low_stock" },
  { key: "usage", label: "ingredient_usage" },
  { key: "staff", label: "staff_performance" },
  { key: "topStaff", label: "top_performers" },
  { key: "discipline", label: "discipline_ranking" },
  { key: "costs", label: "operating_costs" },
  { key: "tables", label: "table_usage" },
];

const ReportsPage = () => {
  const { reports, loading, refreshReports } = useReports();
  const { t, lang } = useLanguage();

  const [filters, setFilters] = useState({
    month: dayjs().format("MM"),
    year: dayjs().format("YYYY"),
    department: "all",
  });
  const [selectedReport, setSelectedReport] = useState("profit");

  if (loading) return <p className="text-gray-600">{t("loading") || "Loading reports..."}</p>;
  if (!reports) return <p className="text-red-500">{t("no_data") || "No report data available."}</p>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const formattedData = (data) => {
    if (!data) return "No data.";
    if (Array.isArray(data)) {
      return data.map((entry, i) => (
        <div key={i} className="mb-2 p-2 bg-gray-100 dark:bg-gray-700 rounded">
          {Object.entries(entry).map(([k, v]) => (
            <div key={k} className="text-sm text-gray-800 dark:text-gray-200">
              <strong>{k}:</strong> {String(v)}
            </div>
          ))}
        </div>
      ));
    }
    if (typeof data === "object") {
      return Object.entries(data).map(([k, v]) => (
        <div key={k} className="text-sm text-gray-800 dark:text-gray-200">
          <strong>{k}:</strong> {String(v)}
        </div>
      ));
    }
    return <p>{String(data)}</p>;
  };

  return (
    <div className="space-y-6 mt-12" dir={lang === "ar" ? "rtl" : "ltr"}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold">{t("reports_dashboard") || "Reports Dashboard"}</h1>

        <div className="flex gap-3 flex-wrap">
          <select
            name="month"
            value={filters.month}
            onChange={handleChange}
            className="border px-2 py-1 rounded text-sm"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={(i + 1).toString().padStart(2, "0")}>
                {t("month") || "Month"} {i + 1}
              </option>
            ))}
          </select>

          <select
            name="year"
            value={filters.year}
            onChange={handleChange}
            className="border px-2 py-1 rounded text-sm"
          >
            {Array.from({ length: 5 }, (_, i) => {
              const year = new Date().getFullYear() - i;
              return <option key={year} value={year}>{year}</option>;
            })}
          </select>

          <select
            name="department"
            value={filters.department}
            onChange={handleChange}
            className="border px-2 py-1 rounded text-sm"
          >
            <option value="all">{t("all_departments") || "All Departments"}</option>
            <option value="kitchen">{t("kitchen") || "Kitchen"}</option>
            <option value="service">{t("service") || "Service"}</option>
            <option value="delivery">{t("delivery") || "Delivery"}</option>
          </select>

          <select
            value={selectedReport}
            onChange={(e) => setSelectedReport(e.target.value)}
            className="border px-2 py-1 rounded text-sm"
          >
            {reportOptions.map((r) => (
              <option key={r.key} value={r.key}>
                {t(r.label) || r.label}
              </option>
            ))}
          </select>

          <button
            onClick={refreshReports}
            className="px-3 py-1 bg-blue-600 text-white rounded shadow hover:bg-blue-700 text-sm"
          >
            {t("refresh") || "Refresh"}
          </button>
        </div>
      </div>

      <div className="p-4 border rounded shadow bg-white dark:bg-gray-800">
        <h2 className="text-lg font-semibold mb-4">
          {t(reportOptions.find((r) => r.key === selectedReport)?.label) || selectedReport}
        </h2>

        {Array.isArray(reports[selectedReport]) ? (
          <div className="overflow-auto">
            <table className="min-w-full text-sm text-left rtl:text-right text-gray-800 dark:text-gray-200">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700">
                  {Object.keys(reports[selectedReport][0] || {}).map((col) => (
                    <th key={col} className="px-3 py-2 whitespace-nowrap">{t(col) || col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reports[selectedReport].map((row, idx) => (
                  <tr key={idx} className="border-t">
                    {Object.values(row).map((val, i) => (
                      <td key={i} className="px-3 py-2 whitespace-nowrap">
                        {typeof val === "object" ? JSON.stringify(val) : String(val)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : typeof reports[selectedReport] === "object" && reports[selectedReport] !== null ? (
          <table className="min-w-full text-sm text-left rtl:text-right text-gray-800 dark:text-gray-200">
            <tbody>
              {Object.entries(reports[selectedReport]).map(([key, value]) => (
                <tr key={key} className="border-t last:border-b">
                  <td className="font-medium px-3 py-2 bg-gray-50 dark:bg-gray-700 whitespace-nowrap">{t(key) || key}</td>
                  <td className="px-3 py-2">{typeof value === "object" ? JSON.stringify(value) : String(value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-600 italic">{t("no_data") || "No data available."}</p>
        )}
      </div>

    </div>
  );
};

export default ReportsPage;
