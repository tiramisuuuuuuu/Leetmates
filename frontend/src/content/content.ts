/// <reference types="chrome" />

const title = document.title;

console.log("Current page:", title);

// Listens for messages from popup, NOT USED FOR NOW
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "NOT_IMPLEMENTED") {
    console.log("Not implemented")
  }
});
