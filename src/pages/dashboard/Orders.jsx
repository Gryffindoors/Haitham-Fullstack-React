import React, { useEffect, useState } from "react";
import OrderTable from "../../orders/OrderTable";
import { getOrders, getOrderById, deleteOrder } from "../../api/orders/orders";
import toast from "react-hot-toast";


export default function OrdersDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [refreshFlag, setRefreshFlag] = useState(false);

  useEffect(() => {
    const loadOrders = async () => {
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

    loadOrders();
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
                setRefreshFlag((prev) => !prev);
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
      // Add modal logic here if needed
    } catch (err) {
      console.error("❌ Failed to load order by ID", err);
      toast.error("Failed to load order details");
    }
  };

  return loading ? (
    <p className="text-center text-gray-500">Loading...</p>
  ) : (
    <OrderTable
      orders={orders}
      onView={(order) => handleSelectOrder(order.id)}
      onEdit={(order) => handleSelectOrder(order.id)}
      onDelete={handleDelete}
    />
  );
}
