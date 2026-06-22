import { useEffect, useRef } from "react";
import { useAdminNotice } from "./AdminNoticeProvider";

type UseAdminStatusNoticeOptions = {
  successTitle?: string;
  errorTitle?: string;
};

export const useAdminStatusNotice = (
  successMessage: string | null | undefined,
  errorMessage: string | null | undefined,
  options: UseAdminStatusNoticeOptions = {}
) => {
  const { notify } = useAdminNotice();
  const lastSuccessRef = useRef<string | null>(null);
  const lastErrorRef = useRef<string | null>(null);

  useEffect(() => {
    if (!successMessage || successMessage === lastSuccessRef.current) {
      return;
    }

    lastSuccessRef.current = successMessage;
    notify({
      tone: "success",
      title: options.successTitle ?? successMessage,
      message: options.successTitle ? successMessage : undefined
    });
  }, [notify, options.successTitle, successMessage]);

  useEffect(() => {
    if (!errorMessage || errorMessage === lastErrorRef.current) {
      return;
    }

    lastErrorRef.current = errorMessage;
    notify({
      tone: "error",
      title: options.errorTitle ?? "Action failed",
      message: errorMessage
    });
  }, [errorMessage, notify, options.errorTitle]);
};
