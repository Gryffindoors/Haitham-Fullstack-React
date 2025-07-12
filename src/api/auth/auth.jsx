import { post } from "../post";
import { get } from "../api";

// POST /api/login → returns token + flat user
export const login = async (username, password) => {
  return await post("/login", { username, password });
};

// POST /api/logout
export const logout = async () => {
  return await post("/logout");
};

// GET /api/me → flat user data
export const getMe = async () => {
  return await get("/me");
};
