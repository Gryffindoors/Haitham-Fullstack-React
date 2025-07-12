// src/api/reports/reportsApi.jsx

import { get } from "../api";

// Profit Reports
export const getMonthlyProfit = (month, year) =>
  get("/reports/profit", { month, year });

export const getProfitTrend = (months = 6) =>
  get("/reports/profit-trend", { months });

// Menu Reports
export const getTopMenuItems = (month, limit = 5) =>
  get("/reports/menu/top", { month, limit });

export const getLowStockIngredients = (threshold = 5) =>
  get("/reports/menu/low-stock", { threshold });

export const getIngredientUsage = (month) =>
  get("/reports/inventory/usage", { month });

// Staff Reports
export const getStaffPerformance = (month) =>
  get("/reports/staff/performance", { month });

export const getTopPerformers = (month) =>
  get("/reports/staff/top", { month });

export const getDisciplineRanking = (month) =>
  get("/reports/staff/discipline", { month });

// Operating Costs
export const getOperatingCostBreakdown = (month, year) =>
  get("/reports/costs/breakdown", { month, year });

// Table Usage
export const getTableUsage = (month) =>
  get("/reports/tables/usage", { month });
