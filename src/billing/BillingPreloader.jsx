import React, { useEffect, useState } from "react";
import { getPaymentMethods, getBillById } from "../api/payment/paymentApi";

// ✅ Only used after a bill has been created
const BillingPreloader = ({ billId, children }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bill, setBill] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const methods = await getPaymentMethods();
        setPaymentMethods(methods || []);

        if (!billId) throw new Error("Missing bill ID");

        const billData = await getBillById(billId);
        setBill(billData);
      } catch (err) {
        console.error("❌ BillingPreloader error", err);
        setError(err.message || "Unexpected error");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [billId]);

  if (loading) return <p>Loading billing info...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!bill) return <p>No bill found</p>;

  return children({ bill, paymentMethods });
};

export default BillingPreloader;
