import { get } from "../api";
import { post, put } from "../post";
import { BASE_URL } from "../../../config";

// Record a manual payment (cash, card, online)
export const payBill = async (billId, payload) => {
  return await post(`/bills/${billId}/pay`, payload);
};

// ✅ Create checkout session
export const createStripeSession = async (billId) => {
  return await post("/stripe/create-checkout-session", {
    bill_id: billId,
  });
};

// Step 1: Create empty bill
export const createEmptyBill = async (payload) => {
  return await post("/bills/create-empty", payload);
};

// Step 2: Attach items to a bill
export const attachItemsToBill = async (billId, data) => {
  console.log("📤 POST /bills/" + billId + "/attach-items", data); // ✅ log before request
  return await post(`/bills/${billId}/attach-items`, data);
};




// ✅ Verify Stripe payment after return
export const verifyStripeSession = async (sessionId) => {
  return await get("/stripe/verify-session", { session_id: sessionId });
};


// GET /bills — Get all bills (for owner/supervisor)
export const getAllBills = async () => {
  return await get("/bills");
};

// GET /bills/today — Get today’s bills (all roles)
export const getTodayBills = async () => {
  return await get("/bills/today");
};

// GET /bills/{id} — View single bill
export const getBillById = async (id) => {
  return await get(`/bills/${id}`);
};

// PUT /bills/{id} — Edit a bill (tips, total, etc.)
export const updateBill = async (id, updates) => {
  return await put(`/bills/${id}`, updates);
};

// Get all payment methods
export const getPaymentMethods = async () => {
  return await get("/bills/methods");
};

// POST /bills — Create new bill
export const createBill = async (payload) => {
  return await post("/bills", payload);
};

export const isOnlinePayment = (methodId, methods = []) => {
  const method = methods.find((m) => m.id === parseInt(methodId));
  return method?.name?.toLowerCase() === "card";
};

