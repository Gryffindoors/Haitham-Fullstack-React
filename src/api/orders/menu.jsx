import { get } from "../api";
import { post, put, del } from "../post";

// GET: menu items
export const getMenuItems = async () => {
  return await get("/menu/items");
};

// GET: menu categories
export const getMenuCategories = async () => {
  return await get("/menu/categories");
};

// POST: create menu item
export const createMenuItem = async (data) => {
  return await post("/menu/items", data);
};

// PUT: update menu item
export const updateMenuItem = async (id, data) => {
  return await put(`/menu/items/${id}`, data);
};

// DELETE: remove menu item
export const deleteMenuItem = async (id) => {
  return await del(`/menu/items/${id}`);
};
