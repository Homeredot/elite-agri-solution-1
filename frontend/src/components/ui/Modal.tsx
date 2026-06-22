import { useEffect, type PropsWithChildren } from "react";
import { createPortal } from "react-dom";

export const Modal = ({
  open,
  title,
  onClose,
  children
}: PropsWithChildren<{
  open: boolean;
  title: string;
  onClose: () => void;
}>) => {
  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return createPortal(
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="icon-button" onClick={onClose}>
            x
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
};
