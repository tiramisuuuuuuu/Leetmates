import { create } from "zustand";

export type ToastType = "success" | "error";

interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

interface ToastState {
  toasts: Toast[];
  showToast: (type: ToastType, message: string) => void;
  dismissToast: (id: number) => void;
}

let nextId = 0;

export const useToast = create<ToastState>()((set) => ({
  toasts: [],
  showToast: (type: ToastType, message: string) => {
    const id = nextId++;
    set((state) => ({ toasts: [...state.toasts, { id, type, message }] }));
  },
  dismissToast: (id: number) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
}));
