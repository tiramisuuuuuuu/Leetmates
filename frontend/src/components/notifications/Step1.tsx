import { enableNotifications } from "../../api/enableNotifications";

export default function SubscribePush({
  next,
  closeModal,
}: {
  next: () => void;
  closeModal: () => void;
}) {
  async function handleEnable() {
    await enableNotifications();
    next();
  }

  return (
    <div className="flex-1 flex flex-col justify-between items-center">
      <p className="text-center text-[12px] text-ink-muted leading-relaxed max-w-[240px]">
        Let friends ping you to join them on LeetCode
      </p>

      <button
        className="w-full bg-clay hover:bg-clay-dark rounded-lg text-xs text-cream py-1"
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
  );
}
