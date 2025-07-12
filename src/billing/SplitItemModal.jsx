// src/components/billing/SplitItemModal.jsx

import React, { useState } from "react";
import { useLanguage } from "../context/LanguageContext";

const SplitItemModal = ({ orders, menuItems = [], onClose, onConfirm }) => {
  const { t, lang } = useLanguage();


  // Map item ID to localized name
  const getItemName = (id) => {
    const item = menuItems.find((m) => m.id === id);
    return lang === "ar" ? item?.name_ar : item?.name || `#${id}`;
  };

  // Only one order is allowed for item split
  const order = orders?.[0];

  if (!order?.items) {
    console.warn("⚠️ order.items is missing in SplitItemModal");
    return (
      <div className="p-4 text-red-600 font-bold">
        No order items available to split.
      </div>
    );
  }

  const initialSplits = order.items.map((item) => ({
    ...item,
    itemName: getItemName(item.menu_item_id),
    splitQuantity: item.quantity,
  }));


  const [splits, setSplits] = useState(initialSplits);

  const handleQtyChange = (index, value) => {
    const updated = [...splits];
    updated[index].splitQuantity = parseFloat(value);
    setSplits(updated);
  };

  const handleConfirm = () => {
    const selectedItems = splits
      .filter((i) => parseFloat(i.splitQuantity || 0) > 0)
      .map((i) => ({
        id: i.id, // This is assumed to be the order_items.id
        item_id: i.item_id, // Just for UI reference
        quantity: parseFloat(i.splitQuantity),
      }));

    onConfirm([
      {
        items: selectedItems,     // used to extract item_ids in Finalize modal
        method: null,
        tips: 0,
        tax: 0,
        service: 0,
      }
    ]);
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded shadow-lg w-full max-w-3xl p-6 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-bold mb-4">{t("split_by_items")}</h3>

        <table className="w-full table-auto text-sm border mb-4">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1">{t("item")}</th>
              <th className="border px-2 py-1">{t("original_qty")}</th>
              <th className="border px-2 py-1">{t("split_qty")}</th>
            </tr>
          </thead>
          <tbody>
            {splits.map((item, idx) => (
              <tr key={item.id || idx} className="text-center">
                <td className="border px-2 py-1">{item.itemName}</td>
                <td className="border px-2 py-1">{item.quantity}</td>
                <td className="border px-2 py-1">
                  <input
                    type="number"
                    min={0}
                    max={item.quantity}
                    value={item.splitQuantity}
                    onChange={(e) => handleQtyChange(idx, e.target.value)}
                    className="border rounded px-2 py-1 w-20 text-center"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded text-gray-600"
          >
            {t("cancel")}
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 rounded text-white bg-green-600 hover:bg-green-700"
          >
            {t("confirm")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SplitItemModal;
