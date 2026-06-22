import {
  Bell,
  Boxes,
  ChartColumnBig,
  CreditCard,
  FileText,
  Home,
  LayoutDashboard,
  Package,
  Settings,
  Shield,
  ShoppingBag,
  Star,
  Truck,
  Users
} from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Button } from "../ui/Button";
import { useAuth } from "../../context/AuthContext";
import { useAdminNotice } from "../ui/AdminNoticeProvider";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/catalog", label: "Catalog", icon: Package },
  { to: "/orders", label: "Orders", icon: ShoppingBag },
  { to: "/payments", label: "Payments", icon: CreditCard },
  { to: "/customers", label: "Customers", icon: Users },
  { to: "/inventory", label: "Inventory", icon: Boxes },
  { to: "/promotions", label: "Promotions", icon: Star },
  { to: "/content", label: "Content", icon: Home },
  { to: "/shipping", label: "Shipping", icon: Truck },
  { to: "/reviews", label: "Reviews", icon: FileText },
  { to: "/reports", label: "Reports", icon: ChartColumnBig },
  { to: "/notifications", label: "Alerts", icon: Bell },
  { to: "/settings", label: "Settings", icon: Settings },
  { to: "/admin", label: "Admins", icon: Shield }
];

export const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { confirm } = useAdminNotice();

  const handleLogout = async () => {
    const confirmed = await confirm({
      title: "Log out",
      message: "Are you sure you want to log out of the admin panel?",
      confirmLabel: "Logout",
      tone: "warning"
    });

    if (!confirmed) {
      return;
    }

    await logout();
    navigate("/login");
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <img src="/logo.png" alt="Elite Agri Solution" className="admin-logo-img" />
        </div>
        <nav className="nav-list">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>

      <div className="main-panel">
        <header className="topbar card">
          <div>
            <strong>{user?.firstName} {user?.lastName ?? ""}</strong>
            <p>{user?.roleName}</p>
          </div>
          <Button variant="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </header>

        <main className="content-area">
          <Outlet />
        </main>

        <nav className="mobile-nav">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            return (
              <NavLink key={item.to} to={item.to} end={item.to === "/"} className="mobile-nav-item">
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
