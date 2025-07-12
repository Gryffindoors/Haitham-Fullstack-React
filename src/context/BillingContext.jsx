// src/context/BillingContext.jsx

import React, { createContext, useEffect, useState } from "react";
import { getOrders } from "../api/orders/orders";
import { getTodayBills, getPaymentMethods } from "../api/payment/paymentApi";
import { getOrderModalData } from "../api/orders/getOrderModalData";

export const BillingContext = createContext();

export const BillingProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [bills, setBills] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [menuData, setMenuData] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isReady, setIsReady] = useState(false);

  const fetchBillingData = async () => {
    setLoading(true);
    try {
      const [ordersData, billsData, methodsData, modalData] = await Promise.all([
        getOrders(),
        getTodayBills(),
        getPaymentMethods(),
        getOrderModalData(),
      ]);

      setOrders(ordersData || []);
      setBills(billsData || []);
      setPaymentMethods(methodsData || []);
      setMenuData(modalData || {});
      setError(null);
    } catch (err) {
      console.error("BillingContext load error", err);
      setError(err.message || "Failed to load billing data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      await fetchBillingData();
      setIsReady(true);
    };
    init();
  }, []);

  return (
    <BillingContext.Provider
      value={{
        orders,
        bills,
        paymentMethods,
        menuData,
        loading,
        error,
        isReady,
        refresh: fetchBillingData,
      }}
    >
      {children}
    </BillingContext.Provider>
  );
};
  