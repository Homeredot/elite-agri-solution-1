import { Bell, BellRing, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { api } from "../../api/client";

type StoreNotification = {
  id: number;
  notification_type: string;
  title: string;
  message: string;
  channel: string;
  created_at: string;
  sent_at: string | null;
  is_broadcast: number | boolean;
};

const INITIALIZED_KEY = "store_notifications_initialized";
const SEEN_KEY = "store_notifications_seen_ids";
const READ_KEY = "store_notifications_read_ids";

const readIdSet = (key: string) => {
  try {
    const raw = localStorage.getItem(key);
    const values = raw ? (JSON.parse(raw) as number[]) : [];
    return new Set(values);
  } catch {
    return new Set<number>();
  }
};

const writeIdSet = (key: string, values: Set<number>) => {
  localStorage.setItem(key, JSON.stringify([...values]));
};

const supportsBrowserNotifications = () =>
  typeof window !== "undefined" && "Notification" in window;

export const StoreNotifications = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [toastNotifications, setToastNotifications] = useState<StoreNotification[]>([]);
  const [permissionState, setPermissionState] = useState(
    supportsBrowserNotifications() ? Notification.permission : "default"
  );

  const notificationsQuery = useQuery({
    queryKey: ["storefront-notifications"],
    queryFn: () => api.get<{ data: StoreNotification[] }>("/store/notifications"),
    refetchInterval: 20000
  });

  const notifications = notificationsQuery.data?.data ?? [];

  useEffect(() => {
    if (!notifications.length || typeof window === "undefined") {
      return;
    }

    const initialized = localStorage.getItem(INITIALIZED_KEY) === "true";
    const seenIds = readIdSet(SEEN_KEY);
    const readIds = readIdSet(READ_KEY);

    if (!initialized) {
      notifications.forEach((notification) => {
        seenIds.add(notification.id);
        readIds.add(notification.id);
      });
      writeIdSet(SEEN_KEY, seenIds);
      writeIdSet(READ_KEY, readIds);
      localStorage.setItem(INITIALIZED_KEY, "true");
      return;
    }

    const freshNotifications = notifications.filter((notification) => !seenIds.has(notification.id));
    if (!freshNotifications.length) {
      return;
    }

    freshNotifications.forEach((notification) => seenIds.add(notification.id));
    writeIdSet(SEEN_KEY, seenIds);

    setToastNotifications((current) => {
      const knownIds = new Set(current.map((notification) => notification.id));
      return [...freshNotifications.filter((notification) => !knownIds.has(notification.id)), ...current].slice(0, 4);
    });

    if (supportsBrowserNotifications() && Notification.permission === "granted") {
      freshNotifications.forEach((notification) => {
        new Notification(notification.title, {
          body: notification.message,
          tag: `store-notification-${notification.id}`
        });
      });
    }
  }, [notifications]);

  useEffect(() => {
    if (!isOpen || typeof window === "undefined") {
      return;
    }

    const readIds = readIdSet(READ_KEY);
    notifications.forEach((notification) => readIds.add(notification.id));
    writeIdSet(READ_KEY, readIds);
    setToastNotifications([]);
  }, [isOpen, notifications]);

  useEffect(() => {
    if (!toastNotifications.length) {
      return;
    }

    const timer = window.setTimeout(() => {
      setToastNotifications((current) => current.slice(0, Math.max(current.length - 1, 0)));
    }, 8000);

    return () => window.clearTimeout(timer);
  }, [toastNotifications]);

  const unreadCount = useMemo(() => {
    if (typeof window === "undefined") {
      return 0;
    }

    const readIds = readIdSet(READ_KEY);
    return notifications.filter((notification) => !readIds.has(notification.id)).length;
  }, [notifications, isOpen]);

  const requestBrowserPermission = async () => {
    if (!supportsBrowserNotifications()) {
      return;
    }

    const permission = await Notification.requestPermission();
    setPermissionState(permission);
  };

  const dismissToast = (notificationId: number) => {
    if (typeof window !== "undefined") {
      const readIds = readIdSet(READ_KEY);
      readIds.add(notificationId);
      writeIdSet(READ_KEY, readIds);
    }

    setToastNotifications((current) =>
      current.filter((notification) => notification.id !== notificationId)
    );
  };

  return (
    <div className="store-notification-shell">
      <button
        className="store-bell-btn"
        type="button"
        onClick={() => setIsOpen((current) => !current)}
      >
        <Bell size={16} />
        <span className="theme-toggle-label">Alerts</span>
        {unreadCount ? <span className="store-bell-count">{unreadCount}</span> : null}
      </button>

      {isOpen ? (
        <div className="store-notification-panel glass">
          <div className="section-heading">
            <h2>Notifications</h2>
            <button type="button" className="theme-toggle" onClick={() => setIsOpen(false)}>
              <X size={16} />
            </button>
          </div>

          <div className="store-notification-permission">
            <div className="store-notification-permission-copy">
              <strong>Browser alerts</strong>
              <span>
                {supportsBrowserNotifications()
                  ? permissionState === "granted"
                    ? "Browser notifications are enabled for this storefront."
                    : "Enable browser notifications to receive pop-up alerts for new store messages."
                  : "This browser does not support Notification API alerts."}
              </span>
            </div>
            {supportsBrowserNotifications() && permissionState !== "granted" ? (
              <button type="button" className="secondary-btn" onClick={() => void requestBrowserPermission()}>
                <BellRing size={16} />
                Enable alerts
              </button>
            ) : null}
          </div>

          <div className="store-notification-list">
            {notifications.length ? (
              notifications.map((notification) => (
                <article key={notification.id} className="store-notification-item">
                  <div className="store-notification-item-head">
                    <strong>{notification.title}</strong>
                    <span>{notification.is_broadcast ? "Broadcast" : "Account"}</span>
                  </div>
                  <p>{notification.message}</p>
                  <small>{new Date(notification.created_at).toLocaleString()}</small>
                </article>
              ))
            ) : (
              <div className="empty-card">
                <BellRing size={18} />
                <strong>No notifications yet</strong>
                <p>Store announcements and account notices will appear here.</p>
              </div>
            )}
          </div>
        </div>
      ) : null}

      {toastNotifications.length ? (
        <div className="store-toast-stack">
          {toastNotifications.map((notification) => (
            <article key={notification.id} className="store-toast glass">
              <div className="store-toast-head">
                <strong>{notification.title}</strong>
                <button type="button" onClick={() => dismissToast(notification.id)}>
                  <X size={14} />
                </button>
              </div>
              <p>{notification.message}</p>
            </article>
          ))}
        </div>
      ) : null}
    </div>
  );
};
