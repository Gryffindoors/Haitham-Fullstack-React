import React, { useEffect, useState } from "react";
import { getOrders } from "../api/orders/orders";
import { useLanguage } from "../context/LanguageContext";
import { useMenuData } from "../context/MenuContext"; // 
import OrderFormModal from "../orders/OrderFormModal";
import OrderTable from "../orders/OrderTable";
import OrderGUIModal from "../orders/OrderGUIModal";
import toast from "react-hot-toast";
import { getOrderById, deleteOrder } from "../api/orders/orders"; // 


const OrdersPage = () => {
  const { t } = useLanguage();
  const { menuItems, reloadMenuData, clearOrderModalCache } = useMenuData();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const load = async () => {
      const toastId = toast.loading("📦 Loading orders...");
      setLoading(true);
      try {
        const data = await getOrders();
        setOrders(data);
        toast.success("✅ Orders loaded", { id: toastId });
      } catch (err) {
        console.error("Failed to load orders:", err);
        toast.error("❌ Failed to load orders", { id: toastId });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [refreshFlag]);

  const handleDelete = (order) => {
    toast.custom((t) => (
      <div className="bg-white shadow-lg rounded-lg p-4 border border-gray-300 max-w-sm w-full">
        <p className="mb-2 font-semibold text-gray-800">
          Are you sure you want to delete order #{order.id}?
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 text-sm rounded border border-gray-300 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              const deletingToast = toast.loading("Deleting...");
              try {
                await deleteOrder(order.id);
                toast.success("✅ Order deleted", { id: deletingToast });
                handleRefresh(); // make sure this exists
              } catch (err) {
                console.error("❌ Delete failed", err);
                toast.error("❌ Failed to delete order", { id: deletingToast });
              }
            }}
            className="px-3 py-1 text-sm rounded bg-red-500 text-white hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    ));
  };

  const handleSelectOrder = async (orderId) => {
    try {
      const fullOrder = await getOrderById(orderId);
      setSelectedOrder(fullOrder);
    } catch (err) {
      console.error("❌ Failed to load order by ID", err);
      toast.error("Failed to load order details");
    }
  };


  const handleRefresh = () => setRefreshFlag(prev => !prev);

  const handleFullRefresh = () => {
    clearOrderModalCache();
    reloadMenuData();      // force-fetch new menu data
    setRefreshFlag(prev => !prev); // reload orders too
  };


  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">{t("orders")}</h1>
        <div className="flex gap-2">
          <button
            onClick={handleFullRefresh}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {t("refresh_data")}
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            {t("add_new")}
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">{t("loading")}</p>
      ) : (
        <OrderTable
          orders={orders}
          onView={(order) => handleSelectOrder(order.id)}
          onEdit={(order) => handleSelectOrder(order.id)}
          onDelete={handleDelete}
        />

      )}

      {selectedOrder && (
        <OrderGUIModal
          initialData={selectedOrder}   // ✅ pass order data for edit
          onClose={() => setSelectedOrder(null)}
          onSuccess={() => {
            setSelectedOrder(null);
            handleRefresh();
          }}
        />
      )}

      {showForm && (
        <OrderGUIModal
          onClose={() => setShowForm(false)}
          onSuccess={handleRefresh}
        />
      )}

    </div>
  );
};

export default OrdersPage;
