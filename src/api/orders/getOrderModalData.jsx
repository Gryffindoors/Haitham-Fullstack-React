// src/api/orders/getOrderModalData.js

import { getCustomers } from "./customers";
import { getMenuItems, getMenuCategories } from "./menu";
import { getOrderTypes, getOrderStatuses } from "./orders"; // ✅ from orders file

const STORAGE_KEY = "orderModalData";

export const getOrderModalData = async (forceRefresh = false) => {
  if (!forceRefresh) {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        // fallback to fetch if JSON parse fails
      }
    }
  }

  try {
    const [customers, orderTypes, statuses, menuItems, menuCategories] = await Promise.all([
      getCustomers(),           // from ./customers.js
      getOrderTypes(),          // from ./orders.js
      getOrderStatuses(),       // from ./orders.js
      getMenuItems(),           // from ./menu.js
      getMenuCategories(),      // from ./menu.js
    ]);

    const result = {
      customers,
      orderTypes,
      statuses,
      menuItems,
      menuCategories,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
    return result;
  } catch (err) {
    console.error("[getOrderModalData] ❌ Error fetching modal data:", err);
    return {
      customers: [],
      orderTypes: [],
      statuses: [],
      menuItems: [],
      menuCategories: [],
    };
  }
};

export const clearOrderModalCache = () => {
  localStorage.removeItem(STORAGE_KEY);
};
