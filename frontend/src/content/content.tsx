/// <reference types="chrome" />
import { createRoot } from "react-dom/client";
import Overlay from "../components/Overlay";


const title = document.title;

console.log("Current page:", title);

// Listens for messages from popup, NOT USED FOR NOW
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "NOT_IMPLEMENTED") {
    console.log("Not implemented")
  }
});

const overlayContainer = document.createElement("div");

document.body.appendChild(overlayContainer);

createRoot(overlayContainer).render(<Overlay />);
