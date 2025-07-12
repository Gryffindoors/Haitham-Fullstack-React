import { get } from "../api";        // GET helper
import { post, put, del } from "../post"; // POST/PUT/DELETE helpers

export const getOrders = async (params = {}) => {
  return await get("/orders", params);
};

export const getOrderTypes = async () => {
  return await get("/order-types");
};

export const getOrderStatuses = async () => {
    return await get("/orders/status");
}

export const getOrderById = async (id) => {
  return await get(`/orders/${id}`);
};

export const createOrder = async (orderData) => {
  return await post("/orders", orderData);
};

export const updateOrder = async (id, orderData) => {
  return await put(`/orders/${id}`, orderData);
};

export const deleteOrder = async (id) => {
  return await del(`/orders/${id}`);
};
