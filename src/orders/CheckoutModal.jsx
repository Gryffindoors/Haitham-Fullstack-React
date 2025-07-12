import React, { useState, useEffect } from "react"; // ✅ now includes useEffect
import { useMenuData } from "../context/MenuContext";
import { useLanguage } from "../context/LanguageContext";
import FormattedText from "../utils/FormattedText";
import FormattedInput from "../utils/FormattedInput";
import CustomerSelectInput from "./customers/CustomerSelectInput";
import toast from "react-hot-toast";
import { createCustomer } from "../api/orders/customers"; // adjust path
import { createOrder } from "../api/orders/orders"; // adjust path

const CheckoutModal = ({ cart = [], onClose, onSubmit }) => {
    const {
        customers = [],
        orderTypes = [],
        statuses = [],
        reloadMenuData,
    } = useMenuData();
    
    const { lang } = useLanguage();

    const [orderType, setOrderType] = useState("");
    const [tableNumber, setTableNumber] = useState("");
    const [customerId, setCustomerId] = useState(null);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [statusId, setStatusId] = useState(null);

    useEffect(() => {
        const defaultStatus = statuses.find(s => s.status === "pending");
        if (defaultStatus) setStatusId(defaultStatus.id);
    }, [statuses]);

    const [newCustomer, setNewCustomer] = useState({
        first_name: "",
        last_name: "",
        phone_number: "",
        address: "",
    });

    const selectedOrderType = orderTypes.find((t) => t.type === orderType);
    const order_type_id = selectedOrderType?.id;

    const handleNewCustomerChange = (field, value) => {
        setNewCustomer((prev) => ({ ...prev, [field]: value }));
    };

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
            if (!statusId) {
                toast.error("Please select an order status");
                return;
            }

            // 2. Post the order
            const payload = {
                order_type_id,
                table_id: orderType === "table" ? tableNumber : null,
                customer_id: finalCustomerId,
                status_id: statusId,
                items: cart.map((item) => ({
                    menu_item_id: item.id,
                    quantity: item.quantity,
                    unit_price: item.price,
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
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-xl p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-4 text-gray-400 hover:text-red-500 text-xl font-bold"
                >
                    ×
                </button>

                <h2 className="text-lg font-semibold mb-4 text-center">
                    <FormattedText id="checkout" defaultMessage="Checkout" />
                </h2>

                {/* Order Type */}
                <div className="mb-4">
                    <label className="block mb-1 text-sm font-medium">
                        <FormattedText id="order_type" defaultMessage="Order Type" />
                    </label>
                    <select
                        value={orderType}
                        onChange={(e) => setOrderType(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    >
                        <option value="">{lang === "ar" ? "اختر نوع الطلب" : "Select type"}</option>
                        {orderTypes.map((type) => (
                            <option key={type.id} className="capitalize" value={type.type}>
                                {lang === "ar" ? type.type_ar : type.type}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Table Number (if table) */}
                {orderType === "table" && (
                    <div className="mb-4">
                        <label className="block mb-1 text-sm font-medium">
                            <FormattedText id="table_number" defaultMessage="Table Number" />
                        </label>
                        <div className="grid grid-cols-7 gap-2 mt-2">
                            {Array.from({ length: 35 }, (_, i) => i + 1).map((num) => (
                                <button
                                    key={num}
                                    onClick={() => setTableNumber(num)}
                                    className={`py-1 rounded text-sm border 
        ${tableNumber === num ? "bg-yellow-500 text-white font-bold" : "bg-gray-100 hover:bg-gray-200"}`}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>

                    </div>
                )}

                {/* Customer Selection */}
                <div className="mb-4">
                    <label className="block mb-1 text-sm font-medium">
                        <FormattedText id="customer" defaultMessage="Customer" />
                    </label>
                    <CustomerSelectInput
                        customers={customers}
                        value={customerId}
                        onSelect={setCustomerId}
                        onAddNew={() => {
                            setCustomerId(null);
                            setIsAddingNew(true);
                        }}
                    />
                </div>

                {/* New Customer Fields */}
                {isAddingNew && (
                    <div className="space-y-3 bg-gray-50 border p-4 rounded">
                        <FormattedInput
                            name="first_name"
                            value={newCustomer.first_name}
                            onChange={(e) => handleNewCustomerChange("first_name", e.target.value)}
                            placeholder={lang === "ar" ? "الاسم الأول" : "First Name"}
                        />
                        <FormattedInput
                            name="last_name"
                            value={newCustomer.last_name}
                            onChange={(e) => handleNewCustomerChange("last_name", e.target.value)}
                            placeholder={lang === "ar" ? "اسم العائلة" : "Last Name"}
                        />
                        <FormattedInput
                            name="phone_number"
                            value={newCustomer.phone_number}
                            onChange={(e) => handleNewCustomerChange("phone_number", e.target.value)}
                            placeholder={lang === "ar" ? "رقم الهاتف" : "Phone Number"}
                        />
                        <FormattedInput
                            name="address"
                            value={newCustomer.address}
                            onChange={(e) => handleNewCustomerChange("address", e.target.value)}
                            placeholder={lang === "ar" ? "العنوان (اختياري)" : "Address (optional)"}
                        />
                    </div>
                )}

                <div className="mb-4">
                    <label className="block mb-1 text-sm font-medium">
                        <FormattedText id="order_status" defaultMessage="Order Status" />
                    </label>
                    <select
                        value={statusId || ""}
                        onChange={(e) => setStatusId(Number(e.target.value))}
                        className="w-full border rounded px-3 py-2 capitalize"
                    >
                        <option value="">
                            {lang === "ar" ? "اختر الحالة" : "Select status"}
                        </option>
                        {statuses.map((s) => (
                            <option key={s.id} value={s.id} className="capitalize">
                                {lang === "ar" ? s.status_ar : s.status}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Submit */}
                <button
                    onClick={handleSubmit}
                    className="mt-6 w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600"
                >
                    <FormattedText id="confirm_checkout" defaultMessage="Confirm Order" />
                </button>
            </div>
        </div>
    );
};

export default CheckoutModal;
