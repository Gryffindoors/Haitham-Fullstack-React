import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

import Login from "./pages/Login";
import LandingPage from "./pages/LandingPage";
import ReservationPage from "./pages/ReservationPage";
import StaffPage from "./pages/dashboard/Staff";
import OrdersPage from "./pages/Orders";
import BillingStartPage from "./pages/BillingStartPage";
import PaymentSplitter from "./billing/PaymentSplitter";

import DashboardLayout from "./layout/DashboardLayout";
import Background from "./layout/background";
import FloatingAuthButton from "./layout/floatingAuthButton";

import { AuthProvider, useAuth } from "./context/AuthContext";
import { MenuProvider } from "./context/MenuContext";
import PaymentConfirmation from "./pages/PaymentConfirmation";
import PaymentOptionsModal from "./billing/PaymentOptionsModal";
import { BillingProvider } from "./context/BillingContext";
import BillingCreatePage from "./pages/BillingCreatePage";
import BillingStripeReturn from "./pages/BillingStripeReturn";
import ReportsPage from "./pages/dashboard/Reports";
import { ReportsProvider } from "./context/ReportsContext";
import { StaffProvider } from "./context/StaffContext";
import OrdersDashboard from "./pages/dashboard/Orders";

// 🔒 Route protection logic
const ProtectedRoute = ({ roles, children }) => {
  const { user, role, isLoading } = useAuth();
  if (isLoading) return null;
  if (!user || (roles && !roles.includes(role))) return <Navigate to="/" replace />;
  return children;
};

// 🔁 Main route definitions
const AppRoutes = () => {
  const { user, role, isLoading } = useAuth();
  if (isLoading) return null;

  return (
    <Routes>
      <Route index element={user ? <LandingPage /> : <Navigate to="/login" replace />} />

      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" replace />} />

      <Route
        path="/reservations"
        element={user && role !== "cashier" ? <ReservationPage /> : <Navigate to="/" replace />}
      />

      <Route path="/orders" element={user && role !== "cashier" ? <OrdersPage /> : <Navigate to="/" replace />}
      />

      <Route path="/dashboard" element={
        <ProtectedRoute roles={["owner", "supervisor"]}>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route path="staff" element={<StaffPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="orders" element={<OrdersDashboard />} />
      </Route>

      <Route
        path="/billing"
        element={
          <ProtectedRoute roles={["owner", "supervisor", "cashier"]}>
            <Outlet />
          </ProtectedRoute>
        }
      >
        <Route index element={<BillingStartPage />} />
        <Route path="create" element={<BillingCreatePage />} />
        <Route path="confirm" element={<PaymentConfirmation />} />
        <Route path="pay" element={<PaymentOptionsModal />} />
        <Route path="split" element={<PaymentSplitter />} />
        <Route path="stripe-return" element={<BillingStripeReturn />} />

      </Route>

    </Routes>
  );
};

// 🚀 App entry point
const App = () => {
  return (
    <AuthProvider>
      <AuthWrapper />
    </AuthProvider>
  );
};

export default App;


const AuthWrapper = () => {
  const { isLoading, user, authReady } = useAuth();
  console.time("🚀 App ready");
  useEffect(() => {
    if (authReady) {
      console.timeEnd("🚀 App ready");
    }
  }, [authReady]);

  if (isLoading) return <div className="p-6">Loading...</div>;

  return (
    <BrowserRouter>
      <Background>
        <MenuProvider>
          <BillingProvider>
            <ReportsProvider>
              <StaffProvider>
                <FloatingAuthButton />
                <AppRoutes />
                <Toaster position="bottom-center" />
              </StaffProvider>
            </ReportsProvider>
          </BillingProvider>
        </MenuProvider>
      </Background>
    </BrowserRouter>
  );
};

