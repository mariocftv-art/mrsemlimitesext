import sys

file_path = "extensions/ext-09/integrated/MR Sem Limite Ext 9/background.js"
with open(file_path, "rb") as f:
    content = f.read()

# We want to replace the mock action definition if possible, 
# or ensure the real one works.
# Actually, the best way is to inject a small bit of code at the end of the script
# that forces the sidePanel behavior and also adds an onClicked listener as fallback.

fix_code = b"""
(function() {
  if (typeof chrome !== 'undefined' && chrome.sidePanel && chrome.sidePanel.setPanelBehavior) {
    chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(() => {});
  }
  if (typeof chrome !== 'undefined' && chrome.action && chrome.action.onClicked) {
    chrome.action.onClicked.addListener((tab) => {
      if (chrome.sidePanel && chrome.sidePanel.open) {
        chrome.sidePanel.open({ tabId: tab.id }).catch(() => {
           // Fallback if open() is not supported or fails
           chrome.storage.local.set({ 'ql_ui_mode': 'sidepanel' });
        });
      }
    });
  }
})();
"""

with open(file_path, "ab") as f:
    f.write(fix_code)
