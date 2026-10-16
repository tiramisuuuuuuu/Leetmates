import { useEffect, useState } from "react";
import { isSubscribedPushNotifications } from "../../api/enableNotifications";
import { useAssetPrefix } from "../../store/assetPrefixStore";

export default function Notifications() {
  const [toggled, setToggled] = useState(false);
  const assetPrefix = useAssetPrefix((state) => state.assetPrefix);

  useEffect(() => {
    async function fetchStatus() {
      setToggled(await isSubscribedPushNotifications());
    }

    fetchStatus();
  }, []);

  return (
    <div className="flex-1 flex flex-col p-3 gap-5 text-ink divide-y divide-ink/[0.06]">
      <div className="w-full flex flex-col gap-1 pb-4">
        <div className="w-full flex flex-row gap-1 items-center justify-between">
          <p className="text-xs font-semibold text-ink">
            Push Notifications{" "}
            <span
              className={toggled ? "text-clay font-bold" : "text-ink-muted"}
            >
              {toggled ? "ON" : "OFF"}
            </span>
          </p>

          <button
            type="button"
            role="switch"
            aria-checked={toggled}
            aria-label="Toggle Push Notifications"
            onClick={() => setToggled((prev) => !prev)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full p-0.5 transition-colors duration-200 ease-in-out ${toggled ? "bg-clay" : "bg-gray-300"}`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                toggled ? "translate-x-5 bg-clay-dark" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        <p className="text-[12px] leading-relaxed text-ink-muted">
          Let friends ping you to join them on LeetCode & receive friend
          requests, and version updates! (Notification settings do not transfer
          between devices.)
        </p>
      </div>

      {toggled && (
        <div className="flex flex-col items-center gap-5 transition-opacity duration-300 ease-in">
          <p className="text-xs text-ink-muted">
            Check that notifications are working properly on this device by
            sending yourself a test message:
          </p>

          <div className="flex w-full flex-col items-center gap-2">
            <button
              type="button"
              className="w-full max-w-60 inline-flex items-center justify-center rounded-lg bg-clay px-3.5 py-2 text-xs font-medium text-cream shadow-xs transition-colors hover:bg-clay-dark focus:outline-none focus:ring-2 focus:ring-clay focus:ring-offset-2"
              onClick={() => {}}
            >
              Send test message
            </button>

            <p className="text-center text-[12px] leading-relaxed text-ink-muted">
              <span className="[@container(max-width:420px)]:hidden">
                Didn't receive it?{" "}
              </span>
              <button
                type="button"
                className="text-[12px] text-ink-muted underline underline-offset-2 hover:text-ink"
                onClick={() =>
                  window.open(assetPrefix + "NotificationsGuide.pdf")
                }
              >
                Troubleshooting guide
              </button>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
