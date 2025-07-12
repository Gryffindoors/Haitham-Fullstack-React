// src/context/MenuContext.jsx

import { createContext, useContext, useEffect, useState } from "react";
import { getOrderModalData, clearOrderModalCache } from "../api/orders/getOrderModalData";

const MenuContext = createContext();

export const useMenuData = () => useContext(MenuContext);

// src/context/MenuContext.jsx
export const MenuProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orderTypes, setOrderTypes] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadMenuData = async (force = false) => {
    setLoading(true);
    try {
      const {
        customers,
        orderTypes,
        statuses,
        menuItems,
        menuCategories,
      } = await getOrderModalData(force);

      setCustomers(customers || []);
      setOrderTypes(orderTypes || []);
      setStatuses(statuses || []);
      setItems(menuItems || []);
      setCategories(menuCategories || []);
    } catch (err) {
      console.error("[MenuContext] ❌ Failed to load menu data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMenuData();
  }, []);

  return (
    <MenuContext.Provider
      value={{
        items,
        categories,
        customers,
        orderTypes,
        statuses,
        loading,
        clearOrderModalCache,
        reloadMenuData: () => loadMenuData(true), // 🔁 add this
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};

