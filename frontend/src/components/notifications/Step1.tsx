import { enableNotifications } from "../../api/enableNotifications";
import { useToast } from "../../store/toastStore";

export default function SubscribePush({
  next,
  closeModal,
}: {
  next: () => void;
  closeModal: () => void;
}) {
  const showToast = useToast((state) => state.showToast);

  async function handleEnable() {
    try {
      await enableNotifications();
      next();
      showToast("success", "Successfully enabled notifications");
    } catch (error) {
      showToast("error", "Error enabling notifications");
    }
  }

  return (
    <div className="flex-1 flex flex-col items-center gap-8">
      <p className="text-center text-[12px] text-ink-muted leading-relaxed max-w-[240px]">
        Let friends ping you to join them on LeetCode
      </p>

      <div className="w-full flex flex-col gap-5">
        <button
          className="w-full bg-clay hover:bg-clay-dark rounded-lg text-xs text-cream py-2"
          onClick={() => handleEnable()}
        >
          Enable push notifications
        </button>

        <button
          onClick={() => closeModal()}
          className="text-xs text-clay font-semibold underline"
        >
          No thanks
        </button>
      </div>
    </div>
  );
}
