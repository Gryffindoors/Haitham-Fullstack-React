import { get } from "../api";        // GET helper
import { post, put, del } from "../post"; // POST/PUT/DELETE helpers

export const getCustomers = async (search = "") => {
  const params = search ? { search } : {};
  return await get("/customers", params);
};

export const createCustomer = async (data) => {
  return await post("/customers", data);
};
