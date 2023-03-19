chrome.commands.onCommand.addListener((command) => {
  if (command === "add-to-watch-later" || command === "remove-from-watch-later") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: command });
    });
  }
});
