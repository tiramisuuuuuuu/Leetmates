import { apiFetch } from "../../api/apiHelper";

export default function TestMessage({
  closeModal,
}: {
  closeModal: () => void;
}) {
  async function promptTestMessage() {
    try {
      const response = await apiFetch("/push/test", {
        method: "POST",
      });
      const body = await response.json();
      console.log("Prompt body ", body);
    } catch (error) {
      console.log("Error requesting test message: ", error);
    }
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-between gap-8">
      <p className="text-center text-[12px] text-ink-muted leading-relaxed max-w-[240px]">
        Check that notifications are working by sending yourself a test message.
      </p>

      <div className="flex w-full flex-col gap-2">
        <button
          className="w-full rounded-lg bg-clay px-3 py-2 text-xs font-medium text-cream transition-colors hover:bg-clay-dark"
          onClick={() => promptTestMessage()}
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
            onClick={() => {}}
          >
            Troubleshooting guide
          </button>
        </p>
      </div>

      <button
        type="button"
        onClick={() => closeModal()}
        className="text-xs font-semibold text-clay underline underline-offset-2 hover:text-clay-dark"
      >
        I've received the message
      </button>
    </div>
  );
}
