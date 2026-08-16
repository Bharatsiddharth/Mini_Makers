"use client";

import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "danger" | "default";
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Shared "are you sure?" dialog. Use this instead of window.confirm() or a
 * bare onClick for any action that can't be easily undone — cancelling an
 * order, deleting a product, changing an order status, etc.
 */
export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Go back",
  tone = "danger",
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4"
      onClick={loading ? undefined : onCancel}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <div
          className={`mb-4 flex h-10 w-10 items-center justify-center rounded-full ${
            tone === "danger" ? "bg-rose/10" : "bg-blush-soft"
          }`}
        >
          <AlertTriangle className={`h-5 w-5 ${tone === "danger" ? "text-rose" : "text-plum"}`} />
        </div>

        <h2 id="confirm-dialog-title" className="font-display text-lg text-ink">
          {title}
        </h2>
        <p id="confirm-dialog-description" className="mt-2 text-sm text-ink-soft">
          {description}
        </p>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-full border border-plum/20 px-4 py-2 text-sm font-medium text-ink-soft transition hover:bg-blush-soft disabled:cursor-not-allowed disabled:opacity-60"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`rounded-full px-4 py-2 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
              tone === "danger" ? "bg-rose hover:bg-rose/90" : "bg-plum hover:bg-plum-deep"
            }`}
          >
            {loading ? "Please wait..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
