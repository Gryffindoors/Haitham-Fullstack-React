import React, { useState } from "react";
import { useLanguage } from "../context/LanguageContext"; // ✅ make sure this works

const statusOptions = [
  { value: "empty", label_en: "Empty", label_ar: "فارغة" },
  { value: "reserved", label_en: "Reserved", label_ar: "محجوزة" },
  { value: "occupied", label_en: "Occupied", label_ar: "مشغولة" },
  { value: "out_of_order", label_en: "Out of Order", label_ar: "خارج الخدمة" },
  { value: "needs_clearing", label_en: "Needs Clearing", label_ar: "تحتاج تنظيف" },
];

export default function AssignTableModal({
  tableCode,
  onClose,
  onSave,
  reservedNumbers = [],
}) {
  const { lang } = useLanguage(); // 'en' or 'ar'
  const isArabic = lang === "ar";

  const [status, setStatus] = useState("empty");
  const [assignedTable, setAssignedTable] = useState("");

  const tableOptions = [
    {
      value: "",
      label: isArabic ? "-- إلغاء التخصيص --" : "-- Clear Assignment --",
    },
    ...Array.from({ length: 35 }, (_, i) => ({
      value: (i + 1).toString(),
      label: `${isArabic ? "طاولة" : "Table"} ${i + 1}`,
    })),
  ];

  const handleSubmit = () => {
    const tableNumber = assignedTable === "" ? null : assignedTable;
    onSave({ code: tableCode, status, assigned_table: tableNumber });
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 bg-black/30 rounded-2xl bg-opacity-40 flex items-center justify-center z-50 ${
        isArabic ? "dir-rtl text-right" : ""
      }`}
    >
      <div className="bg-white rounded-xl p-6 w-full max-w-sm">
        <h2 className="text-lg font-bold mb-4">
          {isArabic ? "تعديل" : "Edit"} {tableCode}
        </h2>

        <label className="block mb-2 font-medium">
          {isArabic ? "الحالة" : "Status"}
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full border px-3 py-2 rounded mb-4"
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {isArabic ? opt.label_ar : opt.label_en}
            </option>
          ))}
        </select>

        <label className="block mb-2 font-medium">
          {isArabic ? "تعيين المجموعة للطاولة" : "Assign to Group Table"}
        </label>
        <select
          value={assignedTable}
          onChange={(e) => setAssignedTable(e.target.value)}
          className="w-full border px-3 py-2 rounded mb-4"
        >
          {tableOptions
            .filter(
              (opt) =>
                opt.value === "" || !reservedNumbers.includes(opt.value)
            )
            .map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
        </select>

        <div className="flex justify-between">
          <button
            className="bg-gray-400 text-white px-4 py-2 rounded"
            onClick={onClose}
          >
            {isArabic ? "إلغاء" : "Cancel"}
          </button>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={handleSubmit}
          >
            {isArabic ? "حفظ" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
