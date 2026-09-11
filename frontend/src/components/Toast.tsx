import { useEffect } from "react";
import { IoCheckmarkCircle, IoCloseCircle } from "react-icons/io5";
import { useToast, type ToastType } from "../store/toastStore";

const DURATION = 3000;

export default function Toast() {
  const toasts = useToast((state) => state.toasts);

  return (
    <div className="absolute bottom-6 right-1.5 flex flex-col items-end gap-1.5">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          id={toast.id}
          type={toast.type}
          message={toast.message}
        />
      ))}
    </div>
  );
}

function ToastItem({
  id,
  type,
  message,
}: {
  id: number;
  type: ToastType;
  message: string;
}) {
  const dismissToast = useToast((state) => state.dismissToast);

  useEffect(() => {
    const timer = setTimeout(() => dismissToast(id), DURATION);
    return () => clearTimeout(timer);
  }, [id, dismissToast]);

  const isSuccess = type === "success";

  return (
    <div
      className={`flex items-center gap-1.5 rounded-md border px-2.5 py-1 shadow-md ${
        isSuccess
          ? "bg-cream border-green-700 text-ink"
          : "bg-cream border-red-700 text-ink"
      }`}
    >
      {isSuccess ? (
        <IoCheckmarkCircle size={14} className="shrink-0 text-green-700" />
      ) : (
        <IoCloseCircle size={14} className="shrink-0 text-red-700" />
      )}
      <p className="text-xs">{message}</p>
    </div>
  );
}
