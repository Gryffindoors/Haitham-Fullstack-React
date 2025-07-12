// src/context/StaffContext.jsx

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getAllStaff, getDepartments } from "../api/staff/staff";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

// Context
const StaffContext = createContext();
export const useStaff = () => useContext(StaffContext);

// Provider
export const StaffProvider = ({ children }) => {
  const { role, isLoading } = useAuth(); // ✅ include isLoading
  const [staff, setStaff] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);

  const preloadImage = (url) =>
    new Promise((resolve) => {
      const img = new Image();
      img.src = url;
      img.onload = resolve;
      img.onerror = resolve; // Fail silently
    });


  const loadStaff = useCallback(async () => {
    if (!role) return;
    setLoading(true);
    try {
      const [staffList, departmentList] = await Promise.all([
        getAllStaff(),
        getDepartments(),
      ]);

      // Preload staff images in parallel
      await Promise.all(
        staffList.map((s) =>
          preloadImage(s.image_url || "/default-user.png")
        )
      );

      setStaff(staffList);
      setDepartments(departmentList);
    } catch (err) {
      toast.error("❌ Failed to load staff or departments");
      setStaff([]);
      setDepartments([]);
    } finally {
      setLoading(false);
    }
  }, [role]);

  useEffect(() => {
    if (!isLoading && role) {
      loadStaff(); // ✅ only after auth is ready
    }
  }, [isLoading, role, loadStaff]);

  return (
    <StaffContext.Provider value={{ staff, departments, loading, refreshStaff: loadStaff }}>
      {children}
    </StaffContext.Provider>
  );
};
