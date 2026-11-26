/// <reference types="chrome" />
// Tracks open LeetCode tabs and which problem the user is on.

const PROBLEM_SLUG_REGEX = /^\/problems\/([a-z0-9-]+)/;

export interface LeetcodeActivity {
  onLeetcode: boolean;
  leetcodeProblem: string | null;
}

// tabId -> problem slug (null = on LeetCode but not on a problem).
// Insertion order is recency: the most recently used tab is last.
const leetcodeTabs = new Map<number, string | null>();

function parseUrl(url: string | undefined) {
  if (!url) return { isLeetcode: false, slug: null };
  try {
    const { hostname, pathname } = new URL(url);
    const isLeetcode = hostname === "leetcode.com";
    const slug = isLeetcode
      ? (pathname.match(PROBLEM_SLUG_REGEX)?.[1] ?? null)
      : null;
    return { isLeetcode, slug };
  } catch {
    return { isLeetcode: false, slug: null };
  }
}

export function getActivity(): LeetcodeActivity {
  const slugs = [...leetcodeTabs.values()];
  return {
    onLeetcode: slugs.length > 0,
    leetcodeProblem: slugs.length > 0 ? slugs[slugs.length - 1] : null,
  };
}

export function initTabTracking(
  onChange: (activity: LeetcodeActivity) => void,
) {
  let last = JSON.stringify(getActivity());
  const emit = () => {
    const activity = getActivity();
    const serialized = JSON.stringify(activity);
    if (serialized === last) return;
    last = serialized;
    onChange(activity);
  };

  const updateTab = (tabId: number, url: string | undefined) => {
    const { isLeetcode, slug } = parseUrl(url);
    leetcodeTabs.delete(tabId);
    if (isLeetcode) leetcodeTabs.set(tabId, slug);
    emit();
  };

  const onNavigation = (details: {
    tabId: number;
    frameId: number;
    url: string;
  }) => {
    if (details.frameId !== 0) return; // main frame only
    updateTab(details.tabId, details.url);
  };

  // Full page loads anywhere (so we notice when a tab leaves LeetCode)
  chrome.webNavigation.onCommitted.addListener(onNavigation);
  // LeetCode is an SPA; problem changes are pushState navigations
  chrome.webNavigation.onHistoryStateUpdated.addListener(onNavigation, {
    url: [{ hostEquals: "leetcode.com" }],
  });

  chrome.tabs.onRemoved.addListener((tabId) => {
    if (leetcodeTabs.delete(tabId)) emit();
  });

  chrome.tabs.onReplaced.addListener((addedTabId, removedTabId) => {
    if (!leetcodeTabs.has(removedTabId)) return;
    const slug = leetcodeTabs.get(removedTabId)!;
    leetcodeTabs.delete(removedTabId);
    leetcodeTabs.set(addedTabId, slug);
    emit();
  });

  // Switching to a LeetCode tab makes its problem the current one
  chrome.tabs.onActivated.addListener(({ tabId }) => {
    if (!leetcodeTabs.has(tabId)) return;
    const slug = leetcodeTabs.get(tabId)!;
    leetcodeTabs.delete(tabId);
    leetcodeTabs.set(tabId, slug);
    emit();
  });

  // The service worker may have restarted: rebuild state from open tabs.
  chrome.tabs.query({ url: "https://leetcode.com/*" }).then((tabs) => {
    tabs
      .sort((a, b) => Number(a.active) - Number(b.active)) // active tabs last
      .forEach((tab) => {
        if (tab.id === undefined || leetcodeTabs.has(tab.id)) return;
        const { isLeetcode, slug } = parseUrl(tab.url);
        if (isLeetcode) leetcodeTabs.set(tab.id, slug);
      });
    emit();
  });
}
