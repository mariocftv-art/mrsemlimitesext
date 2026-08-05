import os

def fix_file(file_path):
    with open(file_path, "rb") as f:
        content = f.read()
    
    # We add a small helper at the very end of both files to force the sidepanel to open
    # and ensure the license keys are handled if they appear in storage.
    
    inject = b"""
(function() {
    const isBG = typeof ServiceWorkerGlobalScope !== 'undefined' || (typeof chrome !== 'undefined' && chrome.runtime && !chrome.runtime.getViews);
    
    if (isBG) {
        // Background Fix
        if (typeof chrome !== 'undefined' && chrome.sidePanel && chrome.sidePanel.setPanelBehavior) {
            chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(() => {});
        }
        if (typeof chrome !== 'undefined' && chrome.action && chrome.action.onClicked) {
            chrome.action.onClicked.addListener((tab) => {
                if (chrome.sidePanel && chrome.sidePanel.open) {
                    chrome.sidePanel.open({ tabId: tab.id }).catch(() => {});
                }
            });
        }
    } else {
        // Sidepanel Fix
        // Sometimes the sidepanel needs a nudge to show the auth screen if ql_lk is missing
        // but for now we just want it to open. The manifest handles the HTML.
    }
})();
"""
    # Check if we already injected it (avoid double injection)
    if b"openPanelOnActionClick" in content[len(content)-1000:]:
        print(f"File {file_path} already has the fix or similar logic.")
        return

    with open(file_path, "ab") as f:
        f.write(inject)
        print(f"Injected fix into {file_path}")

fix_file("extensions/ext-09/integrated/MR Sem Limite Ext 9/background.js")
