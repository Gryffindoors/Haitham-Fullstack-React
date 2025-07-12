import React from "react";
import { useLanguage } from "../context/LanguageContext";

const OrderTable = ({ orders, onView, onEdit, onDelete }) => {
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
            <table className="min-w-full table-auto border">
                <thead>
                    <tr className="bg-gray-100 text-sm">
                        <th className="border px-2 py-2">{t("table")}</th>
                        <th className="border px-2 py-2">{t("order_type")}</th>
                        <th className="border px-2 py-2">{t("customer")}</th>
                        <th className="border px-2 py-2">{t("ordered_at")}</th>
                        <th className="border px-2 py-2">{t("status")}</th>
                        <th className="border px-2 py-2">{t("actions")}</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.id} className="text-sm text-center">
                            <td className="border px-2 py-2">
                                {order.table_id ? order.table_id : "-"}
                            </td>
                            <td className="border px-2 py-2">
                                {lang === "ar" ? order.order_type?.type_ar : order.order_type?.type || "-"}
                            </td>
                            <td className="border px-2 py-2">
                                {order.customer.first_name} {order.customer.last_name}
                            </td>
                            <td className="border px-2 py-2">
                                {formatDate(order.ordered_at)}
                            </td>
                            <td className="border px-2 py-2">
                                <span className="px-2 py-1 rounded text-white text-xs bg-blue-500">
                                    {lang === "ar" ? order.status.status_ar : order.status.status}
                                </span>
                            </td>
                            <td className="border px-2 py-2 space-x-1">
                                <button
                                    className="text-blue-600 hover:underline"
                                    onClick={() => onView(order)}
                                >
                                    {t("view")}
                                </button>
                                <button
                                    className="text-yellow-600 hover:underline"
                                    onClick={() => onEdit(order)}
                                >
                                    {t("edit")}
                                </button>
                                <button
                                    className="text-red-600 hover:underline"
                                    onClick={() => onDelete(order)}
                                >
                                    {t("delete")}
                                </button>
                            </td>
                        </tr>
                    ))}

                    {orders.length === 0 && (
                        <tr>
                            <td colSpan={6} className="text-center py-4 text-gray-500">
                                {t("no_data")}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default OrderTable;
