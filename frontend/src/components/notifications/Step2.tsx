import { apiFetch } from "../../api/apiHelper";

export default function TestMessage() {
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
    <div className="flex-1 flex flex-col gap-3">
      <p className="text-xs text-ink-muted">
        Let friends ping you to join them on LeetCode!
      </p>

      <button
        className="bg-clay hover:bg-clay-dark rounded-lg text-xs text-cream py-1"
        onClick={() => promptTestMessage()}
      >
        Send test message
      </button>
    </div>
  );
}
