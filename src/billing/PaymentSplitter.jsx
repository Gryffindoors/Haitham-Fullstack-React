import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { useLanguage } from "../context/LanguageContext";
import BillingPreloader from "../billing/BillingPreloader";
import toast from "react-hot-toast";

const PaymentSplitter = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { state } = useLocation();
  const selectedOrderIds = state?.selectedOrderIds || JSON.parse(sessionStorage.getItem("selectedOrderIds") || "[]");

  const [groups, setGroups] = useState([]);

  const handleAssignItem = (item, groupIndex) => {
    const updatedGroups = groups.map((g) => ({
      ...g,
      items: g.items.filter((i) => i.id !== item.id),
    }));

    updatedGroups[groupIndex].items.push(item);
    setGroups(updatedGroups);
  };

  const handleChangeMethod = (groupIndex, methodId) => {
    const updated = [...groups];
    updated[groupIndex].methodId = methodId;
    setGroups(updated);
  };

  const handleAddGroup = (defaultMethodId = null) => {
    const newId = groups.length + 1;
    setGroups([...groups, { id: newId, items: [], methodId: defaultMethodId }]);
  };

  const handleSubmitSplit = async (billId) => {
    const payload = groups.map((g) => ({
      payment_method_id: g.methodId,
      item_ids: g.items.map((i) => i.id),
    }));

    // ✅ Validate assignment
    const allAssigned = payload.flatMap((g) => g.item_ids);
    if (!allAssigned.length || allAssigned.length < groups.reduce((sum, g) => sum + g.items.length, 0)) {
      toast.error(t("please_assign_all_items"));
      return;
    }

    try {
      await splitBill(billId, { groups: payload });
      toast.success(t("split_successful"));
      navigate("/billing/start");
    } catch (err) {
      console.error("❌ Split failed", err);
      toast.error(t("error_occurred"));
    }
  };

  return (
    <BillingPreloader selectedOrderIds={selectedOrderIds}>
      {({ bill, paymentMethods }) => {
        const items = bill.items || [];

        // ✅ Initialize groups only once
        if (groups.length === 0 && paymentMethods.length) {
          setGroups([
            { id: 1, items: [], methodId: paymentMethods[0]?.id || null },
          ]);
        }

        const unassigned = items.filter(
          (item) => !groups.some((g) => g.items.find((i) => i.id === item.id))
        );

        return (
          <div className="p-4 max-w-4xl mx-auto">
            <h2 className="text-xl font-bold mb-4">{t("split_by_items")}</h2>

            <div className="flex flex-wrap gap-6">
              {groups.map((group, idx) => (
                <div key={group.id} className="border rounded shadow p-4 w-full sm:w-64">
                  <h3 className="font-semibold mb-2">
                    {t("group")} {group.id}
                  </h3>

                  <select
                    className="w-full border px-2 py-1 mb-2 rounded"
                    value={group.methodId || ""}
                    onChange={(e) => handleChangeMethod(idx, e.target.value)}
                  >
                    <option value="">{t("select_payment_method")}</option>
                    {paymentMethods.map((m) => (
                      <option key={m.id} value={m.id}>
                        {lang === "ar" ? m.name_ar : m.name}
                      </option>
                    ))}
                  </select>

                  <ul className="text-sm space-y-1">
                    {group.items.map((item) => (
                      <li key={item.id} className="border-b py-1">
                        {item.name} - {item.price}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              <button
                onClick={() => handleAddGroup(paymentMethods[0]?.id)}
                className="bg-gray-100 border rounded px-3 py-2 h-fit mt-6 hover:bg-gray-200"
              >
                + {t("add_group")}
              </button>
            </div>

            <div className="mt-6">
              <h4 className="text-md font-medium mb-2">{t("unassigned_items")}:</h4>
              <div className="flex flex-wrap gap-2">
                {unassigned.map((item) => (
                  <div
                    key={item.id}
                    className="bg-yellow-100 px-3 py-1 rounded text-sm cursor-pointer hover:bg-yellow-200"
                    onClick={() => handleAssignItem(item, 0)}
                  >
                    {item.name} ({item.price})
                  </div>
                ))}
              </div>
            </div>

            <div className="text-right mt-8">
              <button
                onClick={() => handleSubmitSplit(bill.id)}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                {t("confirm_split")}
              </button>
            </div>
          </div>
        );
      }}
    </BillingPreloader>
  );
};

export default PaymentSplitter;
