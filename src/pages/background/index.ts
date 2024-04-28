console.log('background script loaded');
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(sender.tab ?
              "bbbbb from a content script:" + sender.tab.url :
              "bbbbbcccc from the extension");

  if (request.greeting === "hello") sendResponse({farewell: "goodbye222"});
  }
);

