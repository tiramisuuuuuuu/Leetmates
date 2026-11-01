import { supabase } from "./supabase";

const IS_BUILD_TEST = import.meta.env.VITE_IS_LOCAL_BUILD === "true";

export async function apiFetch(
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("Not authenticated");
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...Object.fromEntries(new Headers(options.headers || {}).entries()),
    Authorization: `Bearer ${session.access_token}`,
  };

  const url = `${import.meta.env.VITE_BACKEND_URL}${path}`;

  if (!IS_BUILD_TEST) {
    return fetch(url, {
      ...options,
      headers,
    });
  }

  // Proxy fetch via background script ONLY during local build testing
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      {
        type: "PROXY_FETCH",
        url,
        options: {
          ...options,
          headers,
          body:
            typeof options.body === "object"
              ? JSON.stringify(options.body)
              : options.body,
        },
      },
      (response) => {
        if (chrome.runtime.lastError) {
          return reject(new Error(chrome.runtime.lastError.message));
        }

        if (!response.success) {
          return reject(new Error(response.error));
        }

        resolve(
          new Response(JSON.stringify(response.data), {
            status: response.status,
            statusText: response.statusText,
            headers: new Headers(response.headers),
          }),
        );
      },
    );
  });
}
