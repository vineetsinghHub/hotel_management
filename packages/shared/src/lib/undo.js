import { toast } from "sonner";

// undoToast — wraps a destructive action with an easy "Undo" affordance.
// Usage:
//   undoToast({
//     message: "Reservation cancelled",
//     description: "AH-9F27C1 · Maharajah Suite",
//     onUndo: () => restoreReservation(),
//     duration: 5000,
//   });
// Returns the toast id in case you want to dismiss it programmatically.
export const undoToast = ({
  message,
  description,
  onUndo,
  duration = 5000,
  actionLabel = "Undo",
  onUndoneMessage = "Undone",
} = {}) => {
  return toast(message, {
    description,
    duration,
    action: onUndo
      ? {
          label: actionLabel,
          onClick: () => {
            try { onUndo(); } catch (e) { /* noop */ }
            toast.success(onUndoneMessage);
          },
        }
      : undefined,
  });
};

export default undoToast;
