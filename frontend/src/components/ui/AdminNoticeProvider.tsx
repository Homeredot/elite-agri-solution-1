import { createContext, useCallback, useContext, useMemo, useRef, useState, type PropsWithChildren } from "react";
import { AlertTriangle, CheckCircle2, CircleAlert, Info } from "lucide-react";
import { Button } from "./Button";
import { Modal } from "./Modal";

type NoticeTone = "success" | "error" | "warning" | "info";

type NoticeOptions = {
  title: string;
  message?: string;
  tone?: NoticeTone;
  durationMs?: number;
};

type ConfirmOptions = {
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: Exclude<NoticeTone, "success">;
};

type NoticeItem = NoticeOptions & {
  id: number;
  tone: NoticeTone;
};

type ConfirmState = Omit<ConfirmOptions, "tone"> & {
  open: boolean;
  tone: Exclude<NoticeTone, "success">;
  resolver: ((value: boolean) => void) | null;
};

type AdminNoticeContextValue = {
  notify: (options: NoticeOptions) => void;
  confirm: (options: ConfirmOptions) => Promise<boolean>;
};

const AdminNoticeContext = createContext<AdminNoticeContextValue | null>(null);

const toneIconMap = {
  success: CheckCircle2,
  error: CircleAlert,
  warning: AlertTriangle,
  info: Info
} satisfies Record<NoticeTone, typeof Info>;

export const AdminNoticeProvider = ({ children }: PropsWithChildren) => {
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [confirmState, setConfirmState] = useState<ConfirmState>({
    open: false,
    title: "",
    message: "",
    confirmLabel: "Confirm",
    cancelLabel: "Cancel",
    tone: "warning",
    resolver: null
  });
  const nextIdRef = useRef(1);

  const dismissNotice = useCallback((id: number) => {
    setNotices((currentNotices) => currentNotices.filter((notice) => notice.id !== id));
  }, []);

  const notify = useCallback(
    ({ durationMs = 3600, tone = "info", ...options }: NoticeOptions) => {
      const id = nextIdRef.current++;
      setNotices((currentNotices) => [...currentNotices, { id, tone, durationMs, ...options }]);

      window.setTimeout(() => {
        dismissNotice(id);
      }, durationMs);
    },
    [dismissNotice]
  );

  const confirm = useCallback((options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setConfirmState({
        open: true,
        title: options.title,
        message: options.message ?? "",
        confirmLabel: options.confirmLabel ?? "Confirm",
        cancelLabel: options.cancelLabel ?? "Cancel",
        tone: options.tone ?? "warning",
        resolver: resolve
      });
    });
  }, []);

  const closeConfirm = useCallback(
    (confirmed: boolean) => {
      if (confirmState.resolver) {
        confirmState.resolver(confirmed);
      }

      setConfirmState({
        open: false,
        title: "",
        message: "",
        confirmLabel: "Confirm",
        cancelLabel: "Cancel",
        tone: "warning",
        resolver: null
      });
    },
    [confirmState]
  );

  const contextValue = useMemo(
    () => ({
      notify,
      confirm
    }),
    [confirm, notify]
  );

  const ConfirmIcon = toneIconMap[confirmState.tone];

  return (
    <AdminNoticeContext.Provider value={contextValue}>
      {children}

      <div className="admin-notice-stack" aria-live="polite" aria-atomic="true">
        {notices.map((notice) => {
          const NoticeIcon = toneIconMap[notice.tone ?? "info"];

          return (
            <div key={notice.id} className={`admin-notice-card ${notice.tone ?? "info"}`}>
              <div className="admin-notice-icon">
                <NoticeIcon size={18} />
              </div>
              <div className="admin-notice-copy">
                <strong>{notice.title}</strong>
                {notice.message ? <p>{notice.message}</p> : null}
              </div>
              <button
                type="button"
                className="icon-button"
                aria-label="Dismiss notification"
                onClick={() => dismissNotice(notice.id)}
              >
                x
              </button>
            </div>
          );
        })}
      </div>

      <Modal open={confirmState.open} title={confirmState.title} onClose={() => closeConfirm(false)}>
        <div className="admin-confirm-dialog">
          <div className={`admin-confirm-badge ${confirmState.tone}`}>
            <ConfirmIcon size={20} />
          </div>
          {confirmState.message ? <p>{confirmState.message}</p> : null}
          <div className="admin-confirm-actions">
            <Button type="button" variant="secondary" onClick={() => closeConfirm(false)}>
              {confirmState.cancelLabel}
            </Button>
            <Button
              type="button"
              variant={confirmState.tone === "error" ? "danger" : "primary"}
              onClick={() => closeConfirm(true)}
            >
              {confirmState.confirmLabel}
            </Button>
          </div>
        </div>
      </Modal>
    </AdminNoticeContext.Provider>
  );
};

export const useAdminNotice = () => {
  const context = useContext(AdminNoticeContext);

  if (!context) {
    throw new Error("useAdminNotice must be used within an AdminNoticeProvider");
  }

  return context;
};
