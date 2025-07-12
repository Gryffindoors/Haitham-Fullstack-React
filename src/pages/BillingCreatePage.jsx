import React, { useEffect, useState, useMemo, useContext } from "react";
import { useLocation, useNavigate } from "react-router";
import { useLanguage } from "../context/LanguageContext";
import { BillingContext } from "../context/BillingContext";
import toast from "react-hot-toast";
import { getOrderById } from "../api/orders/orders";

import FinalizePaymentModal from "../billing/FinalizePaymentModal";
import SplitAmountModal from "../billing/SplitAmountModal";
import SplitItemModal from "../billing/SplitItemModal";

const BillingCreatePage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { state } = useLocation();

  const selectedOrderIds =
    state?.selectedOrderIds || JSON.parse(sessionStorage.getItem("selectedOrderIds") || "[]");

  // ✅ Early redirect if no orders selected
  if (!selectedOrderIds || selectedOrderIds.length === 0) {
    toast.error(t("no_orders_selected"));
    return navigate("/billing", { replace: true });
  }

  const {
    orders: allOrders,
    paymentMethods,
    menuData,
    isReady,
    error,
  } = useContext(BillingContext);

  const [finalPayloads, setFinalPayloads] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [splitMode, setSplitMode] = useState("full");
  const [showAmountModal, setShowAmountModal] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [showFinalizeModal, setShowFinalizeModal] = useState(false);

  const [splitPayments, setSplitPayments] = useState([]);
  const [itemSplits, setItemSplits] = useState([]);
  const [finalSplitType, setFinalSplitType] = useState("amount");

  const [splitTotal, setSplitTotal] = useState(0);
  const [remainingAmount, setRemainingAmount] = useState(0);

  const allowItemSplit = orders.length === 1;

  useEffect(() => {
    if (!isReady) return;

    const fetchSelectedOrders = async () => {
      try {
        const result = await Promise.all(
          selectedOrderIds.map((id) => getOrderById(id))
        );
        setOrders(result);
      } catch (err) {
        toast.error(t("orders_not_found"));
        navigate("/billing/start");
      } finally {
        setLoading(false);
      }
    };

    fetchSelectedOrders();
  }, [isReady]);

  const totalAmount = useMemo(
    () => orders.reduce((sum, order) => sum + parseFloat(order.total || 0), 0),
    [orders]
  );

  const handleContinue = () => {
    setSplitPayments([]);
    // setItemSplits([]);

    if (splitMode === "byItem" && allowItemSplit) {
      setFinalSplitType("items");
      setShowItemModal(true);
    } else {
      setFinalSplitType("amount");
      setShowAmountModal(true);
    }
  };

  const [stage, setStage] = useState("");
  const allItems = orders[0]?.items?.map((i) => i.id) || [];
  const selectedItems = itemSplits.flatMap((group) =>
    group?.items?.map((i) => i.id) || []
  );
  const remainingItems = allItems.filter((id) => !selectedItems.includes(id));

  useEffect(() => {
    if (stage === "items-remaining") {
      setShowAmountModal(true);
    }
  }, [stage]);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">{t("create_bill")}</h2>

      {loading || !isReady ? (
        <div className="text-gray-500 animate-pulse">{t("loading")}</div>
      ) : (
        <>
          <p className="mb-4">
            {t("total_selected_orders")}: <strong>{orders.length}</strong>
          </p>
          <p className="mb-6">
            {t("total_amount")}: <strong>{totalAmount.toFixed(2)} EGP</strong>
          </p>

          <div className="border rounded p-4 bg-gray-50 text-sm">
            <p className="mb-2 text-gray-700">{t("split_or_select_payment")}</p>

            {allowItemSplit && (
              <div className="mb-4">
                <label className="block text-gray-600 font-medium mb-1">{t("split_type")}</label>
                <select
                  value={splitMode}
                  onChange={(e) => setSplitMode(e.target.value)}
                  className="border rounded px-3 py-2 w-full"
                >
                  <option value="full">{t("full_order")}</option>
                  <option value="byItem">{t("split_by_items")}</option>
                </select>
              </div>
            )}

            <div className="mt-6 text-right">
              <button
                onClick={handleContinue}
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
              >
                {t("continue_to_payment")}
              </button>
            </div>
          </div>
        </>
      )}

      {showAmountModal && (
        <SplitAmountModal
          total={
            finalSplitType === "items" ? splitTotal :
              finalSplitType === "remaining" ? remainingAmount :
                totalAmount
          }
          paymentMethods={paymentMethods}
          orders={orders}
          onClose={() => setShowAmountModal(false)}
          onConfirm={(entries) => {
            setShowAmountModal(false);

            if (stage === "items-first") {
              // Save first payment entry for selected items
              const itemPayload = entries.map((p, i) => {
                const group = itemSplits[i];
                if (!group || !group.items?.length) return null;

                return {
                  order_ids: selectedOrderIds.map(Number),
                  item_ids: group.items.map(i => i.id),
                  amount: parseFloat(p.amount),
                  payment_method_id: parseInt(p.method),
                  tax: parseFloat(p.tax || 0),
                  service_charge: parseFloat(p.service_charge || 0),
                  tips: parseFloat(p.tips || 0),
                };

              }).filter(Boolean);

              // Store the first payload (partial items only)
              setFinalPayloads(itemPayload); // override previous state
              setFinalSplitType("remaining");
              setStage("items-remaining"); // trigger second modal for remainder
              return;
            }


            if (stage === "items-remaining") {
              const allItems = orders[0]?.items?.map((i) => i.id) || [];
              const selectedItems = itemSplits.flatMap((group) => group.items.map((i) => i.id));
              const remainingItems = allItems.filter((id) => !selectedItems.includes(id));

              if (remainingItems.length === 0) {
                toast.error(t("no_remaining_items_found"));
                return;
              }

              const remainingPayload = entries.map(p => ({
                order_ids: selectedOrderIds.map(Number),
                item_ids: remainingItems,
                amount: parseFloat(p.amount),
                payment_method_id: parseInt(p.method),
                tax: parseFloat(p.tax || 0),
                service_charge: parseFloat(p.service_charge || 0),
                tips: parseFloat(p.tips || 0),
              }));

              // Combine first and second payload
              const fullPayloads = [...finalPayloads, ...remainingPayload];
              setFinalPayloads(fullPayloads); // set both at once
              setStage("done"); // optional safeguard
              setTimeout(() => {
                setShowFinalizeModal(true); // wait for state update
              }, 0);
              return;
            }


            // fallback (e.g., regular flow)
            const fallbackPayload = entries.map(p => ({
              order_ids: selectedOrderIds.map(Number),
              item_ids: [],
              amount: parseFloat(p.amount),
              payment_method_id: parseInt(p.method),
              tax: parseFloat(p.tax || 0),
              service_charge: parseFloat(p.service_charge || 0),
              tips: parseFloat(p.tips || 0),
            }));

            setFinalPayloads(fallbackPayload);

            setTimeout(() => {
              setShowFinalizeModal(true);
            }, 10);


          }}
        />
      )}

      {showItemModal && (
        <SplitItemModal
          orders={orders}
          menuItems={menuData?.menuItems || []}
          onClose={() => setShowItemModal(false)}
          onConfirm={(itemSplits) => {
            try {
              const splitItems = itemSplits[0]?.items || [];

              if (!orders[0]?.items) {
                toast.error("Order items not loaded.");
                return;
              }

              const partialTotal = splitItems.reduce((sum, i) => {
                const itemDetail = orders[0].items.find((x) => x.id === i.id);
                if (!itemDetail) {
                  console.warn(`⚠️ No match for item ID ${i.id}`);
                  return sum;
                }
                const unitPrice = (itemDetail.total_price || 0) / (itemDetail.quantity || 1);
                return sum + unitPrice * i.quantity;
              }, 0);

              setItemSplits(itemSplits);
              setSplitTotal(partialTotal);
              setRemainingAmount(Math.max(0, totalAmount - partialTotal));
              setFinalSplitType("items");
              setStage("items-first");
              setShowItemModal(false);
              setShowAmountModal(true);
            } catch (err) {
              console.error("❌ Error in item split processing:", err);
              toast.error("Error during split processing.");
            }
          }}
        />
      )}

      {showFinalizeModal && finalPayloads && (
        <FinalizePaymentModal
          payloads={finalPayloads}
          onClose={() => setShowFinalizeModal(false)}
        />
      )}
    </div>
  );
};

export default BillingCreatePage;
