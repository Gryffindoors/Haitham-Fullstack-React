import api from "../api";         // for GET

import postApi from "../post";

import { toFormData } from "../../utils/toFormData";

// 🔐 Get full staff list (detailed)
export const getAllStaff = async () => {
  const response = await api.get("/staff");
  return response.data;
};

// ➕ Create new staff member (with optional image)
export const createStaff = async (staffData) => {
  const formData = toFormData(staffData);
  const response = await postApi.post("/staff", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// ✏️ Update staff member (by ID)
export const updateStaff = async (id, staffData) => {
  const formData = toFormData(staffData);
  const response = await postApi.post(`/staff/${id}?_method=PUT`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// ❌ Delete staff member
export const deleteStaff = async (id) => {
  const response = await postApi.delete(`/staff/${id}`);
  return response.data;
};

// 📋 Dropdown: roles list
export const getStaffRoles = async () => {
  const response = await api.get("/staff/roles/list");
  return response.data;
};

// 📋 Dropdown: staff ID + name list
export const getStaffList = async () => {
  const response = await api.get("/staff/list");
  return response.data;
};

export const getDepartments = async () => {
  const response = await api.get("/staff/department");
  return response.data;
};
