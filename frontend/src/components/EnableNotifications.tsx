import { apiFetch } from "../api/apiHelper";
import { enableNotifications } from "../api/enableNotifications";

export default function EnableNotifications() {
    async function promptTestMessage() {
        try {
            const response = await apiFetch("/push/test", {
                method: "POST",
            });
            const body = await response.json();
            console.log("Prompt body ", body)
        } catch (error) {
            console.log("Error requesting test message: ", error);
        }
    }

    return (
        <div className="flex flex-col gap-3">
            <button
                className="bg-clay hover:bg-clay-dark rounded-lg text-xs text-cream py-1"
                onClick={() => enableNotifications()}
            >
                Enable push notifications
            </button>

            <button
                className="bg-clay hover:bg-clay-dark rounded-lg text-xs text-cream py-1"
                onClick={() => promptTestMessage()}
            >
                Send test message
            </button>
        </div>
    );
}
