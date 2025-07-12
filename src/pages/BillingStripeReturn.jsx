// src/pages/BillingStripeReturn.jsx

import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";
import toast from "react-hot-toast";
import { verifyStripeSession } from "../api/payment/paymentApi";

const BillingStripeReturn = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      const sessionId = params.get("session_id");
      if (!sessionId) {
        toast.error("Missing session ID");
        navigate("/billing/start");
        return;
      }

      try {
        toast.loading("Verifying payment...");
        const result = await verifyStripeSession(sessionId);

        if (result?.status === "paid" || result?.success) {
          toast.success("Payment successful");
        } else {
          toast.error("Payment not verified");
        }
      } catch (err) {
        console.error("❌ Stripe verification failed", err);
        toast.error("Failed to verify payment");
      } finally {
        toast.dismiss();
        navigate("/billing/start");
      }
    };

    verify();
  }, [params, navigate]);

  return null;
};

export default BillingStripeReturn;
