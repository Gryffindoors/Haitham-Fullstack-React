import React, { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import CustomerSelectInput from "./customers/CustomerSelectInput";
import CustomerFormModal from "./customers/CustomerFormModal";
import FormattedInput from "../utils/FormattedInput";
import { createOrder } from "../api/orders/orders";
import { getOrderModalData } from "../api/orders/getOrderModalData";
import { useMenuData } from "../context/MenuContext"; // for reloadMenuData


const OrderFormModal = ({ onClose, onSuccess, menuItems = [] }) => {
  const { t, lang } = useLanguage();
  const [customers, setCustomers] = useState([]);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [orderTypes, setOrderTypes] = useState([]);
  const [statuses, setStatuses] = useState([]);

  const [form, setForm] = useState({
    customer_id: null,
    order_type_id: null,
    table_id: "",
    status_id: null,
    items: [
      { menu_item_id: "", quantity: 1 }
    ]
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [menuCategories, setMenuCategories] = useState([]);

  useEffect(() => {
    const load = async () => {
      const {
        customers,
        orderTypes,
        statuses,
        menuItems,
        menuCategories
      } = await getOrderModalData();

      setCustomers(customers);
      setOrderTypes(orderTypes);
      setStatuses(statuses);
      setMenuItems(menuItems);
      setMenuCategories(menuCategories);
    };
    load();
  }, []);

  const { reloadMenuData } = useMenuData(); // ✅


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...form.items];
    updatedItems[index][field] = value;
    setForm((prev) => ({ ...prev, items: updatedItems }));
  };

  const addItemRow = () => {
    setForm((prev) => ({ ...prev, items: [...prev.items, { menu_item_id: "", quantity: 1 }] }));
  };

  const removeItemRow = (index) => {
    const updated = form.items.filter((_, i) => i !== index);
    setForm((prev) => ({ ...prev, items: updated }));
  };

  const total = form.items.reduce((sum, item) => {
    const product = menuItems.find((m) => m.id == item.menu_item_id);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  const handleSubmit = async () => {
    let finalCustomerId = customerId;

    const savingToastId = toast.loading("⏳ Saving order...");

    try {
      // 1. Create customer if needed
      if (isAddingNew && newCustomer?.first_name && newCustomer?.phone_number) {
        const response = await createCustomer(newCustomer);
        finalCustomerId = response.id; // or response.data?.id depending on backend
        await reloadMenuData(true); // ✅ refresh context data to include new customer
      }

      // 2. Post the order
      const payload = {
        order_type,
        table_number: orderType === "table" ? tableNumber : null,
        customer_id: finalCustomerId,
        items: cartItems.map((item) => ({
          menu_item_id: item.id,
          quantity: item.qty,
          price: item.price,
        })),
      };

      await createOrder(payload);
      toast.success("✅ Order created successfully", { id: savingToastId });
      onClose();
      onSubmit?.(); // optional refresh trigger
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to save order", { id: savingToastId });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-2xl p-6 rounded shadow-lg overflow-y-auto max-h-screen" dir={lang === "ar" ? "rtl" : "ltr"}>
        <h2 className="text-xl font-bold mb-4 text-center">{t("add_new_order")}</h2>

        <div className="space-y-4">
          <CustomerSelectInput
            customers={customers}
            value={form.customer_id}
            onSelect={(id) => setForm((f) => ({ ...f, customer_id: id }))}
            onAddNew={() => setShowCustomerModal(true)}
          />

          <select
            name="order_type_id"
            value={form.order_type_id || ""}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2"
          >
            <option value="" disabled>{t("select_order_type")}</option>
            {orderTypes.map((o) => (
              <option key={o.id} value={o.id}>
                {lang === "ar" ? o.type_ar : o.type}
              </option>
            ))}
          </select>

          {form.order_type_id == 1 && (
            <FormattedInput
              name="table_id"
              value={form.table_id}
              onChange={handleChange}
              placeholder={t("table_number")}
            />
          )}

          <select
            name="status_id"
            value={form.status_id || ""}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2"
          >
            <option value="" disabled>{t("select_status")}</option>
            {statuses.map((s) => (
              <option key={s.id} value={s.id}>
                {lang === "ar" ? s.status_ar : s.status}
              </option>
            ))}
          </select>

          <div className="space-y-2">
            {form.items.map((item, i) => (
              <div key={i} className="flex gap-2">
                <select
                  value={item.menu_item_id || ""}
                  onChange={(e) => handleItemChange(i, "menu_item_id", e.target.value)}
                  className="flex-1 border rounded px-2 py-1"
                >
                  <option value="" disabled>{t("select_item")}</option>
                  {menuItems.map((m) => (
                    <option key={m.id} value={m.id}>
                      {lang === "ar" ? m.name_ar : m.name} — {m.price}
                    </option>
                  ))}
                </select>
                <FormattedInput
                  name={`quantity-${i}`}
                  value={item.quantity}
                  onChange={(e) => handleItemChange(i, "quantity", e.target.value)}
                  type="number"
                />
                <button onClick={() => removeItemRow(i)} className="text-red-500">✕</button>
              </div>
            ))}
            <button onClick={addItemRow} className="text-blue-600 text-sm underline">
              {t("add_item")}
            </button>
          </div>

          <div className="text-right font-bold">
            {t("total")}: {total.toFixed(2)}
          </div>

          {error && <div className="text-red-600 text-sm text-center">{error}</div>}

          <div className="flex justify-between mt-4">
            <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">{t("cancel")}</button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              {loading ? t("loading") : t("save")}
            </button>
          </div>
        </div>
      </div>

      {showCustomerModal && (
        <CustomerFormModal
          onClose={() => setShowCustomerModal(false)}
          onSuccess={(newCust) => {
            setCustomers((prev) => [...prev, newCust]);
            setForm((f) => ({ ...f, customer_id: newCust.id }));
          }}
        />
      )}
    </div>
  );
};

export default OrderFormModal;
