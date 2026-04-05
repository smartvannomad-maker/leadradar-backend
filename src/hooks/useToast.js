import { useCallback, useMemo, useState } from "react";

let nextToastId = 1;

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const pushToast = useCallback(
    (message, type = "info", duration = 2600) => {
      const id = nextToastId++;
      setToasts((prev) => [...prev, { id, message, type }]);

      window.setTimeout(() => {
        removeToast(id);
      }, duration);

      return id;
    },
    [removeToast]
  );

  const success = useCallback(
    (message) => pushToast(message, "success"),
    [pushToast]
  );

  const error = useCallback(
    (message) => pushToast(message, "error", 3200),
    [pushToast]
  );

  const info = useCallback(
    (message) => pushToast(message, "info"),
    [pushToast]
  );

  return useMemo(
    () => ({
      toasts,
      removeToast,
      success,
      error,
      info,
    }),
    [toasts, removeToast, success, error, info]
  );
}