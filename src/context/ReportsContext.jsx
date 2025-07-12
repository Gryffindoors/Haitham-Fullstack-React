// src/context/ReportsContext.jsx

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  getMonthlyProfit,
  getProfitTrend,
  getTopMenuItems,
  getLowStockIngredients,
  getIngredientUsage,
  getStaffPerformance,
  getTopPerformers,
  getDisciplineRanking,
  getOperatingCostBreakdown,
  getTableUsage,
} from "../api/reports/reportsApi";
import { useAuth } from "./AuthContext";

const ReportsContext = createContext();
export const useReports = () => useContext(ReportsContext);

export const ReportsProvider = ({ children }) => {
  const { role, isLoading } = useAuth(); // ✅ fix here
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadReports = useCallback(async () => {
    if (role !== "owner" && role !== "supervisor") return;
    setLoading(true);

    try {
      const month = String(new Date().getMonth() + 1).padStart(2, "0");
      const year = String(new Date().getFullYear());

      const [
        profit,
        trend,
        topMenu,
        lowStock,
        usage,
        staff,
        topStaff,
        discipline,
        costs,
        tables,
      ] = await Promise.all([
        getMonthlyProfit(month, year),
        getProfitTrend(),
        getTopMenuItems(month),
        getLowStockIngredients(),
        getIngredientUsage(month),
        getStaffPerformance(month),
        getTopPerformers(month),
        getDisciplineRanking(month),
        getOperatingCostBreakdown(month, year),
        getTableUsage(month),
      ]);

      setReports({
        profit,
        trend,
        topMenu,
        lowStock,
        usage,
        staff,
        topStaff,
        discipline,
        costs,
        tables,
      });
    } catch (err) {
      console.error("❌ Failed to load reports:", err);
      setReports(null);
    } finally {
      setLoading(false);
    }
  }, [role]);


  useEffect(() => {
    if (!isLoading && (role === "owner" || role === "supervisor")) {
      loadReports(); // ✅ only one safe call
    }
  }, [isLoading, role, loadReports]);

  return (
    <ReportsContext.Provider value={{ reports, loading, refreshReports: loadReports }}>
      {children}
    </ReportsContext.Provider>
  );
};
