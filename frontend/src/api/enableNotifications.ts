import { apiFetch } from "./apiHelper";

export async function enableNotifications() {
  const response = await apiFetch("/push/public-key");
  const { publicKey } = await response.json();

  const result = await chrome.runtime.sendMessage({
    type: "SUBSCRIBE_TO_PUSH",
    publicKey,
  });

  if (!result?.success) {
    throw new Error("Failed to subscribe to push");
  }

  const apiResponse = await apiFetch("/push/subscribe", {
    method: "POST",
    body: JSON.stringify(result.subscription),
  });

  if (!apiResponse.ok) {
    throw new Error("Failed to subscribe to push");
  }
}

export async function isSubscribedPushNotifications() {
  const result = await chrome.runtime.sendMessage({
    type: "CHECK_PUSH_SUBSCRIPTION",
  });

  if (!result?.success) {
    return false;
  }

  return true;
}

export async function unsubscribeNotifications() {
  const result = await chrome.runtime.sendMessage({
    type: "UNSUBSCRIBE_FROM_PUSH",
  });

  if (!result?.success) {
    throw new Error("Failed to subscribe to push");
  }

  if (result?.endpoint) {
    await apiFetch("/push/delete", {
      method: "POST",
      body: JSON.stringify({
        endpoint: result.endpoint,
      }),
    });
  }
}
