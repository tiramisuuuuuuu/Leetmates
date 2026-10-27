const PROBLEM_SLUG_REGEX = /^\/problems\/([a-z0-9-]+)/;

export default function onNavigationChange(details: chrome.webNavigation.WebNavigationTransitionCallbackDetails) {
  // if (details.frameId !== 0) return; //only main frame
  // const { pathname } = new URL(details.url);
  // if (!pathname.includes('leetcode.com')) return;
  // const slug = pathname.match(PROBLEM_SLUG_REGEX)?.[1] ?? null;
  // if (slug)

  console.log(details.url);

  // open websocket
  //   const ws = new WebSocket('ws://localhost:3000');
  //   ws.onopen = () => console.log('ws open');
}
