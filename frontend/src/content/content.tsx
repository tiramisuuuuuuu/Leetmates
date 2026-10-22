/// <reference types="chrome" />
import { createRoot } from "react-dom/client";
import Overlay from "../components/Overlay";
import tailwindStyles from "../index.css?inline";

// Listens for messages from popup, NOT USED FOR NOW
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "NOT_IMPLEMENTED") {
    console.log("Not implemented");
  }
});

function observeLCTitle(onTitleChange: (title: string) => void) {
  const titleElement = document.querySelector("head > title");

  if (titleElement) {
    const isProblemPage = location.pathname.startsWith("/problems/");

    if (isProblemPage) {
      onTitleChange(document.title);
    }

    const observer = new MutationObserver(() => {
      const isProblemPage = location.pathname.startsWith("/problems/");

      if (isProblemPage) {
        onTitleChange(document.title);
      }
    });

    observer.observe(titleElement, {
      childList: true,
      characterData: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }

  return null;
}

observeLCTitle((title) => {
  console.log("Current question:", title);
});

const shadowRootHost = document.createElement("div");
document.body.appendChild(shadowRootHost);

const shadowRoot = shadowRootHost.attachShadow({ mode: "open" });

const style = document.createElement("style");
style.textContent = tailwindStyles;
shadowRoot.appendChild(style);

const reactRoot = document.createElement("div");
reactRoot.style.position = "fixed";
reactRoot.style.top = "0";
reactRoot.style.left = "0";
reactRoot.style.width = "100vw";
reactRoot.style.height = "100vh";
reactRoot.style.zIndex = "99999";
reactRoot.style.letterSpacing = "0.18px";
reactRoot.style.pointerEvents = "none";

shadowRoot.appendChild(reactRoot);

createRoot(reactRoot).render(
  <Overlay assetPrefix={chrome.runtime.getURL("")} />,
);
