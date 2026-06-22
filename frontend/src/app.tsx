import { Navigate, Route, Routes } from "react-router-dom";
import { AdminLayout } from "./components/layout/AdminLayout";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import { LoginPage } from "./pages/auth/LoginPage";
import { ForgotPasswordPage } from "./pages/auth/ForgotPasswordPage";
import { ResetPasswordPage } from "./pages/auth/ResetPasswordPage";
import { CreateAccountPage } from "./pages/auth/CreateAccountPage";
import { DashboardPage } from "./pages/dashboard/DashboardPage";
import { CatalogPage } from "./pages/catalog/CatalogPage";
import { OrdersPage } from "./pages/orders/OrdersPage";
import { PaymentsPage } from "./pages/payments/PaymentsPage";
import { CustomersPage } from "./pages/customers/CustomersPage";
import { InventoryPage } from "./pages/inventory/InventoryPage";
import { PromotionsPage } from "./pages/promotions/PromotionsPage";
import { ContentPage } from "./pages/content/ContentPage";
import { ShippingPage } from "./pages/shipping/ShippingPage";
import { ReviewsPage } from "./pages/reviews/ReviewsPage";
import { ReportsPage } from "./pages/reports/ReportsPage";
import { NotificationsPage } from "./pages/notifications/NotificationsPage";
import { SettingsPage } from "./pages/settings/SettingsPage";
import { AdminUsersPage } from "./pages/settings/AdminUsersPage";
import { AdminNoticeProvider } from "./components/ui/AdminNoticeProvider";

const App = () => {
  return (
    <AdminNoticeProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/create-account" element={<CreateAccountPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="catalog" element={<CatalogPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="payments" element={<PaymentsPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="promotions" element={<PromotionsPage />} />
          <Route path="content" element={<ContentPage />} />
          <Route path="shipping" element={<ShippingPage />} />
          <Route path="reviews" element={<ReviewsPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="admin" element={<AdminUsersPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AdminNoticeProvider>
  );
};

export default App;
