import { Route, Routes } from "react-router-dom";
import { StoreLayout } from "./components/layout/StoreLayout";
import { HomePage } from "./pages/HomePage";
import { CatalogPage } from "./pages/CatalogPage";
import { ProductPage } from "./pages/ProductPage";
import { CartPage } from "./pages/CartPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { OrderSuccessPage } from "./pages/OrderSuccessPage";
import { ForgotPasswordPage, LoginPage, RegisterPage } from "./pages/AuthPages";
import { AboutPage, ContactPage, FaqPage, PrivacyPage, TermsPage } from "./pages/ContentPages";
import {
  AccountDashboardPage,
  AddressesPage,
  OrderDetailsPage,
  OrdersPage,
  ProfilePage,
  WishlistPage
} from "./pages/AccountPages";
import { NotFoundPage } from "./pages/NotFoundPage";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<StoreLayout />}>
        <Route index element={<HomePage />} />
        <Route path="catalog" element={<CatalogPage />} />
        <Route path="search" element={<CatalogPage />} />
        <Route path="products/:identifier" element={<ProductPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="order-success" element={<OrderSuccessPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="account" element={<AccountDashboardPage />} />
        <Route path="account/profile" element={<ProfilePage />} />
        <Route path="account/addresses" element={<AddressesPage />} />
        <Route path="account/orders" element={<OrdersPage />} />
        <Route path="account/orders/:id" element={<OrderDetailsPage />} />
        <Route path="wishlist" element={<WishlistPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="faq" element={<FaqPage />} />
        <Route path="terms" element={<TermsPage />} />
        <Route path="privacy" element={<PrivacyPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default App;
