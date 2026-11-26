import type { ReactNode } from "react";

export default function ConfirmationPopup({
  title,
  message,
  confirmLabel,
  destructive = false,
  busy = false,
  onConfirm,
  onCancel,
}: {
  title: string;
  message: ReactNode;
  confirmLabel: string;
  destructive?: boolean;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/20 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirmation-popup-title"
        className="w-full max-w-[220px] rounded-md border border-clay/50 bg-cream px-3 py-2.5 shadow-md"
      >
        <h5
          id="confirmation-popup-title"
          className="mb-1 text-xs font-bold text-ink"
        >
          {title}
        </h5>
        <div className="text-[11px] leading-relaxed text-ink/70">{message}</div>
        <div className="mt-3 flex justify-end gap-1.5">
          <button
            disabled={busy}
            onClick={onCancel}
            className="rounded px-2 py-1 text-[10px] font-medium text-ink-muted hover:bg-ink/5 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            disabled={busy}
            onClick={onConfirm}
            className={`rounded px-2 py-1 text-[10px] font-semibold text-white disabled:opacity-50 ${destructive ? "bg-red-700 hover:bg-red-800" : "bg-clay hover:bg-clay-dark"}`}
          >
            {busy ? "Please wait…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
