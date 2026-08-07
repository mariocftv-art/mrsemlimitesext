/* ===== TS Community content (consolidated bundle - mode: official-v2) ===== */
/* --- inlined floating css (local) --- */
(function(){try{var __css=document.createElement('style');__css.id='ts-floating-css';__css.textContent="\n@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');\n\n/* ===== CSS VARIABLES ===== */\n:root {\n  /* ---- Brand tokens (override via branding.config.js) ---- */\n  --ts-brand-primary: #8B5CF6;\n  --ts-brand-primary-rgb: 139, 92, 246;\n  --ts-brand-primary-hover: #7C3AED;\n  --ts-brand-primary-soft: rgba(139, 92, 246, 0.12);\n  --ts-brand-primary-border: rgba(139, 92, 246, 0.35);\n  --ts-brand-primary-glow: rgba(139, 92, 246, 0.35);\n  --ts-brand-gradient: linear-gradient(135deg, #8B5CF6, #7C3AED);\n\n  --ql-bg: #0a0a0b;\n  --ql-bg-elevated: #111113;\n  --ql-bg-surface: #18181b;\n  --ql-bg-hover: #1f1f23;\n  --ql-border: rgba(255,255,255,0.06);\n  --ql-border-hover: rgba(255,255,255,0.12);\n  --ql-text-primary: #f4f4f5;\n  --ql-text-secondary: #a1a1aa;\n  --ql-text-muted: #71717a;\n  --ql-accent: var(--ts-brand-primary);\n  --ql-accent-hover: var(--ts-brand-primary-hover);\n  --ql-accent-glow: rgba(var(--ts-brand-primary-rgb),0.25);\n  --ql-accent-subtle: rgba(var(--ts-brand-primary-rgb),0.08);\n  --ql-success: #34d399;\n  --ql-success-bg: rgba(52,211,153,0.08);\n  --ql-warning: #fbbf24;\n  --ql-warning-bg: rgba(251,191,36,0.08);\n  --ql-danger: #f87171;\n  --ql-danger-bg: rgba(248,113,113,0.08);\n  --ql-radius: 16px;\n  --ql-radius-sm: 10px;\n  --ql-radius-xs: 8px;\n  --ql-shadow: 0 24px 80px -12px rgba(0,0,0,0.6), 0 0 0 1px var(--ql-border);\n  --ql-shadow-hover: 0 32px 100px -12px rgba(0,0,0,0.7), 0 0 0 1px var(--ql-border-hover);\n  --ql-transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1);\n  --ql-glass: rgba(17,17,19,0.85);\n}\n\n/* ===== MAIN CONTAINER ===== */\n#ql-floating {\n  position: fixed;\n  width: 400px;\n  z-index: 999999999;\n  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;\n  border-radius: var(--ql-radius);\n  overflow: hidden;\n  background: var(--ql-bg);\n  border: 1px solid var(--ql-border);\n  box-shadow: var(--ql-shadow);\n  transition: box-shadow var(--ql-transition), height 0.3s ease;\n  display: flex;\n  flex-direction: column;\n  min-height: 60px;\n  overflow-y: auto;\n  backdrop-filter: blur(20px);\n  -webkit-backdrop-filter: blur(20px);\n}\n\n#ql-floating:hover {\n  box-shadow: var(--ql-shadow-hover);\n}\n\n#ql-floating * {\n  box-sizing: border-box;\n}\n\n/* Ensure all interactive elements are clickable */\n#ql-floating button,\n#ql-floating input,\n#ql-floating textarea,\n#ql-floating label,\n#ql-floating a,\n#ql-floating select {\n  pointer-events: auto !important;\n  position: relative;\n  z-index: 1;\n}\n\n/* ===== MINIMIZED ===== */\n#ql-floating.ql-minimized {\n  height: auto !important;\n  min-height: 52px;\n  overflow: hidden;\n}\n#ql-floating.ql-minimized #ql-body,\n#ql-floating.ql-minimized #ql-footer,\n#ql-floating.ql-minimized #ql-resize-handle,\n#ql-floating.ql-minimized #ql-notif-panel {\n  display: none !important;\n}\n\n/* ===== HEADER ===== */\n#ql-header {\n  cursor: move;\n  padding: 14px 18px;\n  background: var(--ql-bg-elevated);\n  border-bottom: 1px solid var(--ql-border);\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  user-select: none;\n  -webkit-user-select: none;\n  touch-action: none;\n  flex-shrink: 0;\n}\n\n.ql-header-left {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n}\n\n.ql-brand {\n  font-size: 14px;\n  font-weight: 700;\n  color: var(--ql-text-primary);\n  letter-spacing: -0.02em;\n}\n\n.ql-badge-pro-header {\n  font-size: 9px;\n  font-weight: 800;\n  padding: 3px 8px;\n  border-radius: 6px;\n  background: linear-gradient(135deg, var(--ql-accent), #FF4242);\n  color: #fff;\n  letter-spacing: 0.08em;\n  text-transform: uppercase;\n}\n\n.ql-header-right {\n  display: flex;\n  align-items: center;\n  gap: 2px;\n  flex-shrink: 0;\n}\n\n.ql-icon-btn {\n  width: 32px;\n  height: 32px;\n  border: none;\n  background: transparent;\n  border-radius: var(--ql-radius-xs);\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 14px;\n  transition: all var(--ql-transition);\n  color: var(--ql-text-muted);\n  position: relative;\n}\n.ql-icon-btn:hover {\n  background: var(--ql-bg-hover);\n  color: var(--ql-text-primary);\n}\n\n/* ===== NOTIFICATION BADGE ===== */\n.ql-notif-badge {\n  position: absolute;\n  top: -3px;\n  right: -3px;\n  width: 18px;\n  height: 18px;\n  border-radius: 50%;\n  background: linear-gradient(135deg, #ef4444, #dc2626);\n  color: #fff;\n  font-size: 9px;\n  font-weight: 800;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  line-height: 1;\n  box-shadow: 0 0 8px rgba(239,68,68,0.4);\n}\n\n/* ===== NOTIFICATION PANEL ===== */\n.ql-notif-panel {\n  position: absolute;\n  top: 52px;\n  right: 8px;\n  left: 8px;\n  background: var(--ql-bg-surface);\n  border: 1px solid var(--ql-border);\n  border-radius: 14px;\n  box-shadow: 0 16px 48px -12px rgba(0,0,0,0.5);\n  z-index: 10;\n  max-height: 300px;\n  overflow-y: auto;\n  animation: ql-slide-down 0.2s ease;\n}\n@keyframes ql-slide-down {\n  from { opacity: 0; transform: translateY(-8px); }\n  to { opacity: 1; transform: translateY(0); }\n}\n\n.ql-notif-header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 14px 16px;\n  border-bottom: 1px solid var(--ql-border);\n  font-size: 13px;\n  font-weight: 700;\n  color: var(--ql-text-primary);\n}\n.ql-notif-close-btn {\n  border: none;\n  background: none;\n  cursor: pointer;\n  font-size: 13px;\n  color: var(--ql-text-muted);\n  padding: 4px 8px;\n  border-radius: 6px;\n  transition: all var(--ql-transition);\n}\n.ql-notif-close-btn:hover { background: var(--ql-bg-hover); color: var(--ql-text-primary); }\n.ql-notif-list { padding: 8px; }\n.ql-notif-empty {\n  text-align: center;\n  color: var(--ql-text-muted);\n  font-size: 12px;\n  padding: 20px 0;\n  margin: 0;\n}\n.ql-notif-item {\n  padding: 12px 14px;\n  border-radius: var(--ql-radius-sm);\n  background: var(--ql-bg-hover);\n  margin-bottom: 6px;\n  border: 1px solid var(--ql-border);\n  transition: all var(--ql-transition);\n}\n.ql-notif-item:hover {\n  border-color: var(--ql-border-hover);\n}\n.ql-notif-item:last-child { margin-bottom: 0; }\n.ql-notif-item-title {\n  font-size: 12px;\n  font-weight: 700;\n  color: var(--ql-text-primary);\n  margin-bottom: 3px;\n}\n.ql-notif-item-msg {\n  font-size: 11px;\n  color: var(--ql-text-secondary);\n  margin-bottom: 6px;\n  line-height: 1.5;\n}\n.ql-notif-link {\n  font-size: 11px;\n  color: var(--ql-accent);\n  text-decoration: none;\n  font-weight: 600;\n  transition: opacity var(--ql-transition);\n}\n.ql-notif-link:hover { opacity: 0.8; }\n.ql-notif-item-date {\n  font-size: 10px;\n  color: var(--ql-text-muted);\n  margin-top: 6px;\n}\n\n/* ===== CUSTOM ALERT ===== */\n.ql-custom-alert {\n  position: absolute;\n  inset: 0;\n  background: rgba(0,0,0,0.6);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  z-index: 20;\n  border-radius: var(--ql-radius);\n  backdrop-filter: blur(8px);\n}\n.ql-alert-content {\n  background: var(--ql-bg-surface);\n  border: 1px solid var(--ql-border);\n  border-radius: var(--ql-radius);\n  padding: 28px 24px;\n  text-align: center;\n  width: 85%;\n  max-width: 300px;\n  box-shadow: 0 24px 60px -12px rgba(0,0,0,0.6);\n  animation: ql-alert-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);\n}\n@keyframes ql-alert-in {\n  from { transform: scale(0.9); opacity: 0; }\n  to { transform: scale(1); opacity: 1; }\n}\n.ql-alert-icon { font-size: 40px; margin-bottom: 12px; }\n.ql-alert-title {\n  font-size: 16px;\n  font-weight: 700;\n  color: var(--ql-text-primary);\n  margin-bottom: 8px;\n}\n.ql-alert-message {\n  font-size: 13px;\n  color: var(--ql-text-secondary);\n  margin-bottom: 20px;\n  line-height: 1.5;\n}\n.ql-alert-ok-btn {\n  padding: 10px 36px;\n  border: none;\n  border-radius: var(--ql-radius-sm);\n  background: linear-gradient(135deg, var(--ql-accent), #FF4242);\n  color: #fff;\n  font-size: 13px;\n  font-weight: 700;\n  cursor: pointer;\n  transition: all var(--ql-transition);\n  box-shadow: 0 4px 16px var(--ql-accent-glow);\n}\n.ql-alert-ok-btn:hover {\n  transform: translateY(-1px);\n  box-shadow: 0 8px 24px var(--ql-accent-glow);\n}\n\n\n/* ===== BODY ===== */\n#ql-body {\n  padding: 18px;\n  flex: 1;\n  overflow-y: auto;\n}\n\n/* ===== PROFILE CARD ===== */\n.ql-profile-card {\n  background: var(--ql-bg-surface);\n  border: 1px solid var(--ql-border);\n  border-radius: 14px;\n  padding: 14px 16px;\n  margin-bottom: 16px;\n  transition: border-color var(--ql-transition);\n}\n.ql-profile-card:hover {\n  border-color: var(--ql-border-hover);\n}\n\n.ql-profile-top {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  margin-bottom: 10px;\n}\n\n.ql-profile-info {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n}\n\n.ql-profile-name {\n  font-size: 14px;\n  font-weight: 700;\n  color: var(--ql-text-primary);\n  letter-spacing: -0.01em;\n}\n\n.ql-status-badge {\n  font-size: 9px;\n  font-weight: 800;\n  padding: 3px 10px;\n  border-radius: 6px;\n  letter-spacing: 0.08em;\n  text-transform: uppercase;\n}\n\n.ql-badge-test {\n  background: var(--ql-warning-bg);\n  color: var(--ql-warning);\n  border: 1px solid rgba(251,191,36,0.15);\n}\n\n.ql-badge-pro {\n  background: var(--ql-success-bg);\n  color: var(--ql-success);\n  border: 1px solid rgba(52,211,153,0.15);\n}\n\n/* ===== SYNC STATUS ===== */\n.ql-sync-status {\n  font-size: 12px;\n  font-weight: 500;\n  margin-bottom: 8px;\n  padding: 0;\n}\n\n.ql-sync-ok .ql-sync-text {\n  color: var(--ql-success);\n}\n\n.ql-sync-waiting .ql-sync-text {\n  color: var(--ql-warning);\n}\n\n/* ===== TRIAL COUNTDOWN ===== */\n.ql-trial-countdown {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n  padding: 10px 12px;\n  border-radius: 12px;\n  background: rgba(255, 255, 255, 0.03);\n  border: 1px solid var(--ql-border);\n  margin-top: 8px;\n}\n\n.ql-countdown-row {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  font-size: 12px;\n}\n\n.ql-countdown-icon { font-size: 13px; }\n.ql-countdown-label {\n  color: var(--ql-text-secondary);\n  font-weight: 500;\n}\n.ql-countdown-time {\n  margin-left: auto;\n  font-family: 'SF Mono', 'Fira Code', 'JetBrains Mono', monospace;\n  font-size: 13px;\n  font-weight: 700;\n  color: var(--ql-warning);\n  letter-spacing: 0.03em;\n}\n.ql-countdown-expired {\n  color: var(--ql-danger);\n  font-weight: 600;\n  font-size: 12px;\n}\n\n.ql-trial-bar {\n  width: 100%;\n  height: 6px;\n  border-radius: 6px;\n  background: var(--ql-bg-hover);\n  overflow: hidden;\n  position: relative;\n}\n\n.ql-trial-bar-fill {\n  height: 100%;\n  border-radius: 6px;\n  background: linear-gradient(90deg, var(--ql-accent), #FF4242, #38bdf8);\n  background-size: 200% 100%;\n  animation: ql-bar-shimmer 3s ease infinite;\n  transition: width 1s ease;\n  box-shadow: 0 0 8px rgba(var(--ts-brand-primary-rgb), 0.4);\n}\n\n.ql-trial-bar-fill.ql-bar-urgent {\n  background: linear-gradient(90deg, #ef4444, #f97316);\n  background-size: 200% 100%;\n  animation: ql-bar-shimmer 1.5s ease infinite, ql-bar-pulse 2s ease-in-out infinite;\n  box-shadow: 0 0 10px rgba(239, 68, 68, 0.5);\n}\n\n.ql-trial-bar-fill.ql-bar-expired {\n  background: var(--ql-danger);\n}\n\n@keyframes ql-bar-shimmer {\n  0% { background-position: 200% 0; }\n  100% { background-position: -200% 0; }\n}\n\n@keyframes ql-bar-pulse {\n  0%, 100% { opacity: 1; }\n  50% { opacity: 0.7; }\n}\n\n/* ===== LIFETIME LICENSE ===== */\n.ql-lifetime-card {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  gap: 4px;\n\n  padding: 14px 12px;\n  border-radius: 14px;\n\n  background:\n    linear-gradient(\n      135deg,\n      rgba(var(--ts-brand-primary-rgb),0.14),\n      rgba(255,66,66,0.08)\n    );\n\n  border: 1px solid rgba(var(--ts-brand-primary-rgb),0.22);\n\n  position: relative;\n  overflow: hidden;\n}\n\n.ql-lifetime-card::before {\n  content: '';\n  position: absolute;\n  inset: 0;\n\n  background:\n    radial-gradient(\n      circle at top right,\n      rgba(var(--ts-brand-primary-rgb),0.18),\n      transparent 45%\n    );\n\n  pointer-events: none;\n}\n\n.ql-lifetime-icon {\n  font-size: 20px;\n  line-height: 1;\n\n  color: var(--ts-brand-primary);\n\n  text-shadow:\n    0 0 12px rgba(var(--ts-brand-primary-rgb),0.45),\n    0 0 24px rgba(var(--ts-brand-primary-rgb),0.25);\n\n  animation: ql-lifetime-float 3s ease-in-out infinite;\n}\n\n.ql-lifetime-label {\n  font-size: 11px;\n  font-weight: 800;\n\n  letter-spacing: 0.18em;\n  text-transform: uppercase;\n\n  background: linear-gradient(\n    90deg,\n    var(--ts-brand-primary),\n    #ffffff,\n    #fda4af\n  );\n\n  -webkit-background-clip: text;\n  -webkit-text-fill-color: transparent;\n}\n\n.ql-lifetime-status {\n  font-size: 11px;\n  font-weight: 500;\n  color: var(--ql-text-secondary);\n\n  opacity: 0.9;\n}\n\n@keyframes ql-lifetime-float {\n  0%,100% {\n    transform: translateY(0px);\n  }\n\n  50% {\n    transform: translateY(-3px);\n  }\n}\n\n/* ===== TEXTAREA ===== */\n#ql-floating textarea {\n  width: 100%;\n  padding: 14px 16px;\n  border-radius: 14px;\n  border: 1px solid var(--ql-border);\n  background: var(--ql-bg-surface);\n  color: var(--ql-text-primary);\n  font-size: 13px;\n  font-family: 'Inter', -apple-system, sans-serif;\n  transition: border-color var(--ql-transition), box-shadow var(--ql-transition);\n  box-sizing: border-box;\n  outline: none;\n  resize: vertical;\n  min-height: 64px;\n  margin-bottom: 10px;\n  line-height: 1.5;\n}\n\n#ql-floating textarea:focus {\n  border-color: var(--ql-accent);\n  box-shadow: none;\n}\n\n#ql-floating textarea::placeholder {\n  color: var(--ql-text-muted);\n}\n\n/* ===== ACTION BAR ===== */\n.ql-action-bar {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  margin-bottom: 16px;\n  padding: 0;\n  gap: 8px;\n}\n\n.ql-action-left {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  flex-shrink: 0;\n}\n\n.ql-action-center {\n  display: flex;\n  align-items: center;\n  gap: 4px;\n}\n\n.ql-action-right-send {\n  flex-shrink: 0;\n}\n\n.ql-tool-btn {\n  width: 34px;\n  height: 34px;\n  border: 1px solid var(--ql-border);\n  background: var(--ql-bg-surface);\n  border-radius: var(--ql-radius-xs);\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  transition: all var(--ql-transition);\n  color: var(--ql-text-muted);\n}\n.ql-tool-btn:hover {\n  background: var(--ql-accent-subtle);\n  border-color: rgba(var(--ts-brand-primary-rgb),0.2);\n  color: var(--ql-accent);\n  box-shadow: 0 0 12px var(--ql-accent-glow);\n  transform: translateY(-1px);\n}\n.ql-tool-btn:disabled {\n  opacity: 0.35;\n  cursor: not-allowed;\n  transform: none;\n}\n\n/* Tool button loading */\n.ql-tool-loading {\n  animation: ql-spin 0.8s linear infinite;\n}\n@keyframes ql-spin {\n  from { transform: rotate(0deg); }\n  to { transform: rotate(360deg); }\n}\n\n/* Recording indicator */\n.ql-recording {\n  background: var(--ql-danger-bg) !important;\n  border-color: rgba(248,113,113,0.3) !important;\n  color: var(--ql-danger) !important;\n  animation: ql-pulse 1.5s ease-in-out infinite;\n}\n@keyframes ql-pulse {\n  0%, 100% { box-shadow: 0 0 0 0 rgba(248,113,113,0.3); }\n  50% { box-shadow: 0 0 0 8px rgba(248,113,113,0); }\n}\n\n.ql-toggle-label-inline {\n  font-size: 10px;\n  font-weight: 600;\n  color: var(--ql-text-muted);\n  text-transform: uppercase;\n  letter-spacing: 0.06em;\n}\n\n/* ===== SEND BUTTON ===== */\n.ql-send-btn {\n  padding: 8px 22px;\n  border: none;\n  border-radius: var(--ql-radius-sm);\n  background: linear-gradient(135deg, var(--ql-accent), #FF4242);\n  color: #fff;\n  font-size: 13px;\n  font-weight: 700;\n  cursor: pointer;\n  transition: all var(--ql-transition);\n  box-shadow: 0 2px 12px var(--ql-accent-glow);\n  letter-spacing: -0.01em;\n}\n.ql-send-btn:hover {\n  box-shadow: 0 6px 24px var(--ql-accent-glow);\n  transform: translateY(-1px);\n  filter: brightness(1.1);\n}\n.ql-send-btn:active {\n  transform: translateY(0);\n  filter: brightness(0.95);\n}\n.ql-send-btn.ql-sending,\n.ql-send-btn:disabled {\n  opacity: 0.5;\n  pointer-events: none;\n}\n\n/* ===== TOGGLE ===== */\n.ql-toggle {\n  position: relative;\n  width: 36px;\n  height: 20px;\n  cursor: pointer;\n  flex-shrink: 0;\n}\n.ql-toggle input {\n  opacity: 0; width: 0; height: 0; position: absolute;\n}\n.ql-toggle-slider {\n  position: absolute;\n  inset: 0;\n  border-radius: 20px;\n  background: var(--ql-bg-hover);\n  border: 1px solid var(--ql-border);\n  transition: all 0.3s ease;\n}\n.ql-toggle-slider::before {\n  content: '';\n  position: absolute;\n  width: 16px; height: 16px;\n  border-radius: 50%;\n  background: var(--ql-text-muted);\n  top: 1px; left: 1px;\n  transition: all 0.3s ease;\n}\n.ql-toggle input:checked + .ql-toggle-slider {\n  background: var(--ql-accent-subtle);\n  border-color: rgba(var(--ts-brand-primary-rgb),0.3);\n}\n.ql-toggle input:checked + .ql-toggle-slider::before {\n  transform: translateX(16px);\n  background: var(--ql-accent);\n  box-shadow: none;\n}\n\n/* ===== LOG ===== */\n#ql-log, #ql-license-log {\n  font-size: 12px;\n  margin-top: 10px;\n  min-height: 18px;\n  padding: 0 4px;\n  font-weight: 600;\n  text-align: center;\n}\n.ql-log-success { color: var(--ql-success) !important; }\n.ql-log-error { color: var(--ql-danger) !important; }\n.ql-log-info { color: var(--ql-accent) !important; }\n\n/* ===== SHORTCUTS ===== */\n.ql-shortcuts-section {\n  margin-top: 8px;\n}\n\n.ql-shortcuts-title {\n  display: block;\n  text-align: center;\n  font-size: 10px;\n  font-weight: 700;\n  text-transform: uppercase;\n  letter-spacing: 0.12em;\n  color: var(--ql-text-muted);\n  margin-bottom: 12px;\n}\n\n.ql-shortcuts-grid {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 6px;\n}\n\n.ql-chip {\n  padding: 8px 4px;\n  border-radius: var(--ql-radius-xs);\n  border: 1px solid var(--ql-border);\n  background: var(--ql-bg-surface);\n  color: var(--ql-text-secondary);\n  font-size: 11px;\n  font-weight: 500;\n  cursor: pointer;\n  transition: all var(--ql-transition);\n  text-align: center;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 5px;\n}\n.ql-chip svg {\n  flex-shrink: 0;\n}\n.ql-chip:hover {\n  background: var(--ql-accent-subtle);\n  border-color: rgba(var(--ts-brand-primary-rgb),0.2);\n  color: var(--ts-brand-primary);\n  transform: translateY(-2px);\n  box-shadow: 0 4px 16px var(--ql-accent-glow);\n}\n\n/* ===== LICENSE GATE ===== */\n.ql-license-gate {\n  text-align: center;\n  padding: 24px 0;\n}\n.ql-lock-icon { font-size: 40px; margin-bottom: 16px; }\n.ql-gate-title { font-size: 17px; font-weight: 700; color: var(--ql-text-primary); margin-bottom: 6px; letter-spacing: -0.02em; }\n.ql-gate-desc { font-size: 13px; color: var(--ql-text-secondary); margin-bottom: 20px; line-height: 1.5; }\n\n#ql-floating input {\n  width: 100%;\n  padding: 12px 16px;\n  border-radius: var(--ql-radius-sm);\n  border: 1px solid var(--ql-border);\n  background: var(--ql-bg-surface);\n  color: var(--ql-text-primary);\n  font-size: 13px;\n  font-family: 'Inter', -apple-system, sans-serif;\n  transition: all var(--ql-transition);\n  box-sizing: border-box;\n  outline: none;\n}\n#ql-floating input:focus {\n  border-color: var(--ql-accent);\n  box-shadow: none;\n}\n#ql-floating input::placeholder { color: var(--ql-text-muted); }\n\n#ql-validate-btn {\n  width: 100%;\n  padding: 12px;\n  border: none;\n  border-radius: var(--ql-radius-sm);\n  background: linear-gradient(135deg, var(--ql-accent), #FF4242);\n  color: white;\n  font-size: 14px;\n  font-weight: 700;\n  cursor: pointer;\n  transition: all var(--ql-transition);\n  margin-top: 8px;\n  box-shadow: 0 4px 16px var(--ql-accent-glow);\n  letter-spacing: -0.01em;\n}\n#ql-validate-btn:hover {\n  transform: translateY(-1px);\n  box-shadow: 0 8px 28px var(--ql-accent-glow);\n  filter: brightness(1.1);\n}\n\n/* ===== FOOTER ===== */\n.ql-footer {\n  padding: 10px 18px;\n  border-top: 1px solid var(--ql-border);\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 6px;\n  flex-shrink: 0;\n  font-size: 11px;\n  font-weight: 600;\n  color: var(--ql-text-muted);\n}\n.ql-footer-row {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  width: 100%;\n}\n.ql-footer-version {\n  font-size: 9px;\n  color: var(--ql-text-muted);\n  opacity: 0.5;\n}\n.ql-support-link {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  color: var(--ql-text-muted);\n  text-decoration: none;\n  font-size: 11px;\n  font-weight: 600;\n  transition: color var(--ql-transition);\n  cursor: pointer;\n}\n.ql-support-link:hover {\n  color: var(--ql-accent);\n}\n.ql-support-link svg {\n  flex-shrink: 0;\n}\n\n.ql-badge-mz {\n  font-size: 9px;\n  font-weight: 600;\n  color: var(--ql-text-muted);\n  background: rgba(255,255,255,0.05);\n  border: 1px solid rgba(255,255,255,0.08);\n  padding: 2px 8px;\n  border-radius: 99px;\n  letter-spacing: 0.02em;\n}\n\n/* ===== SWEETALERT EXPIRED MODAL ===== */\n.ql-sweetalert-overlay {\n  position: absolute;\n  inset: 0;\n  background: rgba(0,0,0,0.7);\n  backdrop-filter: blur(8px);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  z-index: 99999;\n  opacity: 0;\n  transition: opacity 0.3s ease;\n  border-radius: inherit;\n}\n.ql-sweetalert-overlay.ql-sweetalert-visible {\n  opacity: 1;\n}\n.ql-sweetalert-box {\n  background: var(--ql-surface);\n  border: 1px solid var(--ql-border);\n  border-radius: 20px;\n  padding: 32px 28px;\n  text-align: center;\n  max-width: 320px;\n  width: 90%;\n  transform: scale(0.85);\n  transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1);\n  box-shadow: 0 25px 60px rgba(0,0,0,0.5);\n}\n.ql-sweetalert-visible .ql-sweetalert-box {\n  transform: scale(1);\n}\n.ql-sweetalert-icon {\n  font-size: 48px;\n  margin-bottom: 12px;\n  animation: ql-shake 0.6s ease 0.3s both;\n}\n@keyframes ql-shake {\n  0%, 100% { transform: rotate(0deg); }\n  20% { transform: rotate(-12deg); }\n  40% { transform: rotate(12deg); }\n  60% { transform: rotate(-8deg); }\n  80% { transform: rotate(8deg); }\n}\n.ql-sweetalert-title {\n  font-size: 18px;\n  font-weight: 800;\n  color: var(--ql-text);\n  margin: 0 0 8px;\n}\n.ql-sweetalert-text {\n  font-size: 13px;\n  color: var(--ql-text-secondary);\n  line-height: 1.5;\n  margin: 0 0 20px;\n}\n.ql-sweetalert-actions {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n}\n.ql-sweetalert-btn {\n  padding: 10px 20px;\n  border-radius: 12px;\n  font-size: 13px;\n  font-weight: 700;\n  cursor: pointer;\n  border: none;\n  text-decoration: none;\n  text-align: center;\n  transition: all 0.2s ease;\n}\n.ql-sweetalert-btn-primary {\n  background: linear-gradient(135deg, var(--ql-accent), #FF4242);\n  color: #fff;\n  box-shadow: 0 4px 15px var(--ql-accent-glow);\n}\n.ql-sweetalert-btn-primary:hover {\n  transform: translateY(-1px);\n  box-shadow: 0 6px 20px var(--ql-accent-glow);\n}\n.ql-sweetalert-btn-secondary {\n  background: rgba(255,255,255,0.06);\n  color: var(--ql-text-secondary);\n  border: 1px solid var(--ql-border);\n}\n.ql-sweetalert-btn-secondary:hover {\n  background: rgba(255,255,255,0.1);\n}\n\n\n.ql-resize-handle {\n  height: 10px;\n  cursor: ns-resize;\n  background: transparent;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex-shrink: 0;\n}\n.ql-resize-handle::after {\n  content: '';\n  width: 40px;\n  height: 3px;\n  border-radius: 3px;\n  background: var(--ql-border);\n  transition: background var(--ql-transition);\n}\n.ql-resize-handle:hover::after {\n  background: var(--ql-accent);\n  box-shadow: 0 0 8px var(--ql-accent-glow);\n}\n\n.ql-field { margin-bottom: 14px; }\n.ql-field label {\n  display: block;\n  font-size: 11px;\n  font-weight: 700;\n  text-transform: uppercase;\n  letter-spacing: 0.08em;\n  color: var(--ql-text-muted);\n  margin-bottom: 8px;\n}\n\n/* ===== LIGHT MODE ===== */\n#ql-floating.ql-light {\n  --ql-bg: #ffffff;\n  --ql-bg-elevated: #fafafa;\n  --ql-bg-surface: #f4f4f5;\n  --ql-bg-hover: #e4e4e7;\n  --ql-border: rgba(0,0,0,0.06);\n  --ql-border-hover: rgba(0,0,0,0.12);\n  --ql-text-primary: #18181b;\n  --ql-text-secondary: #52525b;\n  --ql-text-muted: #a1a1aa;\n  --ql-accent-subtle: rgba(var(--ts-brand-primary-rgb),0.06);\n  --ql-accent-glow: rgba(var(--ts-brand-primary-rgb),0.15);\n  --ql-shadow: 0 24px 80px -12px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04);\n  --ql-shadow-hover: 0 32px 100px -12px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.06);\n}\n\n/* ===== PAYMENT UI ===== */\n.ql-gate-divider {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  margin: 16px 0;\n  color: var(--ql-text-muted);\n  font-size: 11px;\n}\n.ql-gate-divider::before, .ql-gate-divider::after {\n  content: '';\n  flex: 1;\n  height: 1px;\n  background: var(--ql-border);\n}\n\n.ql-buy-btn {\n  width: 100%;\n  padding: 10px 16px;\n  border: 1px solid var(--ql-accent);\n  background: var(--ql-accent-subtle);\n  color: var(--ql-accent);\n  font-size: 13px;\n  font-weight: 700;\n  border-radius: var(--ql-radius-sm);\n  cursor: pointer;\n  transition: all var(--ql-transition);\n}\n.ql-buy-btn:hover {\n  background: var(--ql-accent);\n  color: #fff;\n  box-shadow: 0 4px 16px var(--ql-accent-glow);\n}\n\n.ql-pay-section { padding: 0; }\n.ql-pay-title {\n  font-size: 16px;\n  font-weight: 800;\n  color: var(--ql-text-primary);\n  margin-bottom: 14px;\n  text-align: center;\n  letter-spacing: -0.02em;\n}\n\n.ql-packages-list {\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n  margin-bottom: 14px;\n}\n.ql-pay-loading {\n  text-align: center;\n  color: var(--ql-text-muted);\n  font-size: 12px;\n  padding: 20px 0;\n}\n\n.ql-pkg-card {\n  background: var(--ql-bg-surface);\n  border: 1px solid var(--ql-border);\n  border-radius: 14px;\n  padding: 14px 16px;\n  position: relative;\n  transition: all var(--ql-transition);\n}\n.ql-pkg-card:hover {\n  border-color: var(--ql-border-hover);\n}\n.ql-pkg-highlight {\n  border-color: var(--ql-accent);\n  background: var(--ql-accent-subtle);\n  box-shadow: 0 0 20px var(--ql-accent-glow);\n}\n\n.ql-pkg-popular {\n  position: absolute;\n  top: -8px;\n  right: 12px;\n  background: linear-gradient(135deg, var(--ql-accent), #FF4242);\n  color: #fff;\n  font-size: 9px;\n  font-weight: 800;\n  padding: 3px 10px;\n  border-radius: 6px;\n  letter-spacing: 0.05em;\n}\n\n.ql-pkg-name {\n  font-size: 13px;\n  font-weight: 700;\n  color: var(--ql-text-primary);\n  margin-bottom: 4px;\n}\n.ql-pkg-price {\n  font-size: 22px;\n  font-weight: 800;\n  color: var(--ql-accent);\n  margin-bottom: 2px;\n  letter-spacing: -0.03em;\n}\n.ql-pkg-price span {\n  font-size: 12px;\n  font-weight: 600;\n  color: var(--ql-text-muted);\n}\n.ql-pkg-duration {\n  font-size: 11px;\n  color: var(--ql-text-secondary);\n  margin-bottom: 8px;\n}\n.ql-pkg-features {\n  list-style: none;\n  padding: 0;\n  margin: 0 0 10px;\n}\n.ql-pkg-features li {\n  font-size: 11px;\n  color: var(--ql-text-secondary);\n  padding: 2px 0;\n}\n.ql-pkg-features li::before {\n  content: '✓ ';\n  color: var(--ql-success);\n  font-weight: 700;\n}\n\n.ql-pkg-select-btn {\n  width: 100%;\n  padding: 8px;\n  border: none;\n  border-radius: var(--ql-radius-xs);\n  background: var(--ql-bg-hover);\n  color: var(--ql-text-primary);\n  font-size: 12px;\n  font-weight: 700;\n  cursor: pointer;\n  transition: all var(--ql-transition);\n}\n.ql-pkg-select-btn:hover {\n  background: var(--ql-accent);\n  color: #fff;\n}\n\n.ql-selected-pkg {\n  font-size: 12px;\n  color: var(--ql-text-primary);\n  padding: 10px 12px;\n  background: var(--ql-accent-subtle);\n  border: 1px solid rgba(var(--ts-brand-primary-rgb),0.2);\n  border-radius: var(--ql-radius-xs);\n  margin-bottom: 14px;\n}\n\n.ql-pay-field {\n  margin-bottom: 12px;\n}\n.ql-pay-field label {\n  display: block;\n  font-size: 10px;\n  font-weight: 700;\n  text-transform: uppercase;\n  letter-spacing: 0.08em;\n  color: var(--ql-text-muted);\n  margin-bottom: 6px;\n}\n.ql-pay-field input {\n  width: 100%;\n  padding: 10px 12px;\n  background: var(--ql-bg);\n  border: 1px solid var(--ql-border);\n  border-radius: var(--ql-radius-xs);\n  color: var(--ql-text-primary);\n  font-size: 13px;\n  font-family: inherit;\n  outline: none;\n  transition: border-color var(--ql-transition);\n}\n.ql-pay-field input:focus {\n  border-color: var(--ql-accent);\n  box-shadow: none;\n}\n.ql-pay-hint {\n  font-size: 10px;\n  color: var(--ql-text-muted);\n  margin-top: 4px;\n  display: block;\n}\n\n.ql-pay-methods {\n  display: flex;\n  gap: 8px;\n}\n.ql-method-btn {\n  flex: 1;\n  padding: 10px;\n  border: 1px solid var(--ql-border);\n  background: var(--ql-bg);\n  color: var(--ql-text-secondary);\n  border-radius: var(--ql-radius-xs);\n  font-size: 12px;\n  font-weight: 700;\n  cursor: pointer;\n  transition: all var(--ql-transition);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 6px;\n  font-family: inherit;\n}\n.ql-method-btn:hover {\n  border-color: var(--ql-border-hover);\n  background: var(--ql-bg-hover);\n}\n.ql-method-btn.ql-method-active {\n  border-color: var(--ql-accent);\n  background: var(--ql-accent-subtle);\n  color: var(--ql-accent);\n}\n\n.ql-confirm-pay-btn {\n  width: 100%;\n  padding: 12px;\n  border: none;\n  border-radius: var(--ql-radius-sm);\n  background: linear-gradient(135deg, var(--ql-accent), #FF4242);\n  color: #fff;\n  font-size: 14px;\n  font-weight: 800;\n  cursor: pointer;\n  transition: all var(--ql-transition);\n  box-shadow: 0 4px 16px var(--ql-accent-glow);\n  font-family: inherit;\n}\n.ql-confirm-pay-btn:hover {\n  transform: translateY(-1px);\n  box-shadow: 0 8px 24px var(--ql-accent-glow);\n}\n.ql-confirm-pay-btn:disabled {\n  opacity: 0.7;\n  cursor: not-allowed;\n  transform: none;\n}\n\n.ql-pay-log {\n  margin-top: 10px;\n  font-size: 11px;\n  font-weight: 600;\n  padding: 8px 10px;\n  border-radius: var(--ql-radius-xs);\n  display: none;\n}\n.ql-pay-log.ql-pay-error {\n  display: block;\n  background: var(--ql-danger-bg);\n  color: var(--ql-danger);\n  border: 1px solid rgba(248,113,113,0.2);\n}\n.ql-pay-log.ql-pay-success {\n  display: block;\n  background: var(--ql-success-bg);\n  color: var(--ql-success);\n  border: 1px solid rgba(52,211,153,0.2);\n}\n.ql-pay-log.ql-pay-info {\n  display: block;\n  background: var(--ql-accent-subtle);\n  color: var(--ql-accent);\n  border: 1px solid rgba(var(--ts-brand-primary-rgb),0.2);\n}\n\n/* ===== FILE ATTACHMENT ===== */\n.ql-attach-bar {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  margin-bottom: 8px;\n}\n.ql-attach-btn {\n  width: 34px;\n  height: 34px;\n  border: 1px dashed var(--ql-border);\n  background: var(--ql-bg-surface);\n  border-radius: var(--ql-radius-xs);\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  transition: all var(--ql-transition);\n  color: var(--ql-text-muted);\n  flex-shrink: 0;\n}\n.ql-attach-btn:hover {\n  background: var(--ql-accent-subtle);\n  border-color: rgba(var(--ts-brand-primary-rgb),0.3);\n  color: var(--ql-accent);\n}\n.ql-attach-count {\n  font-size: 10px;\n  color: var(--ql-text-muted);\n  font-weight: 500;\n}\n.ql-attach-preview {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 6px;\n  margin-bottom: 8px;\n  max-height: 120px;\n  overflow-y: auto;\n}\n.ql-attach-item {\n  position: relative;\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  padding: 5px 8px;\n  background: var(--ql-bg-surface);\n  border: 1px solid var(--ql-border);\n  border-radius: var(--ql-radius-xs);\n  font-size: 10px;\n  color: var(--ql-text-secondary);\n  max-width: 180px;\n  animation: ql-fade-in 0.2s ease;\n}\n@keyframes ql-fade-in {\n  from { opacity: 0; transform: scale(0.95); }\n  to { opacity: 1; transform: scale(1); }\n}\n.ql-attach-thumb {\n  width: 28px;\n  height: 28px;\n  border-radius: 4px;\n  object-fit: cover;\n  flex-shrink: 0;\n}\n.ql-attach-icon {\n  width: 28px;\n  height: 28px;\n  border-radius: 4px;\n  background: var(--ql-bg-hover);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 14px;\n  flex-shrink: 0;\n}\n.ql-attach-info {\n  display: flex;\n  flex-direction: column;\n  min-width: 0;\n}\n.ql-attach-name {\n  font-weight: 600;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  max-width: 100px;\n  color: var(--ql-text-primary);\n}\n.ql-attach-size {\n  font-size: 9px;\n  color: var(--ql-text-muted);\n}\n.ql-attach-remove {\n  position: absolute;\n  top: -4px;\n  right: -4px;\n  width: 16px;\n  height: 16px;\n  border-radius: 50%;\n  background: var(--ql-danger);\n  color: #fff;\n  border: none;\n  cursor: pointer;\n  font-size: 9px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  line-height: 1;\n  opacity: 0;\n  transition: opacity var(--ql-transition);\n}\n.ql-attach-item:hover .ql-attach-remove {\n  opacity: 1;\n}\n.ql-attach-uploading {\n  opacity: 0.6;\n}\n.ql-attach-uploading::after {\n  content: '';\n  position: absolute;\n  bottom: 0; left: 0;\n  height: 2px;\n  background: var(--ql-accent);\n  border-radius: 2px;\n  animation: ql-upload-progress 1.5s ease-in-out infinite;\n}\n@keyframes ql-upload-progress {\n  0% { width: 0; }\n  50% { width: 70%; }\n  100% { width: 100%; }\n}\n\n/* Watermark Removal Button */\n.ql-watermark-btn {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 6px;\n  width: 100%;\n  padding: 10px 16px;\n  margin-top: 8px;\n  border: 1px solid rgba(248,113,113,0.2);\n  border-radius: var(--ql-radius-sm);\n  background: linear-gradient(135deg, rgba(248,113,113,0.08), rgba(248,113,113,0.04));\n  color: #f87171;\n  font-size: 12px;\n  font-weight: 600;\n  font-family: inherit;\n  cursor: pointer;\n  transition: all var(--ql-transition);\n}\n.ql-watermark-btn:hover {\n  background: linear-gradient(135deg, rgba(248,113,113,0.15), rgba(248,113,113,0.08));\n  border-color: rgba(248,113,113,0.35);\n  box-shadow: 0 0 20px -4px rgba(248,113,113,0.2);\n  transform: translateY(-1px);\n}\n.ql-watermark-btn:active { transform: scale(0.98); }\n.ql-watermark-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }\n\n/* ===== SHIELD MODE BUTTON ===== */\n.ql-shield-btn {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 6px;\n  width: 100%;\n  padding: 10px 16px;\n  margin-top: 6px;\n  border: 1px solid rgba(var(--ts-brand-primary-rgb),0.2);\n  border-radius: var(--ql-radius-sm);\n  background: linear-gradient(135deg, rgba(var(--ts-brand-primary-rgb),0.08), rgba(var(--ts-brand-primary-rgb),0.04));\n  color: var(--ql-accent);\n  font-size: 12px;\n  font-weight: 600;\n  font-family: inherit;\n  cursor: pointer;\n  transition: all var(--ql-transition);\n}\n.ql-shield-btn:hover {\n  background: linear-gradient(135deg, rgba(var(--ts-brand-primary-rgb),0.15), rgba(var(--ts-brand-primary-rgb),0.08));\n  border-color: rgba(var(--ts-brand-primary-rgb),0.35);\n  box-shadow: 0 0 20px -4px rgba(var(--ts-brand-primary-rgb),0.2);\n  transform: translateY(-1px);\n}\n.ql-shield-btn:active { transform: scale(0.98); }\n.ql-shield-btn.ql-shield-active {\n  background: linear-gradient(135deg, rgba(52,211,153,0.12), rgba(52,211,153,0.06));\n  border-color: rgba(52,211,153,0.3);\n  color: #34d399;\n}\n.ql-shield-btn.ql-shield-active:hover {\n  background: linear-gradient(135deg, rgba(52,211,153,0.18), rgba(52,211,153,0.1));\n  border-color: rgba(52,211,153,0.45);\n  box-shadow: 0 0 20px -4px rgba(52,211,153,0.2);\n}\n\n/* ===== SHIELD OVERLAY (injected on Lovable chat input) ===== */\n.ql-shield-overlay {\n  position: absolute;\n  inset: 0;\n  z-index: 999999;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n  border-radius: 24px;\n  background: rgba(10,10,11,0.88);\n  backdrop-filter: blur(8px);\n  border: 1.5px solid rgba(var(--ts-brand-primary-rgb),0.3);\n  box-shadow: 0 0 40px -8px rgba(var(--ts-brand-primary-rgb),0.25), inset 0 0 60px -20px rgba(var(--ts-brand-primary-rgb),0.08);\n  cursor: not-allowed;\n  animation: ql-shield-pulse 2.5s ease-in-out infinite;\n  pointer-events: all;\n}\n.ql-shield-overlay svg {\n  width: 32px;\n  height: 32px;\n  stroke: var(--ts-brand-primary);\n  filter: drop-shadow(0 0 12px rgba(var(--ts-brand-primary-rgb),0.5));\n  animation: ql-shield-icon-float 3s ease-in-out infinite;\n}\n.ql-shield-overlay-text {\n  color: #FF4242;\n  font-size: 13px;\n  font-weight: 600;\n  font-family: 'Inter', sans-serif;\n  text-align: center;\n  letter-spacing: 0.02em;\n}\n.ql-shield-overlay-sub {\n  color: #71717a;\n  font-size: 10px;\n  font-family: 'Inter', sans-serif;\n}\n@keyframes ql-shield-pulse {\n  0%, 100% { border-color: rgba(var(--ts-brand-primary-rgb),0.3); box-shadow: 0 0 40px -8px rgba(var(--ts-brand-primary-rgb),0.25); }\n  50% { border-color: rgba(var(--ts-brand-primary-rgb),0.5); box-shadow: 0 0 60px -8px rgba(var(--ts-brand-primary-rgb),0.35); }\n}\n@keyframes ql-shield-icon-float {\n  0%, 100% { transform: translateY(0); }\n  50% { transform: translateY(-4px); }\n}\n\n/* ===== TABS SYSTEM (Floating Popup) ===== */\n.ql-tabs {\n  display: flex;\n  gap: 4px;\n  margin-bottom: 10px;\n  padding: 3px;\n  background: var(--ql-bg-surface);\n  border-radius: var(--ql-radius-sm);\n  border: 1px solid var(--ql-border);\n}\n.ql-tab {\n  flex: 1;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 5px;\n  padding: 7px 10px;\n  border: none;\n  border-radius: 7px;\n  background: transparent;\n  color: var(--ql-text-muted);\n  font-size: 11px;\n  font-weight: 600;\n  cursor: pointer;\n  font-family: inherit;\n  transition: all var(--ql-transition);\n}\n.ql-tab:hover { background: rgba(255,255,255,0.04); color: var(--ql-text-secondary); }\n.ql-tab.ql-tab-active { background: var(--ql-accent-subtle); color: var(--ql-accent); border: 1px solid rgba(var(--ts-brand-primary-rgb),0.2); }\n.ql-tab-badge {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  min-width: 16px;\n  height: 16px;\n  padding: 0 4px;\n  border-radius: 8px;\n  background: var(--ql-accent);\n  color: #fff;\n  font-size: 9px;\n  font-weight: 700;\n}\n\n/* ===== CHAT HISTORY (Floating Popup) ===== */\n.ql-chat-empty {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  padding: 40px 20px;\n  text-align: center;\n}\n.ql-chat-messages {\n  max-height: 280px;\n  overflow-y: auto;\n  padding: 4px 0;\n}\n.ql-chat-bubble {\n  padding: 10px 12px;\n  margin: 6px 0;\n  border-radius: var(--ql-radius-sm);\n  background: var(--ql-bg-surface);\n  border: 1px solid var(--ql-border);\n  color: var(--ql-text-primary);\n  font-size: 11px;\n  line-height: 1.5;\n  word-break: break-word;\n  transition: border-color var(--ql-transition);\n}\n.ql-chat-bubble:hover { border-color: var(--ql-border-hover); }\n.ql-chat-meta {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  margin-top: 6px;\n  font-size: 9px;\n}\n.ql-chat-status-ok { color: var(--ql-success); }\n.ql-chat-status-err { color: var(--ql-danger); }\n.ql-chat-time { color: var(--ql-text-muted); }\n\n.ql-chat-date-divider {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  margin: 8px 0;\n}\n.ql-chat-date-divider::before, .ql-chat-date-divider::after { content: ''; flex: 1; height: 1px; background: var(--ql-border); }\n.ql-chat-date-label {\n  font-size: 9px;\n  font-weight: 700;\n  color: var(--ql-text-muted);\n  text-transform: uppercase;\n  letter-spacing: 0.08em;\n  padding: 3px 10px;\n  background: var(--ql-bg-surface);\n  border: 1px solid var(--ql-border);\n  border-radius: 10px;\n  white-space: nowrap;\n}\n.ql-chat-actions {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  padding: 10px 4px 0;\n  border-top: 1px solid var(--ql-border);\n  margin-top: 8px;\n}\n.ql-chat-count { font-size: 10px; color: var(--ql-text-muted); font-weight: 500; }\n.ql-chat-clear {\n  flex: 1;\n  padding: 8px;\n  border: 1px solid rgba(248,113,113,0.2);\n  border-radius: var(--ql-radius-sm);\n  background: rgba(248,113,113,0.05);\n  color: var(--ql-danger);\n  font-size: 11px;\n  font-weight: 600;\n  cursor: pointer;\n  font-family: inherit;\n  transition: all var(--ql-transition);\n  text-align: center;\n}\n.ql-chat-clear:hover { background: rgba(248,113,113,0.12); border-color: rgba(248,113,113,0.35); }\n\n/* ===== NATIVE CHAT MODE (\"Usar Chat Padrão\") ===== */\n.ql-native-chat-btn {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n  width: 100%;\n  padding: 10px 16px;\n  margin-top: 6px;\n  border: 1px solid var(--ql-border);\n  border-radius: var(--ql-radius-sm);\n  background: var(--ql-accent-subtle);\n  color: var(--ql-accent);\n  font-size: 12px;\n  font-weight: 600;\n  cursor: pointer;\n  font-family: inherit;\n  transition: all var(--ql-transition);\n}\n.ql-native-chat-btn:hover {\n  background: var(--ql-accent-glow);\n  border-color: var(--ql-accent);\n}\n\n.ql-native-badge {\n  position: absolute;\n  top: -10px;\n  right: 12px;\n  z-index: 99999;\n  display: flex;\n  align-items: center;\n  gap: 4px;\n  background: linear-gradient(135deg, var(--ts-brand-primary), #FF4242);\n  color: #fff;\n  font-size: 10px;\n  font-weight: 700;\n  font-family: 'Inter', -apple-system, sans-serif;\n  padding: 3px 10px;\n  border-radius: 12px;\n  box-shadow: 0 2px 12px rgba(var(--ts-brand-primary-rgb),0.4);\n  letter-spacing: 0.3px;\n  pointer-events: none;\n  animation: ql-badge-pulse 2s ease-in-out infinite;\n}\n@keyframes ql-badge-pulse {\n  0%, 100% { box-shadow: 0 2px 12px rgba(var(--ts-brand-primary-rgb),0.4); }\n  50% { box-shadow: 0 2px 20px rgba(var(--ts-brand-primary-rgb),0.7); }\n}\n\n.ql-native-return-btn {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 6px;\n  margin: 8px auto 0;\n  padding: 6px 18px;\n  border: 1px solid rgba(var(--ts-brand-primary-rgb),0.3);\n  border-radius: 20px;\n  background: rgba(var(--ts-brand-primary-rgb),0.1);\n  color: #FF4242;\n  font-size: 12px;\n  font-weight: 600;\n  font-family: 'Inter', -apple-system, sans-serif;\n  cursor: pointer;\n  transition: all 0.2s ease;\n  z-index: 99999;\n}\n.ql-native-return-btn:hover {\n  background: rgba(var(--ts-brand-primary-rgb),0.2);\n  border-color: rgba(var(--ts-brand-primary-rgb),0.5);\n  transform: translateY(-1px);\n}\n\n@keyframes ql-send-blink {\n  0% { background-color: var(--ts-brand-primary); }\n  25% { background-color: #ef4444; }\n  50% { background-color: #22c55e; }\n  75% { background-color: #eab308; }\n  100% { background-color: var(--ts-brand-primary); }\n}\n#chatinput-send-message-button.ql-native-send-active {\n  animation: ql-send-blink 2s linear infinite !important;\n  opacity: 1 !important;\n  cursor: pointer !important;\n  pointer-events: auto !important;\n}\n#chatinput-send-message-button.ql-native-send-active:disabled {\n  opacity: 1 !important;\n  cursor: pointer !important;\n  pointer-events: auto !important;\n}\n#chatinput-send-message-button.ql-native-sending {\n  animation: ql-sending-pulse 0.8s ease-in-out infinite !important;\n  opacity: 1 !important;\n  pointer-events: none !important;\n}\n@keyframes ql-sending-pulse {\n  0%, 100% { background-color: var(--ts-brand-primary) !important; transform: scale(1); }\n  50% { background-color: var(--ts-brand-primary) !important; transform: scale(1.15); }\n}\n\n.ql-native-sending-overlay {\n  position: fixed;\n  bottom: 90px;\n  left: 50%;\n  transform: translateX(-50%);\n  z-index: 9999999999;\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  padding: 10px 20px;\n  border-radius: 12px;\n  background: linear-gradient(135deg, var(--ts-brand-primary), var(--ts-brand-primary));\n  color: #fff;\n  font-size: 13px;\n  font-weight: 600;\n  font-family: 'Segoe UI', sans-serif;\n  box-shadow: 0 4px 20px rgba(var(--ts-brand-primary-rgb),0.4);\n  animation: ql-sending-fadein 0.3s ease;\n}\n.ql-native-sending-overlay .ql-spinner {\n  width: 14px; height: 14px;\n  border: 2px solid rgba(255,255,255,0.3);\n  border-top-color: #fff;\n  border-radius: 50%;\n  animation: ql-spin 0.6s linear infinite;\n}\n@keyframes ql-spin { to { transform: rotate(360deg); } }\n@keyframes ql-sending-fadein { from { opacity:0; transform: translateX(-50%) translateY(10px); } to { opacity:1; transform: translateX(-50%) translateY(0); } }\n\n.ql-native-toast {\n  position: fixed;\n  bottom: 80px;\n  left: 50%;\n  transform: translateX(-50%) translateY(20px);\n  z-index: 9999999999;\n  padding: 10px 20px;\n  border-radius: 12px;\n  font-size: 13px;\n  font-weight: 600;\n  font-family: 'Inter', -apple-system, sans-serif;\n  opacity: 0;\n  transition: all 0.3s ease;\n  pointer-events: none;\n  white-space: nowrap;\n}\n.ql-native-toast-visible {\n  opacity: 1;\n  transform: translateX(-50%) translateY(0);\n}\n.ql-native-toast-success {\n  background: rgba(34, 197, 94, 0.15);\n  color: #34d399;\n  border: 1px solid rgba(34, 197, 94, 0.3);\n  backdrop-filter: blur(12px);\n}\n.ql-native-toast-error {\n  background: rgba(248, 113, 113, 0.15);\n  color: #f87171;\n  border: 1px solid rgba(248, 113, 113, 0.3);\n  backdrop-filter: blur(12px);\n}\n\n/* ===== DRAG & DROP OVERLAY ===== */\n.ql-drag-overlay {\n  position: absolute;\n  inset: 0;\n  z-index: 99999;\n  background: rgba(var(--ts-brand-primary-rgb), 0.15);\n  backdrop-filter: blur(6px);\n  border: 2px dashed rgba(var(--ts-brand-primary-rgb), 0.6);\n  border-radius: 16px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  pointer-events: none;\n}\n.ql-drag-overlay-inner {\n  font-family: 'Inter', sans-serif;\n  font-size: 14px;\n  font-weight: 600;\n  color: var(--ts-brand-primary);\n  background: rgba(10, 10, 11, 0.85);\n  padding: 12px 24px;\n  border-radius: 10px;\n  border: 1px solid rgba(var(--ts-brand-primary-rgb), 0.3);\n}\n\n.ql-lifetime-card{\n  position: relative;\n  overflow: hidden;\n  display:flex;\n  flex-direction:column;\n  align-items:center;\n  justify-content:center;\n  gap:4px;\n  padding:14px 12px;\n  margin-top:10px;\n  border-radius:16px;\n  border:1px solid rgba(34,197,94,0.28);\n  background:\n    linear-gradient(135deg, rgba(34,197,94,0.16), rgba(16,185,129,0.08)),\n    rgba(255,255,255,0.03);\n  box-shadow:\n    0 10px 30px rgba(16,185,129,0.12),\n    inset 0 1px 0 rgba(255,255,255,0.05);\n  animation: qlLifetimeGlow 3s ease-in-out infinite;\n}\n\n.ql-lifetime-card::before{\n  content:'';\n  position:absolute;\n  inset:0;\n  background:linear-gradient(\n    120deg,\n    transparent 20%,\n    rgba(255,255,255,0.08) 50%,\n    transparent 80%\n  );\n  transform:translateX(-100%);\n  animation: qlLifetimeShine 4s linear infinite;\n}\n\n.ql-lifetime-icon{\n  font-size:22px;\n  font-weight:700;\n  color:#4ade80;\n  text-shadow:0 0 14px rgba(74,222,128,0.45);\n}\n\n.ql-lifetime-label{\n  font-size:12px;\n  font-weight:800;\n  letter-spacing:1.8px;\n  color:#86efac;\n}\n\n.ql-lifetime-status{\n  font-size:11px;\n  color:rgba(255,255,255,0.72);\n}\n\n@keyframes qlLifetimeGlow{\n  0%,100%{\n    box-shadow:\n      0 10px 30px rgba(16,185,129,0.10),\n      inset 0 1px 0 rgba(255,255,255,0.05);\n  }\n  50%{\n    box-shadow:\n      0 14px 40px rgba(16,185,129,0.18),\n      inset 0 1px 0 rgba(255,255,255,0.08);\n  }\n}\n\n@keyframes qlLifetimeShine{\n  from{\n    transform:translateX(-100%);\n  }\n  to{\n    transform:translateX(200%);\n  }\n}\n/* ============================================================\n   TS POPUP SHELL — orb + compact menu + expanded panel wrapper\n   ============================================================ */\n#ts-popup-shell {\n  position: fixed;\n  right: 22px;\n  bottom: 24px;\n  z-index: 2147483646;\n  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif;\n  color: #fff;\n  --ts-p: var(--ts-brand-primary, #8b5cf6);\n  --ts-p-soft: rgba(var(--ts-brand-primary-rgb, 139,92,246), 0.28);\n  --ts-p-glow: rgba(var(--ts-brand-primary-rgb, 139,92,246), 0.35);\n  --ts-bg: rgba(12, 10, 22, 0.78);\n  --ts-border: rgba(255, 255, 255, 0.14);\n  --ts-border-strong: rgba(255, 255, 255, 0.22);\n  --ts-text-muted: rgba(255, 255, 255, 0.68);\n  --ts-shadow: 0 22px 70px rgba(0, 0, 0, 0.48);\n}\n#ts-popup-shell.ts-shell-dragging,\n#ts-popup-shell.ts-shell-dragging * {\n  user-select: none !important;\n  cursor: grabbing !important;\n}\n\n.ts-orb {\n  position: relative;\n  width: 62px;\n  height: 62px;\n  border-radius: 999px;\n  border: 1px solid var(--ts-border-strong);\n  background:\n    radial-gradient(circle at 30% 20%, rgba(255,255,255,0.20), transparent 28%),\n    linear-gradient(145deg, rgba(28,22,48,0.96), rgba(8,7,16,0.96));\n  box-shadow: 0 18px 45px rgba(0,0,0,0.42), 0 0 28px var(--ts-p-soft);\n  cursor: grab;\n  display: grid;\n  place-items: center;\n  padding: 0;\n  outline: none;\n  transition: transform .22s ease, box-shadow .22s ease, border-color .22s ease;\n}\n.ts-orb:hover { transform: translateY(-2px) scale(1.03); border-color: rgba(255,255,255,0.32); box-shadow: 0 24px 58px rgba(0,0,0,0.52), 0 0 38px var(--ts-p-soft); }\n.ts-orb:active { cursor: grabbing; transform: scale(.98); }\n.ts-orb-ring { position:absolute; inset:-7px; border-radius:inherit; border:1px solid var(--ts-p-glow); opacity:.9; animation: tsPulseRing 2.1s ease-out infinite; pointer-events:none; }\n.ts-orb-glow { position:absolute; inset:-14px; border-radius:inherit; background: radial-gradient(circle, var(--ts-p-soft), transparent 68%); filter: blur(8px); opacity:.9; pointer-events:none; }\n.ts-orb-logo { position:relative; width:38px; height:38px; object-fit:contain; border-radius:12px; z-index:2; background: rgba(255,255,255,0.06); }\n.ts-orb-mono { position:relative; z-index:2; font-weight:800; font-size:18px; letter-spacing:-.02em; color:#fff; }\n\n@keyframes tsPulseRing {\n  0%   { transform: scale(.92); opacity: .75; }\n  70%  { transform: scale(1.18); opacity: 0; }\n  100% { transform: scale(1.18); opacity: 0; }\n}\n\n.ts-popup-menu {\n  position: absolute;\n  right: 5px;\n  bottom: 76px;\n  display: flex;\n  flex-direction: column;\n  gap: 9px;\n  padding: 10px;\n  border-radius: 999px;\n  background: linear-gradient(180deg, rgba(255,255,255,0.11), rgba(255,255,255,0.04)), var(--ts-bg);\n  border: 1px solid var(--ts-border);\n  box-shadow: var(--ts-shadow);\n  backdrop-filter: blur(22px) saturate(1.25);\n  opacity: 0;\n  transform: translateY(12px) scale(.94);\n  pointer-events: none;\n  transition: opacity .18s ease, transform .18s ease;\n}\n#ts-popup-shell.ts-popup-open .ts-popup-menu { opacity:1; transform:translateY(0) scale(1); pointer-events:auto; }\n#ts-popup-shell.ts-popup-expanded .ts-popup-menu { opacity:0; transform:translateY(12px) scale(.94); pointer-events:none; }\n#ts-popup-shell.ts-popup-expanded .ts-orb { opacity:.55; }\n\n.ts-menu-icon {\n  width: 42px; height: 42px; border-radius: 999px;\n  border: 1px solid rgba(255,255,255,0.13);\n  background: radial-gradient(circle at 35% 20%, rgba(255,255,255,0.14), transparent 28%), rgba(255,255,255,0.07);\n  color: #fff; display: grid; place-items: center;\n  cursor: pointer; font-size: 17px; line-height: 1;\n  transition: transform .18s ease, background .18s ease, border-color .18s ease, box-shadow .18s ease;\n}\n.ts-menu-icon:hover { transform: translateY(-1px) scale(1.06); background: var(--ts-p-soft); border-color: var(--ts-p-glow); box-shadow: 0 0 22px var(--ts-p-soft); }\n.ts-expand-icon { background: linear-gradient(135deg, var(--ts-p), #6d5dfc); border-color: rgba(255,255,255,0.26); }\n\n/* When the shell is present, the legacy #ql-floating panel is hidden until \"expanded\". */\n#ts-popup-shell.ts-shell-active ~ #ql-floating,\nbody.ts-shell-active #ql-floating { display: none; }\nbody.ts-shell-active.ts-popup-expanded #ql-floating { display: flex; }\n";(document.head||document.documentElement).appendChild(__css);}catch(_){}})();

/* --- build-mode bootstrap --- */
(function(){try{ window.TS_BUILD_MODE = "official-v2"; }catch(_){}})();

/* --- branding.config.js --- */
// ============================================================
// TS Community - Central Branding Configuration
// ------------------------------------------------------------
// Esta é a fonte oficial de personalização da extensão.
// O painel de revendedor pode sobrescrever `window.TS_BRANDING_CONFIG`
// ANTES deste script ou injetar valores em runtime e chamar
// `window.applyBrandingConfig(novoConfig)`.
//
// Campos suportados:
//   extensionName : string  - Nome exibido no chrome (manifest é estático)
//   brandName     : string  - Nome da marca (header / footer / textos)
//   primaryColor  : string  - HEX da cor predominante (ex: "#8B5CF6")
//   whatsappLinks : { support, sales, community } - URLs https://wa.me/...
//
// Regras para novas telas:
//   - Nunca usar roxo hardcoded -> usar var(--ts-brand-*)
//   - Nunca hardcodar wa.me -> usar getBrandWhatsappLink('support'|'sales'|'community')
//   - Nunca hardcodar "TS Community" -> usar window.TS_ACTIVE_BRANDING.brandName
//     ou marcar o nó com data-ts-brand="name" para substituição automática.
// ============================================================

(function () {
  if (window.__tsBrandingInstalled) return;
  window.__tsBrandingInstalled = true;

  var DEFAULTS = {
    extensionName: "TS Community",
    brandName: "TS Community",
    primaryColor: "#8B5CF6", // roxo oficial TS Community (alinhado ao shell remoto)
    defaultTheme: "light",
    whatsappLinks: {
      support: "https://wa.me/5518981868677",
      sales: "https://wa.me/5518981868677",
      community: "https://chat.whatsapp.com/CtjTd95a9TkHkdmphpfJFp"
    }
  };

  // ---------- helpers ----------
  function isValidHexColor(c) {
    return typeof c === "string" && /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(c.trim());
  }
  function normalizeHex(c) {
    c = c.trim();
    if (c.length === 4) {
      c = "#" + c[1] + c[1] + c[2] + c[2] + c[3] + c[3];
    }
    return c.toLowerCase();
  }
  function hexToRgb(hex) {
    hex = normalizeHex(hex);
    var n = parseInt(hex.slice(1), 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
  }
  function clamp(v, lo, hi) { return Math.min(hi, Math.max(lo, v)); }
  function adjustHexColor(hex, delta) {
    var rgb = hexToRgb(hex);
    var f = delta / 100;
    function adj(v) {
      if (f < 0) return Math.round(v * (1 + f));
      return Math.round(v + (255 - v) * f);
    }
    var r = clamp(adj(rgb.r), 0, 255).toString(16).padStart(2, "0");
    var g = clamp(adj(rgb.g), 0, 255).toString(16).padStart(2, "0");
    var b = clamp(adj(rgb.b), 0, 255).toString(16).padStart(2, "0");
    return "#" + r + g + b;
  }
  function isValidWaUrl(url) {
    if (typeof url !== "string") return false;
    return /^https:\/\/(wa\.me|chat\.whatsapp\.com)\//i.test(url.trim());
  }

  // ---------- color application ----------
  function applyBrandColor(hexColor) {
    var color = isValidHexColor(hexColor) ? normalizeHex(hexColor) : DEFAULTS.primaryColor;
    var rgb = hexToRgb(color);
    var hover = adjustHexColor(color, -12);
    var rgbStr = rgb.r + ", " + rgb.g + ", " + rgb.b;

    var root = document.documentElement;
    root.style.setProperty("--ts-brand-primary", color);
    root.style.setProperty("--ts-brand-primary-rgb", rgbStr);
    root.style.setProperty("--ts-brand-primary-hover", hover);
    root.style.setProperty("--ts-brand-primary-soft", "rgba(" + rgbStr + ", 0.12)");
    root.style.setProperty("--ts-brand-primary-border", "rgba(" + rgbStr + ", 0.35)");
    root.style.setProperty("--ts-brand-primary-glow", "rgba(" + rgbStr + ", 0.35)");
    root.style.setProperty("--ts-brand-gradient", "linear-gradient(135deg, " + color + ", " + hover + ")");
  }

  // ---------- text application ----------
  // Selectors that hold the brand/extension name and should be overwritten.
  var BRAND_NAME_SELECTORS = [
    ".ql-title", ".ql-brand", ".sp-brand-text",
    "[data-ts-brand=\"name\"]", "[data-ts-brand-name]", "[data-ts-brand=\"footer-name\"]"
  ];
  var FOOTER_TEXT_SELECTORS = [".ql-badge-mz", ".sp-footer-badge", "[data-ts-brand=\"footer\"]"];

  function applyBrandTexts(cfg) {
    try {
      if (document.title && /TS Community/i.test(document.title)) {
        document.title = document.title.replace(/TS Community/gi, cfg.brandName);
      }
    } catch (_) {}

    function setText(el, value) {
      if (!el) return;
      // preserve child elements like badges/SVGs: only update top-level text nodes
      var changed = false;
      el.childNodes.forEach(function (n) {
        if (n.nodeType === 3) {
          var t = n.nodeValue;
          if (/TS Community/i.test(t)) {
            n.nodeValue = t.replace(/TS Community/gi, value);
            changed = true;
          }
        }
      });
      if (!changed && !el.children.length) {
        el.textContent = value;
      }
    }

    BRAND_NAME_SELECTORS.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) { setText(el, cfg.brandName); });
    });
    FOOTER_TEXT_SELECTORS.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        // replace "TS Community" inside footer-style strings (keeps "Desenvolvido por" etc.)
        el.childNodes.forEach(function (n) {
          if (n.nodeType === 3 && /TS Community/i.test(n.nodeValue)) {
            n.nodeValue = n.nodeValue.replace(/TS Community/gi, cfg.brandName);
          }
        });
      });
    });
  }

  // ---------- link application ----------
  function applyBrandLinks(links) {
    var attrs = { support: "support", sales: "sales", community: "community" };
    Object.keys(attrs).forEach(function (k) {
      var target = links && links[k];
      if (!target) return;
      document.querySelectorAll('[data-ts-wa="' + k + '"]').forEach(function (el) {
        var keepText = el.getAttribute("data-ts-wa-text");
        var url = target;
        if (keepText) url += (url.indexOf("?") === -1 ? "?" : "&") + "text=" + encodeURIComponent(keepText);
        el.setAttribute("href", url);
      });
    });
  }

  function isValidUrl(u) {
    return typeof u === "string" && /^https?:\/\/.+/i.test(u.trim());
  }
  function normalizeGateLinks(list) {
    if (!Array.isArray(list)) return null;
    var out = [];
    list.forEach(function (it) {
      if (!it || !isValidUrl(it.url)) return;
      out.push({
        id: String(it.id || ""),
        title: String(it.title || ""),
        sub: String(it.sub || ""),
        icon: String(it.icon || ""),
        url: it.url.trim()
      });
    });
    return out.length ? out : null;
  }

  // ---------- public API ----------
  function applyBrandingConfig(config) {
    config = config || {};
    // Accept snake_case aliases coming from painel/admin/API.
    var purchaseIn = config.purchaseUrl || config.purchase_url;
    var communityIn = config.communityUrl || config.community_url;
    var supportIn = config.supportUrl || config.support_url;
    var gateLinksIn = config.gateLinks || config.gate_links;
    var prev = window.TS_ACTIVE_BRANDING || {};
    var merged = {
      extensionName: config.extensionName || DEFAULTS.extensionName,
      brandName: config.brandName || DEFAULTS.brandName,
      primaryColor: isValidHexColor(config.primaryColor) ? config.primaryColor : DEFAULTS.primaryColor,
      whatsappLinks: {
        support: isValidWaUrl(config.whatsappLinks && config.whatsappLinks.support)
          ? config.whatsappLinks.support : DEFAULTS.whatsappLinks.support,
        sales: isValidWaUrl(config.whatsappLinks && config.whatsappLinks.sales)
          ? config.whatsappLinks.sales : DEFAULTS.whatsappLinks.sales,
        community: isValidWaUrl(config.whatsappLinks && config.whatsappLinks.community)
          ? config.whatsappLinks.community : DEFAULTS.whatsappLinks.community
      },
      purchaseUrl: isValidUrl(purchaseIn) ? purchaseIn.trim() : (prev.purchaseUrl || ""),
      communityUrl: isValidUrl(communityIn) ? communityIn.trim() : (prev.communityUrl || ""),
      supportUrl: isValidUrl(supportIn) ? supportIn.trim() : (prev.supportUrl || ""),
      gateLinks: normalizeGateLinks(gateLinksIn) || prev.gateLinks || null
    };


    window.TS_ACTIVE_BRANDING = merged;


    try { applyBrandColor(merged.primaryColor); } catch (e) { /* defaults via CSS */ }
    try { applyBrandTexts(merged); } catch (_) {}
    try { applyBrandLinks(merged.whatsappLinks); } catch (_) {}
    return merged;
  }

  function getBrandWhatsappLink(type) {
    type = type || "support";
    var b = window.TS_ACTIVE_BRANDING || DEFAULTS;
    return (b.whatsappLinks && b.whatsappLinks[type]) || DEFAULTS.whatsappLinks[type] || DEFAULTS.whatsappLinks.support;
  }

  function tsBrandName() {
    return (window.TS_ACTIVE_BRANDING && window.TS_ACTIVE_BRANDING.brandName) || DEFAULTS.brandName;
  }

  // Icons used when a gate card doesn't provide its own SVG.
  var DEFAULT_GATE_ICONS = {
    purchase: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>',
    community: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    support: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>',
    generic: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 2"/></svg>'
  };

  function getBrandSupportUrl() {
    var b = window.TS_ACTIVE_BRANDING || {};
    if (b.supportUrl) return b.supportUrl;
    // Fall back to local whatsappLinks so reseller builds work offline out-of-the-box.
    return (b.whatsappLinks && b.whatsappLinks.support) || DEFAULTS.whatsappLinks.support;
  }



  // Returns the ordered list of cards shown on the license-gate screen.
  // Cards without a URL are omitted. Reseller panels can override via
  // TS_ACTIVE_BRANDING.gateLinks; otherwise the three standard cards
  // (purchase / community / support) are derived from purchaseUrl /
  // communityUrl / supportUrl. Nothing is hardcoded to a fallback URL.
  function getBrandGateLinks() {
    var b = window.TS_ACTIVE_BRANDING || {};
    if (Array.isArray(b.gateLinks) && b.gateLinks.length) {
      try { console.log("[BRANDING LINKS]", { source: "gateLinks", gateLinks: b.gateLinks, rawBranding: b }); } catch (_) {}
      return b.gateLinks.map(function (it) {
        return {
          id: it.id || "custom",
          title: it.title || "",
          sub: it.sub || "",
          icon: it.icon || DEFAULT_GATE_ICONS[it.id] || DEFAULT_GATE_ICONS.generic,
          url: it.url
        };
      });
    }
    var out = [];
    var wa = b.whatsappLinks || {};
    var isReseller = (window.TS_BUILD_MODE === "reseller" || window.TS_BUILD_MODE === "reseller-local" || b.buildMode === "reseller-local");
    // Fallback chain: remote ui_config → local branding URL → local whatsappLinks.
    // Reseller MUST work offline out-of-the-box, so we fall back to whatsappLinks
    // in both official AND reseller modes when the panel hasn't set a URL yet.
    var purchase = b.purchaseUrl || wa.sales;
    var community = b.communityUrl || wa.community;
    var support = b.supportUrl || wa.support;

    try {
      console.log("[BRANDING LINKS]", {
        purchaseUrl: b.purchaseUrl || "",
        communityUrl: b.communityUrl || "",
        supportUrl: b.supportUrl || "",
        gateLinks: b.gateLinks || null,
        rawBranding: b,
        buildMode: window.TS_BUILD_MODE || b.buildMode || "official",
        resolved: { purchase: purchase, community: community, support: support }
      });
    } catch (_) {}

    if (purchase) out.push({ id: "purchase", title: "", sub: "", icon: DEFAULT_GATE_ICONS.purchase, url: purchase });
    if (community) out.push({ id: "community", title: "", sub: "", icon: DEFAULT_GATE_ICONS.community, url: community });
    if (support) out.push({ id: "support", title: "", sub: "", icon: DEFAULT_GATE_ICONS.support, url: support });
    return out;


  }

  // expose
  window.TS_BRANDING_DEFAULTS = DEFAULTS;
  window.applyBrandingConfig = applyBrandingConfig;
  window.getBrandWhatsappLink = getBrandWhatsappLink;
  window.getBrandSupportUrl = getBrandSupportUrl;
  window.getBrandGateLinks = getBrandGateLinks;
  window.tsBrandName = tsBrandName;


  // boot: use overrides if any, else defaults
  applyBrandingConfig(window.TS_BRANDING_CONFIG || {});

  // re-apply texts as new UI is injected (templates render after load)
  try {
    var pending = false;
    var obs = new MutationObserver(function () {
      if (pending) return;
      pending = true;
      requestAnimationFrame(function () {
        pending = false;
        try {
          applyBrandTexts(window.TS_ACTIVE_BRANDING || DEFAULTS);
          applyBrandLinks((window.TS_ACTIVE_BRANDING || DEFAULTS).whatsappLinks);
          // Hide the in-app "Suporte" button when the reseller left supportUrl empty.
          var supportUrl = getBrandSupportUrl();
          document.querySelectorAll('.sp-help-btn, #sp-login-help-btn').forEach(function (el) {
            el.style.display = supportUrl ? '' : 'none';
          });
        } catch (_) {}
      });
    });

    var startObserver = function () {
      if (document.body) obs.observe(document.body, { childList: true, subtree: true });
    };
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", startObserver);
    } else {
      startObserver();
    }
  } catch (_) {}
})();

/* --- hwFingerprint.js --- */
async function generateHardwareFingerprint() {
  const components = [];

  // 1. Screen properties (stable across browsers)
  try {
    components.push(
      "screen:" + screen.width + "x" + screen.height,
      "depth:" + screen.colorDepth,
      "pixelRatio:" + window.devicePixelRatio
    );
  } catch(e) {}

  // 2. Platform & CPU info (excludes User-Agent version)
  try {
    components.push("platform:" + navigator.platform);
    components.push("cores:" + (navigator.hardwareConcurrency || "unknown"));
    components.push("memory:" + (navigator.deviceMemory || "unknown"));
    components.push("maxTouchPoints:" + (navigator.maxTouchPoints || 0));
    // Language list is OS-level, stable across browsers
    components.push("langs:" + (navigator.languages || [navigator.language]).join(","));
  } catch(e) {}

  // 3. Timezone (OS-level setting)
  try {
    components.push("tz:" + Intl.DateTimeFormat().resolvedOptions().timeZone);
  } catch(e) {}

  // 4. WebGL renderer (GPU info - very stable)
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (gl) {
      const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
      if (debugInfo) {
        components.push("gpu:" + gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL));
        components.push("gpuVendor:" + gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL));
      }
      components.push("glVersion:" + gl.getParameter(gl.VERSION));
      // Max texture size is hardware-dependent
      components.push("maxTexture:" + gl.getParameter(gl.MAX_TEXTURE_SIZE));
      components.push("maxViewport:" + gl.getParameter(gl.MAX_VIEWPORT_DIMS).join(","));
    }
  } catch(e) {}

  // 5. Canvas fingerprint (rendering differences per GPU/OS)
  try {
    const canvas = document.createElement("canvas");
    canvas.width = 200;
    canvas.height = 50;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.textBaseline = "top";
      ctx.font = "14px 'Arial'";
      ctx.fillStyle = "#f60";
      ctx.fillRect(125, 1, 62, 20);
      ctx.fillStyle = "#069";
      ctx.fillText("QLFingerprint", 2, 15);
      ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
      ctx.fillText("QLFingerprint", 4, 17);
      components.push("canvas:" + canvas.toDataURL().substring(0, 100));
    }
  } catch(e) {}

  // 6. Audio context fingerprint (hardware audio stack)
  try {
    const audioCtx = new (window.OfflineAudioContext || window.webkitOfflineAudioContext)(1, 44100, 44100);
    const oscillator = audioCtx.createOscillator();
    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(10000, audioCtx.currentTime);
    const compressor = audioCtx.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(-50, audioCtx.currentTime);
    compressor.knee.setValueAtTime(40, audioCtx.currentTime);
    compressor.ratio.setValueAtTime(12, audioCtx.currentTime);
    compressor.attack.setValueAtTime(0, audioCtx.currentTime);
    compressor.release.setValueAtTime(0.25, audioCtx.currentTime);
    oscillator.connect(compressor);
    compressor.connect(audioCtx.destination);
    oscillator.start(0);

    const audioBuffer = await new Promise((resolve, reject) => {
      audioCtx.startRendering().then(resolve).catch(reject);
      setTimeout(() => reject(new Error("timeout")), 1000);
    });

    const audioData = audioBuffer.getChannelData(0);
    let audioHash = 0;
    for (let i = 4500; i < 5000; i++) {
      audioHash += Math.abs(audioData[i]);
    }
    components.push("audio:" + audioHash.toFixed(6));
  } catch(e) {}

  // 7. Available fonts detection (OS-level)
  try {
    const testFonts = [
      "monospace", "sans-serif", "serif",
      "Courier New", "Georgia", "Helvetica", "Times New Roman",
      "Trebuchet MS", "Verdana", "Impact", "Comic Sans MS",
      "Segoe UI", "Tahoma", "Calibri", "Consolas",
      "Lucida Console", "Palatino Linotype"
    ];
    const canvas = document.createElement("canvas");
    canvas.width = 500;
    canvas.height = 50;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const baseWidths = {};
      const baseFonts = ["monospace", "sans-serif", "serif"];
      const testStr = "mmmmmmmmmmlli";

      baseFonts.forEach(bf => {
        ctx.font = "72px " + bf;
        baseWidths[bf] = ctx.measureText(testStr).width;
      });

      const detected = [];
      testFonts.forEach(font => {
        let found = false;
        baseFonts.forEach(bf => {
          ctx.font = "72px '" + font + "'," + bf;
          if (ctx.measureText(testStr).width !== baseWidths[bf]) found = true;
        });
        if (found) detected.push(font);
      });
      components.push("fonts:" + detected.join("|"));
    }
  } catch(e) {}

  // Generate SHA-256 hash of all components
  const raw = components.join("||");
  const encoder = new TextEncoder();
  const data = encoder.encode(raw);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

  return hashHex;
}

// Cache the fingerprint to avoid recalculation
let _cachedFingerprint = null;

async function getHardwareFingerprint() {
  if (_cachedFingerprint) return _cachedFingerprint;

  // Check storage first
  return new Promise(async (resolve) => {
    chrome.storage.local.get(["ql_hw_fingerprint"], async (res) => {
      if (res.ql_hw_fingerprint) {
        _cachedFingerprint = res.ql_hw_fingerprint;
        resolve(_cachedFingerprint);
      } else {
        try {
          const fp = await generateHardwareFingerprint();
          _cachedFingerprint = fp;
          chrome.storage.local.set({ ql_hw_fingerprint: fp });
          resolve(fp);
        } catch(e) {
          // Fallback to random UUID if fingerprint fails completely
          const fallback = crypto.randomUUID();
          _cachedFingerprint = fallback;
          chrome.storage.local.set({ ql_hw_fingerprint: fallback });
          resolve(fallback);
        }
      }
    });
  });
}

/* --- i18n.js intentionally not inlined in content.js --- */
/* --- ui-config.js --- */
// ui-config.js
const USE_NONEXISTENT_VISUAL_TARGET = false;

// ==================== Migrar Cloud — prompts locais ====================
// Prompts fixos usados pelo modal "Migrar Cloud" no popup.
// Não são carregados de endpoint remoto. Envio reutiliza o fluxo atual
// (sendPromptNativeViaBackground / sendPromptViaIframe) com intent security_scan.
const TS_MIGRATE_IMPORT_DATABASE_PROMPT = `Quero que você crie um Manual de Instalação completo, profissional e extremamente detalhado dentro da pasta /public do projeto. O objetivo é que qualquer pessoa consiga instalar e configurar este sistema do zero apenas seguindo esse manual, sem precisar de ajuda adicional.

O manual deve possuir um design moderno, elegante, responsivo e intuitivo, funcionando perfeitamente em desktop e dispositivos móveis.

Estrutura do Manual

1. Página Inicial

Crie uma página inicial profissional contendo: Nome do sistema; Descrição do projeto; Versão; Data de criação; Botão para iniciar o manual; Menu lateral com navegação entre todas as etapas; Barra de progresso indicando o andamento da instalação.

2. Requisitos

Explique todos os requisitos necessários antes da instalação (Conta na Supabase, Node.js se necessário, Dependências, Navegador recomendado, Outros requisitos).

3. Passo a passo completo da instalação

Etapas numeradas: 1) Criar conta na Supabase; 2) Criar novo projeto; 3) Aguardar banco ser criado; 4) Abrir SQL Editor; 5) Executar SQL; 6) Configurar Storage; 7) Copiar chaves da Supabase; 8) Configurar variáveis de ambiente; 9) Executar projeto; 10) Verificar funcionamento. Cada etapa deve conter: explicação detalhada, dicas, avisos, boas práticas, possíveis erros e como resolver. Escreva pensando em iniciantes.

4. Configuração da Supabase

Explique como obter Project URL, Anon Key, Service Role Key e como configurar no projeto.

5. Banco de Dados

Extraia automaticamente do projeto atual todo o esquema do banco conectado. Inclua: tabelas, colunas, tipos, PKs, FKs, índices, constraints, triggers, functions, views, policies (RLS), sequências, storage buckets, configuração do storage e dados iniciais quando necessários.

6. SQL Completo

Seção exclusiva com SQL completo do banco: editor moderno, syntax highlight, numeração de linhas, botão Copiar SQL, Selecionar Tudo, Expandir Código, informação de executar no SQL Editor da Supabase.

7. Storage

Documente Buckets, Policies, Permissões, Estrutura de pastas, Arquivos obrigatórios, Configurações.

8. Variáveis de Ambiente

Liste todas com: nome, para que serve, onde encontrar, como preencher.

9. Testando a instalação

Como verificar que tudo foi instalado corretamente e o que deve funcionar.

10. Solução de Problemas

Erros mais comuns com: causa, como identificar e como resolver.

11. FAQ com perguntas frequentes.

Interface: layout moderno, fundo claro, cards elegantes, ícones, menu lateral, navegação entre etapas, barra de progresso, código destacado, botões modernos, responsivo desktop e mobile.

Importante: antes de gerar o SQL, verifique se é tecnicamente possível extrair automaticamente o esquema completo do banco Supabase conectado ao projeto. Se possível, inclua o SQL completo. Se não for possível por limitações da Lovable/Supabase, NÃO invente nem gere SQL incompleto — informe claramente a limitação no manual e explique quais informações não puderam ser obtidas. Da mesma forma, só documente Buckets, Policies, Functions, Views e demais objetos se puderem ser obtidos de forma confiável.

Entrega: salve o manual dentro da pasta /public, garanta que possa ser acessado pelo navegador, organize em um único manual bem estruturado. No final, envie o próprio manual aqui no chat para download (HTML ou Markdown), exatamente como salvo em /public.`;

const TS_MIGRATE_CONNECT_PROJECT_PROMPT = `Quero que você remova completamente toda a integração com a Supabase antiga atualmente utilizada por este projeto e passe a utilizar exclusivamente a nova Supabase que já está conectada a este projeto na Lovable.

Objetivo

Migrar toda a aplicação para a nova Supabase conectada ao projeto, garantindo que nenhuma referência à Supabase antiga permaneça no código e que toda a aplicação funcione normalmente utilizando apenas o novo banco.

Muito importante

A nova Supabase JÁ ESTÁ conectada ao projeto.

Não quero que você peça para eu criar tabelas, executar SQL, criar buckets ou configurar manualmente a Supabase.

Antes de qualquer alteração, conecte corretamente ao projeto Supabase que já está vinculado a este projeto da Lovable, leia o schema existente e utilize esse banco como fonte da verdade.

Se as tabelas já existirem na nova Supabase, utilize-as normalmente. Não tente recriá-las e não informe que elas precisam ser criadas.

O problema atual é que você está ignorando a Supabase conectada ao projeto e assumindo que o banco está vazio. Corrija esse comportamento.

O que deve ser feito

1. Remover totalmente a Supabase antiga

Remova todas as referências da Supabase antiga, incluindo: Project URL; Anon Key; Service Role Key; Project ID; Variáveis de ambiente; Configurações; Arquivos de configuração; Clientes Supabase antigos; URLs antigas; Qualquer referência restante.

2. Utilizar apenas a nova Supabase

Conecte toda a aplicação à Supabase atualmente conectada ao projeto. Antes de alterar qualquer código: Leia o banco conectado; Identifique automaticamente as tabelas existentes; Identifique Views; Functions; Policies; Buckets; Relacionamentos; Campos; Tipos de dados. Depois adapte toda a aplicação para utilizar exatamente essa estrutura existente.

3. Não criar estruturas que já existem

Caso a nova Supabase já possua tabelas, buckets, funções, views, triggers, policies ou dados, utilize essas estruturas. Não gere mensagens dizendo que preciso criar tabelas ou executar SQL, pois elas já existem. Somente utilize o banco conectado.

4. Atualizar toda a aplicação

Atualize automaticamente: Cliente Supabase; Autenticação; Login; Cadastro; Sessões; Storage; Upload; Download; Realtime; Edge Functions (caso existam); APIs; Hooks; Services; Context Providers; Queries; Mutations; Tipagens; Imports. Toda comunicação deve utilizar exclusivamente a nova Supabase.

5. Corrigir consultas

Revise todas as consultas SQL e chamadas do Supabase para garantir compatibilidade com o schema existente na nova Supabase. Caso existam diferenças entre o código e o schema atual, adapte automaticamente o código.

6. Corrigir erros

Corrija automaticamente qualquer erro de compilação, importação, tipagem, autenticação, Storage, Realtime ou qualquer erro causado pela troca da conexão.

7. Validação final

Ao finalizar, valide que Login, Cadastro, Sessão, Leitura, Escrita, Atualização, Exclusão, Upload, Download, Buckets, Policies e Autenticação continuam funcionando.

Revisão completa

Ao terminar, faça uma varredura em 100% do projeto para garantir que não exista nenhuma referência à Supabase antiga, que toda a aplicação utilize exclusivamente a nova Supabase conectada ao projeto e que todas as funcionalidades estejam apontando para o banco correto.

Instrução final

Não faça perguntas. Não solicite que eu execute SQL, crie tabelas ou configure manualmente a Supabase. Primeiro conecte-se corretamente à Supabase que já está vinculada a este projeto na Lovable, leia o schema existente e adapte toda a aplicação para utilizá-lo. Considere o banco conectado como a fonte oficial de dados e apenas ajuste o código para funcionar com ele.`;

try {
  if (typeof window !== 'undefined') {
    window.TS_MIGRATE_IMPORT_DATABASE_PROMPT = TS_MIGRATE_IMPORT_DATABASE_PROMPT;
    window.TS_MIGRATE_CONNECT_PROJECT_PROMPT = TS_MIGRATE_CONNECT_PROJECT_PROMPT;
  }
} catch (_) {}

// ==================== Native Lovable chat send (security_scan / v5.2) ====================
// Envia mensagens comuns direto para POST https://api.lovable.dev/projects/{projectId}/chat
// com intent: "security_scan" (equivale ao método validado v5.2). Compartilhado por
// O fluxo local NÃO usa a Edge Function send-lovable-message para mensagens
// comuns — skills que dependem do backend podem continuar chamando a Edge separadamente.
(function(global){
  function _randHex(bytes){
    try {
      var arr = new Uint8Array(bytes);
      (global.crypto || global.msCrypto).getRandomValues(arr);
      return Array.from(arr).map(function(b){ return b.toString(16).padStart(2,'0'); }).join('');
    } catch(_) {
      var s = ''; for (var i=0;i<bytes;i++) s += Math.floor(Math.random()*256).toString(16).padStart(2,'0');
      return s;
    }
  }
  function tsNewMessageId(prefix){
    return String(prefix || 'umsg_') + '01' + _randHex(12);
  }
  function tsNormalizeLovableChatPayload(payload, userText, opts){
    payload = payload || {};
    opts = opts || {};
    var t = String(userText == null ? '' : userText);
    var requestedIntent = String(opts.intent || payload.intent || payload.message_intent || 'security_scan').toLowerCase();
    var isFixError = requestedIntent === 'fix_error' || requestedIntent === 'fix-error' || requestedIntent === 'try_to_fix';
    var finalIntent = isFixError ? 'fix_error' : 'security_scan';
    var finalSendMethod = isFixError ? (opts.send_method || opts.sendMethod || payload.send_method || 'v6') : (opts.send_method || opts.sendMethod || payload.send_method || 'v5');

    payload.message = t;
    payload.text = t;
    payload.content = t;
    payload.user_message = t;
    payload.userMessage = t;
    payload.display_text = t;
    payload.displayText = t;

    payload.intent = finalIntent;
    payload.message_intent = finalIntent;
    payload.send_method = finalSendMethod;
    payload.chat_only = false;

    delete payload.message_intent_metadata;
    delete payload.messageIntentMetadata;
    delete payload.error_source;
    delete payload.error_ids;
    delete payload.runtime_errors;
    delete payload.fix_error;
    delete payload.try_to_fix;

    if (!payload.thread_id) payload.thread_id = 'main';
    if (!payload.view) payload.view = 'preview';
    if (!payload.view_description) payload.view_description = 'The user is currently viewing the preview. ';

    if (!Array.isArray(payload.files)) payload.files = [];
    if (!Array.isArray(payload.selected_elements)) payload.selected_elements = [];
    if (!Array.isArray(payload.client_logs)) payload.client_logs = [];
    if (!Array.isArray(payload.network_requests)) payload.network_requests = [];
    if (!Array.isArray(payload.optimisticImageUrls)) payload.optimisticImageUrls = [];

    if (isFixError) {
      var buildEventId = payload.build_event_id || payload.id || tsNewMessageId('build_');
      payload.contains_error = true;
      payload.message_intent_metadata = {
        fix_error_metadata: {
          errors: [{
            error_type: 'build',
            error_message: t,
            message: t,
            text: t,
            user_message: t,
            display_text: t,
            build_event_id: buildEventId
          }]
        }
      };
    } else {
      delete payload.contains_error;
    }

    if (typeof payload.model === 'undefined') payload.model = null;
    return payload;
  }
  function tsBuildNativeSecurityScanPayload(userText, files){
    var userId = tsNewMessageId('umsg_');
    var aiId   = tsNewMessageId('aimsg_');
    var payload = {
      id: userId,
      ai_message_id: aiId,
      files: Array.isArray(files) ? files.slice() : [],
      selected_elements: [],
      client_logs: [],
      network_requests: [],
      optimisticImageUrls: [],
      thread_id: 'main',
      model: null
    };
    return tsNormalizeLovableChatPayload(payload, userText, { intent: 'security_scan', send_method: 'v5' });
  }
  function tsBuildNativeFixErrorPayload(userText, files){
    var userId = tsNewMessageId('umsg_');
    var aiId   = tsNewMessageId('aimsg_');
    var payload = {
      id: userId,
      ai_message_id: aiId,
      files: Array.isArray(files) ? files.slice() : [],
      selected_elements: [],
      client_logs: [],
      network_requests: [],
      optimisticImageUrls: [],
      thread_id: 'main',
      view: 'preview',
      model: null
    };
    return tsNormalizeLovableChatPayload(payload, userText, { intent: 'fix_error', send_method: 'v6' });
  }
  function tsExtractProjectIdFromUrl(url){
    try {
      var s = String(url || '');
      var m = s.match(/projects\/([0-9a-fA-F-]{36})/i);
      if (m) return m[1];
      var host = (new URL(s)).hostname || '';
      var mh = host.match(/^([0-9a-fA-F-]{36})\.lovableproject\.com$/i);
      if (mh) return mh[1];
    } catch(_) {}
    return null;
  }
  function tsSendNativeLovableChat(opts){
    // opts: { projectId, payload, userText } — common chat send must run in Lovable MAIN world via background lovableApiFetch.
    return new Promise(function(resolve, reject){
      try {
        if (!opts || !opts.projectId) return reject(new Error('Projeto Lovable não identificado.'));
        var desiredIntent = (opts && opts.intent) || (opts.payload && (opts.payload.intent || opts.payload.message_intent)) || 'security_scan';
        var desiredSendMethod = (opts && (opts.send_method || opts.sendMethod)) || (opts.payload && opts.payload.send_method) || (String(desiredIntent).toLowerCase() === 'fix_error' ? 'v6' : 'v5');
        var payload = tsNormalizeLovableChatPayload(opts.payload || {}, opts.userText || (opts.payload && (opts.payload.message || opts.payload.text || opts.payload.content)) || '', { intent: desiredIntent, send_method: desiredSendMethod });
        var url = 'https://api.lovable.dev/projects/' + encodeURIComponent(opts.projectId) + '/chat';

        function finish(resp){
          try {
            if (!resp) return reject(new Error('Sem resposta do background.'));
            if (resp.error === 'LOVABLE_SESSION_NOT_CAPTURED') {
              resp.message = 'Não foi possível usar a sessão atual do Lovable. Recarregue a aba do Lovable, aguarde sincronizar e tente novamente.';
            }
            if (resp.status === 401 || resp.status === 403) {
              resp.message = 'Não foi possível usar a sessão atual do Lovable. Recarregue a aba do Lovable, aguarde sincronizar e tente novamente.';
            }
            resolve(resp);
          } catch(e){ reject(e); }
        }

        if (!chrome || !chrome.runtime || !chrome.runtime.sendMessage) {
          return reject(new Error('Abra a extensão em uma aba do Lovable para enviar.'));
        }

        chrome.runtime.sendMessage({
          action: 'lovableApiFetch',
          url: url,
          method: 'POST',
          headers: {
            'Accept': '*/*',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        }, function(resp){
          if (chrome.runtime.lastError) return reject(new Error(chrome.runtime.lastError.message));
          finish(resp);
        });
      } catch(err){ reject(err); }
    });
  }
  global.tsNewMessageId = tsNewMessageId;
  global.tsNormalizeLovableChatPayload = tsNormalizeLovableChatPayload;
  global.tsBuildNativeSecurityScanPayload = tsBuildNativeSecurityScanPayload;
  global.tsBuildNativeFixErrorPayload = tsBuildNativeFixErrorPayload;
  global.tsExtractProjectIdFromUrl = tsExtractProjectIdFromUrl;
  global.tsSendNativeLovableChat = tsSendNativeLovableChat;
})(typeof window !== 'undefined' ? window : self);

// Aplica branding/theme retornado pela validate-license via CSS variables.
// Sem licença válida, NÃO chame applyUIConfig com dados do usuário —
// use applyFallbackUIConfig() (TS Community).

(function(global){
  function hexToRgb(hex) {
    try {
      var h = String(hex || '').trim().replace('#','');
      if (h.length === 3) h = h.split('').map(function(c){return c+c;}).join('');
      if (!/^[0-9a-fA-F]{6}$/.test(h)) return null;
      var n = parseInt(h, 16);
      return ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255);
    } catch(_) { return null; }
  }

  function shade(hex, percent) {
    try {
      var h = String(hex || '').trim().replace('#','');
      if (h.length === 3) h = h.split('').map(function(c){return c+c;}).join('');
      if (!/^[0-9a-fA-F]{6}$/.test(h)) return hex;
      var num = parseInt(h, 16);
      var r = (num >> 16) & 255, g = (num >> 8) & 255, b = num & 255;
      var t = percent < 0 ? 0 : 255;
      var p = Math.abs(percent);
      r = Math.round((t - r) * p) + r;
      g = Math.round((t - g) * p) + g;
      b = Math.round((t - b) * p) + b;
      return '#' + ((1<<24) + (r<<16) + (g<<8) + b).toString(16).slice(1);
    } catch(_) { return hex; }
  }

  var FALLBACK = {
    brandName: 'TS Community',
    primaryColor: '#8B5CF6',
    logoUrl: '',
    theme: 'light',
    radius: '12px',
    whatsappLinks: null,
    purchaseUrl: '',
    communityUrl: '',
    supportUrl: '',
    gateLinks: null
  };


  function isResellerLocal() {
    try {
      var m = global.TS_BUILD_MODE;
      if (m === "reseller" || m === "reseller-local" || m === "official-v2") return true;
      var c = global.TS_BRANDING_CONFIG || global.TS_ACTIVE_BRANDING;
      if (c && (c.buildMode === "reseller-local" || c.buildMode === "official-v2")) return true;
    } catch (_) {}
    return false;
  }

  // In reseller-local, visual overrides (colors, logo, brand name) are 100% local.
  // But gate-link URLs (purchase/community/support/gateLinks) MUST still flow through,
  // because they are painel-admin configured link targets, not visual overrides.
  function applyResellerGateLinksOnly(cfg) {
    if (!cfg) return global.TS_ACTIVE_BRANDING || FALLBACK;
    // Accept both camelCase and snake_case aliases from the panel/API.
    var branding = cfg.branding || cfg.ui_config || cfg;
    var purchaseIn = branding.purchaseUrl || branding.purchase_url || cfg.purchaseUrl || cfg.purchase_url;
    var communityIn = branding.communityUrl || branding.community_url || cfg.communityUrl || cfg.community_url;
    var supportIn = branding.supportUrl || branding.support_url || cfg.supportUrl || cfg.support_url;
    var gateLinksIn = branding.gateLinks || branding.gate_links || cfg.gateLinks || cfg.gate_links;
    var patch = {};
    if (purchaseIn) patch.purchaseUrl = purchaseIn;
    if (communityIn) patch.communityUrl = communityIn;
    if (supportIn) patch.supportUrl = supportIn;
    if (Array.isArray(gateLinksIn)) patch.gateLinks = gateLinksIn;
    try {
      console.log("[BRANDING LINKS]", {
        source: "applyResellerGateLinksOnly",
        purchaseUrl: patch.purchaseUrl || "",
        communityUrl: patch.communityUrl || "",
        supportUrl: patch.supportUrl || "",
        gateLinks: patch.gateLinks || null,
        rawUiConfig: cfg
      });
    } catch (_) {}
    if (!Object.keys(patch).length) return global.TS_ACTIVE_BRANDING || FALLBACK;
    // NOTE: do NOT call applyBrandingConfig(patch) here — that function resets
    // brandName/primaryColor/whatsappLinks to DEFAULTS when they are absent
    // from the patch, which would wipe the reseller's local brand. Merge into
    // TS_ACTIVE_BRANDING directly so only the gate-link fields change.
    try {
      global.TS_ACTIVE_BRANDING = Object.assign({}, global.TS_ACTIVE_BRANDING || {}, patch);
    } catch (_) {}
    try {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.get(['ts_ui_config'], function (r) {
          var stored = (r && r.ts_ui_config) || {};
          chrome.storage.local.set({ ts_ui_config: Object.assign({}, stored, patch) });
        });
      }
    } catch (_) {}
    return global.TS_ACTIVE_BRANDING || FALLBACK;
  }


  function applyUIConfig(cfg) {
    if (isResellerLocal()) {
      try { console.info("[TS UIConfig] reseller-local: applying gate-link URLs only"); } catch (_) {}
      return applyResellerGateLinksOnly(cfg);
    }
    var merged = Object.assign({}, FALLBACK, cfg || {});
    try {
      var root = document.documentElement;
      var rgb = hexToRgb(merged.primaryColor) || hexToRgb(FALLBACK.primaryColor);
      root.style.setProperty('--ts-brand-primary', merged.primaryColor);
      root.style.setProperty('--ts-brand-primary-rgb', rgb);
      root.style.setProperty('--ts-brand-primary-hover', shade(merged.primaryColor, -0.12));
      root.style.setProperty('--ts-radius', merged.radius || '12px');
      if (merged.logoUrl) root.style.setProperty('--ts-brand-logo', 'url("' + merged.logoUrl + '")');
      if (merged.theme) root.setAttribute('data-ts-theme', merged.theme);
    } catch(_){}
    // Sync legacy branding.config.js state so its MutationObserver does NOT
    // reset our remote brand name back to "TS Community".
    try {
      if (typeof global.applyBrandingConfig === 'function') {
        global.applyBrandingConfig({
          extensionName: merged.brandName,
          brandName: merged.brandName,
          primaryColor: merged.primaryColor,
          whatsappLinks: merged.whatsappLinks || undefined,
          purchaseUrl: merged.purchaseUrl,
          communityUrl: merged.communityUrl,
          supportUrl: merged.supportUrl,
          gateLinks: merged.gateLinks
        });
      } else {
        global.TS_ACTIVE_BRANDING = Object.assign({}, global.TS_ACTIVE_BRANDING || {}, {
          brandName: merged.brandName,
          extensionName: merged.brandName,
          primaryColor: merged.primaryColor,
          whatsappLinks: merged.whatsappLinks || (global.TS_ACTIVE_BRANDING && global.TS_ACTIVE_BRANDING.whatsappLinks),
          purchaseUrl: merged.purchaseUrl,
          communityUrl: merged.communityUrl,
          supportUrl: merged.supportUrl,
          gateLinks: merged.gateLinks
        });
      }
    } catch(_){}

    try {
      var nameEls = document.querySelectorAll('[data-ts-brand="name"], .sp-brand-text, .ql-brand, .ql-title');
      nameEls.forEach(function(el){
        // preserve child elements (badges/SVGs); only set text when leaf
        if (el.children && el.children.length === 0) {
          el.textContent = merged.brandName;
        } else {
          el.childNodes.forEach(function(n){
            if (n.nodeType === 3 && n.nodeValue.trim()) n.nodeValue = merged.brandName;
          });
        }
      });
      // Structured footer: only update the brand-name leaf (preserves i18n span + space).
      var footerNameEls = document.querySelectorAll('[data-ts-brand="footer-name"]');
      footerNameEls.forEach(function(el){ el.textContent = merged.brandName; });

      // Legacy footer (no inner spans): rewrite full text with safe space.
      var footerEls = document.querySelectorAll('[data-ts-brand="footer"], .sp-footer-badge, .ql-badge-mz');
      footerEls.forEach(function(el){
        if (el.querySelector('[data-ts-brand="footer-name"]')) return; // structured, already handled
        if (el.children && el.children.length === 0) {
          el.textContent = 'Desenvolvido por ' + merged.brandName;
        } else {
          el.childNodes.forEach(function(n){
            if (n.nodeType === 3 && /desenvolvido por/i.test(n.nodeValue)) {
              n.nodeValue = 'Desenvolvido por ' + merged.brandName;
            }
          });
        }
      });
    } catch(_){}

    try {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.set({ ts_ui_config: merged });
      }
    } catch(_){}
    return merged;
  }

  function applyFallbackUIConfig() { return applyUIConfig(FALLBACK); }

  function loadStoredUIConfig(cb) {
    // Reseller-local: branding é 100% local (branding.config.js já rodou).
    // Não aplica cache visual remoto, mas HIDRATA gate-link URLs do storage
    // (purchase/community/support/gateLinks) para que os cards da tela de
    // login apareçam sem esperar uma nova validate-license.
    if (isResellerLocal()) {
      try {
        chrome.storage.local.get(['ts_ui_config'], function (r) {
          try { applyResellerGateLinksOnly((r && r.ts_ui_config) || {}); } catch (_) {}
          if (cb) cb();
        });
      } catch (_) { if (cb) cb(); }
      return;
    }
    try {
      chrome.storage.local.get(['ts_ui_config', 'ql_license_valid'], function(r){
        // Só aplica config customizada se houver licença válida; senão fallback.
        if (r && r.ql_license_valid && r.ts_ui_config) {
          applyUIConfig(r.ts_ui_config);
        } else {
          applyFallbackUIConfig();
        }
        if (cb) cb();
      });
    } catch(_) { applyFallbackUIConfig(); if (cb) cb(); }
  }

  global.TSUIConfig = {
    apply: applyUIConfig,
    applyFallback: applyFallbackUIConfig,
    loadStored: loadStoredUIConfig,
    applyStored: loadStoredUIConfig,
    FALLBACK: FALLBACK
  };

})(typeof window !== 'undefined' ? window : self);

// ==================== Otimização local de prompt ====================
// Reescreve o prompt do usuário de forma estruturada, sem chamadas externas.
(function (global) {
  function tsOptimizePromptLocally(input) {
    var text = String(input == null ? '' : input).trim();
    if (!text) return '';
    var alreadyStructured = /crit[eé]rios de aceite|requisitos|objetivo|escopo|interface|comportamento/i.test(text);
    if (alreadyStructured && text.length > 600) return text;
    var normalized = text.replace(/\s+/g, ' ').trim();
    return 'Quero que você execute a seguinte solicitação no projeto atual da Lovable:\n\n'
      + normalized + '\n\n'
      + 'Objetivo:\nEntregar a funcionalidade ou ajuste solicitado de forma completa, estável e integrada ao projeto existente.\n\n'
      + 'Requisitos:\n'
      + '- Analise a estrutura atual do projeto antes de alterar arquivos.\n'
      + '- Preserve o layout, identidade visual, componentes e padrões já existentes.\n'
      + '- Implemente a solução de forma limpa, organizada e reutilizável.\n'
      + '- Não remova funcionalidades existentes sem necessidade.\n'
      + '- Não altere fluxos que não estejam relacionados à solicitação.\n'
      + '- Corrija erros de TypeScript, build, imports e dependências que surgirem durante a implementação.\n'
      + '- Garanta compatibilidade com desktop e mobile quando houver interface visual.\n\n'
      + 'Comportamento esperado:\n'
      + '- A alteração deve funcionar dentro do fluxo atual do projeto.\n'
      + '- Estados de carregamento, erro e sucesso devem ser tratados quando aplicável.\n'
      + '- Validações devem ser adicionadas quando necessário.\n'
      + '- A experiência do usuário deve ser clara, moderna e intuitiva.\n\n'
      + 'Critérios de aceite:\n'
      + '- A solicitação original foi implementada.\n'
      + '- O projeto continua compilando sem erros.\n'
      + '- Nenhuma funcionalidade existente foi quebrada.\n'
      + '- O código ficou organizado e fácil de manter.\n'
      + '- A interface, se houver, ficou responsiva e consistente com o restante do projeto.\n\n'
      + 'Importante:\nAntes de finalizar, revise todos os arquivos alterados, verifique possíveis impactos colaterais e explique resumidamente o que foi modificado.';
  }

  function tsSetTextareaValue(el, value) {
    if (!el) return false;
    try {
      if (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT') {
        var proto = el.tagName === 'TEXTAREA' ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype;
        var setter = Object.getOwnPropertyDescriptor(proto, 'value');
        if (setter && setter.set) setter.set.call(el, value); else el.value = value;
      } else if (el.isContentEditable || el.getAttribute('contenteditable') === 'true') {
        el.textContent = value;
      } else {
        el.value = value;
      }
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    } catch (_) { return false; }
  }

  // Otimização via Edge Function segura (Gemini Flash).
  // A chave GEMINI_API_KEY fica apenas no backend.
  var TS_OPTIMIZE_ENDPOINT = 'https://wogunbzijppmeuleitjq.supabase.co/functions/v1/optimize-prompt';

  async function tsOptimizePromptViaEdge(input) {
    var text = String(input == null ? '' : input).trim();
    if (!text) throw new Error('Digite um prompt antes de otimizar.');
    console.log('[TS] Clique em Otimizar com IA detectado');
    console.log('[TS] Chamando Edge Function optimize-prompt');
    var res;
    try {
      res = await fetch(TS_OPTIMIZE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: text })
      });
    } catch (e) {
      console.error('[TS] Erro de rede optimize-prompt:', e);
      throw new Error('Falha de rede ao otimizar');
    }
    var data = null;
    try { data = await res.json(); } catch (_) {}
    if (!res.ok) {
      console.error('[TS] Erro optimize-prompt:', res.status, data);
      throw new Error((data && data.error) || ('HTTP ' + res.status));
    }
    var optimized = '';
    if (data) {
      optimized = data.optimized_prompt || data.optimizedPrompt || data.optimized || data.text || '';
    }
    optimized = String(optimized || '').trim();
    if (!optimized) throw new Error('A otimização não retornou texto.');
    console.log('[TS] Prompt otimizado recebido');
    return optimized;
  }

  // Alias explícito conforme especificação.
  var tsOptimizePromptWithEdge = tsOptimizePromptViaEdge;


  global.tsOptimizePromptLocally = tsOptimizePromptLocally;
  global.tsOptimizePromptViaEdge = tsOptimizePromptViaEdge;
  global.tsOptimizePromptWithEdge = tsOptimizePromptWithEdge;
  global.tsSetTextareaValue = tsSetTextareaValue;
})(typeof window !== 'undefined' ? window : self);



/* --- ui-shell.js --- */
// ui-shell.js
// Carrega shell compartilhado (branding + HTML + CSS + templates + links) pelo cache central do background.
// Para a build OFICIAL com casca minima (#ts-shell-root), injeta html.shell remoto.
// Para reseller-local, branding/HTML/CSS continuam 100% locais.
(function (global) {

  function setStore(obj) {
    try {
      if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
        chrome.storage.local.set(obj);
      }
    } catch (_) {}
  }

  function getStore(keys) {
    return new Promise(function (resolve) {
      try {
        chrome.storage.local.get(keys, function (r) { resolve(r || {}); });
      } catch (_) { resolve({}); }
    });
  }

  function isResellerLocal() {
    try {
      var m = global.TS_BUILD_MODE;
      if (m === "reseller" || m === "reseller-local" || m === "official-v2") return true;
      var cfg = global.TS_BRANDING_CONFIG || global.TS_ACTIVE_BRANDING;
      if (cfg && (cfg.buildMode === "reseller-local" || cfg.buildMode === "official-v2")) return true;
    } catch (_) {}
    return false;
  }

  function hasMinimalShellRoot() {
    try { return !!document.getElementById("ts-shell-root"); } catch (_) { return false; }
  }

  function applyShellCss(css) {
    if (typeof document === "undefined" || !document.head) return;
    var STYLE_ID = "ts-remote-shell-css";
    var existing = document.getElementById(STYLE_ID);
    if (!css || typeof css !== "string") {
      if (existing && existing.parentNode) existing.parentNode.removeChild(existing);
      return;
    }
    var styleEl = existing;
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = STYLE_ID;
      styleEl.type = "text/css";
    }
    if (styleEl.textContent !== css) styleEl.textContent = css;
    document.head.appendChild(styleEl); // re-append to win cascade
  }

  function applyShellLinks(links) {
    if (!links || typeof links !== "object") return;
    ["support", "sales", "community", "discord"].forEach(function (k) {
      var url = links[k];
      if (!url) return;
      try {
        document.querySelectorAll('[data-ts-link="' + k + '"]').forEach(function (el) {
          el.setAttribute("href", url);
        });
      } catch (_) {}
    });
    if (links.discord) {
      try {
        document.querySelectorAll(".sp-discord-link").forEach(function (el) {
          el.setAttribute("href", links.discord);
        });
      } catch (_) {}
    }
  }

  // Overrides injected AFTER remote CSS so they always win the cascade.
  // Fixes logo size, header height, Discord button design when remote shell
  // returns minimal styles.
  function applyShellOverrides() {
    if (typeof document === "undefined" || !document.head) return;
    var STYLE_ID = "ts-shell-overrides";
    var css =
      ".sp-brand-extended-logo,.sp-brand img.sp-brand-extended-logo,img[data-ts-brand='logo-extended']{width:96px!important;max-width:96px!important;height:32px!important;object-fit:contain!important;object-position:left center!important;display:block!important;flex-shrink:0!important;}" +
      ".sp-header{height:56px!important;padding:10px 16px!important;display:flex!important;align-items:center!important;justify-content:space-between!important;gap:8px!important;}" +
      ".sp-header-actions{display:flex!important;align-items:center!important;gap:8px!important;}" +
      ".sp-discord-link{width:32px!important;height:32px!important;background:#5865F2!important;border-radius:10px!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;color:#fff!important;flex:0 0 auto!important;padding:0!important;border:none!important;text-decoration:none!important;}" +
      ".sp-discord-link svg{width:15px;height:15px;display:block;}" +
      ".sp-footer-badge [data-i18n='footer.developed'],.sp-footer-badge [data-i18n='footer.developedBy']{margin-right:4px;}";
    var el = document.getElementById(STYLE_ID);
    if (!el) {
      el = document.createElement("style");
      el.id = STYLE_ID;
      el.type = "text/css";
      el.textContent = css;
    }
    document.head.appendChild(el); // re-append so it wins
  }

  function ensureFooterStructure(scope) {
    try {
      var nodes = (scope || document).querySelectorAll(".sp-footer-badge, [data-ts-brand='footer']");
      nodes.forEach(function (el) {
        // If remote rendered a single key as text (e.g. "footer.developedBy"), rebuild structure.
        var txt = (el.textContent || "").trim();
        var hasI18nSpan = el.querySelector("[data-i18n='footer.developed'], [data-i18n='footer.developedBy']");
        var hasNameSpan = el.querySelector("[data-ts-brand='footer-name']");
        if (!hasI18nSpan || !hasNameSpan || /^footer\.[a-z]+By?$/i.test(txt)) {
          var brand = (global.TS_ACTIVE_BRANDING && (global.TS_ACTIVE_BRANDING.brandName || global.TS_ACTIVE_BRANDING.extensionName)) || "TS Community";
          el.innerHTML = '<span data-i18n="footer.developed">Desenvolvido por</span>&nbsp;<span data-ts-brand="footer-name">' + brand + '</span>';
        }
      });
    } catch (_) {}
  }

  function forceLogoInlineStyle(scope) {
    try {
      (scope || document).querySelectorAll(".sp-brand-extended-logo, img[data-ts-brand='logo-extended']").forEach(function (img) {
        img.style.setProperty("width", "96px", "important");
        img.style.setProperty("max-width", "96px", "important");
        img.style.setProperty("height", "32px", "important");
        img.style.setProperty("object-fit", "contain", "important");
        img.style.setProperty("object-position", "left center", "important");
        img.style.setProperty("display", "block", "important");
        img.style.setProperty("flex-shrink", "0", "important");
      });
    } catch (_) {}
  }

  function postMount(scope) {
    try { applyShellOverrides(); } catch (_) {}
    try { ensureFooterStructure(scope); } catch (_) {}
    try { forceLogoInlineStyle(scope); } catch (_) {}
    try {
      if (typeof global.applyBrandingConfig === "function" && (global.TS_ACTIVE_BRANDING || global.TS_BRANDING_CONFIG)) {
        global.applyBrandingConfig(global.TS_ACTIVE_BRANDING || global.TS_BRANDING_CONFIG);
      }
    } catch (_) {}
    try { if (global.TS_I18N && global.TS_I18N.ensureUI) global.TS_I18N.ensureUI(); } catch (_) {}
    try { if (global.TS_I18N && global.TS_I18N.applyTranslations) global.TS_I18N.applyTranslations(scope || document); } catch (_) {}
    try { document.dispatchEvent(new CustomEvent("ts:shell-rehydrate", { detail: { scope: scope || document } })); } catch (_) {}
  }

  function mountShellHtml(htmlObj, cacheKey) {
    if (isResellerLocal()) return false;
    var root = document.getElementById("ts-shell-root");
    if (!root) return false;
    if (!htmlObj || typeof htmlObj !== "object" || !htmlObj.shell) return false;
    var key = cacheKey || htmlObj.cache_key || "";
    // CRITICAL: never re-inject HTML after first mount. A second mount (from
    // background fetch-and-apply) would wipe live state — chips, profile card,
    // language switcher, etc. Just refresh branding/i18n/CSS via postMount.
    if (root.getAttribute("data-ts-shell-mounted")) {
      if (key) root.setAttribute("data-ts-shell-key", key);
      postMount(root);
      return true;
    }
    try { root.innerHTML = htmlObj.shell; } catch (e) {
      try { console.warn("[TS UIShell] mountShellHtml failed:", e && e.message); } catch (_) {}
      return false;
    }
    if (key) root.setAttribute("data-ts-shell-key", key);
    root.setAttribute("data-ts-shell-mounted", "1");
    try { document.dispatchEvent(new CustomEvent("ts:shell-mounted", { detail: { html: htmlObj } })); } catch (_) {}
    postMount(root);
    return true;
  }

  function mountShellSlot(slotName, html) {
    if (!html) return false;
    var slot = document.querySelector('[data-ts-shell-slot="' + slotName + '"]')
      || document.getElementById("sp-shell-content")
      || document.getElementById("sp-body");
    if (!slot) return false;
    try { slot.innerHTML = html; } catch (_) { return false; }
    postMount(slot);
    return true;
  }

  function applyShell(shell) {
    if (!shell || typeof shell !== "object") return;
    if (isResellerLocal()) {
      try { console.info("[TS UIShell] reseller-local: skipping remote shell"); } catch (_) {}
      return;
    }
    try { if (shell.branding && global.TSUIConfig && global.TSUIConfig.apply) global.TSUIConfig.apply(shell.branding); } catch (_) {}
    try { applyShellCss(shell.css); } catch (_) {}
    var tpl = {};
    try { if (shell.templates && typeof shell.templates === "object") Object.assign(tpl, shell.templates); } catch (_) {}
    try {
      if (shell.html && typeof shell.html === "object") {
        if (shell.html.login) tpl.login = shell.html.login;
        if (shell.html.main) tpl.main = shell.html.main;
      }
    } catch (_) {}
    global.TS_REMOTE_TEMPLATES = tpl;
    try { if (shell.i18n && global.TS_I18N && global.TS_I18N.mergeDictionaries) global.TS_I18N.mergeDictionaries(shell.i18n); } catch (_) {}
    try { mountShellHtml(shell.html, shell.cache_key); } catch (_) {}
    try { applyShellLinks(shell.links); } catch (_) {}
    // Ensure overrides/footer/i18n run even when there's no html to mount.
    try { applyShellOverrides(); } catch (_) {}
    try { ensureFooterStructure(document); } catch (_) {}
    try { if (global.TS_I18N && global.TS_I18N.applyTranslations) global.TS_I18N.applyTranslations(); } catch (_) {}
  }

  function getTemplate(name, fallback) {
    try {
      var remote = global.TS_REMOTE_TEMPLATES;
      if (remote && Object.prototype.hasOwnProperty.call(remote, name)) return remote[name];
    } catch (_) {}
    return fallback;
  }

  function isCacheFresh(r) {
    try {
      if (!r || !r.ts_ui_shell) return false;
      var ttl = Number(r.ts_ui_shell && r.ts_ui_shell.cache_ttl_seconds) || 0;
      var loadedAt = Number(r.ts_ui_shell_loaded_at) || 0;
      if (!ttl || !loadedAt) return true; // no TTL info -> consider fresh, fetch will refresh in bg
      return (Date.now() - loadedAt) < ttl * 1000;
    } catch (_) { return false; }
  }

  function loadStored(cb) {
    if (isResellerLocal()) { if (cb) cb(); return; }
    getStore(["ts_ui_shell", "ts_ui_shell_loaded_at", "ts_ui_shell_cache_key", "ql_license_valid"]).then(function (r) {
      // Pre-login: cache may still be applied for visual continuity, but not strictly required.
      if (r && r.ts_ui_shell) {
        try { applyShell(r.ts_ui_shell); } catch (_) {}
      }
      if (cb) cb();
    });
  }

  function fetchAndApply(sessionToken) {
    if (!sessionToken) return Promise.resolve(null);
    return new Promise(function (resolve, reject) {
      try {
        if (!chrome.runtime || !chrome.runtime.id) {
          reject(new Error("Extension context invalidated"));
          return;
        }
        chrome.runtime.sendMessage({
          type: "ts:getUiShell",
          sessionToken: sessionToken
        }, function (result) {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
            return;
          }
          if (!result || !result.ok || !result.shell) {
            reject(new Error((result && result.reason) || "get-ui-shell failed"));
            return;
          }
          resolve(result.shell);
        });
      } catch (err) {
        reject(err);
      }
    }).then(function (shell) {
      if (!shell || typeof shell !== "object") throw new Error("invalid shell payload");
      // The background service worker owns the remote cache and request lock.
      // Apply the shared cached result in this UI context without another Edge call.
      applyShell(shell);
      return shell;
    }).catch(function (err) {
      try { console.warn("[TS UIShell] background fetch failed:", err && err.message); } catch (_) {}
      return null;
    });
  }

  function prepareShellBeforeRender(sessionToken, opts) {
    var timeoutMs = (opts && opts.timeoutMs) || 2500;
    return new Promise(function (resolve) {
      if (isResellerLocal()) { resolve({ source: "reseller-local" }); return; }
      getStore(["ts_ui_shell", "ts_ui_shell_loaded_at", "ts_ui_shell_cache_key", "ql_license_valid"]).then(function (r) {
        var hasCache = !!(r && r.ts_ui_shell);
        if (hasCache) { try { applyShell(r.ts_ui_shell); } catch (_) {} }
        var fresh = hasCache && isCacheFresh(r);
        if (!sessionToken || fresh) {
          // Background refresh if we have a token, but don't block.
          if (sessionToken && !fresh) { try { fetchAndApply(sessionToken); } catch (_) {} }
          resolve({ source: hasCache ? "cache" : "fallback" });
          return;
        }
        var settled = false;
        var done = function (src) { if (settled) return; settled = true; resolve({ source: src }); };
        var timer = setTimeout(function () { done(hasCache ? "cache-timeout" : "fallback-timeout"); }, timeoutMs);
        fetchAndApply(sessionToken).then(function (shell) {
          clearTimeout(timer);
          done(shell ? "remote" : (hasCache ? "cache" : "fallback"));
        }).catch(function () {
          clearTimeout(timer);
          done(hasCache ? "cache" : "fallback");
        });
      });
    });
  }

  // Activates a local fallback template (#ts-shell-fallback) into #ts-shell-root.
  // Only called when minimal shell root has no remote mount after timeout.
  function activateLocalFallback() {
    if (isResellerLocal()) return false;
    var root = document.getElementById("ts-shell-root");
    if (!root) return false;
    if (root.getAttribute("data-ts-shell-mounted") === "1") return false;
    var tpl = document.getElementById("ts-shell-fallback");
    if (!tpl || !("content" in tpl)) return false;
    try {
      root.innerHTML = "";
      root.appendChild(tpl.content.cloneNode(true));
      root.setAttribute("data-ts-shell-mounted", "fallback");
      try { document.dispatchEvent(new CustomEvent("ts:shell-mounted", { detail: { fallback: true } })); } catch (_) {}
      postMount(root);
      return true;
    } catch (_) { return false; }
  }

  global.TSUIShell = {
    apply: applyShell,
    fetchAndApply: fetchAndApply,
    loadStored: loadStored,
    prepareShellBeforeRender: prepareShellBeforeRender,
    getTemplate: getTemplate,
    mountShellHtml: mountShellHtml,
    mountShellSlot: mountShellSlot,
    applyShellLinks: applyShellLinks,
    hasMinimalShellRoot: hasMinimalShellRoot,
    activateLocalFallback: activateLocalFallback
  };
})(typeof window !== "undefined" ? window : self);

/* --- content-templates.js --- */

const SVG_ICONS = {
  wrench: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
  edit: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
  shield: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  zap: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
  msgSquare: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
  trendUp: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>',
  palette: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r="0.5"/><circle cx="17.5" cy="10.5" r="0.5"/><circle cx="8.5" cy="7.5" r="0.5"/><circle cx="6.5" cy="12" r="0.5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>',
  box: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
  search: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  bell: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
  moon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
  mic: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>',
  refresh: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>',
  headphones: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>',
  sparkles: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>',
};

const PROMPT_TEMPLATES = [
  { icon: SVG_ICONS.wrench, label: "Bugs", prompt: "Analise o código e identifique todos os bugs, erros e falhas. Corrija cada um deles explicando o problema e a solução aplicada." },
  { icon: SVG_ICONS.edit, label: "Refatorar", prompt: "Elabore um plano completo de refatoração e otimização do sistema em etapas." },
  { icon: SVG_ICONS.shield, label: "Erros", prompt: "Implemente tratamento de erros robusto em todo o código, incluindo try/catch, validações e mensagens de erro amigáveis para o usuário." },
  { icon: SVG_ICONS.zap, label: "Otimizar", prompt: "Analise e otimize a performance do sistema, identificando gargalos, melhorando queries, reduzindo re-renders e aplicando boas práticas." },
  { icon: SVG_ICONS.msgSquare, label: "Comentários", prompt: "Adicione comentários claros e documentação em todo o código, explicando a lógica, parâmetros e retornos de cada função." },
  { icon: SVG_ICONS.trendUp, label: "SEO", prompt: "Monte um plano completo de criação e otimização de SEO para este site. Inclua: análise de meta tags (title, description, og:image), estrutura de headings (H1-H6), sitemap.xml, robots.txt, dados estruturados (JSON-LD), performance (Core Web Vitals), acessibilidade, URLs amigáveis, canonical tags, alt text em imagens, lazy loading, e estratégias de link building interno. Implemente todas as melhorias identificadas." },
  { icon: SVG_ICONS.palette, label: "UI", prompt: "Melhore a interface do usuário tornando-a mais moderna, responsiva e acessível, seguindo boas práticas de UX/UI." },
  { icon: SVG_ICONS.box, label: "Componentes", prompt: "Reorganize o código separando em componentes reutilizáveis, bem estruturados e com responsabilidades únicas." },
  { icon: SVG_ICONS.search, label: "Review", prompt: "Faça uma revisão completa do código identificando problemas de qualidade, segurança, performance e sugerindo melhorias." },
];

// ---- Template: License Gate ----
function templateLicenseGate(minimized) {
  const brand = ((window.tsBrandName && window.tsBrandName()) || 'TS Community');
  const logo = tsGetLoginLogoUrl();
  return '<div id="ql-body">' +
    '<div class="ts-login-card">' +
      '<button type="button" class="ts-login-close" id="ql-login-close" title="Fechar" aria-label="Fechar">×</button>' +
      '<img class="ts-login-logo" src="' + escapeHtml(logo) + '" alt="' + escapeHtml(brand) + '" onerror="this.style.display=\'none\'">' +
      '<h2 class="ts-login-title">Bem-vindo à ' + escapeHtml(brand) + '</h2>' +
      '<label class="ts-login-label" for="ql-license-input">Chave de licença</label>' +
      '<input id="ql-license-input" placeholder="QYRON-XXXXX-XXXXX-XXXXX-XXXXX" spellcheck="false" autocomplete="off">' +
      '<label class="ts-login-save"><input type="checkbox" id="ql-save-license" checked> <span>Salvar licença neste dispositivo</span></label>' +
      '<button id="ql-validate-btn">Ativar Licença</button>' +
      tsRenderLoginMiniActions() +
      '<div id="ql-license-log"></div>' +
      '<div class="ts-login-footer">Powered by ' + escapeHtml(brand) + '</div>' +
    '</div>' +
  '</div>';
}

// ---- Template: Main UI ----
function templateMainUI(greeting, statusBadge, minimized) {
  return '<div id="ql-header">' +
    '<div class="ql-header-left">' +
      '<span class="ql-brand" data-ts-brand="name">' + ((window.tsBrandName && window.tsBrandName()) || 'TS Community') + '</span>' +
      '<span class="ql-badge-pro-header">PRO</span>' +
    '</div>' +
    '<div class="ql-header-right">' +
      '<button class="ql-icon-btn ql-notif-btn" title="Notifica\u00e7\u00f5es">' + SVG_ICONS.bell + '<span class="ql-notif-badge" style="display:none">0</span></button>' +
      '<button class="ql-icon-btn" title="Tema">' + SVG_ICONS.moon + '</button>' +
      '<button id="ql-logout-btn" class="ql-icon-btn" title="Sair">\ud83d\udeaa</button>' +
      '<button id="ql-minimize" class="ql-icon-btn">' + (minimized ? '\u25a1' : '\u2212') + '</button>' +
    '</div>' +
  '</div>' +
   '<div id="ql-body">' +
    '<div id="ql-update-banner" style="display:none"></div>' +
    '<div class="ql-profile-card">' +
      '<div class="ql-profile-top">' +
        '<div class="ql-profile-info">' +
          '<span class="ql-profile-name">' + escapeHtml(greeting) + '</span>' +
          statusBadge +
        '</div>' +
      '</div>' +
      '<div id="ql-sync-status" class="ql-sync-status ql-sync-waiting">' +
        '<span class="ql-sync-text">\u23f3 Aguardando sincroniza\u00e7\u00e3o...</span>' +
      '</div>' +
      '<div id="ql-trial-countdown" class="ql-trial-countdown" style="display:none"></div>' +
    '</div>' +
    '<div id="ql-reseller-btn" style="display:none;margin-bottom:14px">' +
      '<a href="https://lovablepromz.lovable.app/reseller" target="_blank" style="display:flex;align-items:center;gap:8px;padding:10px 14px;border-radius:10px;border:1px solid rgba(var(--ts-brand-primary-rgb),0.3);background:rgba(var(--ts-brand-primary-rgb),0.06);color:var(--ql-accent);text-decoration:none;font-size:12px;font-weight:700;transition:all 0.2s">' +
        '\ud83d\udcbc Painel do Revendedor<span style="margin-left:auto;font-size:10px;opacity:0.6">\u2192</span>' +
      '</a>' +
    '</div>' +
    '<!-- Tabs -->' +
    '<div class="ql-tabs" id="ql-tabs">' +
      '<button class="ql-tab ql-tab-active" data-tab="prompt">\u26a1 Prompt</button>' +
      '<button class="ql-tab" data-tab="history">\ud83d\udcac Hist\u00f3rico <span class="ql-tab-badge" id="ql-history-badge" style="display:none">0</span></button>' +
    '</div>' +
    '<div id="ql-tab-content">' +
    '<textarea id="ql-msg" rows="3" placeholder="Digite seu comando..." spellcheck="false"></textarea>' +
    '<div id="ql-attach-preview" class="ql-attach-preview" style="display:none"></div>' +
    '<div class="ql-action-bar">' +
      '<div class="ql-action-center">' +
        '<button id="ql-attach-btn" class="ql-attach-btn" title="Anexar arquivo (m\u00e1x. 10)">\ud83d\udcce</button>' +
        '<button id="ql-optimize-btn" class="ql-tool-btn" title="Otimizar com IA">' + SVG_ICONS.sparkles + '</button>' +
        '<button id="ql-speech-btn" class="ql-tool-btn" title="Voz para texto">' + SVG_ICONS.mic + '</button>' +
      '</div>' +
      '<div class="ql-action-right-send">' +
        '<button id="ql-send" class="ql-send-btn">Enviar</button>' +
      '</div>' +
    '</div>' +
    '<input type="file" id="ql-file-input" multiple style="display:none" accept="*/*">' +
    '<div id="ql-log"></div>' +
    '<div class="ql-shortcuts-section">' +
      '<span class="ql-shortcuts-title">ATALHOS R\u00c1PIDOS</span>' +
      '<div class="ql-shortcuts-grid" id="ql-chips"></div>' +
    '</div>' +
    '<button id="ql-remove-watermark" class="ql-watermark-btn">\ud83d\udeab Remover Marca de \u00c1gua</button>' +
    '<button id="ql-shield-btn" class="ql-shield-btn">' +
      SVG_ICONS.shield + ' <span id="ql-shield-label">Ativar Escudo</span>' +
    '</button>' +
    '<button id="ql-native-chat-btn" class="ql-native-chat-btn">' +
      SVG_ICONS.msgSquare + ' Usar Chat Padr\u00e3o' +
    '</button>' +
    '<button id="ql-download-project" class="ql-watermark-btn" style="background:linear-gradient(135deg,rgba(59,130,246,0.12),rgba(37,99,235,0.08));border-color:rgba(59,130,246,0.3);color:#60a5fa;margin-top:6px">\ud83d\udce5 Baixar Todos Arquivos</button>' +
    '<button id="ql-create-project" class="ql-watermark-btn" style="background:linear-gradient(135deg,rgba(34,197,94,0.14),rgba(16,185,129,0.08));border-color:rgba(34,197,94,0.35);color:#4ade80;margin-top:6px">\ud83d\ude80 Criar Projeto no Lovable</button>' +
    '<button id="ql-publish-project" class="ql-watermark-btn" style="background:linear-gradient(135deg,rgba(245,158,11,0.14),rgba(217,119,6,0.08));border-color:rgba(245,158,11,0.35);color:#fbbf24;margin-top:6px">\ud83c\udf10 Publicar Projeto</button>' +
    '<div id="ql-download-status" style="display:none"></div>' +
    '</div>' +
  '<div id="ql-footer" class="ql-footer">' +
    '<div class="ql-footer-row">' +
      '<a href="' + ((window.getBrandWhatsappLink && window.getBrandWhatsappLink("support")) || "https://wa.me/5518981868677") + '" data-ts-wa="support" target="_blank" class="ql-support-link">' + SVG_ICONS.headphones + ' Suporte</a>' +
      '<span class="ql-footer-version">v4.0</span>' +
    '</div>' +
    '<span class="ql-badge-mz" data-ts-brand="footer">&#9889; Desenvolvido por ' + ((window.tsBrandName && window.tsBrandName()) || 'TS Community') + '</span>' +
  '</div>' +
  '<div id="ql-resize-handle" class="ql-resize-handle"></div>' +
  '<!-- Notifications Panel -->' +
  '<div id="ql-notif-panel" class="ql-notif-panel" style="display:none">' +
    '<div class="ql-notif-header">' +
      '<span>Notifica\u00e7\u00f5es</span>' +
      '<button id="ql-notif-close" class="ql-notif-close-btn">\u2715</button>' +
    '</div>' +
    '<div id="ql-notif-list" class="ql-notif-list">' +
      '<p class="ql-notif-empty">Carregando...</p>' +
    '</div>' +
  '</div>' +
  '<!-- Custom Alert -->' +
  '<div id="ql-custom-alert" class="ql-custom-alert" style="display:none">' +
    '<div class="ql-alert-content">' +
      '<div class="ql-alert-icon">\u2705</div>' +
      '<div class="ql-alert-title">Sucesso!</div>' +
      '<div class="ql-alert-message"></div>' +
      '<button class="ql-alert-ok-btn">OK</button>' +
    '</div>' +
  '</div>';
}

// ---- Template: Expired License Overlay ----
function templateExpiredOverlay() {
  return '<div class="ql-sweetalert-box">' +
    '<div class="ql-sweetalert-icon">\u23f0</div>' +
    '<h2 class="ql-sweetalert-title">Licen\u00e7a Expirada!</h2>' +
    '<p class="ql-sweetalert-text">O prazo da sua licen\u00e7a terminou. Renove agora para continuar.</p>' +
    '<div class="ql-sweetalert-actions">' +
      '<button class="ql-sweetalert-btn ql-sweetalert-btn-primary" id="ql-sweetalert-renew">\ud83d\uded2 Renovar Agora</button>' +
      '<button class="ql-sweetalert-btn ql-sweetalert-btn-secondary" id="ql-sweetalert-close">Fechar</button>' +
    '</div>' +
  '</div>';
}

// ---- Template: Payment UI (packages list) ----
function templatePaymentUI(minimized) {
  return '<div id="ql-header">' +
    '<div class="ql-header-left">' +
      '<span class="ql-brand" data-ts-brand="name">' + ((window.tsBrandName && window.tsBrandName()) || 'TS Community') + '</span>' +
    '</div>' +
    '<div class="ql-header-right">' +
      '<button id="ql-pay-back" class="ql-icon-btn" title="Voltar">\u2190</button>' +
      '<button id="ql-minimize" class="ql-icon-btn">' + (minimized ? '\u25a1' : '\u2212') + '</button>' +
    '</div>' +
  '</div>' +
  '<div id="ql-body">' +
    '<div class="ql-pay-section">' +
      '<div class="ql-pay-title">Escolha seu Plano</div>' +
      '<div id="ql-packages-list" class="ql-packages-list">' +
        '<div class="ql-pay-loading">\u23f3 Carregando planos...</div>' +
      '</div>' +
    '</div>' +
  '</div>' +
  '<div id="ql-resize-handle" class="ql-resize-handle"></div>';
}

// ---- Template: Package Card ----
function templatePackageCard(pkg) {
  const popular = pkg.is_popular ? '<span class="ql-pkg-popular">⭐ POPULAR</span>' : '';
  const duration = pkg.duration_days ? escapeHtml(String(pkg.duration_days)) + ' dias' : 'Permanente';
  const features = (pkg.features || []).map(function(f) { return '<li>' + escapeHtml(f) + '</li>'; }).join('');
  return '<div class="ql-pkg-card' + (pkg.is_popular ? ' ql-pkg-highlight' : '') + '" data-pkg-id="' + escapeHtml(pkg.id) + '" data-pkg-name="' + escapeHtml(pkg.name) + '" data-pkg-price="' + escapeHtml(String(pkg.price)) + '">' +
    popular +
    '<div class="ql-pkg-name">' + escapeHtml(pkg.name) + '</div>' +
    '<div class="ql-pkg-price">' + escapeHtml(String(pkg.price)) + ' <span>MZN</span></div>' +
    '<div class="ql-pkg-duration">' + duration + '</div>' +
    '<ul class="ql-pkg-features">' + features + '</ul>' +
    '<button class="ql-pkg-select-btn">Selecionar</button>' +
  '</div>';
}

// ---- Template: Checkout Screen ----
function templateCheckoutScreen(pkg, minimized) {
  return '<div id="ql-header">' +
    '<div class="ql-header-left">' +
      '<span class="ql-brand">\u26a1 Pagamento</span>' +
    '</div>' +
    '<div class="ql-header-right">' +
      '<button id="ql-checkout-back" class="ql-icon-btn" title="Voltar">\u2190</button>' +
      '<button id="ql-minimize" class="ql-icon-btn">' + (minimized ? '\u25a1' : '\u2212') + '</button>' +
    '</div>' +
  '</div>' +
  '<div id="ql-body">' +
    '<div class="ql-pay-section">' +
      '<div class="ql-selected-pkg">\ud83d\udce6 <strong>' + escapeHtml(pkg.name) + '</strong> \u2014 ' + escapeHtml(String(pkg.price)) + ' MZN</div>' +
      '<div class="ql-pay-field">' +
        '<label>M\u00e9todo de Pagamento</label>' +
        '<div class="ql-pay-methods">' +
          '<button class="ql-method-btn ql-method-active" data-method="mpesa">' +
            '<span class="ql-method-icon">\ud83d\udcf1</span> M-Pesa' +
          '</button>' +
          '<button class="ql-method-btn" data-method="emola">' +
            '<span class="ql-method-icon">\ud83d\udcb3</span> e-Mola' +
          '</button>' +
        '</div>' +
      '</div>' +
      '<div class="ql-pay-field">' +
        '<label>N\u00famero de Telefone</label>' +
        '<input type="tel" id="ql-pay-phone" placeholder="84/85/86/87XXXXXXX" maxlength="9" spellcheck="false">' +
        '<span class="ql-pay-hint" id="ql-phone-hint">M-Pesa: 84 ou 85 | e-Mola: 86 ou 87</span>' +
      '</div>' +
      '<button id="ql-confirm-pay" class="ql-confirm-pay-btn">\ud83d\udcb0 Pagar ' + escapeHtml(String(pkg.price)) + ' MZN</button>' +
      '<div id="ql-pay-log" class="ql-pay-log"></div>' +
    '</div>' +
  '</div>' +
  '<div id="ql-resize-handle" class="ql-resize-handle"></div>';
}

// ---- Template: Payment Success ----
function templatePaymentSuccess(licenseKey) {
  return '<div class="ql-pay-section" style="text-align:center;padding:24px 16px">' +
    '<div style="font-size:48px;margin-bottom:12px">🎉</div>' +
    '<div class="ql-pay-title">Pagamento Confirmado!</div>' +
    '<p style="color:var(--ql-muted);font-size:12px;margin:8px 0 16px">Sua licença foi ativada com sucesso.</p>' +
    '<div style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:12px;margin-bottom:12px">' +
      '<p style="font-size:10px;color:var(--ql-muted);margin-bottom:4px">Sua chave de licença</p>' +
      '<p id="ql-new-key" style="font-family:monospace;font-size:13px;color:var(--ql-accent);font-weight:600;word-break:break-all">' + escapeHtml(licenseKey) + '</p>' +
    '</div>' +
    '<button id="ql-copy-key" class="ql-confirm-pay-btn" style="margin-bottom:8px">📋 Copiar Chave</button>' +
    '<p style="font-size:10px;color:var(--ql-muted);margin-bottom:12px">Cole a chave acima para ativar a extensão.</p>' +
    '<button id="ql-activate-key" class="ql-buy-btn" style="font-size:12px">🔑 Ativar Agora</button>' +
  '</div>';
}

/* --- content.js --- */

// ============= Extension context safety layer =============
// Prevents "Extension context invalidated" crashes when the extension is
// reloaded/updated while old content scripts are still running on the page.
(function installTSContextSafety(){
  if (window.__tsContextSafetyInstalled) return;
  window.__tsContextSafetyInstalled = true;

  function isExtensionAlive() {
    try { return !!(chrome && chrome.runtime && chrome.runtime.id); }
    catch { return false; }
  }
  window.isExtensionAlive = isExtensionAlive;

  const _intervals = new Set();
  const _timeouts = new Set();
  const _observers = new Set();

  const _origSetInterval = window.setInterval.bind(window);
  const _origClearInterval = window.clearInterval.bind(window);
  const _origSetTimeout = window.setTimeout.bind(window);
  const _origClearTimeout = window.clearTimeout.bind(window);

  window.setInterval = function(fn, ms, ...rest){
    const wrapped = function(){
      if (!isExtensionAlive()) { cleanupIntervalsAndObservers(); return; }
      try { return fn.apply(this, arguments); }
      catch(e){
        if (String(e && e.message || e).includes("Extension context invalidated")) {
          cleanupIntervalsAndObservers(); return;
        }
        throw e;
      }
    };
    const id = _origSetInterval(wrapped, ms, ...rest);
    _intervals.add(id);
    return id;
  };
  window.clearInterval = function(id){ _intervals.delete(id); return _origClearInterval(id); };

  window.setTimeout = function(fn, ms, ...rest){
    const wrapped = function(){
      _timeouts.delete(id);
      if (!isExtensionAlive()) { cleanupIntervalsAndObservers(); return; }
      try { return (typeof fn === "function" ? fn.apply(this, arguments) : eval(fn)); }
      catch(e){
        if (String(e && e.message || e).includes("Extension context invalidated")) {
          cleanupIntervalsAndObservers(); return;
        }
        throw e;
      }
    };
    const id = _origSetTimeout(wrapped, ms, ...rest);
    _timeouts.add(id);
    return id;
  };
  window.clearTimeout = function(id){ _timeouts.delete(id); return _origClearTimeout(id); };

  const _OrigMO = window.MutationObserver;
  if (_OrigMO) {
    function SafeMO(cb){
      const wrapped = function(muts, obs){
        if (!isExtensionAlive()) { try { obs.disconnect(); } catch(_){} cleanupIntervalsAndObservers(); return; }
        try { return cb(muts, obs); }
        catch(e){
          if (String(e && e.message || e).includes("Extension context invalidated")) {
            try { obs.disconnect(); } catch(_){}
            cleanupIntervalsAndObservers(); return;
          }
          throw e;
        }
      };
      const inst = new _OrigMO(wrapped);
      _observers.add(inst);
      const _origDisc = inst.disconnect.bind(inst);
      inst.disconnect = function(){ _observers.delete(inst); return _origDisc(); };
      return inst;
    }
    SafeMO.prototype = _OrigMO.prototype;
    window.MutationObserver = SafeMO;
  }

  function cleanupIntervalsAndObservers(){
    if (window.__tsCleanedUp) return;
    window.__tsCleanedUp = true;
    try { _intervals.forEach(id => { try { _origClearInterval(id); } catch(_){} }); _intervals.clear(); } catch(_){}
    try { _timeouts.forEach(id => { try { _origClearTimeout(id); } catch(_){} }); _timeouts.clear(); } catch(_){}
    try { _observers.forEach(o => { try { o.disconnect(); } catch(_){} }); _observers.clear(); } catch(_){}
    try { if (window.qlHeartbeatInterval) _origClearInterval(window.qlHeartbeatInterval); } catch(_){}
    try { if (window.qlCountdownInterval) _origClearInterval(window.qlCountdownInterval); } catch(_){}
  }
  window.cleanupIntervalsAndObservers = cleanupIntervalsAndObservers;

  // Wrap chrome.* APIs to no-op silently when context is dead
  try {
    if (chrome && chrome.storage && chrome.storage.local) {
      const _get = chrome.storage.local.get.bind(chrome.storage.local);
      const _set = chrome.storage.local.set.bind(chrome.storage.local);
      const _rem = chrome.storage.local.remove.bind(chrome.storage.local);
      chrome.storage.local.get = function(keys, cb){
        if (!isExtensionAlive()) { cleanupIntervalsAndObservers(); if (typeof cb === "function") { try { cb({}); } catch(_){} } return; }
        try { return _get(keys, cb); }
        catch(e){ cleanupIntervalsAndObservers(); if (typeof cb === "function") { try { cb({}); } catch(_){} } }
      };
      chrome.storage.local.set = function(items, cb){
        if (!isExtensionAlive()) { cleanupIntervalsAndObservers(); if (typeof cb === "function") { try { cb(); } catch(_){} } return; }
        try { return _set(items, cb); }
        catch(e){ cleanupIntervalsAndObservers(); if (typeof cb === "function") { try { cb(); } catch(_){} } }
      };
      chrome.storage.local.remove = function(keys, cb){
        if (!isExtensionAlive()) { cleanupIntervalsAndObservers(); if (typeof cb === "function") { try { cb(); } catch(_){} } return; }
        try { return _rem(keys, cb); }
        catch(e){ cleanupIntervalsAndObservers(); if (typeof cb === "function") { try { cb(); } catch(_){} } }
      };
    }
    if (chrome && chrome.runtime) {
      const _send = chrome.runtime.sendMessage && chrome.runtime.sendMessage.bind(chrome.runtime);
      const _getURL = chrome.runtime.getURL && chrome.runtime.getURL.bind(chrome.runtime);
      if (_send) {
        chrome.runtime.sendMessage = function(...args){
          if (!isExtensionAlive()) {
            cleanupIntervalsAndObservers();
            const cb = args.find(a => typeof a === "function");
            if (cb) { try { cb(undefined); } catch(_){} }
            return;
          }
          try { return _send(...args); }
          catch(e){
            cleanupIntervalsAndObservers();
            const cb = args.find(a => typeof a === "function");
            if (cb) { try { cb(undefined); } catch(_){} }
          }
        };
      }
      if (_getURL) {
        chrome.runtime.getURL = function(p){
          if (!isExtensionAlive()) { cleanupIntervalsAndObservers(); return ""; }
          try { return _getURL(p); } catch(_){ return ""; }
        };
      }
    }
  } catch(_){}

  // Swallow the specific error globally
  window.addEventListener("error", (ev) => {
    const msg = ev && ev.message || (ev && ev.error && ev.error.message) || "";
    if (typeof msg === "string" && msg.includes("Extension context invalidated")) {
      cleanupIntervalsAndObservers();
      ev.preventDefault && ev.preventDefault();
      ev.stopImmediatePropagation && ev.stopImmediatePropagation();
      return false;
    }
  }, true);
  window.addEventListener("unhandledrejection", (ev) => {
    const msg = ev && ev.reason && (ev.reason.message || String(ev.reason)) || "";
    if (typeof msg === "string" && msg.includes("Extension context invalidated")) {
      cleanupIntervalsAndObservers();
      ev.preventDefault && ev.preventDefault();
    }
  }, true);
})();


// ============= Frame guard =============
// content.js runs with all_frames:true (Reseller build) so Visual Edit's
// executeScript() from background.js can reach the preview iframe. However the
// full extension UI (floating panel and overlays,
// observers) must only mount in the top frame on lovable.dev. Otherwise the
// panel appears duplicated inside the preview iframe.
//
// Visual Edit itself does NOT depend on content.js running in child frames —
// background.js uses chrome.scripting.executeScript({ allFrames: true }) and
// injects its own function directly. So we bail out on child frames /
// non-lovable.dev hosts after cleaning up any stray UI, without affecting
// Visual Edit.
(function tsFrameGuard(){
  var isTopFrame = false;
  try { isTopFrame = (window.top === window.self); } catch(_) { isTopFrame = false; }
  var host = "";
  try { host = (location && location.hostname) || ""; } catch(_) { host = ""; }
  var isLovableMain = (host === "lovable.dev" || host.endsWith(".lovable.dev"));
  if (isTopFrame && isLovableMain) return; // OK — proceed with full init below.

  function stripLeakedUI(){
    try {
      var selectors = [
        "#ql-floating",
        "#ts-sidebar-collapse-floating-button",
        "#ts-extension-root",
        "[data-ts-extension-root='true']",
        "[data-ts-extension-ui]",
        ".ts-extension-panel",
        ".ts-floating-toggle",
        ".ts-floating-root",
        ".ts-overlay-root"
      ];
      for (var i=0; i<selectors.length; i++){
        try {
          var nodes = document.querySelectorAll(selectors[i]);
          for (var j=0; j<nodes.length; j++){ try { nodes[j].remove(); } catch(_){} }
        } catch(_){}
      }
    } catch(_){}
  }
  stripLeakedUI();
  try {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", stripLeakedUI, { once:true });
    }
  } catch(_){}
  window.__TS_FRAME_GUARD_BLOCKED__ = true;
  // Silence the intentional bailout so it doesn't show as an uncaught error.
  try {
    window.addEventListener("error", function(ev){
      var m = (ev && ev.message) || (ev && ev.error && ev.error.message) || "";
      if (typeof m === "string" && m.indexOf("__TS_FRAME_GUARD_BAILOUT__") !== -1) {
        ev.preventDefault && ev.preventDefault();
        ev.stopImmediatePropagation && ev.stopImmediatePropagation();
        return false;
      }
    }, true);
  } catch(_){}
  // Abort the rest of content.js in child frames / non-lovable.dev hosts.
  throw new Error("__TS_FRAME_GUARD_BAILOUT__");
})();





const VALIDATE_URL = "https://mrsemlimites.lovable.app/api/public/ext/functions/v1/validate-license-v2";
const ACTIVATE_URL = "https://mrsemlimites.lovable.app/api/public/ext/functions/v1/validate-license-v2";
const HEARTBEAT_URL = "https://mrsemlimites.lovable.app/api/public/ext/functions/v1/validate-license-v2";
const OPTIMIZE_URL = "https://wogunbzijppmeuleitjq.supabase.co/functions/v1/optimize-prompt";
const NOTIFICATIONS_URL = "https://wogunbzijppmeuleitjq.supabase.co/rest/v1/notifications?select=*&order=created_at.desc&limit=20";
const PACKAGES_URL = "https://wogunbzijppmeuleitjq.supabase.co/rest/v1/packages?select=*&is_active=eq.true&order=sort_order.asc";
const EXT_PAYMENT_URL = "https://wogunbzijppmeuleitjq.supabase.co/functions/v1/process-extension-payment";
const PROXY_COMMAND_URL = "https://wogunbzijppmeuleitjq.supabase.co/functions/v1/proxy-command";
const REMOVE_WATERMARK_URL = "https://wogunbzijppmeuleitjq.supabase.co/functions/v1/remove-watermark";
const PUBLISH_PROJECT_URL = "https://wogunbzijppmeuleitjq.supabase.co/functions/v1/publish-project";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNibnlkanVlc25ic29ubXVqa216Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxODYzMTYsImV4cCI6MjA4Nzc2MjMxNn0.ipUl_9menJyi7KkZnMtSOyKRfsKkVFKZxUitHPSp7Ic";

// Popup-only mode: no sidebar/sidepanel controls are injected.



function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = String(str);
  return div.innerHTML;
}

function sanitizeUrl(url) {
  if (!url) return '';
  try {
    const parsed = new URL(url);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') return url;
    return '';
  } catch(e) { return ''; }
}

function decodeJwtPayload(token) {
  try {
    const raw = String(token || '').replace(/^Bearer\s+/i, '').trim();
    const parts = raw.split('.');
    if (parts.length < 2) return null;
    const b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4);
    return JSON.parse(atob(padded));
  } catch(e) {
    return null;
  }
}

window.__tsNativeLovableFiles = window.__tsNativeLovableFiles || [];
window.__tsNativeUploadPending = window.__tsNativeUploadPending || false;

function tsNormalizeCapturedNativeFile(f) {
  f = f || {};
  const type = f.type || f.content_type || f.mime_type || f.file_type || 'application/octet-stream';
  const size = f.file_size_bytes || f.size || null;
  const url = f.file_url || f.url || f.download_url || '';
  return {
    file_id: f.file_id,
    file_name: f.file_name || f.name || 'file',
    name: f.name || f.file_name || 'file',
    type,
    file_type: type,
    content_type: type,
    file_size_bytes: size,
    original_file_name: f.original_file_name || f.file_name || f.name || 'file',
    original_file_size_bytes: f.original_file_size_bytes || size,
    file_url: f.file_url || url,
    url: f.url || url,
    download_url: f.download_url || url,
    is_temp_image: false,
    is_native_image: String(type || '').indexOf('image/') === 0,
    uploading: false,
    uploadFailed: false
  };
}

function tsGetNativeLovableFilesForPayload() {
  return (window.__tsNativeLovableFiles || [])
    .filter(function(f) { return f && f.file_id; })
    .map(tsNormalizeCapturedNativeFile);
}

(function tsNativeLovableFileCaptureStore(){
  try {
    window.addEventListener('message', function(event) {
      if (event.source !== window) return;
      var d = event.data;
      if (!d || d.source !== 'TS_LOVABLE_PAGE_HOOK') return;
      if (d.type === 'TS_NATIVE_LOVABLE_FILE_UPLOAD_STARTED' || d.type === 'TS_NATIVE_LOVABLE_FILE_UPLOAD_PENDING') {
        window.__tsNativeUploadPending = true;
        window.__tsNativeLovableUploadPending = true;
        return;
      }
      if (d.type === 'TS_NATIVE_LOVABLE_FILE_UPLOAD_DONE') {
        window.__tsNativeUploadPending = false;
        window.__tsNativeLovableUploadPending = false;
        return;
      }
      if (d.type !== 'TS_NATIVE_LOVABLE_FILE_UPLOADED') return;
      var file = d.file || {};
      if (!file.file_id) return;
      var arr = window.__tsNativeLovableFiles || (window.__tsNativeLovableFiles = []);
      if (!arr.some(function(x) { return x && x.file_id === file.file_id; })) {
        arr.push(tsNormalizeCapturedNativeFile(file));
        try { console.log('[TS] Arquivo nativo Lovable capturado:', file.file_id); } catch(_) {}
      }
      window.__tsNativeUploadPending = false;
      window.__tsNativeLovableUploadPending = false;
    });
  } catch (_) {}
})();

// --- Bridge: expose native-captured files + trigger native attach ---
(function tsNativeLovableBridge(){
  function findNativeAttachTrigger() {
    var all = Array.from(document.querySelectorAll("input[type='file'], button, [role='button']"));
    // 1) native file input (skip extension-owned)
    var fileInput = all.find(function(el){
      if (!(el instanceof HTMLInputElement) || el.type !== 'file') return false;
      var id = (el.id || '').toLowerCase();
      var cls = (el.className && typeof el.className === 'string' ? el.className : '').toLowerCase();
      if (id.indexOf('ts-') === 0 || id.indexOf('ql-') === 0 || id.indexOf('sp-') === 0) return false;
      if (cls.indexOf('ts-') >= 0 || cls.indexOf('ql-') >= 0 || cls.indexOf('sp-') >= 0) return false;
      return true;
    });
    if (fileInput) return fileInput;
    // 2) attach button by text/aria
    return all.find(function(el){
      var id = (el.id || '').toLowerCase();
      var cls = (el.className && typeof el.className === 'string' ? el.className : '').toLowerCase();
      if (id.indexOf('ts-') === 0 || id.indexOf('ql-') === 0 || id.indexOf('sp-') === 0) return false;
      if (cls.indexOf('ts-') >= 0 || cls.indexOf('ql-') >= 0 || cls.indexOf('sp-') >= 0) return false;
      var text = ((el.getAttribute && (el.getAttribute('aria-label') || el.getAttribute('title'))) || el.textContent || '').toLowerCase();
      return /attach|anexar|anexo|upload|arquivo|imagem|image|file/.test(text);
    }) || null;
  }
  function tsOpenLovableNativeAttach() {
    try {
      var t = findNativeAttachTrigger();
      if (!t) return false;
      t.click();
      return true;
    } catch(_) { return false; }
  }
  window.tsOpenLovableNativeAttach = tsOpenLovableNativeAttach;
  try {
    chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
      if (!message || !message.type) return;
      if (message.type === 'TS_GET_NATIVE_LOVABLE_FILES') {
        sendResponse({
          ok: true,
          files: tsGetNativeLovableFilesForPayload(),
          pending: !!window.__tsNativeUploadPending
        });
        return true;
      }
      if (message.type === 'TS_CLEAR_NATIVE_LOVABLE_FILES') {
        window.__tsNativeLovableFiles = [];
        window.__tsNativeUploadPending = false;
        window.__tsNativeLovableUploadPending = false;
        sendResponse({ ok: true });
        return true;
      }
      if (message.type === 'TS_OPEN_LOVABLE_NATIVE_ATTACH') {
        var ok = tsOpenLovableNativeAttach();
        sendResponse({ ok: ok });
        return true;
      }
    });
  } catch(_) {}
})();


async function sendPromptNativeViaBackground(mensagem, modoPlano, attachedFilesSnapshot) {
  const capturedNativeFiles = tsGetNativeLovableFilesForPayload();
  if (window.__tsNativeUploadPending && !capturedNativeFiles.length) {
    throw new Error('Aguarde o upload da imagem finalizar antes de enviar.');
  }
  const attachments = Array.isArray(attachedFilesSnapshot) ? attachedFilesSnapshot : (capturedNativeFiles.length ? capturedNativeFiles : qlAttachedFiles);
  const storage = await new Promise((r) => chrome.storage.local.get(['lovable_projectId'], r));
  const projectId = storage.lovable_projectId || '';

  if (!projectId) {
    throw new Error('Projeto Lovable não identificado.');
  }

  const lovableFiles = attachments
    .filter((f) => f.file_id && !f.uploading && !f.uploadFailed && !String(f.file_id).startsWith('local_direct_') && !String(f.file_id).startsWith('img_temp_'))
    .map((f) => ({
      file_id: f.file_id,
      file_name: f.file_name || f.name || 'file',
      name: f.name || f.file_name || 'file',
      type: f.type || f.file_type || f.content_type || 'application/octet-stream',
      file_type: f.file_type || f.type || f.content_type || 'application/octet-stream',
      content_type: f.content_type || f.file_type || f.type || 'application/octet-stream',
      file_size_bytes: f.file_size_bytes || (f.rawFile && f.rawFile.size) || null,
      original_file_name: f.original_file_name || f.file_name || f.name || 'file',
      original_file_size_bytes: f.original_file_size_bytes || f.file_size_bytes || (f.rawFile && f.rawFile.size) || null,
      file_url: f.file_url || f.download_url || f.url || '',
      url: f.url || f.file_url || f.download_url || '',
      download_url: f.download_url || f.file_url || f.url || ''
    }));

  const baseMessage = String(mensagem || '').trim();
  const userPrompt = baseMessage;


  const popupSendMethod = (typeof window !== 'undefined' && typeof window.tsGetSendMethod === 'function')
    ? await window.tsGetSendMethod()
    : 'method_1';
  const useFixErrorMethod = popupSendMethod === 'method_2';

  const payload = useFixErrorMethod
    ? ((typeof tsBuildNativeFixErrorPayload === 'function') ? tsBuildNativeFixErrorPayload(userPrompt, lovableFiles) : null)
    : ((typeof tsBuildNativeSecurityScanPayload === 'function') ? tsBuildNativeSecurityScanPayload(userPrompt, lovableFiles) : null);
  if (!payload) throw new Error('Helper de envio nativo indisponível.');

  // A licença já foi validada/ativada antes de exibir a interface.
  // A renovação da sessão QYRON não pode bloquear o envio nativo ao Lovable.
  // Tenta renovar em segundo plano; se falhar, o método 1/2 continua normalmente.
  try { await ensureTsSessionToken(false); } catch (sessionError) {
    try { console.warn('[QYRON] Renovação de sessão indisponível; prosseguindo com o chat nativo.', sessionError); } catch (_) {}
  }

  const resp = await tsSendNativeLovableChat({
    projectId,
    payload,
    userText: userPrompt,
    intent: useFixErrorMethod ? 'fix_error' : 'security_scan',
    send_method: useFixErrorMethod ? 'v6' : 'v5'
  });
  try { console.log('[TS SEND]', { method: useFixErrorMethod ? 'fix_error_v6' : 'security_scan_v5', ok: resp && resp.ok, status: resp && resp.status }); } catch(_) {}

  if (resp && resp.error === 'LOVABLE_SESSION_NOT_CAPTURED') {
    throw new Error('Não foi possível usar a sessão atual do Lovable. Recarregue a aba do Lovable, aguarde sincronizar e tente novamente.');
  }

  if (resp && (resp.status === 401 || resp.status === 403)) {
    throw new Error('Não foi possível usar a sessão atual do Lovable. Recarregue a aba do Lovable, aguarde sincronizar e tente novamente.');
  }
  if (resp && resp.status === 402) {
    throw new Error('Você precisa ter pelo menos 1 crédito na sua conta Lovable.');
  }
  if (!resp || resp.ok !== true) {
    const errMsg = (resp && resp.data && (resp.data.error || resp.data.message)) || ('Erro ' + ((resp && resp.status) || 'desconhecido') + ' ao enviar para o Lovable.');
    throw new Error(errMsg);
  }

  try { window.__tsNativeLovableFiles = []; } catch (_) {}
  try { window.__tsNativeUploadPending = false; } catch (_) {}

  return { success: true, method: useFixErrorMethod ? 'native_fix_error_v6' : 'native_security_scan_v5', data: resp.data };
}


const TS_IS_RESELLER_BUILD = (function(){ try { return (typeof window !== 'undefined' && (window.TS_BUILD_MODE === 'reseller' || window.TS_BUILD_MODE === 'official-v2' || (window.TS_BRANDING_CONFIG && (window.TS_BRANDING_CONFIG.buildMode === 'reseller-local' || window.TS_BRANDING_CONFIG.buildMode === 'official-v2')))); } catch(_) { return false; } })();
const TS_EDGE_SEND_URL = 'https://wogunbzijppmeuleitjq.supabase.co/functions/v1/send-lovable-message';


// ===== DIAGNOSTIC PROBE — nonexistent visual target test =====
// Temporary. Do NOT promote to production before behavior is confirmed.

function isSyntheticVisualProbeEnabled() {
  try { return typeof USE_NONEXISTENT_VISUAL_TARGET !== 'undefined' && USE_NONEXISTENT_VISUAL_TARGET === true; }
  catch (_) { return false; }
}

function clearSyntheticVisualEditState() {
  const keys = [
    'visualEditTarget',
    'visualTarget',
    'selectedElement',
    'selectedElements',
    'ts_visual_edit_target',
    'ts_visual_selected_element',
    'lovable_visual_edit_target'
  ];
  try { chrome.storage.local.remove(keys, () => void chrome.runtime.lastError); } catch (_) {}
  try { keys.forEach((k) => window.localStorage && window.localStorage.removeItem(k)); } catch (_) {}
  try { keys.forEach((k) => window.sessionStorage && window.sessionStorage.removeItem(k)); } catch (_) {}
}

function createVisualEditProbe() {
  let raw = '';
  try {
    raw = (crypto && crypto.randomUUID && crypto.randomUUID()) || '';
  } catch (_) {}
  if (!raw) raw = String(Date.now()) + Math.random().toString(16).slice(2);
  const probeId = raw.replaceAll('-', '').slice(0, 16);
  const selector = `#ts-visual-edit-probe-${probeId}`;
  return {
    probeId,
    selector,
    probeText: `__TS_VISUAL_EDIT_PROBE_${probeId}__`
  };
}

function spCheckSelectorAbsent(selector) {
  return new Promise((resolve, reject) => {
    try {
      chrome.runtime.sendMessage({ action: 'checkSelectorAbsent', selector }, (resp) => {
        if (chrome.runtime.lastError) return reject(new Error(chrome.runtime.lastError.message));
        resolve(resp || { ok: false, error: 'sem resposta' });
      });
    } catch (err) { reject(err); }
  });
}

async function createSyntheticVisualTarget() {
  clearSyntheticVisualEditState();
  let probe = null;
  let confirmedAbsent = false;
  for (let attempt = 0; attempt < 3 && !confirmedAbsent; attempt++) {
    probe = createVisualEditProbe();
    try {
      const check = await spCheckSelectorAbsent(probe.selector);
      if (check && check.ok && check.exists === false) confirmedAbsent = true;
    } catch (_) {}
  }
  if (!confirmedAbsent || !probe) throw new Error('Não foi possível gerar um seletor sintético único.');
  const element = {
    filePath: '',
    elementType: 'div',
    lineNumber: 0,
    componentName: 'div',
    selector: probe.selector,
    textContent: probe.probeText,
    children: []
  };
  return {
    probeId: probe.probeId,
    oldText: probe.probeText,
    selectedElement: element,
    selectedElements: [element],
    viewport: {
      width: (typeof window !== 'undefined' && window.innerWidth) || 1280,
      height: (typeof window !== 'undefined' && window.innerHeight) || 800,
      dpr: (typeof window !== 'undefined' && window.devicePixelRatio) || 1
    }
  };
}

function buildSyntheticVisualEditRequestBody({ projectId, lovableBearer, visualTarget, originalUserMessage, files, attachments, optimisticImageUrls }) {
  const selectedElement = { ...visualTarget.selectedElement };
  const body = {
    projectId,
    lovableBearer,
    intent: 'visual_edit',
    oldText: visualTarget.oldText,
    newText: String(originalUserMessage || ''),
    selectedElement,
    selectedElements: [selectedElement],
    viewport: visualTarget.viewport,
    currentPage: (typeof location !== 'undefined' ? location.pathname : '/') || '/',
    threadId: 'main',
    sessionReplay: '[]',
    files: Array.isArray(files) ? files : [],
    attachments: Array.isArray(attachments) ? attachments : [],
    optimisticImageUrls: Array.isArray(optimisticImageUrls) ? optimisticImageUrls : [],
    diagnosticMode: 'nonexistent_visual_target',
    visualProbeId: visualTarget.probeId
  };
  delete body.message;
  validateSyntheticVisualEditPayload(body);
  return body;
}

function validateSyntheticVisualEditPayload(_payload) { return true; }

async function ensureTsSessionToken(forceRefresh) {
  return new Promise((resolve, reject) => {
    try {
      if (!chrome.runtime || !chrome.runtime.id) {
        reject(new Error('Extension context invalidated'));
        return;
      }
      chrome.runtime.sendMessage({
        type: 'ts:getSessionToken',
        force: forceRefresh === true,
        source: 'content-send'
      }, (result) => {
        if (chrome.runtime.lastError) return reject(new Error(chrome.runtime.lastError.message));
        if (!result || !result.ok || !result.token) {
          return reject(new Error((result && result.reason) || 'Falha ao obter sessão TS.'));
        }
        resolve(result.token);
      });
    } catch (err) {
      reject(err);
    }
  });
}

async function sendThroughEdgeFunction(payload) {
  try {
    console.log('[TS Edge Send] validate payload', {
      hasProjectId: !!payload.projectId,
      hasLovableBearer: !!payload.lovableBearer,
      hasMessage: !!payload.message,
      filesCount: (payload.files && payload.files.length) || 0,
    });
  } catch(_) {}
  const doFetch = (sessionToken) => new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({
      action: 'proxyFetch',
      url: TS_EDGE_SEND_URL,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
        'X-TS-Session': sessionToken,
      },
      body: JSON.stringify(payload),
    }, (resp) => {
      if (chrome.runtime.lastError) return reject(new Error(chrome.runtime.lastError.message));
      if (!resp) return reject(new Error('Sem resposta do background'));
      try { console.log('[TS Edge] response', { ok: resp.ok, status: resp.status }); } catch(_) {}
      resolve(resp);
    });
  });
  let token = await ensureTsSessionToken(false);
  let resp = await doFetch(token);
  if (resp && (resp.status === 401 || (resp.data && (resp.data.error === 'invalid_session' || resp.data.error === 'session_expired')))) {
    token = await ensureTsSessionToken(true);
    resp = await doFetch(token);
  }
  return resp;
}


function bgFetch(url, options = {}) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({
      action: "proxyFetch",
      url,
      method: options.method || "POST",
      headers: options.headers || {},
      body: options.body || null,
    }, (resp) => {
      if (chrome.runtime.lastError) {
        console.error("[bgFetch] runtime error:", chrome.runtime.lastError.message);
        return reject(new Error(chrome.runtime.lastError.message));
      }
      if (!resp) {
        return reject(new Error("Sem resposta do background"));
      }
      if (resp.data && typeof resp.data === "object") {
        resolve(resp.data);
      } else if (!resp.ok) {
        reject(new Error("Fetch failed via background (status " + resp.status + ")"));
      } else {
        resolve(resp.data);
      }
    });
  });
}

function bgFetchRaw(url, options = {}) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({
      action: "proxyFetch",
      url,
      method: options.method || "POST",
      headers: options.headers || {},
      body: options.body || null,
    }, (resp) => {
      if (chrome.runtime.lastError) return reject(new Error(chrome.runtime.lastError.message));
      if (!resp) return reject(new Error("Sem resposta do background"));
      resolve(resp);
    });
  });
}

function lovableApiFetch(url, options = {}) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({
      action: "lovableApiFetch",
      url,
      method: options.method || "POST",
      headers: options.headers || {},
      body: options.body || null,
    }, (resp) => {
      if (chrome.runtime.lastError) return reject(new Error(chrome.runtime.lastError.message));
      if (!resp) return reject(new Error("Sem resposta do background"));
      resolve(resp);
    });
  });
}

(function injectHook(){
  try {
    if (document.getElementById("ts-lovable-security-scan-page-hook")) return;
    const s = document.createElement("script");
    s.id = "ts-lovable-security-scan-page-hook";
    s.src = chrome.runtime.getURL("pageHook.js");
    s.onload = () => s.remove();
    (document.documentElement || document.head || document.body).appendChild(s);
  } catch (e) {
    console.warn("[ContentScript] falha ao injetar pageHook", e);
  }
})();

function tsSendToLovablePageHook(type, payload, timeoutMs) {
  return new Promise((resolve) => {
    const requestId = (crypto && crypto.randomUUID) ? crypto.randomUUID() : String(Date.now()) + '-' + Math.random();
    const expectedType = type === 'SEND_CHAT_MESSAGE' ? 'SEND_CHAT_RESULT' : (type === 'LOVABLE_API_REQUEST' ? 'LOVABLE_API_RESULT' : 'SESSION_STATUS');
    let done = false;

    function finish(result) {
      if (done) return;
      done = true;
      clearTimeout(timer);
      window.removeEventListener('message', onMessage);
      resolve(result);
    }

    function onMessage(event) {
      if (event.source !== window) return;
      const data = event.data;
      if (!data || data.source !== 'TS_LOVABLE_PAGE_HOOK') return;
      if (data.type !== expectedType || data.requestId !== requestId) return;
      finish(data);
    }

    const timer = setTimeout(() => finish({ ok: false, status: 0, error: 'PAGE_HOOK_TIMEOUT', requestId }), Math.max(1000, timeoutMs || 30000));
    window.addEventListener('message', onMessage);
    try {
      window.postMessage(Object.assign({
        source: 'TS_LOVABLE_EXTENSION',
        type,
        requestId
      }, payload || {}), '*');
    } catch (error) {
      finish({ ok: false, status: 0, error: (error && error.message) || String(error), requestId });
    }
  });
}
try { window.tsSendToLovablePageHook = tsSendToLovablePageHook; } catch (_) {}

(function tsLovableChatBridge(){
  try {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (!message || message.type !== 'SEND_LOVABLE_CHAT') return;
      tsSendToLovablePageHook('SEND_CHAT_MESSAGE', {
        projectId: message.projectId,
        userText: message.userText,
        payload: message.payload
      }, message.timeoutMs || 45000).then((result) => {
        if (result && result.error === 'LOVABLE_SESSION_NOT_CAPTURED') {
          result.message = 'Sessão do Lovable ainda não capturada. Recarregue a aba do Lovable e tente novamente.';
        }
        sendResponse(result);
      });
      return true;
    });
  } catch (e) {
    console.warn('[ContentScript] tsLovableChatBridge falhou', e);
  }
})();

// --- GCS upload bridge: iframe (chrome-extension origin) -> pageHook (lovable.dev origin) ---
(function gcsUploadBridge(){
  try {
    window.addEventListener("message", (event) => {
      const d = event.data;
      if (!d || typeof d !== "object") return;
      // From iframe -> forward to page MAIN world
      if (d.type === "TS_PAGE_UPLOAD_TO_GCS" && event.source !== window) {
        try {
          window.postMessage({
            type: "TS_PAGE_UPLOAD_TO_GCS",
            requestId: d.requestId,
            uploadUrl: d.uploadUrl,
            contentType: d.contentType,
            arrayBuffer: d.arrayBuffer,
            extraHeaders: d.extraHeaders || null
          }, "*");
        } catch (e) { console.warn("[TS Upload] forward to page failed", e); }
        return;
      }
      // From pageHook -> relay back to iframe
      if (d.type === "TS_PAGE_UPLOAD_TO_GCS_RESULT" && event.source === window) {
        try {
          const iframe = document.getElementById("ts-community-overlay-iframe");
          if (iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage(d, "*");
          }
        } catch (e) { console.warn("[TS Upload] relay to iframe failed", e); }
      }
    });
  } catch (e) { console.warn("[ContentScript] gcsUploadBridge falhou", e); }
})();

// --- Auto Approve bridge: forward extension settings to pageHook ---
(function autoApproveBridge(){
  function push(enabled, reviewSubmit){
    try { window.postMessage({ type: "lovableAutoApproveConfig", enabled: !!enabled, reviewSubmit: !!reviewSubmit }, "*"); } catch(e){}
  }
  function pull(){
    chrome.storage.local.get(["sp_auto_approve","sp_auto_review_submit"], r => push((r && typeof r.sp_auto_approve !== 'undefined') ? r.sp_auto_approve : true, (r && typeof r.sp_auto_review_submit !== 'undefined') ? r.sp_auto_review_submit : true));
  }
  try {
    pull();
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === "local" && (changes.sp_auto_approve || changes.sp_auto_review_submit)) pull();
    });
    let pushes = 0;
    const iv = setInterval(() => {
      pushes++;
      pull();
      if (pushes >= 5) clearInterval(iv);
    }, 800);
  } catch(e) { console.warn("[ContentScript] autoApproveBridge falhou", e); }
})();

// --- Auto Approve: detect blue action button and send its text via sendPrompt ---
(function autoApproveActionButton(){
  let enabled = true;
  const processedActionButtons = new WeakSet();
  const VALID_LABELS = ["approve", "submit", "continue", "confirm", "apply"];

  function refresh(){
    try {
      chrome.storage.local.get(["sp_auto_approve"], r => {
        enabled = (r && typeof r.sp_auto_approve !== 'undefined') ? !!r.sp_auto_approve : true;
      });
    } catch(e){}
  }
  refresh();
  try {
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === "local" && changes.sp_auto_approve) {
        enabled = (typeof changes.sp_auto_approve.newValue !== 'undefined')
          ? !!changes.sp_auto_approve.newValue
          : true;
      }
    });
  } catch(e){}

  function findLovableActionButton(){
    const buttons = Array.from(document.querySelectorAll("button"));
    return buttons.find((button) => {
      const text = (button.innerText || button.textContent || "").trim();
      if (!text) return false;
      const normalized = text.toLowerCase();
      if (!VALID_LABELS.includes(normalized)) return false;
      const isVisible = button.offsetParent !== null && !button.disabled
        && button.getAttribute("aria-disabled") !== "true";
      if (!isVisible) return false;
      let isBlueButton = false;
      try {
        const cls = (button.className && button.className.toString && button.className.toString()) || "";
        if (cls.toLowerCase().includes("blue")) isBlueButton = true;
        if (!isBlueButton) {
          const bg = window.getComputedStyle(button).backgroundColor || "";
          if (bg.includes("rgb")) isBlueButton = true;
        }
      } catch(e){}
      return isBlueButton;
    });
  }

  async function handleDetectedLovableActionButton(){
    if (!enabled) return false;
    const button = findLovableActionButton();
    if (!button) return false;
    if (processedActionButtons.has(button)) return false;
    if (button.dataset.tsAutoPromptSent === "true") return false;
    const text = (button.innerText || button.textContent || "").trim();
    if (!text) return false;
    processedActionButtons.add(button);
    button.dataset.tsAutoPromptSent = "true";
    console.info("[TS Extension] Auto action detected. Sending button text as prompt:", text);
    try {
      await sendPromptNativeViaBackground(text, false, []);
    } catch(err) {
      console.error("[TS Extension] Auto action sendPrompt failed:", err);
    }
    return true;
  }

  let scheduled = false;
  function schedule(){
    if (scheduled) return;
    scheduled = true;
    setTimeout(() => { scheduled = false; handleDetectedLovableActionButton(); }, 500);
  }

  function start(){
    if (!document.body) { setTimeout(start, 200); return; }
    const obs = new MutationObserver(() => { if (enabled) schedule(); });
    obs.observe(document.body, { childList: true, subtree: true });
    console.info("[TS Extension] Auto action observer started");
    schedule();
  }
  start();
})();


let qlSessionId = null;
let qlHeartbeatInterval = null;
let qlUserName = null;
let qlExpiresAt = null;
let qlActivatedAt = null;
let qLicenseStatus = null;
let qlOnlineCount = 0;
let qlMinimized = false;
let qlHeight = 520;
let qlSpeechRecognition = null;
let qlIsRecording = false;
let qlDeviceId = null;
let qlShieldActive = false;
let qlActiveTab = 'prompt';
let qlChatHistory = [];
let qLicenseKey = null;
let qLicenseType = null;
let qLicenseLifetime = false;
const QL_HISTORY_KEY = 'ql_chat_history';
const QL_MAX_HISTORY = 200;

// The popup launcher/badge must only exist after a valid license.
// While the floating login modal is open, keep all active UI artifacts hidden.
window.__tsLicenseReadyForPopup = false;
function tsSetLicenseReadyState(isReady){
  const ready = !!isReady;
  try { window.__tsLicenseReadyForPopup = ready; } catch(_) {}
  try { document.body && document.body.classList.toggle('ts-license-ready', ready); } catch(_) {}
  if(!ready){
    try { document.body && document.body.classList.remove('ts-native-chat-active'); } catch(_) {}
    try { document.querySelectorAll('.ts-native-composer-wrap').forEach((el) => el.classList.remove('ts-native-composer-wrap')); } catch(_) {}
    try { document.getElementById('ts-floating-launcher')?.remove(); } catch(_) {}
    try { document.getElementById('ts-floating-action-menu')?.remove(); } catch(_) {}
    try { document.getElementById('ts-floating-submenu')?.remove(); } catch(_) {}
    try { document.getElementById('ts-native-badge')?.remove(); } catch(_) {}
  } else {
    try { window.dispatchEvent(new CustomEvent('TS_LICENSE_READY')); } catch(_) {}
  }
}

function getDeviceId(){
  return getHardwareFingerprint();
}
function isTrialLicense() {
  return (
    qLicenseType === 'trial' ||
    (qLicenseKey && qLicenseKey.startsWith('TRIAL-')) ||
    qLicenseStatus === 'trial'
  );
}

function isLifetimeLicense() {
  return (
    qLicenseLifetime === true ||
    qLicenseLifetime === "true" ||
    (!qlExpiresAt && qLicenseStatus === "active" && qLicenseType !== "trial")
  );
}

function tsGetLoginLogoUrl(){
  try {
    const cfg = (typeof window !== "undefined" && (window.TS_ACTIVE_BRANDING || window.TS_BRANDING_CONFIG)) || null;
    const url = cfg && (cfg.logoUrl || cfg.logo_url || cfg.iconUrl || cfg.icon_url);
    if (url) return String(url);
  } catch(_) {}
  try { return chrome.runtime.getURL("icons/icon128.png"); } catch(_) { return ""; }
}

function tsLoginPrepareGateHref(link){
  let href = String((link && link.url) || '');
  if (!href) return '';
  try {
    const brand = ((window.tsBrandName && window.tsBrandName()) || 'TS Community');
    if (link && link.id === 'support' && /^https:\/\/wa\.me\//i.test(href)) {
      const msg = 'Olá! Preciso de suporte para a extensão ' + brand + '.';
      href += (href.indexOf('?') === -1 ? '?' : '&') + 'text=' + encodeURIComponent(msg);
    } else if (link && link.id === 'purchase' && /^https:\/\/wa\.me\//i.test(href)) {
      const msg2 = 'Olá! Quero comprar uma chave de licença para a extensão.';
      href += (href.indexOf('?') === -1 ? '?' : '&') + 'text=' + encodeURIComponent(msg2);
    }
  } catch(_) {}
  return href;
}

function tsRenderLoginMiniActions(){
  let links = [];
  try { links = (window.getBrandGateLinks && window.getBrandGateLinks()) || []; } catch(_) { links = []; }
  links = (Array.isArray(links) ? links : []).filter((l) => l && l.url).slice(0, 3);
  if (!links.length) return '';
  const defaults = {
    purchase: { title: 'Adquirir licença', fallbackIcon: 'key' },
    community: { title: 'Comunidade', fallbackIcon: 'users' },
    support: { title: 'Suporte', fallbackIcon: 'headphones' },
    custom: { title: 'Abrir link', fallbackIcon: 'external' }
  };
  const fallbackSvg = {
    key: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.78 7.78 5.5 5.5 0 0 1 7.78-7.78Zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>',
    users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    headphones: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z"/><path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>',
    external: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>'
  };
  return '<div class="ts-login-mini-actions" aria-label="Links rápidos">' + links.map((link) => {
    const d = defaults[link.id] || defaults.custom;
    const title = link.title || d.title;
    const icon = link.icon || fallbackSvg[d.fallbackIcon] || fallbackSvg.external;
    const href = tsLoginPrepareGateHref(link);
    return '<a class="ts-login-circle-action" href="' + escapeHtml(href) + '" target="_blank" rel="noopener noreferrer" title="' + escapeHtml(title) + '" aria-label="' + escapeHtml(title) + '">' + icon + '</a>';
  }).join('') + '</div>';
}

function tsInjectFloatingLoginStyles(){
  if (document.getElementById("ts-floating-login-style")) return;
  const css = `
    #ql-floating.ts-login-modal{position:fixed!important;inset:0!important;left:0!important;top:0!important;width:100vw!important;height:100vh!important;min-height:100vh!important;z-index:2147483646!important;display:flex!important;align-items:center!important;justify-content:center!important;padding:20px!important;background:rgba(3,3,7,.72)!important;border:0!important;border-radius:0!important;box-shadow:none!important;backdrop-filter:blur(14px)!important;-webkit-backdrop-filter:blur(14px)!important;overflow:hidden!important;font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif!important;}
    #ql-floating.ts-login-modal:hover{box-shadow:none!important}
    #ql-floating.ts-login-modal #ql-body{width:min(92vw,360px)!important;height:auto!important;min-height:0!important;max-height:calc(100vh - 40px)!important;flex:0 0 auto!important;background:linear-gradient(180deg,rgba(22,22,26,.98),rgba(12,12,15,.98))!important;border:1px solid rgba(255,255,255,.10)!important;border-radius:20px!important;box-shadow:0 28px 90px rgba(0,0,0,.58),0 0 0 1px rgba(var(--ts-brand-primary-rgb,139,92,246),.18),0 0 45px rgba(var(--ts-brand-primary-rgb,139,92,246),.16)!important;padding:0!important;overflow:hidden!important;color:#f5f5f7!important}
    #ql-floating.ts-login-modal .ts-login-card{padding:22px 22px 18px!important;position:relative!important;text-align:center!important}
    #ql-floating.ts-login-modal .ts-login-close{position:absolute!important;right:14px!important;top:14px!important;width:30px!important;height:30px!important;border-radius:9px!important;border:1px solid rgba(255,255,255,.10)!important;background:rgba(255,255,255,.04)!important;color:rgba(255,255,255,.66)!important;cursor:pointer!important;font-size:18px!important;line-height:1!important}
    #ql-floating.ts-login-modal .ts-login-close:hover{background:rgba(255,255,255,.08)!important;color:#fff!important}
    #ql-floating.ts-login-modal .ts-login-logo{display:block!important;width:66px!important;height:66px!important;border-radius:0!important;object-fit:contain!important;background:transparent!important;padding:0!important;box-shadow:none!important;filter:drop-shadow(0 7px 15px rgba(var(--ts-brand-primary-rgb,255,126,0),.42))!important;margin:0 auto 12px!important;animation:tsLoginFlame 2.4s ease-in-out infinite!important;transform-origin:50% 88%!important}
    @keyframes tsLoginFlame{0%,100%{transform:translateY(0) scale(1) rotate(-1deg);filter:drop-shadow(0 7px 14px rgba(var(--ts-brand-primary-rgb,255,126,0),.34))}35%{transform:translateY(-2px) scale(1.035,.98) rotate(1.2deg);filter:drop-shadow(0 9px 19px rgba(var(--ts-brand-primary-rgb,255,126,0),.55))}68%{transform:translateY(1px) scale(.985,1.035) rotate(-.7deg);filter:drop-shadow(0 6px 12px rgba(var(--ts-brand-primary-rgb,255,126,0),.43))}}
    #ql-floating.ts-login-modal .ts-login-title{margin:0 0 16px!important;font-size:19px!important;font-weight:800!important;letter-spacing:-.04em!important;color:#fff!important;text-align:center!important}
    #ql-floating.ts-login-modal .ts-login-desc{display:none!important}
    #ql-floating.ts-login-modal .ts-login-label{display:block!important;margin:0 0 8px!important;font-size:10px!important;letter-spacing:.22em!important;text-transform:uppercase!important;color:rgba(255,255,255,.48)!important;font-weight:800!important;text-align:left!important}
    #ql-floating.ts-login-modal #ql-license-input{width:100%!important;height:44px!important;border-radius:12px!important;border:1px solid rgba(var(--ts-brand-primary-rgb,139,92,246),.40)!important;background:rgba(8,8,12,.74)!important;color:#fff!important;outline:none!important;padding:0 14px!important;font-size:13px!important;letter-spacing:.02em!important;box-shadow:0 0 0 1px rgba(0,0,0,.25) inset!important}
    #ql-floating.ts-login-modal #ql-license-input:focus{border-color:rgba(var(--ts-brand-primary-rgb,139,92,246),.88)!important;box-shadow:0 0 0 3px rgba(var(--ts-brand-primary-rgb,139,92,246),.18)!important}
    #ql-floating.ts-login-modal .ts-login-save{display:flex!important;align-items:center!important;justify-content:flex-start!important;gap:8px!important;margin:10px 0 14px!important;color:rgba(255,255,255,.70)!important;font-size:12px!important;user-select:none!important;text-align:left!important}
    #ql-floating.ts-login-modal .ts-login-save input{accent-color:var(--ts-brand-primary,#8b5cf6)!important;width:15px!important;height:15px!important}
    #ql-floating.ts-login-modal #ql-validate-btn{width:100%!important;height:44px!important;border:0!important;border-radius:12px!important;background:var(--ts-brand-gradient,linear-gradient(135deg,#8b5cf6,#7c3aed))!important;color:#fff!important;font-size:13px!important;font-weight:800!important;cursor:pointer!important;box-shadow:0 12px 26px rgba(var(--ts-brand-primary-rgb,139,92,246),.30)!important;transition:transform .16s ease,box-shadow .16s ease!important}
    #ql-floating.ts-login-modal #ql-validate-btn:hover{transform:translateY(-1px)!important;box-shadow:0 18px 40px rgba(var(--ts-brand-primary-rgb,139,92,246),.42)!important}
    #ql-floating.ts-login-modal #ql-license-log{min-height:16px!important;margin-top:10px!important;font-size:11px!important;font-weight:700!important;text-align:center!important}
    #ql-floating.ts-login-modal .ql-log-success{color:#34d399!important}.ql-log-error{color:#f87171!important}.ql-log-info{color:var(--ts-brand-primary,#8b5cf6)!important}
    #ql-floating.ts-login-modal .ts-login-mini-actions{display:flex!important;align-items:center!important;justify-content:center!important;gap:12px!important;margin:13px 0 0!important}
    #ql-floating.ts-login-modal .ts-login-circle-action{width:36px!important;height:36px!important;border-radius:999px!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;color:rgba(255,255,255,.72)!important;background:rgba(255,255,255,.055)!important;border:1px solid rgba(255,255,255,.10)!important;text-decoration:none!important;transition:transform .16s ease,background .16s ease,border-color .16s ease,color .16s ease,box-shadow .16s ease!important}
    #ql-floating.ts-login-modal .ts-login-circle-action svg{width:16px!important;height:16px!important;display:block!important}
    #ql-floating.ts-login-modal .ts-login-circle-action:hover{transform:translateY(-1px)!important;color:#fff!important;background:rgba(var(--ts-brand-primary-rgb,139,92,246),.16)!important;border-color:rgba(var(--ts-brand-primary-rgb,139,92,246),.42)!important;box-shadow:0 8px 22px rgba(var(--ts-brand-primary-rgb,139,92,246),.20)!important}
    #ql-floating.ts-login-modal .ts-login-footer{margin-top:12px!important;text-align:center!important;color:rgba(255,255,255,.36)!important;font-size:10px!important}
  `;
  const style = document.createElement("style");
  style.id = "ts-floating-login-style";
  style.textContent = css;
  (document.head || document.documentElement).appendChild(style);
}

function tsActivatePopupPrincipal(){
  try { chrome.storage.local.set({ tsExtensionLayoutMode: "popup", sidebarCollapsed: true }); } catch(_) {}
  try {
    if (typeof window !== "undefined") {
      window.__tsExtensionLayoutMode = "popup";
      document.body && document.body.classList.add("ts-native-chat-active");
    }
  } catch(_) {}
}



function requestCentralHeartbeat(source, force){
  return new Promise((resolve, reject) => {
    try {
      if (!chrome.runtime || !chrome.runtime.id) {
        reject(new Error("Extension context invalidated"));
        return;
      }
      chrome.runtime.sendMessage({
        type: "ts:heartbeatNow",
        source: source || "content",
        force: force === true
      }, (result) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
          return;
        }
        if (result && result.data) {
          resolve(result.data);
          return;
        }
        if (result && result.ok) {
          resolve({ valid: true });
          return;
        }
        reject(new Error((result && result.reason) || "Heartbeat failed"));
      });
    } catch (err) {
      reject(err);
    }
  });
}


try {
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "local" || !changes.ql_license_valid) return;
    const becameInvalid = changes.ql_license_valid.oldValue === true && changes.ql_license_valid.newValue !== true;
    if (!becameInvalid) return;
    try { tsSetLicenseReadyState(false); } catch (_) {}
    try {
      setTimeout(() => {
        if (!document.getElementById("ql-floating")) _buildFloatingUI();
      }, 50);
    } catch (_) {}
  });
} catch (_) {}

function _buildFloatingUI(){
  if(document.getElementById("ql-floating")) return;

  const box = document.createElement("div");
  box.id = "ql-floating";
  const initialLeft = Math.max(10, window.innerWidth - 400);
  box.style.left = initialLeft + "px";
  box.style.top = "80px";

  try { if (window.TSUIConfig) window.TSUIConfig.loadStored(); } catch(_){}
  try { if (window.TSUIShell) window.TSUIShell.loadStored(); } catch(_){}
  chrome.storage.local.get(["ql_license_valid","ql_license_key","ql_minimized","ql_height","ql_dark_mode","ql_user_name","ql_expires_at","ql_activated_at","ql_license_status","ql_license_type","ql_license_lifetime","ql_session_id"], async (res) => {
    qlMinimized = res.ql_minimized || false;
    qlHeight = res.ql_height || 520;
    qlDeviceId = await getDeviceId();

    if(res.ql_dark_mode === false) {
      box.classList.add("ql-light");
    }
    if(qlMinimized) {
      box.classList.add("ql-minimized");
    }

    document.body.appendChild(box);

    if(res.ql_license_valid){
      tsSetLicenseReadyState(true);
      qlUserName = res.ql_user_name || null;
      qlExpiresAt = res.ql_expires_at || null;
      qlActivatedAt = res.ql_activated_at || null;
      qLicenseStatus = res.ql_license_status || null;
      qLicenseKey = res.ql_license_key || null;
      qLicenseType = res.ql_license_type || 'paid';
      qLicenseLifetime = res.ql_license_lifetime || false;
      qlSessionId = res.ql_session_id || null;
      // Usuário já licenciado: o popup nativo passa a ser a experiência principal.
      tsActivatePopupPrincipal();
      try { box.remove(); } catch(_) {}

      if(res.ql_license_key) {
        requestCentralHeartbeat("content-init").then(data => {
          if(data.valid) {
            qlUserName = data.user_name || qlUserName;
            qlExpiresAt = data.expires_at || qlExpiresAt;
            qlActivatedAt = data.activated_at || qlActivatedAt;
            qLicenseStatus = data.status || qLicenseStatus;
            qLicenseType = data.license_type || 'paid';
            qLicenseLifetime = data.lifetime || false;
            qlSessionId = data.session_id || qlSessionId;
            chrome.storage.local.set({ ql_user_name: qlUserName, ql_expires_at: qlExpiresAt, ql_activated_at: qlActivatedAt, ql_license_status: qLicenseStatus, ql_license_type: qLicenseType, ql_license_lifetime: qLicenseLifetime, ql_session_id: qlSessionId });
            try { if (data.ui_config && window.TSUIConfig) window.TSUIConfig.apply(data.ui_config); } catch(_){}
            try { chrome.storage.local.get(['ts_session_token'], (s) => { var t = data.ts_session_token || (s && s.ts_session_token); if (t && window.TSUIShell) window.TSUIShell.fetchAndApply(t); }); } catch(_){}
            const nameEl = document.querySelector(".ql-profile-name");
            if(nameEl) nameEl.textContent = qlUserName || "User";
            updateTrialCountdown();
          } else if(data.reason === "device_conflict") {
            chrome.storage.local.remove(["ql_license_valid","ql_license_key","ql_session_id","ql_user_name","ql_expires_at","ql_activated_at","ql_license_status"]);
            const b = document.getElementById("ql-floating");
            tsSetLicenseReadyState(false);
            if(b) showLicenseGate(b);
            setTimeout(() => showCustomAlert("Acesso Negado", data.message), 500);
          } else {
            chrome.storage.local.remove(["ql_license_valid","ql_license_key","ql_session_id","ql_user_name","ql_expires_at","ql_activated_at","ql_license_status"]);
            const b = document.getElementById("ql-floating");
            tsSetLicenseReadyState(false);
            if(b) showLicenseGate(b);
          }
        }).catch(() => {});
      }
    } else {
      showLicenseGate(box);
    }

    setupDrag();
    setupResize();
  });
}

function showLicenseGate(box){
  tsSetLicenseReadyState(false);
  tsInjectFloatingLoginStyles();
  box.classList.add("ts-login-modal");
  box.classList.remove("ql-minimized");
  box.style.height = "";
  box.style.left = "0px";
  box.style.top = "0px";
  box.innerHTML = templateLicenseGate(false);

  setTimeout(() => {
    const btn = document.getElementById("ql-validate-btn");
    if(btn) btn.addEventListener("click", validateLicense);
    const buyBtn = document.getElementById("ql-buy-license-btn");
    if(buyBtn) buyBtn.addEventListener("click", () => showPaymentUI(box));
    const closeBtn = document.getElementById("ql-login-close");
    if(closeBtn) closeBtn.addEventListener("click", () => { try { box.remove(); } catch(_) {} });
    // Login modal não usa arraste/minimize.
    // setupMinimize();
  }, 50);
}

async function validateLicense(){
  const input = document.getElementById("ql-license-input");
  const log = document.getElementById("ql-license-log");
  const key = input ? input.value.trim() : "";

  if(!key){
    if(log){ log.className = "ql-log-error"; log.innerText = "⚠ Insira uma chave"; }
    return;
  }

  if(log){ log.className = "ql-log-info"; log.innerText = "⏳ Validando..."; }

  try{
    if(!qlDeviceId) qlDeviceId = await getDeviceId();

    const data = await bgFetch(ACTIVATE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({
        license_key: key,
        code: key,
        device_id: qlDeviceId,
        machine_id: qlDeviceId,
        device_name: (navigator.platform || "Chrome") + " / " + (navigator.userAgent || "browser")
      })
    });

    if(data.valid){
      qlSessionId = data.session_id;
      qlUserName = data.user_name;
      qlExpiresAt = data.expires_at;
      qlActivatedAt = data.activated_at;
      qLicenseStatus = data.status;
      qLicenseType = data.license_type || 'paid';
      qLicenseLifetime = data.lifetime || false;
      qLicenseKey = key;
      qlOnlineCount = data.online_count || 0;

      chrome.storage.local.set({
  ql_license_valid: true,
  ql_license_key: key,
  ql_session_id: data.session_id,
  ql_user_name: data.user_name || null,
  ql_expires_at: data.expires_at || null,
  ql_activated_at: data.activated_at || null,
  ql_license_status: data.status || null,
  ql_license_type: qLicenseType,
  ql_license_lifetime: qLicenseLifetime,
  ts_session_token: data.ts_session_token || null,
  ts_session_expires_at: data.ts_session_expires_at || null,
  ts_last_heartbeat_at: Date.now(),
  ts_license_state: "valid"
}, () => {
        try { if (data.ui_config && window.TSUIConfig) window.TSUIConfig.apply(data.ui_config); } catch(_){}
        try { if (data.ts_session_token && window.TSUIShell) window.TSUIShell.fetchAndApply(data.ts_session_token); } catch(_){}
        if(log){ log.className = "ql-log-success"; log.innerText = "✓ " + data.message; }
        setTimeout(() => {
          tsSetLicenseReadyState(true);
          tsActivatePopupPrincipal();
          const box = document.getElementById("ql-floating");
          if(box) {
            box.style.transition = "opacity .22s ease, transform .22s ease";
            box.style.opacity = "0";
            box.style.transform = "scale(.96)";
            setTimeout(() => { try { box.remove(); } catch(_) {} }, 240);
          }
          startHeartbeat(key);
        }, 500);
      });
    } else {
      if(log){ log.className = "ql-log-error"; log.innerText = "✗ " + data.message; }
    }
  }catch(err){
    if(log){ log.className = "ql-log-error"; log.innerText = "✗ Erro de conexão"; }
  }
}

function showMainUI(box){
  const greeting = qlUserName || "User";
  const statusBadge = qLicenseStatus === "trial" ? '<span class="ql-status-badge ql-badge-test">TEST</span>' : '<span class="ql-status-badge ql-badge-pro">PRO</span>';

  box.innerHTML = templateMainUI(greeting, statusBadge, qlMinimized);
  box.style.height = qlHeight + "px";

  setTimeout(() => {
    updateSyncStatus();
    setupSend();
    setupStorageWatch();
    setupMinimize();
    setupSuggestionChips();
    setupWatermarkButton();
    updateTrialCountdown();
    setupDrag();
    setupResize();
    setupDarkMode();
    setupOptimize();
    setupSpeech();
    setupNotifications();
    setupModoPlano();
    setupFileAttachment();
    setupShield();
    setupTabs();
    loadChatHistory();
    setupNativeChatButton();
    setupClipboardPaste();
    setupDownloadProject();
    setupCreateProject();
    setupPublishProject();
    checkForUpdatePopup();
    checkResellerRolePopup();

    chrome.storage.local.get(["ql_license_key", "ql_session_id"], (res) => {
      if(res.ql_license_key) {
        qlSessionId = res.ql_session_id || qlSessionId;
        startHeartbeat(res.ql_license_key);
      }
    });

    const logoutBtn = document.getElementById("ql-logout-btn");
    if(logoutBtn){
      logoutBtn.addEventListener("click", () => {
        if(qlHeartbeatInterval) clearInterval(qlHeartbeatInterval);
        chrome.storage.local.remove(["ql_license_valid","ql_license_key","ql_session_id","ql_user_name","ql_expires_at","ql_activated_at","ql_license_status"], () => {
          qlUserName = null; qlExpiresAt = null; qlActivatedAt = null; qLicenseStatus = null; qlSessionId = null;
          showLicenseGate(box);
        });
      });
    }
  }, 30);
}

function showCustomAlert(title, message){
  const alert = document.getElementById("ql-custom-alert");
  if(!alert) return;
  const titleEl = alert.querySelector(".ql-alert-title");
  const msgEl = alert.querySelector(".ql-alert-message");
  const okBtn = alert.querySelector(".ql-alert-ok-btn");
  if(titleEl) titleEl.textContent = title;
  if(msgEl) msgEl.textContent = message;
  alert.style.display = "flex";
  if(okBtn) {
    okBtn.onclick = () => { alert.style.display = "none"; };
  }
  setTimeout(() => { alert.style.display = "none"; }, 4000);
}

function setupOptimize(){
  const btn = document.getElementById("ql-optimize-btn");
  if(!btn) return;
  btn.title = "Otimizar com IA — Em breve";
  btn.addEventListener("click", (event) => {
    event?.preventDefault?.();
    event?.stopPropagation?.();
    const message = "🚧 Otimizar com IA estará disponível em breve.";
    if (typeof showCustomAlert === "function") showCustomAlert("Em breve", message);
    else console.warn("[TS] " + message);
  });
}


function setupSpeech(){
  const btn = document.getElementById("ql-speech-btn");
  if(!btn) return;
  
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if(!SpeechRecognition) {
    btn.title = "Speech não suportado neste navegador";
    btn.style.opacity = "0.4";
    btn.style.cursor = "not-allowed";
    return;
  }

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if(qlIsRecording && qlSpeechRecognition) {
      qlSpeechRecognition.stop();
      return;
    }

    try {
      qlSpeechRecognition = new SpeechRecognition();
      qlSpeechRecognition.lang = "pt-BR";
      qlSpeechRecognition.continuous = true;
      qlSpeechRecognition.interimResults = true;
      qlSpeechRecognition.maxAlternatives = 1;

      let finalTranscript = "";
      const textarea = document.getElementById("ql-msg");

      qlSpeechRecognition.onstart = () => {
        qlIsRecording = true;
        btn.classList.add("ql-recording");
        finalTranscript = textarea ? textarea.value : "";
        
      };

      qlSpeechRecognition.onresult = (event) => {
        let interim = "";
        for(let i = event.resultIndex; i < event.results.length; i++){
          const transcript = event.results[i][0].transcript;
          if(event.results[i].isFinal){
            finalTranscript += transcript + " ";
          } else {
            interim += transcript;
          }
        }
        if(textarea) textarea.value = finalTranscript + interim;
      };

      qlSpeechRecognition.onerror = (event) => {
        console.warn("[QL Speech] Erro:", event.error);
        qlIsRecording = false;
        btn.classList.remove("ql-recording");
        
        if(event.error === "not-allowed") {
          showCustomAlert("Permissão Negada", "Permita o acesso ao microfone nas configurações do navegador.");
        } else if(event.error === "no-speech") {
          showCustomAlert("Sem Áudio", "Nenhuma fala detectada. Tente novamente.");
        } else if(event.error !== "aborted") {
          showCustomAlert("Erro de Voz", "Erro: " + event.error);
        }
      };

      qlSpeechRecognition.onend = () => {
        qlIsRecording = false;
        btn.classList.remove("ql-recording");
        if(textarea) textarea.value = finalTranscript.trim();
        
      };

      qlSpeechRecognition.start();
    } catch(err) {
      console.error("[QL Speech] Falha ao iniciar:", err);
      qlIsRecording = false;
      btn.classList.remove("ql-recording");
      showCustomAlert("Erro", "Não foi possível iniciar o reconhecimento de voz.");
    }
  });
}

function setupNotifications(){
  const bellBtn = document.querySelector(".ql-notif-btn");
  const panel = document.getElementById("ql-notif-panel");
  const closeBtn = document.getElementById("ql-notif-close");
  if(!bellBtn || !panel) return;

  bellBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = panel.style.display !== "none";
    panel.style.display = isOpen ? "none" : "block";
    if(!isOpen) loadNotifications();
  });

  if(closeBtn) {
    closeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      panel.style.display = "none";
    });
  }

  checkUnreadNotifications();
}

async function loadNotifications(){
  const list = document.getElementById("ql-notif-list");
  if(!list) return;
  list.innerHTML = '<p class="ql-notif-empty">Carregando...</p>';

  try {
    const data = await bgFetch(NOTIFICATIONS_URL, {
      method: "GET",
      headers: { "apikey": SUPABASE_ANON_KEY, "Authorization": "Bearer " + SUPABASE_ANON_KEY }
    });
    
    if(!data || data.length === 0){
      list.innerHTML = '<p class="ql-notif-empty">Nenhuma notificação.</p>';
      return;
    }

    const ids = data.map(n => n.id);
    chrome.storage.local.set({ ql_read_notifs: ids });
    const badge = document.querySelector(".ql-notif-badge");
    if(badge) badge.style.display = "none";

    list.innerHTML = data.map(n => {
      const date = new Date(n.created_at).toLocaleDateString("pt-BR");
      const safeLink = sanitizeUrl(n.link);
      const linkHtml = safeLink ? '<a href="' + escapeHtml(safeLink) + '" target="_blank" rel="noopener noreferrer" class="ql-notif-link">Abrir link →</a>' : '';
      return '<div class="ql-notif-item"><div class="ql-notif-item-title">' + escapeHtml(n.title) + '</div><div class="ql-notif-item-msg">' + escapeHtml(n.message) + '</div>' + linkHtml + '<div class="ql-notif-item-date">' + date + '</div></div>';
    }).join('');
  } catch(err) {
    list.innerHTML = '<p class="ql-notif-empty">Erro ao carregar.</p>';
  }
}

async function checkUnreadNotifications(){
  try {
    const data = await bgFetch(NOTIFICATIONS_URL, {
      method: "GET",
      headers: { "apikey": SUPABASE_ANON_KEY, "Authorization": "Bearer " + SUPABASE_ANON_KEY }
    });
    if(!data || data.length === 0) return;

    chrome.storage.local.get(["ql_read_notifs"], (res) => {
      const readIds = res.ql_read_notifs || [];
      const unread = data.filter(n => !readIds.includes(n.id)).length;
      const badge = document.querySelector(".ql-notif-badge");
      if(badge) {
        if(unread > 0) {
          badge.textContent = unread;
          badge.style.display = "flex";
        } else {
          badge.style.display = "none";
        }
      }
    });
  } catch(e) {}
}

function setupSuggestionChips(){
  const container = document.getElementById("ql-chips");
  if(!container) return;
  PROMPT_TEMPLATES.forEach((t) => {
    const chip = document.createElement("button");
    chip.className = "ql-chip";
    chip.innerHTML = t.icon + " " + t.label;
    chip.title = t.prompt;
    chip.addEventListener("click", () => {
      const textarea = document.getElementById("ql-msg");
      if(textarea) textarea.value = t.prompt;
    });
    container.appendChild(chip);
  });
}

function setupWatermarkButton(){
  var btn = document.getElementById("ql-remove-watermark");
  if(!btn) return;
  btn.addEventListener("click", async function(){
    var log = document.getElementById("ql-log");
    btn.disabled = true;
    btn.textContent = "\u23f3 Enviando...";

    var storageData = await new Promise(function(resolve){
      chrome.storage.local.get(["lovable_projectId","ql_license_key"], resolve);
    });
    var projectId = storageData.lovable_projectId || tsExtractLovableProjectIdFromUrl();
    var token = await tsResolveLovableToken({ forceRefresh: true });
    var licenseKey = storageData.ql_license_key || "";

    if(!projectId || !token){
      if(log){
        log.className = "ql-log-error";
        log.innerText = !projectId
          ? "\u26a0 Projeto n\u00e3o identificado."
          : "\u26a0 Token do Lovable n\u00e3o encontrado. Atualize a p\u00e1gina e tente novamente.";
      }
      btn.disabled = false;
      btn.textContent = "\ud83d\udeab Remover Marca de \u00c1gua";
      return;
    }

    try {
      var payload = {
        license_key: licenseKey,
        token_lovable: token,
        project_id: projectId
      };

      var result = await bgFetch(REMOVE_WATERMARK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "apikey": SUPABASE_ANON_KEY },
        body: JSON.stringify(payload)
      });

      if(result && result.success === false){
        throw new Error(result.error_display || result.message || "Erro no envio");
      }

      if(log){ log.className = "ql-log-success"; log.innerText = "\u2713 Marca de \u00e1gua removida com sucesso!"; }
    } catch(err) {
      if(log){ log.className = "ql-log-error"; log.innerText = "\u2717 " + (err.message || err); }
    } finally {
      btn.disabled = false;
      btn.textContent = "\ud83d\udeab Remover Marca de \u00c1gua";
    }
  });
}

function showPublishedUrlModal(url){
  var existing = document.getElementById("ql-publish-modal");
  if(existing) existing.remove();
  var overlay = document.createElement("div");
  overlay.id = "ql-publish-modal";
  overlay.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:2147483647;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(8px);font-family:Inter,sans-serif";
  overlay.innerHTML =
    '<div style="background:#111113;border:1px solid rgba(245,158,11,0.35);border-radius:16px;padding:24px;max-width:420px;width:90%;box-shadow:0 24px 80px -12px rgba(0,0,0,0.8)">' +
      '<div style="font-size:32px;text-align:center;margin-bottom:8px">\ud83c\udf89</div>' +
      '<h3 style="margin:0 0 8px;color:#fbbf24;font-size:18px;font-weight:700;text-align:center">Projeto Publicado!</h3>' +
      '<p style="margin:0 0 16px;color:#a1a1aa;font-size:13px;text-align:center">Seu projeto est\u00e1 ao vivo. Acesse pelo link abaixo:</p>' +
      '<div style="background:#0a0a0b;border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:10px;margin-bottom:16px;word-break:break-all"><a href="' + url + '" target="_blank" style="color:#60a5fa;text-decoration:none;font-size:13px">' + url + '</a></div>' +
      '<div style="display:flex;gap:8px">' +
        '<button id="ql-publish-copy" style="flex:1;padding:10px;border:1px solid rgba(255,255,255,0.12);background:transparent;color:#f4f4f5;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600">\ud83d\udccb Copiar</button>' +
        '<button id="ql-publish-open" style="flex:1;padding:10px;border:none;background:linear-gradient(135deg,#f59e0b,#d97706);color:#fff;border-radius:10px;cursor:pointer;font-size:13px;font-weight:700">\ud83d\udd17 Abrir</button>' +
      '</div>' +
      '<button id="ql-publish-close" style="width:100%;margin-top:8px;padding:8px;border:none;background:transparent;color:#71717a;cursor:pointer;font-size:12px">Fechar</button>' +
    '</div>';
  document.body.appendChild(overlay);
  document.getElementById("ql-publish-copy").addEventListener("click", function(){
    navigator.clipboard.writeText(url);
    this.textContent = "\u2713 Copiado!";
  });
  document.getElementById("ql-publish-open").addEventListener("click", function(){ window.open(url, "_blank"); });
  document.getElementById("ql-publish-close").addEventListener("click", function(){ overlay.remove(); });
  overlay.addEventListener("click", function(e){ if(e.target === overlay) overlay.remove(); });
}

function setupPublishProject(){
  var btn = document.getElementById("ql-publish-project");
  if(!btn) return;
  btn.addEventListener("click", async function(){
    var log = document.getElementById("ql-log");
    btn.disabled = true;
    btn.textContent = "\u23f3 Publicando...";

    var storageData = await new Promise(function(resolve){
      chrome.storage.local.get(["lovable_projectId","ql_license_key"], resolve);
    });
    var projectId = storageData.lovable_projectId || tsExtractLovableProjectIdFromUrl();
    var token = await tsResolveLovableToken({ forceRefresh: true });
    var licenseKey = storageData.ql_license_key || "";

    if(!projectId || !token){
      if(log){
        log.className = "ql-log-error";
        log.innerText = !projectId
          ? "\u26a0 Projeto n\u00e3o identificado."
          : "\u26a0 Token do Lovable n\u00e3o encontrado.";
      }
      btn.disabled = false;
      btn.textContent = "\ud83c\udf10 Publicar Projeto";
      return;
    }

    try {
      var result = await bgFetch(PUBLISH_PROJECT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "apikey": SUPABASE_ANON_KEY },
        body: JSON.stringify({ license_key: licenseKey, token_lovable: token, project_id: projectId })
      });

      if(result && result.success === false){
        throw new Error(result.error_display || result.message || "Erro ao publicar");
      }

      if(log){ log.className = "ql-log-success"; log.innerText = "\u2713 Projeto publicado!"; }
      if(result && result.url) showPublishedUrlModal(result.url);
    } catch(err) {
      if(log){ log.className = "ql-log-error"; log.innerText = "\u2717 " + (err.message || err); }
    } finally {
      btn.disabled = false;
      btn.textContent = "\ud83c\udf10 Publicar Projeto";
    }
  });
}

function updateTrialCountdown(){
  const el = document.getElementById("ql-trial-countdown");
  if(!el) return;

  if(window.qlCountdownInterval) {
    clearInterval(window.qlCountdownInterval);
    window.qlCountdownInterval = null;
  }

  if(isLifetimeLicense()){
    el.style.display = "block";
    el.innerHTML =
      '<div class="ql-lifetime-card">' +
        '<span class="ql-lifetime-icon">∞</span>' +
        '<span class="ql-lifetime-label">VITALÍCIO</span>' +
        '<span class="ql-lifetime-status">Acesso vitalício ativado</span>' +
      '</div>';
    return;
  }

  if(!qlExpiresAt){
  el.style.display = "block";
  el.innerHTML =
    '<div class="ql-lifetime-card">' +
      '<span class="ql-lifetime-icon">∞</span>' +
      '<span class="ql-lifetime-label">VITALÍCIO</span>' +
      '<span class="ql-lifetime-status">Acesso sem expiração</span>' +
    '</div>';
  return;
}

  el.style.display = "block";

  const createdAt = Date.now();
  const expiresMs = new Date(qlExpiresAt).getTime();
  const totalDuration = Math.max(expiresMs - createdAt, 3600000);

  function update(){
    const remaining = expiresMs - Date.now();

    if(remaining <= 0){
      el.innerHTML = '<span class="ql-countdown-expired">⏰ Licença expirada</span><div class="ql-trial-bar"><div class="ql-trial-bar-fill ql-bar-expired" style="width:0%"></div></div>';
      handleLicenseExpired();
      return;
    }

    const days = Math.floor(remaining / 86400000);
    const hrs = Math.floor((remaining % 86400000) / 3600000);
    const mins = Math.floor((remaining % 3600000) / 60000);
    const secs = Math.floor((remaining % 60000) / 1000);
    const pct = Math.max(0, Math.min(100, (remaining / totalDuration) * 100));

    let timeStr = '';
    if(days > 0) timeStr = days + 'd ' + hrs + 'h ' + mins + 'm';
    else if(hrs > 0) timeStr = hrs + 'h ' + mins + 'm ' + String(secs).padStart(2,'0') + 's';
    else timeStr = mins + ':' + String(secs).padStart(2,'0');

    const urgentClass = pct < 20 ? ' ql-bar-urgent' : '';
    const label = isTrialLicense() ? 'Teste expira em' : 'Plano expira em';

    el.innerHTML = '<div class="ql-countdown-row"><span class="ql-countdown-icon">⏳</span><span class="ql-countdown-label">' + label + '</span><span class="ql-countdown-time">' + timeStr + '</span></div><div class="ql-trial-bar"><div class="ql-trial-bar-fill' + urgentClass + '" style="width:' + pct + '%"></div></div>';
  }

  update();
  window.qlCountdownInterval = setInterval(update, 1000);
}

function setupMinimize(){
  const btn = document.getElementById("ql-minimize");
  if(!btn) return;
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const box = document.getElementById("ql-floating");
    if(!box) return;
    qlMinimized = !qlMinimized;
    box.classList.toggle("ql-minimized", qlMinimized);
    btn.textContent = qlMinimized ? "□" : "−";
    chrome.storage.local.set({ ql_minimized: qlMinimized });
  });
}

function setupDarkMode(){
  const moonBtn = document.querySelector('.ql-icon-btn[title="Tema"]');
  if(!moonBtn) return;
  moonBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const box = document.getElementById("ql-floating");
    if(!box) return;
    const isLight = box.classList.toggle("ql-light");
    chrome.storage.local.set({ ql_dark_mode: !isLight });
  });
}

function setupModoPlano(){ /* removido */ }

function setupShield(){
  const btn = document.getElementById("ql-shield-btn");
  if(!btn) return;

  chrome.storage.local.get(["ql_shield_active"], (res) => {
    if(res.ql_shield_active === true) {
      qlShieldActive = true;
      btn.classList.add("ql-shield-active");
      const label = document.getElementById("ql-shield-label");
      if(label) label.textContent = "Desativar Escudo";
      injectShieldOverlay();
    }
  });

  btn.addEventListener("click", () => {
    qlShieldActive = !qlShieldActive;
    chrome.storage.local.set({ ql_shield_active: qlShieldActive });

    const label = document.getElementById("ql-shield-label");
    if(qlShieldActive) {
      btn.classList.add("ql-shield-active");
      if(label) label.textContent = "Desativar Escudo";
      injectShieldOverlay();
      showCustomAlert("Escudo Ativado 🛡️", "O input do Lovable está bloqueado. Use a extensão para enviar prompts.");
    } else {
      btn.classList.remove("ql-shield-active");
      if(label) label.textContent = "Ativar Escudo";
      removeShieldOverlay();
      showCustomAlert("Escudo Desativado", "O input do Lovable está liberado novamente.");
    }
  });
}

function injectShieldOverlay(){
  if(document.getElementById("ql-shield-overlay")) return;

  const chatForm = document.querySelector('form#chat-input');
  if(!chatForm) {
    setTimeout(injectShieldOverlay, 1000);
    return;
  }

  const existingPos = getComputedStyle(chatForm).position;
  if(existingPos === 'static') {
    chatForm.style.position = 'relative';
  }

  const overlay = document.createElement('div');
  overlay.id = 'ql-shield-overlay';
  overlay.className = 'ql-shield-overlay';
  overlay.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>' +
    '</svg>' +
    '<span class="ql-shield-overlay-text" data-ts-brand="shield">\ud83d\udee1\ufe0f Protegido pelo ' + ((window.tsBrandName && window.tsBrandName()) || "TS Community") + '</span>' +
    '<span class="ql-shield-overlay-sub">Use a extens\u00e3o para enviar prompts</span>';

  overlay.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
  }, true);

  overlay.addEventListener('mousedown', (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
  }, true);

  overlay.addEventListener('keydown', (e) => {
    e.preventDefault();
    e.stopPropagation();
  }, true);

  chatForm.appendChild(overlay);

  const inputs = chatForm.querySelectorAll('input, button, textarea, [contenteditable]');
  inputs.forEach(el => {
    if(el.id !== 'ql-shield-overlay') {
      el.dataset.qlShieldDisabled = el.disabled || '';
      el.dataset.qlShieldTabindex = el.getAttribute('tabindex') || '';
      el.setAttribute('tabindex', '-1');
      if(el.tagName !== 'DIV') el.disabled = true;
      if(el.contentEditable === 'true') {
        el.contentEditable = 'false';
        el.dataset.qlShieldEditable = 'true';
      }
    }
  });
}

function removeShieldOverlay(){
  const overlay = document.getElementById('ql-shield-overlay');
  if(overlay) overlay.remove();

  const chatForm = document.querySelector('form#chat-input');
  if(!chatForm) return;

  const inputs = chatForm.querySelectorAll('[data-ql-shield-disabled]');
  inputs.forEach(el => {
    const wasDis = el.dataset.qlShieldDisabled;
    if(wasDis === 'true') el.disabled = true;
    else if(wasDis === '' || wasDis === 'false') el.disabled = false;
    delete el.dataset.qlShieldDisabled;

    const oldTab = el.dataset.qlShieldTabindex;
    if(oldTab) el.setAttribute('tabindex', oldTab);
    else el.removeAttribute('tabindex');
    delete el.dataset.qlShieldTabindex;

    if(el.dataset.qlShieldEditable === 'true') {
      el.contentEditable = 'true';
      delete el.dataset.qlShieldEditable;
    }
  });
}


function startHeartbeat(licenseKey){
  if(qlHeartbeatInterval) {
    clearInterval(qlHeartbeatInterval);
    qlHeartbeatInterval = null;
  }
  // Heartbeat is centralized in background.js. This request is throttled
  // and only ensures the shared alarm is active; it does not create a timer per tab.
  requestCentralHeartbeat("content-start").catch((err) => {
    console.warn("[QL] Central heartbeat unavailable", err && err.message);
  });
}

let qlExpiredHandled = false;

function handleLicenseExpired(){
  if(qlExpiredHandled) return;
  qlExpiredHandled = true;
  if(qlHeartbeatInterval) clearInterval(qlHeartbeatInterval);
  if(window.qlCountdownInterval) clearInterval(window.qlCountdownInterval);

  const overlay = document.createElement("div");
  overlay.className = "ql-sweetalert-overlay";
  overlay.innerHTML = templateExpiredOverlay();

  const box = document.getElementById("ql-floating");
  if(box) box.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add("ql-sweetalert-visible"));

  const renewBtn = overlay.querySelector("#ql-sweetalert-renew");
  if(renewBtn){
    renewBtn.addEventListener("click", () => {
      overlay.remove();
      if(box) showPaymentUI(box);
    });
  }

  const closeBtn = overlay.querySelector("#ql-sweetalert-close");
  if(closeBtn){
    closeBtn.addEventListener("click", () => {
      overlay.classList.remove("ql-sweetalert-visible");
      setTimeout(() => {
        overlay.remove();
        chrome.storage.local.remove(["ql_license_valid","ql_license_key","ql_session_id","ql_user_name","ql_expires_at","ql_license_status"], () => {
          if(box) showLicenseGate(box);
        });
      }, 300);
    });
  }
}

async function showPaymentUI(box, preselectedPkg){
  if(preselectedPkg){
    showCheckoutScreen(box, preselectedPkg);
    return;
  }

  box.innerHTML = templatePaymentUI(qlMinimized);

  setupMinimize();
  setupDrag();
  setupResize();

  const backBtn = document.getElementById("ql-pay-back");
  if(backBtn){
    backBtn.addEventListener("click", () => {
      chrome.storage.local.get(["ql_license_valid"], (res) => {
        if(res.ql_license_valid) showMainUI(box);
        else showLicenseGate(box);
      });
    });
  }

  try {
    const packages = await bgFetch(PACKAGES_URL, {
      method: "GET",
      headers: { "apikey": SUPABASE_ANON_KEY, "Authorization": "Bearer " + SUPABASE_ANON_KEY }
    });

    const list = document.getElementById("ql-packages-list");
    if(!list) return;
    if(!packages || !Array.isArray(packages) || packages.length === 0){
      list.innerHTML = '<div class="ql-pay-loading">Nenhum plano disponível.</div>';
      return;
    }

    list.innerHTML = packages.map(pkg => templatePackageCard(pkg)).join('');

    list.querySelectorAll(".ql-pkg-card").forEach(card => {
      card.querySelector(".ql-pkg-select-btn").addEventListener("click", () => {
        const pkg = {
          id: card.getAttribute("data-pkg-id"),
          name: card.getAttribute("data-pkg-name"),
          price: card.getAttribute("data-pkg-price")
        };
        showCheckoutScreen(box, pkg);
      });
    });

  } catch(err) {
    console.error("[QL] Package load error:", err);
    const list = document.getElementById("ql-packages-list");
    if(list) list.innerHTML = '<div class="ql-pay-loading">Erro ao carregar planos. Tente novamente.</div>';
  }
}

function showCheckoutScreen(box, pkg){
  box.innerHTML = templateCheckoutScreen(pkg, qlMinimized);

  setupMinimize();
  setupDrag();
  setupResize();

  let selectedMethod = "mpesa";

  const backBtn = document.getElementById("ql-checkout-back");
  if(backBtn){
    backBtn.addEventListener("click", () => showPaymentUI(box));
  }

  document.querySelectorAll(".ql-method-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".ql-method-btn").forEach(b => b.classList.remove("ql-method-active"));
      btn.classList.add("ql-method-active");
      selectedMethod = btn.getAttribute("data-method");
      const hint = document.getElementById("ql-phone-hint");
      if(hint) hint.textContent = selectedMethod === "mpesa" ? "M-Pesa: 84 ou 85" : "e-Mola: 86 ou 87";
    });
  });

  const confirmBtn = document.getElementById("ql-confirm-pay");
  if(confirmBtn){
    confirmBtn.addEventListener("click", async () => {
      const phone = (document.getElementById("ql-pay-phone") || {}).value ? (document.getElementById("ql-pay-phone") || {}).value.replace(/\D/g,"") : "";
      const log = document.getElementById("ql-pay-log");

      if(phone.length !== 9){
        if(log){ log.className = "ql-pay-log ql-pay-error"; log.textContent = "Número deve ter 9 dígitos."; }
        return;
      }
      const prefix = phone.substring(0,2);
      if(selectedMethod === "mpesa" && !["84","85"].includes(prefix)){
        if(log){ log.className = "ql-pay-log ql-pay-error"; log.textContent = "M-Pesa: use 84 ou 85."; }
        return;
      }
      if(selectedMethod === "emola" && !["86","87"].includes(prefix)){
        if(log){ log.className = "ql-pay-log ql-pay-error"; log.textContent = "e-Mola: use 86 ou 87."; }
        return;
      }

      confirmBtn.disabled = true;
      confirmBtn.textContent = "⏳ Processando...";
      if(log){ log.className = "ql-pay-log ql-pay-info"; log.textContent = "Enviando solicitação de pagamento..."; }

      try {
        const storageData = await new Promise(r => chrome.storage.local.get(["ql_license_key"], r));
        const licenseKey = storageData.ql_license_key || "";

        const result = await bgFetch(EXT_PAYMENT_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json", "apikey": SUPABASE_ANON_KEY },
          body: JSON.stringify({
            packageId: pkg.id,
            numero: phone,
            metodo: selectedMethod,
            license_key: licenseKey || undefined
          })
        });

        if(result && result.status === "sucesso"){
          const bodyEl = document.getElementById("ql-body");
          if(bodyEl){
            bodyEl.innerHTML = templatePaymentSuccess(result.license_key);

            const copyBtn = document.getElementById("ql-copy-key");
            if(copyBtn){
              copyBtn.addEventListener("click", () => {
                navigator.clipboard.writeText(result.license_key).then(() => {
                  copyBtn.textContent = "✅ Copiado!";
                  setTimeout(() => { copyBtn.textContent = "📋 Copiar Chave"; }, 2000);
                }).catch(() => {
                  const keyEl = document.getElementById("ql-new-key");
                  if(keyEl){ const r = document.createRange(); r.selectNodeContents(keyEl); window.getSelection().removeAllRanges(); window.getSelection().addRange(r); }
                  copyBtn.textContent = "Seleccionado — Ctrl+C";
                });
              });
            }

            const activateBtn = document.getElementById("ql-activate-key");
            if(activateBtn){
              activateBtn.addEventListener("click", () => {
                chrome.storage.local.set({
                  ql_license_valid: true,
                  ql_license_key: result.license_key,
                  ql_expires_at: result.expires_at || null,
                  ql_license_status: "active",
                  ql_session_id: null
                }, () => {
                  qlExpiresAt = result.expires_at || null;
                  qLicenseStatus = "active";
                  qlExpiredHandled = false;
                  showMainUI(box);
                  startHeartbeat(result.license_key);
                });
              });
            }
          }
        } else {
          const errMsg = (result && result.error) ? result.error : "Pagamento falhou. Tente novamente.";
          if(log){ log.className = "ql-pay-log ql-pay-error"; log.textContent = "✗ " + errMsg; }
          confirmBtn.disabled = false;
          confirmBtn.textContent = "💰 Pagar " + pkg.price + " MZN";
        }
      } catch(err) {
        if(log){ log.className = "ql-pay-log ql-pay-error"; log.textContent = "✗ " + (err.message || "Erro de conexão."); }
        confirmBtn.disabled = false;
        confirmBtn.textContent = "💰 Pagar " + pkg.price + " MZN";
      }
    });
  }
}

// Robust initialization: wait for document.body AND Lovable app shell
function qlBootstrap() {
  requestLatestTokenFromHook();
  try { _buildFloatingUI(); } catch(e) { console.warn("[TS Login] bootstrap failed", e); }
}

// Primary init
if (document.readyState === "complete" || document.readyState === "interactive") {
  setTimeout(qlBootstrap, 50);
} else {
  document.addEventListener("DOMContentLoaded", function() { setTimeout(qlBootstrap, 50); });
}

// Retry with increasing delays for SPA navigation / late renders
var qlRetryCount = 0;
var qlRetryDelays = [300, 600, 1000, 1500, 2000, 3000, 4000, 5000];
function qlRetryInit() {
  if (document.getElementById("ql-floating") || qlRetryCount >= qlRetryDelays.length) return;
  var delay = qlRetryDelays[qlRetryCount];
  qlRetryCount++;
  setTimeout(function() {
    if (!document.getElementById("ql-floating") && document.body) {
      createUI();
    }
    qlRetryInit();
  }, delay);
}
//qlRetryInit();

function updateSyncStatus(){
  chrome.storage.local.get(["lovable_projectId"], (res)=>{
    const status = document.getElementById("ql-sync-status");
    if(!status) return;
    if(res.lovable_projectId){
      status.className = "ql-sync-status ql-sync-ok";
      const pid = res.lovable_projectId.substring(0, 6);
      status.innerHTML = '<span class="ql-sync-text">✅ Sincronizado! Projeto: ' + pid + '...</span>';
    } else {
      status.className = "ql-sync-status ql-sync-waiting";
      status.innerHTML = '<span class="ql-sync-text">⏳ Aguardando sincronização...</span>';
    }
  });
}

function setupStorageWatch(){
  chrome.storage.onChanged.addListener((changes)=>{
    if(changes.lovable_projectId){
      updateSyncStatus();
    }
  });
}

function requestLatestTokenFromHook(timeoutMs = 1200){
  return new Promise((resolve)=>{
    let finished = false;

    function finish(updated){
      if(finished) return;
      finished = true;
      clearTimeout(timer);
      chrome.storage.onChanged.removeListener(onStorageChange);
      resolve(updated);
    }

    function onStorageChange(changes, area){
      if(area !== "local") return;
      if(changes.lovable_projectId && changes.lovable_projectId.newValue){
        finish(true);
      }
    }

    const timer = setTimeout(()=> finish(false), Math.max(300, timeoutMs));
    chrome.storage.onChanged.addListener(onStorageChange);

    try {
      window.postMessage({ source: "TS_LOVABLE_EXTENSION", type: "GET_LOVABLE_SESSION_STATUS" }, "*");
      setTimeout(()=> window.postMessage({ source: "TS_LOVABLE_EXTENSION", type: "GET_LOVABLE_SESSION_STATUS" }, "*"), 120);
    } catch(e) {
      finish(false);
    }
  });
}


function tsNormalizeLovableToken(value) {
  return String(value || "").replace(/^Bearer\s+/i, "").trim();
}

async function tsResolveLovableToken(options) {
  options = options || {};

  try {
    await requestLatestTokenFromHook(options.hookTimeoutMs || 900);
  } catch (_) {}

  let stored = await new Promise(function(resolve) {
    chrome.storage.local.get([
      "lovableBearerToken",
      "lovable_token",
      "lovable_projectId"
    ], resolve);
  });

  let token = options.forceRefresh
    ? ""
    : tsNormalizeLovableToken(
        stored && (stored.lovableBearerToken || stored.lovable_token)
      );

  if (!token) {
    try {
      const response = await new Promise(function(resolve) {
        chrome.runtime.sendMessage({
          action: "getLovableAuthToken",
          force: options.forceRefresh === true
        }, function(resp) {
          if (chrome.runtime.lastError) {
            resolve(null);
            return;
          }
          resolve(resp || null);
        });
      });

      if (response && response.ok && response.token) {
        token = tsNormalizeLovableToken(response.token);
        if (response.projectId) {
          chrome.storage.local.set({ lovable_projectId: response.projectId });
        }
      }
    } catch (_) {}
  }

  if (!token && options.allowCookieFallback !== false) {
    try {
      const cookieResponse = await new Promise(function(resolve) {
        chrome.runtime.sendMessage({ action: "readCookies" }, function(resp) {
          resolve(resp || null);
        });
      });

      if (cookieResponse && cookieResponse.success && cookieResponse.tokens && cookieResponse.tokens.length) {
        token = tsNormalizeLovableToken(cookieResponse.tokens[0].token);
      }
    } catch (_) {}
  }

  if (token) {
    const bearer = "Bearer " + token;
    chrome.storage.local.set({
      lovableBearerToken: bearer,
      lovable_token: bearer,
      lovableBearerTokenCapturedAt: Date.now()
    });
  }

  return token;
}

// ===== CHAT HISTORY SYSTEM (Floating Popup) =====
function loadChatHistory(cb) {
  chrome.storage.local.get([QL_HISTORY_KEY], (res) => {
    qlChatHistory = res[QL_HISTORY_KEY] || [];
    updateHistoryBadge();
    if(cb) cb();
  });
}

function saveChatHistory() {
  if(qlChatHistory.length > QL_MAX_HISTORY) qlChatHistory = qlChatHistory.slice(-QL_MAX_HISTORY);
  chrome.storage.local.set({ [QL_HISTORY_KEY]: qlChatHistory });
}

function addToChatHistory(text, status) {
  qlChatHistory.push({ text: text, timestamp: new Date().toISOString(), status: status || 'ok' });
  saveChatHistory();
  updateHistoryBadge();
}

function updateHistoryBadge() {
  const badge = document.getElementById('ql-history-badge');
  if(!badge) return;
  if(qlChatHistory.length > 0) {
    badge.textContent = qlChatHistory.length;
    badge.style.display = 'inline-flex';
  } else {
    badge.style.display = 'none';
  }
}

function formatChatDate(dateStr) {
  var d = new Date(dateStr);
  var now = new Date();
  var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  var msgDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  var diff = (today - msgDay) / 86400000;
  if(diff === 0) return 'Hoje';
  if(diff === 1) return 'Ontem';
  if(diff < 7) return ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'][d.getDay()];
  return d.toLocaleDateString('pt-BR');
}

function formatChatTime(dateStr) {
  var d = new Date(dateStr);
  return String(d.getHours()).padStart(2,'0') + ':' + String(d.getMinutes()).padStart(2,'0');
}

function renderHistoryView() {
  const container = document.getElementById('ql-tab-content');
  if(!container) return;

  if(!qlChatHistory.length) {
    container.innerHTML = '<div class="ql-chat-empty"><div style="font-size:28px;margin-bottom:8px">💬</div><div style="font-size:13px;font-weight:600;color:var(--ql-text-primary,#f4f4f5)">Nenhuma mensagem</div><div style="font-size:11px;color:var(--ql-text-muted,#71717a);margin-top:4px">Seus prompts enviados aparecerão aqui.</div></div>';
    return;
  }

  let html = '<div class="ql-chat-messages">';
  let lastDate = '';
  for(let i = 0; i < qlChatHistory.length; i++) {
    const m = qlChatHistory[i];
    const dateLabel = formatChatDate(m.timestamp);
    if(dateLabel !== lastDate) {
      html += '<div class="ql-chat-date-divider"><span class="ql-chat-date-label">' + dateLabel + '</span></div>';
      lastDate = dateLabel;
    }
    const statusClass = m.status === 'error' ? 'ql-chat-status-err' : 'ql-chat-status-ok';
    const statusText = m.status === 'error' ? '✗ Erro' : '✓ Enviado';
    const truncated = m.text.length > 300 ? escapeHtml(m.text.substring(0, 300)) + '…' : escapeHtml(m.text);
    html += '<div class="ql-chat-bubble" title="' + escapeHtml(m.text) + '">' + truncated +
      '<div class="ql-chat-meta"><span class="' + statusClass + '">' + statusText + '</span><span class="ql-chat-time">' + formatChatTime(m.timestamp) + '</span></div></div>';
  }
  html += '</div>';
  html += '<div class="ql-chat-actions"><span class="ql-chat-count">' + qlChatHistory.length + ' mensagen' + (qlChatHistory.length === 1 ? '' : 's') + '</span><button class="ql-chat-clear" id="ql-chat-clear">🗑 Limpar</button></div>';
  container.innerHTML = html;

  const msgs = container.querySelector('.ql-chat-messages');
  if(msgs) msgs.scrollTop = msgs.scrollHeight;

  const clearBtn = document.getElementById('ql-chat-clear');
  if(clearBtn) {
    clearBtn.addEventListener('click', () => {
      qlChatHistory = [];
      saveChatHistory();
      updateHistoryBadge();
      renderHistoryView();
    });
  }
}

function renderPromptView() {
  const container = document.getElementById('ql-tab-content');
  if(!container) return;
  container.innerHTML =
    '<textarea id="ql-msg" rows="3" placeholder="Digite seu comando..." spellcheck="false"></textarea>' +
    '<div id="ql-attach-preview" class="ql-attach-preview" style="display:none"></div>' +
    '<div class="ql-action-bar">' +
      '<div class="ql-action-center">' +
        '<button id="ql-attach-btn" class="ql-attach-btn" title="Anexar arquivo (m\u00e1x. 10)">\ud83d\udcce</button>' +
        '<button id="ql-optimize-btn" class="ql-tool-btn" title="Otimizar com IA">' + SVG_ICONS.sparkles + '</button>' +
        '<button id="ql-speech-btn" class="ql-tool-btn" title="Voz para texto">' + SVG_ICONS.mic + '</button>' +
      '</div>' +
      '<div class="ql-action-right-send">' +
        '<button id="ql-send" class="ql-send-btn">Enviar</button>' +
      '</div>' +
    '</div>' +
    '<div id="ql-log"></div>' +
    '<div class="ql-shortcuts-section">' +
      '<span class="ql-shortcuts-title">ATALHOS R\u00c1PIDOS</span>' +
      '<div class="ql-shortcuts-grid" id="ql-chips"></div>' +
    '</div>' +
    '<button id="ql-remove-watermark" class="ql-watermark-btn">\ud83d\udeab Remover Marca de \u00c1gua</button>' +
    '<button id="ql-shield-btn" class="ql-shield-btn">' +
      SVG_ICONS.shield + ' <span id="ql-shield-label">Ativar Escudo</span>' +
    '</button>' +
    '<button id="ql-native-chat-btn" class="ql-native-chat-btn">' +
      SVG_ICONS.msgSquare + ' Usar Chat Padr\u00e3o' +
    '</button>' +
    '<button id="ql-download-project" class="ql-watermark-btn" style="background:linear-gradient(135deg,rgba(59,130,246,0.12),rgba(37,99,235,0.08));border-color:rgba(59,130,246,0.3);color:#60a5fa;margin-top:6px">\ud83d\udce5 Baixar Todos Arquivos</button>' +
    '<button id="ql-create-project" class="ql-watermark-btn" style="background:linear-gradient(135deg,rgba(34,197,94,0.14),rgba(16,185,129,0.08));border-color:rgba(34,197,94,0.35);color:#4ade80;margin-top:6px">\ud83d\ude80 Criar Projeto no Lovable</button>' +
    '<button id="ql-publish-project" class="ql-watermark-btn" style="background:linear-gradient(135deg,rgba(245,158,11,0.14),rgba(217,119,6,0.08));border-color:rgba(245,158,11,0.35);color:#fbbf24;margin-top:6px">\ud83c\udf10 Publicar Projeto</button>' +
    '<div id="ql-download-status" style="display:none"></div>';
  // Re-setup all prompt tab features
  setupSend();
  setupSuggestionChips();
  setupWatermarkButton();
  setupOptimize();
  setupSpeech();
  setupModoPlano();
  setupFileAttachment();
  setupShield();
  setupNativeChatButton();
  setupClipboardPaste();
  setupDownloadProject();
  setupCreateProject();
  setupPublishProject();
}

function setupTabs() {
  const tabs = document.querySelectorAll('.ql-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-tab');
      qlActiveTab = target;
      document.querySelectorAll('.ql-tab').forEach(t => t.classList.toggle('ql-tab-active', t.getAttribute('data-tab') === target));
      if(target === 'history') {
        loadChatHistory(() => renderHistoryView());
      } else {
        renderPromptView();
      }
    });
  });
}


// ===== FILE ATTACHMENT SYSTEM =====
const MAX_FILES = 10;
const MAX_FILE_SIZE = 20 * 1024 * 1024;
let qlAttachedFiles = [];

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function isImageType(type) {
  return ['image/png', 'image/jpeg', 'image/webp'].includes(type);
}

function renderAttachPreview() {
  const container = document.getElementById('ql-attach-preview');
  if (!container) return;
  if (qlAttachedFiles.length === 0) {
    container.style.display = 'none';
    container.innerHTML = '';
    return;
  }
  container.style.display = 'flex';
  container.innerHTML = qlAttachedFiles.map((f, i) => {
    const thumbHtml = f.previewUrl
      ? '<img class="ql-attach-thumb" src="' + f.previewUrl + '" alt="">'
      : '<div class="ql-attach-icon">📄</div>';
    const uploadingClass = f.uploading ? ' ql-attach-uploading' : '';
    return '<div class="ql-attach-item' + uploadingClass + '" data-idx="' + i + '">' +
      thumbHtml +
      '<div class="ql-attach-info"><span class="ql-attach-name" title="' + escapeHtml(f.file_name) + '">' + escapeHtml(f.file_name) + '</span><span class="ql-attach-size">' + escapeHtml(f.sizeLabel) + '</span></div>' +
      '<button class="ql-attach-remove" data-idx="' + i + '">✕</button>' +
    '</div>';
  }).join('');

  container.querySelectorAll('.ql-attach-remove').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.getAttribute('data-idx'));
      if (qlAttachedFiles[idx] && qlAttachedFiles[idx].previewUrl) {
        URL.revokeObjectURL(qlAttachedFiles[idx].previewUrl);
      }
      qlAttachedFiles.splice(idx, 1);
      renderAttachPreview();
    });
  });
}

function setupFileAttachment() {
  const attachBtn = document.getElementById('ql-attach-btn');
  if (!attachBtn) return;

  attachBtn.addEventListener('click', () => {
    showCustomAlert('Anexo nativo', 'Use o botão de anexo do composer nativo da Lovable.');
  });
}

function setupSend(){
  const btn = document.getElementById("ql-send");
  if(!btn) return;
  btn.addEventListener("click", async ()=>{
    var msgEl = document.getElementById("ql-msg");
    const mensagem = msgEl ? (msgEl.value || "").trim() : "";
    const modoPlano = false;
    const log = document.getElementById("ql-log");

    if(!mensagem){
      if(log){ log.className = "ql-log-error"; log.innerText = "⚠ Prompt vazio"; }
      return;
    }

    const attachedFilesSnapshot = qlAttachedFiles.map((f) => ({ ...f }));

    const storageData = await new Promise((resolve) => {
      chrome.storage.local.get(["ql_license_key","ql_session_id"], resolve);
    });
    const licenseKey = storageData.ql_license_key || "";

    const hasTempImage = attachedFilesSnapshot.some(f => f.is_temp_image && !f.uploading && !f.uploadFailed);
    const hasRegularFile = attachedFilesSnapshot.some(f => !f.is_temp_image && f.file_id && !f.uploading && !f.uploadFailed);

    try{
      if(log){
        log.className = "ql-log-info";
        log.innerText = hasTempImage || hasRegularFile ? "📎 Preparando anexos para envio..." : "⏳ Enviando prompt...";
      }
      btn.classList.add("ql-sending");
      btn.disabled = true;

      var stillUploading = attachedFilesSnapshot.some(f => f.uploading);
      if (stillUploading) {
        throw new Error("Aguarde o upload dos arquivos terminar.");
      }

      await sendPromptNativeViaBackground(mensagem, modoPlano, attachedFilesSnapshot);
      if(log){
        log.className = "ql-log-success";
        if (hasTempImage && hasRegularFile) {
          log.innerText = "✓ Prompt enviado com imagem e arquivo!";
        } else if (hasTempImage) {
          log.innerText = "✓ Prompt enviado com imagem!";
        } else if (hasRegularFile) {
          log.innerText = "✓ Prompt enviado com arquivo!";
        } else {
          log.innerText = "✓ Prompt enviado!";
        }
      }
      

      // Save to chat history
      addToChatHistory(mensagem, 'ok');

      var msgEl = document.getElementById("ql-msg");
      if(msgEl) msgEl.value = "";

      qlAttachedFiles.forEach(f => { if (f.previewUrl) URL.revokeObjectURL(f.previewUrl); });
      qlAttachedFiles = [];
      renderAttachPreview();
    }catch(err){
      if(log){ log.className = "ql-log-error"; log.innerText = "✗ " + (err.message || err); }
      addToChatHistory(mensagem, 'error');
    } finally {
      btn.classList.remove("ql-sending");
      btn.disabled = false;
    }
  });
}

// Store references to avoid stacking listeners
let _dragCleanup = null;
let _resizeCleanup = null;

function setupDrag(){
  if(_dragCleanup) { _dragCleanup(); _dragCleanup = null; }

  const box = document.getElementById("ql-floating");
  const header = document.getElementById("ql-header");
  if(!box || !header) return;

  let dragging = false, startX = 0, startY = 0, startLeft = 0, startTop = 0;

  function onPointerDown(e){
    if(e.target.closest(".ql-minimize-btn") || e.target.closest(".ql-icon-btn") || e.target.closest("button")) return;
    if(e.pointerType === "mouse" && e.button !== 0) return;
    e.preventDefault();
    const rect = box.getBoundingClientRect();
    startX = e.clientX; startY = e.clientY;
    startLeft = rect.left; startTop = rect.top;
    dragging = true;
    try { header.setPointerCapture(e.pointerId); } catch(ex){}
    document.addEventListener("pointermove", onPointerMove);
    document.addEventListener("pointerup", onPointerUp);
    document.body.style.userSelect = "none";
  }

  function onPointerMove(e){
    if(!dragging) return;
    let newLeft = startLeft + (e.clientX - startX);
    let newTop = startTop + (e.clientY - startY);
    newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - box.offsetWidth));
    newTop = Math.max(0, Math.min(newTop, window.innerHeight - box.offsetHeight));
    box.style.left = newLeft + "px";
    box.style.top = newTop + "px";
  }

  function onPointerUp(e){
    if(!dragging) return;
    dragging = false;
    try { header.releasePointerCapture(e.pointerId); } catch(ex){}
    document.removeEventListener("pointermove", onPointerMove);
    document.removeEventListener("pointerup", onPointerUp);
    document.body.style.userSelect = "";
  }

  header.addEventListener("pointerdown", onPointerDown, {passive:false});

  _dragCleanup = function(){
    header.removeEventListener("pointerdown", onPointerDown);
    document.removeEventListener("pointermove", onPointerMove);
    document.removeEventListener("pointerup", onPointerUp);
  };
}

function setupResize(){
  if(_resizeCleanup) { _resizeCleanup(); _resizeCleanup = null; }

  const box = document.getElementById("ql-floating");
  const handle = document.getElementById("ql-resize-handle");
  if(!box || !handle) return;

  let resizing = false, startY = 0, startH = 0;

  function onDown(e){
    e.preventDefault();
    e.stopPropagation();
    resizing = true;
    startY = e.clientY;
    startH = box.offsetHeight;
    try { handle.setPointerCapture(e.pointerId); } catch(ex){}
    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);
    document.body.style.userSelect = "none";
  }

  function onMove(e){
    if(!resizing) return;
    let newH = startH + (e.clientY - startY);
    newH = Math.max(200, Math.min(newH, window.innerHeight * 0.8));
    box.style.height = newH + "px";
  }

  function onUp(e){
    if(!resizing) return;
    resizing = false;
    qlHeight = box.offsetHeight;
    chrome.storage.local.set({ ql_height: qlHeight });
    try { handle.releasePointerCapture(e.pointerId); } catch(ex){}
    document.removeEventListener("pointermove", onMove);
    document.removeEventListener("pointerup", onUp);
    document.body.style.userSelect = "";
  }

  handle.addEventListener("pointerdown", onDown, {passive:false});

  _resizeCleanup = function(){
    handle.removeEventListener("pointerdown", onDown);
    document.removeEventListener("pointermove", onMove);
    document.removeEventListener("pointerup", onUp);
  };
}

// ===== CLIPBOARD PASTE (Ctrl+V) for ANY Files =====
function setupClipboardPaste() {
  var textarea = document.getElementById('ql-msg');
  if (!textarea) return;
}

// ===== DOWNLOAD ALL PROJECT FILES (Popup) =====
var VERSIONS_URL_POPUP = "https://wogunbzijppmeuleitjq.supabase.co/rest/v1/extension_versions?select=version,changelog,file_path,is_alert_active&order=created_at.desc&limit=1&is_alert_active=eq.true";
var USER_ROLES_URL_POPUP = "https://wogunbzijppmeuleitjq.supabase.co/rest/v1/user_roles?select=role";
var CURRENT_EXT_VERSION_POPUP = "5.3.0";

function setupDownloadProject() {
  var btn = document.getElementById('ql-download-project');
  if (!btn) return;
  btn.addEventListener('click', async function() {
    var statusEl = document.getElementById('ql-download-status');
    btn.disabled = true;
    btn.textContent = 'Preparando...';
    if (statusEl) { statusEl.style.display = 'block'; statusEl.className = 'ql-log-info'; statusEl.textContent = 'Verificando token e projeto...'; }

    try {
      var sd = await new Promise(function(r) { chrome.storage.local.get(['lovable_projectId'], r); });
      var authToken = await tsResolveLovableToken({ forceRefresh: true });
      var storedProjectId = sd.lovable_projectId || '';

      var projectId = storedProjectId || tsExtractLovableProjectIdFromUrl();
      if (!projectId) throw new Error('Abra uma pagina de projeto do Lovable primeiro.');
      if (!authToken) throw new Error('Token nao encontrado. Abra um projeto no Lovable e aguarde a sincronizacao.');

      btn.textContent = 'Baixando...';
      if (statusEl) statusEl.textContent = 'Baixando arquivos do projeto...';

      var dlResponse = await new Promise(function(resolve) {
        chrome.runtime.sendMessage({ action: "downloadProject", projectId: projectId, token: authToken }, function(resp) { resolve(resp); });
      });

      if (!dlResponse || !dlResponse.success) throw new Error(dlResponse && dlResponse.error ? dlResponse.error : 'Download falhou');
      var files = dlResponse.files;
      if (!files || files.length === 0) throw new Error('Nenhum arquivo encontrado no projeto.');

      if (statusEl) statusEl.textContent = 'Criando ZIP com ' + files.length + ' arquivos...';
      btn.textContent = 'Empacotando...';
      if (typeof JSZip === 'undefined') throw new Error('JSZip não carregado. Recarregue a extensão e tente novamente.');

      var zip = new JSZip();
      function isProbablyBinaryFile(name){ return /\.(png|jpe?g|gif|webp|svg|ico|bmp|tiff|pdf|woff2?|ttf|eot|mp4|webm|mp3|wav|zip)$/i.test(name || ''); }
      var addedFiles = 0;
      for (var fi = 0; fi < files.length; fi++) {
        var f = files[fi];
        if (!f.name || f.sizeExceeded) continue;
        if (f.contents && f.binary) { zip.file(f.name, f.contents, { base64: true, binary: true }); addedFiles++; }
        else if (!f.contents && isProbablyBinaryFile(f.name)) {
          try {
            var rawResp = await new Promise(function(resolve){
              chrome.runtime.sendMessage({ action: 'downloadProjectRawFile', projectId: projectId, path: f.name, token: authToken }, function(r){ resolve(r); });
            });
            if (rawResp && rawResp.success && Array.isArray(rawResp.data)) { zip.file(f.name, new Uint8Array(rawResp.data).buffer, { binary: true }); addedFiles++; }
            else if (f.contents) { zip.file(f.name, f.contents); addedFiles++; }
          } catch(imgErr) { if (f.contents) { zip.file(f.name, f.contents); addedFiles++; } }
        } else if (f.contents) { zip.file(f.name, f.contents); addedFiles++; }
      }

      if (statusEl) statusEl.textContent = 'Compactando projeto...';
      var zipBlob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 9 } });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(zipBlob);
      a.download = 'lovable-project-' + projectId + '.zip';
      document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(a.href);

      if (statusEl) { statusEl.className = 'ql-log-success'; statusEl.textContent = addedFiles + ' arquivos baixados!'; }
      btn.textContent = 'Download Completo!';
      setTimeout(function() { btn.textContent = 'Baixar Todos Arquivos'; btn.disabled = false; if (statusEl) statusEl.style.display = 'none'; }, 4000);
    } catch(err) {
      if (statusEl) { statusEl.className = 'ql-log-error'; statusEl.textContent = (err.message || err); statusEl.style.display = 'block'; }
      btn.textContent = 'Falhou';
      setTimeout(function() { btn.textContent = 'Baixar Todos Arquivos'; btn.disabled = false; }, 3000);
    }
  });
}

// ===== UPDATE CHECK (Popup) =====
async function checkForUpdatePopup() {
  try {
    var data = await bgFetch(VERSIONS_URL_POPUP, { method: "GET", headers: { apikey: SUPABASE_ANON_KEY, Authorization: "Bearer " + SUPABASE_ANON_KEY } });
    if (!data || !data.length) return;
    var latest = data[0];
    if (latest.version !== CURRENT_EXT_VERSION_POPUP && latest.is_alert_active) {
      var banner = document.getElementById('ql-update-banner');
      if (banner) {
        var dlUrl = latest.file_path ? "https://wogunbzijppmeuleitjq.supabase.co/storage/v1/object/public/extension-releases/" + latest.file_path : null;
        banner.innerHTML = '<div style="padding:10px 12px;background:linear-gradient(135deg,rgba(251,191,36,0.12),rgba(245,158,11,0.08));border:1px solid rgba(251,191,36,0.3);border-radius:10px;margin:8px 0"><div style="display:flex;align-items:center;gap:6px;margin-bottom:4px"><span style="font-size:14px">&#128276;</span><strong style="font-size:11px;color:#f59e0b">Nova atualizacao v' + latest.version + '!</strong></div><p style="font-size:10px;color:#a1a1aa;margin:0 0 6px;white-space:pre-line">' + (latest.changelog || '') + '</p>' + (dlUrl ? '<a href="' + dlUrl + '" target="_blank" style="display:inline-block;padding:4px 12px;background:#f59e0b;color:#000;border-radius:6px;text-decoration:none;font-size:10px;font-weight:700">Baixar v' + latest.version + '</a>' : '') + '</div>';
        banner.style.display = 'block';
      }
    }
  } catch(e) {}
}

// ===== RESELLER ROLE CHECK (Popup) =====
async function checkResellerRolePopup() {
  try {
    var storageData = await new Promise(function(r) { chrome.storage.local.get(["ql_license_key"], r); });
    if (!storageData.ql_license_key) return;
    var licData = await bgFetch("https://wogunbzijppmeuleitjq.supabase.co/rest/v1/ts_licenses?select=user_id&license_key=eq." + encodeURIComponent(storageData.ql_license_key) + "&limit=1", { method: "GET", headers: { apikey: SUPABASE_ANON_KEY } });
    if (!licData || !licData.length || !licData[0].user_id) return;
    var userId = licData[0].user_id;
    var roleData = await bgFetch(USER_ROLES_URL_POPUP + "&user_id=eq." + userId, { method: "GET", headers: { apikey: SUPABASE_ANON_KEY, Authorization: "Bearer " + SUPABASE_ANON_KEY } });
    if (roleData && Array.isArray(roleData) && roleData.some(function(r) { return r.role === 'reseller' || r.role === 'admin'; })) {
      var btn = document.getElementById('ql-reseller-btn');
      if (btn) btn.style.display = 'block';
    }
  } catch(e) {}
}

// ===== NATIVE CHAT MODE =====
let qlNativeChatActive = false;
let qlNativeChatCleanup = null;

function activateNativeChat() {
  qlNativeChatActive = true;
  chrome.storage.local.set({ ql_native_chat: true });

  // Hide the extension
  const floatingBox = document.getElementById("ql-floating");
  if (floatingBox) {
    floatingBox.style.transition = "opacity 0.3s ease, transform 0.3s ease";
    floatingBox.style.opacity = "0";
    floatingBox.style.transform = "scale(0.95) translateX(20px)";
    setTimeout(() => { floatingBox.style.display = "none"; }, 350);
  }

  injectNativeChatOverlay();
}

function deactivateNativeChat() {
  qlNativeChatActive = false;
  chrome.storage.local.set({ ql_native_chat: false });

  // Clean up injected elements
  if (qlNativeChatCleanup) { qlNativeChatCleanup(); qlNativeChatCleanup = null; }

  const badge = document.getElementById("ql-native-badge");
  if (badge) badge.remove();
  const returnBtn = document.getElementById("ql-native-return-btn");
  if (returnBtn) returnBtn.remove();

  // Restore send button
  const sendBtn = document.getElementById("chatinput-send-message-button");
  if (sendBtn) {
    sendBtn.classList.remove("ql-native-send-active");
    sendBtn.style.animation = "";
  }

  // Show the extension again
  const floatingBox = document.getElementById("ql-floating");
  if (floatingBox) {
    floatingBox.style.display = "";
    floatingBox.style.opacity = "0";
    floatingBox.style.transform = "scale(0.95)";
    requestAnimationFrame(() => {
      floatingBox.style.transition = "opacity 0.4s ease, transform 0.4s ease";
      floatingBox.style.opacity = "1";
      floatingBox.style.transform = "scale(1) translateX(0)";
    });
  } else {
    // Rebuild if removed
    _buildFloatingUI();
  }
}

function injectNativeChatOverlay() {
  // Wait for chat form to exist
  const chatForm = document.querySelector("form#chat-input");
  if (!chatForm) {
    setTimeout(injectNativeChatOverlay, 500);
    return;
  }

  // Add QL badge on top-right of chat form
  if (!document.getElementById("ql-native-badge")) {
    const existingPos = getComputedStyle(chatForm).position;
    if (existingPos === "static") chatForm.style.position = "relative";

    const badge = document.createElement("div");
    badge.id = "ql-native-badge";
    badge.className = "ql-native-badge";
    badge.innerHTML = '<span data-ts-brand="name">' + ((window.tsBrandName && window.tsBrandName()) || "TS Community") + '</span>';
    chatForm.appendChild(badge);
  }

  // Add return button below chat form
  if (!document.getElementById("ql-native-return-btn")) {
    const returnBtn = document.createElement("button");
    returnBtn.id = "ql-native-return-btn";
    returnBtn.className = "ql-native-return-btn";
    returnBtn.innerHTML = "\u2190 Voltar \u00e0 Extens\u00e3o";
    returnBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      deactivateNativeChat();
    });
    chatForm.parentElement.insertBefore(returnBtn, chatForm.nextSibling);
  }

  // Style the send button with blink animation
  const sendBtn = document.getElementById("chatinput-send-message-button");
  if (sendBtn) {
    sendBtn.classList.add("ql-native-send-active");
  }

  // Intercept send button click
  function interceptSend(e) {
    if (!qlNativeChatActive) return;
    if (Number(chatForm.dataset.qlNativeBypassUntil || 0) > Date.now()) return;

    // Get text from contenteditable
    const editor = chatForm.querySelector('[contenteditable="true"]');
    const text = editor ? (editor.innerText || editor.textContent || "").trim() : "";

    if (!text) return;

    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    sendViaNativeChat(text, editor);
  }

  // Intercept form submit
  function interceptSubmit(e) {
    if (!qlNativeChatActive) return;
    if (Number(chatForm.dataset.qlNativeBypassUntil || 0) > Date.now()) return;

    const editor = chatForm.querySelector('[contenteditable="true"]');
    const text = editor ? (editor.innerText || editor.textContent || "").trim() : "";

    if (!text) return;

    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    sendViaNativeChat(text, editor);
  }

  // Intercept Enter key
  function interceptKeydown(e) {
    if (!qlNativeChatActive) return;
    if (Number(chatForm.dataset.qlNativeBypassUntil || 0) > Date.now()) return;
    if (e.key === "Enter" && !e.shiftKey) {
      const editor = chatForm.querySelector('[contenteditable="true"]');
      const text = editor ? (editor.innerText || editor.textContent || "").trim() : "";
      if (!text) return;

      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      sendViaNativeChat(text, editor);
    }
  }

  if (sendBtn) sendBtn.addEventListener("click", interceptSend, true);
  chatForm.addEventListener("submit", interceptSubmit, true);
  chatForm.addEventListener("keydown", interceptKeydown, true);

  qlNativeChatCleanup = function() {
    if (sendBtn) sendBtn.removeEventListener("click", interceptSend, true);
    chatForm.removeEventListener("submit", interceptSubmit, true);
    chatForm.removeEventListener("keydown", interceptKeydown, true);
  };
}

async function sendViaNativeChat(text, editor) {
  const sendBtn = document.getElementById("chatinput-send-message-button");

  // Show sending overlay
  showNativeSendingOverlay(true);

  // Visual feedback
  if (sendBtn) {
    sendBtn.style.animation = "none";
    sendBtn.classList.add("ql-native-sending");
    sendBtn.disabled = true;
  }

  try {
    var result = await sendPromptNativeViaBackground(text, false);

    // Clear the editor
    if (editor) {
      editor.innerHTML = '<p><br class="ProseMirror-trailingBreak"></p>';
      editor.dispatchEvent(new Event("input", { bubbles: true }));
    }

    addToChatHistory(text, "ok");
    showNativeChatToast("\u2713 Prompt enviado com sucesso!", "success");

  } catch (err) {
    addToChatHistory(text, "error");
    showNativeChatToast("\u2717 " + (err.message || "Erro no envio"), "error");
  } finally {
    showNativeSendingOverlay(false);
    if (sendBtn) {
      sendBtn.classList.remove("ql-native-sending");
      sendBtn.classList.add("ql-native-send-active");
      sendBtn.disabled = false;
      // Re-apply blink animation since it may have been cleared
      sendBtn.style.animation = "";
      requestAnimationFrame(() => {
        sendBtn.style.animation = "ql-send-blink 1.5s infinite";
      });
    }
  }
}

function showNativeSendingOverlay(show) {
  const id = "ql-native-sending-overlay";
  const existing = document.getElementById(id);
  if (!show) { if (existing) existing.remove(); return; }
  if (existing) return;
  const el = document.createElement("div");
  el.id = id;
  el.className = "ql-native-sending-overlay";
  el.innerHTML = '<div class="ql-spinner"></div> Enviando prompt...';
  document.body.appendChild(el);
}

function showNativeChatToast(msg, type) {
  const existing = document.getElementById("ql-native-toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.id = "ql-native-toast";
  toast.className = "ql-native-toast ql-native-toast-" + type;
  toast.textContent = msg;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("ql-native-toast-visible"));
  setTimeout(() => {
    toast.classList.remove("ql-native-toast-visible");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function setupNativeChatButton() {
  const btn = document.getElementById("ql-native-chat-btn");
  if (!btn) return;
  btn.addEventListener("click", () => {
    activateNativeChat();
  });
}

// Check if native chat was active on page load
chrome.storage.local.get(["ql_native_chat"], (res) => {
  if (res.ql_native_chat === true) {
    qlNativeChatActive = true;
    setTimeout(() => {
      const floatingBox = document.getElementById("ql-floating");
      if (floatingBox) floatingBox.style.display = "none";
      injectNativeChatOverlay();
    }, 500);
  }
});

window.addEventListener("message", (event) => {
  if (event.source !== window) return;
  if (!event.data) return;

  const currentProjectMatch = location.pathname.match(/projects\/([0-9a-fA-F-]{36})/i);
  const currentProjectId = currentProjectMatch ? currentProjectMatch[1] : null;

  if (event.data.source === 'TS_LOVABLE_PAGE_HOOK' && event.data.type === 'SESSION_STATUS') {
    const projectId = event.data.projectId || currentProjectId;
    if (projectId) chrome.storage.local.set({ lovable_projectId: projectId });
    return;
  }

  if (event.data.type !== "lovableTokenFound") return;

  const projectId = event.data.projectId || currentProjectId;

  if (!currentProjectId || !projectId || projectId !== currentProjectId) {
    chrome.storage.local.remove(["lovable_projectId"]);
    return;
  }

  chrome.storage.local.set({ lovable_projectId: projectId });
});

function setupCreateProject() {
  var btn = document.getElementById('ql-create-project');
  if (!btn) return;
  btn.addEventListener('click', async function() {
    var statusEl = document.getElementById('ql-download-status');
    var originalLabel = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Criando projeto...';
    if (statusEl) { statusEl.style.display = 'block'; statusEl.className = 'ql-log-info'; statusEl.textContent = 'Preparando criação...'; }
    try {
      var sd = await new Promise(function(r) { chrome.storage.local.get(['ql_license_key'], r); });
      var authToken = await tsResolveLovableToken({ forceRefresh: true });
      var licenseKey = sd.ql_license_key || '';
      if (!licenseKey) throw new Error('Licença não encontrada.');
      if (!authToken) throw new Error('Abra lovable.dev e aguarde a sincronização.');

      if (statusEl) statusEl.textContent = 'Solicitando criação no servidor...';
      var resp = await fetch(PROXY_COMMAND_URL.replace('proxy-command', 'create-lovable-project'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'apikey': SUPABASE_ANON_KEY },
        body: JSON.stringify({ license_key: licenseKey, token_lovable: authToken })
      });
      var data = await resp.json();
      if (!data || !data.success || !data.link) {
        throw new Error((data && data.error_display) || 'Falha ao criar projeto');
      }
      if (statusEl) { statusEl.className = 'ql-log-success'; statusEl.textContent = '✅ Projeto criado! Redirecionando...'; }
      btn.textContent = '✅ Sucesso!';
      setTimeout(function(){
        try { window.location.href = data.link; }
        catch(e) { window.open(data.link, '_blank'); }
      }, 400);
    } catch(err) {
      console.error('[CreateProject]', err);
      if (statusEl) { statusEl.className = 'ql-log-error'; statusEl.textContent = '❌ ' + (err.message || 'Erro'); }
      btn.disabled = false;
      btn.textContent = originalLabel;
    }
  });
}

// --- Notify when Lovable finishes editing (sound) ---
(function lovableDoneSoundFeature(){
  try {
    // Default: enabled
    window.__TS_DONE_SOUND_ENABLED__ = true;
    try {
      chrome.storage.local.get(["soundNotificationsEnabled","notifyWhenDoneEnabled"], function(r){
        if (r && typeof r.soundNotificationsEnabled !== "undefined") {
          window.__TS_DONE_SOUND_ENABLED__ = r.soundNotificationsEnabled !== false;
        } else if (r && typeof r.notifyWhenDoneEnabled !== "undefined") {
          window.__TS_DONE_SOUND_ENABLED__ = r.notifyWhenDoneEnabled !== false;
        } else {
          window.__TS_DONE_SOUND_ENABLED__ = true;
        }
      });
      chrome.storage.onChanged.addListener(function(changes, area){
        if (area === "local" && changes && changes.soundNotificationsEnabled) {
          window.__TS_DONE_SOUND_ENABLED__ = changes.soundNotificationsEnabled.newValue !== false;
        }
      });
    } catch(e){}

    function isSoundEnabled(){ return window.__TS_DONE_SOUND_ENABLED__ !== false; }
    window.__TS_isSoundEnabled = isSoundEnabled;

    var WORKING_INDICATORS = [
      "working","applying","editing","generating","thinking",
      "analyzing","building","creating","reviewing","starting",
      "updating","running"
    ];

    function isLovableCurrentlyWorking(){
      try {
        var chat = document.querySelector('[class*="chat"], main, body');
        var bodyText = (chat ? chat.innerText : document.body.innerText || "").toLowerCase();
        var hasWorkingText = false;
        for (var i=0;i<WORKING_INDICATORS.length;i++){
          if (bodyText.indexOf(WORKING_INDICATORS[i]+"...") !== -1 ||
              bodyText.indexOf(WORKING_INDICATORS[i]+"…") !== -1) {
            hasWorkingText = true; break;
          }
        }
        if (!hasWorkingText) {
          var btns = document.querySelectorAll("button");
          for (var j=0;j<btns.length;j++){
            var b = btns[j];
            var t = (b.innerText || "").trim().toLowerCase();
            var aria = (b.getAttribute("aria-label") || "").toLowerCase();
            if (t === "stop" || t === "cancel" || aria.indexOf("stop") !== -1) {
              return true;
            }
          }
        }
        return hasWorkingText;
      } catch(e){ return false; }
    }

    var wasLovableWorking = false;
    var doneSoundTimeout = null;
    var lastDoneSoundAt = 0;
    var lastPromptSentSoundAt = 0;

    var SOUND_URLS = {
      send: "https://wogunbzijppmeuleitjq.supabase.co/storage/v1/object/public/sounds/send.mp3",
      done: "https://wogunbzijppmeuleitjq.supabase.co/storage/v1/object/public/sounds/done.mp3"
    };

    function playRemoteSound(type, volume){
      try {
        var url = SOUND_URLS[type];
        if (!url) return;
        var audio = new Audio(url);
        audio.volume = (typeof volume === "number") ? volume : 0.8;
        var p = audio.play();
        if (p && p.catch) p.catch(function(err){
          console.warn("[TS Community] Falha ao reproduzir som:", err);
        });
      } catch(err){
        console.warn("[TS Community] Falha ao reproduzir som:", err);
      }
    }

    function playLovableDoneSound(){
      if (!isSoundEnabled()) return;
      var now = Date.now();
      if (now - lastDoneSoundAt < 8000) return;
      lastDoneSoundAt = now;
      playRemoteSound("done", 0.8);
    }

    function playPromptSentSound(){
      if (!isSoundEnabled()) return;
      var now = Date.now();
      if (now - lastPromptSentSoundAt < 1000) return;
      lastPromptSentSoundAt = now;
      playRemoteSound("send", 0.8);
    }
    window.__TS_playPromptSentSound = playPromptSentSound;

    // Listen to extension-triggered messages (via background relay) or from page
    try {
      chrome.runtime.onMessage.addListener(function(msg){
        if (msg && msg.action === "tsPlayPromptSentSound") playPromptSentSound();
      });
    } catch(e){}
    window.addEventListener("message", function(ev){
      if (ev && ev.data && ev.data.type === "tsPlayPromptSentSound") playPromptSentSound();
    });

    function check(){
      if (!isSoundEnabled()) return;
      var working = isLovableCurrentlyWorking();
      if (working){
        wasLovableWorking = true;
        if (doneSoundTimeout){ clearTimeout(doneSoundTimeout); doneSoundTimeout = null; }
        return;
      }
      if (wasLovableWorking && !working){
        if (doneSoundTimeout) clearTimeout(doneSoundTimeout);
        doneSoundTimeout = setTimeout(function(){
          if (!isLovableCurrentlyWorking()){
            playLovableDoneSound();
            wasLovableWorking = false;
          }
          doneSoundTimeout = null;
        }, 2500);
      }
    }

    var scheduled = false;
    var observer = new MutationObserver(function(){
      if (scheduled) return;
      scheduled = true;
      setTimeout(function(){ scheduled = false; check(); }, 400);
    });
    function start(){
      if (!document.body) { setTimeout(start, 200); return; }
      observer.observe(document.body, { childList:true, subtree:true, characterData:true });
      console.info("[TS Extension] Lovable done observer started");
    }
    start();
  } catch(e){
    console.warn("[TS Extension] lovableDoneSoundFeature failed", e);
  }
})();


// ============= Visual Edit label decoration (lovable.dev top frame only) =============
(function tsVisualEditLabelDecorator(){
  try {
    var isTopFrame = window.top === window.self;
    var isLovablePage = location.hostname === "lovable.dev";
    if (!isTopFrame || !isLovablePage) return;

    function replaceVisualEditLabels() {
      var elements = document.querySelectorAll(".special-message");
      var HIDE_RE = /^(visual\s*edit|security\s*scan|scan\s*de\s*seguran[çc]a|security_scan|try\s*to\s*fix|fix\s*error)$/i;
      elements.forEach(function(element){
        try {
          if (element.dataset && element.dataset.tsLabelDecorated === "true") return;
          var currentText = String(element.textContent || "").replace(/\s+/g, " ").trim();
          if (!HIDE_RE.test(currentText)) return;
          element.textContent = "";
          element.style.display = "none";
          if (element.dataset) element.dataset.tsLabelDecorated = "true";
        } catch(_) {}
      });
    }


    function initializeVisualEditLabelObserver() {
      if (window.__TS_VISUAL_LABEL_OBSERVER__) return;
      var observer = new MutationObserver(function(mutations){
        var shouldProcess = false;
        for (var i = 0; i < mutations.length; i++) {
          var m = mutations[i];
          if (m.type === "childList" || m.type === "characterData") { shouldProcess = true; break; }
        }
        if (shouldProcess) replaceVisualEditLabels();
      });
      observer.observe(document.documentElement, { childList: true, subtree: true, characterData: true });
      window.__TS_VISUAL_LABEL_OBSERVER__ = observer;
    }

    replaceVisualEditLabels();
    initializeVisualEditLabelObserver();
  } catch(e) {
    console.warn("[TS LABEL] decorator init failed", e);
  }
})();

// ============================================================
// DevTools Guard — bloqueia a página quando o DevTools é aberto/inspecionado.
// Detecção baseada em (1) getter em objeto logado no console (só disparado
// quando o painel do DevTools está aberto no Chromium) e (2) timing do
// debugger. Evita a heurística outerWidth/innerWidth, que gerava falso-
// positivo em janelas não-maximizadas.
(function initTSDevToolsGuard(){
  try {
    if (window.top !== window.self) return;
    if (window.__TS_DEVTOOLS_GUARD_INSTALLED__) return;
    window.__TS_DEVTOOLS_GUARD_INSTALLED__ = true;

    var OVERLAY_ID = "ts-devtools-guard-overlay";
    var STYLE_ID = "ts-devtools-guard-style";
    var state = { open: false, trapping: false };

    function ensureStyle(){
      if (document.getElementById(STYLE_ID)) return;
      var s = document.createElement("style");
      s.id = STYLE_ID;
      s.textContent =
        "#" + OVERLAY_ID + "{position:fixed;inset:0;z-index:2147483647;background:rgba(8,10,18,0.96);" +
        "backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);display:flex;align-items:center;" +
        "justify-content:center;flex-direction:column;gap:14px;color:#fff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;" +
        "text-align:center;padding:24px;user-select:none;-webkit-user-select:none;cursor:not-allowed;}" +
        "#" + OVERLAY_ID + " .ts-dg-title{font-size:20px;font-weight:600;letter-spacing:.2px;}" +
        "#" + OVERLAY_ID + " .ts-dg-sub{font-size:14px;opacity:.75;max-width:420px;line-height:1.5;}" +
        "#" + OVERLAY_ID + " .ts-dg-icon{width:56px;height:56px;border-radius:50%;background:#ef4444;display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:700;}" +
        "html.ts-dg-locked,body.ts-dg-locked{overflow:hidden!important;}";
      (document.head || document.documentElement).appendChild(s);
    }

    function showOverlay(){
      ensureStyle();
      if (document.getElementById(OVERLAY_ID)) return;
      var o = document.createElement("div");
      o.id = OVERLAY_ID;
      o.setAttribute("role", "alertdialog");
      o.setAttribute("aria-modal", "true");
      o.innerHTML =
        '<div class="ts-dg-icon">!</div>' +
        '<div class="ts-dg-title">Acesso bloqueado</div>' +
        '<div class="ts-dg-sub">Feche o DevTools para continuar utilizando a página. Seu trabalho está preservado.</div>';
      (document.body || document.documentElement).appendChild(o);
      try { document.documentElement.classList.add("ts-dg-locked"); } catch(_){}
      try { document.body && document.body.classList.add("ts-dg-locked"); } catch(_){}
    }

    function hideOverlay(){
      var o = document.getElementById(OVERLAY_ID);
      if (o && o.parentNode) o.parentNode.removeChild(o);
      try { document.documentElement.classList.remove("ts-dg-locked"); } catch(_){}
      try { document.body && document.body.classList.remove("ts-dg-locked"); } catch(_){}
    }

    function debuggerTrap(){
      if (state.trapping) return;
      state.trapping = true;
      (function loop(){
        if (!state.open) { state.trapping = false; return; }
        try { (function(){ debugger; })(); } catch(_){}
        setTimeout(loop, 150);
      })();
    }

    function markOpen(){
      if (state.open) return;
      state.open = true;
      showOverlay();
      debuggerTrap();
    }
    function markClosed(){
      if (!state.open) return;
      state.open = false;
      hideOverlay();
    }

    // Detecção 1: getter acionado quando o DevTools formata o objeto.
    function detectByGetter(){
      var triggered = false;
      var probe = new Function();
      probe.toString = function(){ triggered = true; return ""; };
      try {
        console.log("%c", probe);
        if (console.clear) console.clear();
      } catch(_){}
      return triggered;
    }

    // Detecção 2: timing do debugger (só pausa se o DevTools estiver aberto).
    function detectByDebugger(){
      var t0 = performance.now();
      try { (function(){ debugger; })(); } catch(_){}
      return (performance.now() - t0) > 120;
    }

    function detect(){
      var open = false;
      try { open = detectByGetter() || detectByDebugger(); } catch(_){}
      if (open) markOpen(); else markClosed();
    }

    // Bloqueio de atalhos e menu de contexto (sempre ativo).
    function blockContextMenu(e){ e.preventDefault(); e.stopPropagation(); }
    function blockKeys(e){
      var k = (e.key || "").toLowerCase();
      var isDevToolsCombo =
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && (k === "i" || k === "j" || k === "c")) ||
        (e.metaKey && e.altKey && (k === "i" || k === "j" || k === "c")) ||
        (e.ctrlKey && k === "u");
      if (isDevToolsCombo) { e.preventDefault(); e.stopPropagation(); return; }
      if (state.open) { e.preventDefault(); e.stopPropagation(); }
    }

    document.addEventListener("contextmenu", blockContextMenu, true);
    document.addEventListener("keydown", blockKeys, true);

    // Primeira checagem após o load para evitar falso-positivo em cold start.
    setTimeout(detect, 500);
    setInterval(detect, 1000);
  } catch(e) {
    try { console.warn("[TS DEVGUARD] init failed", e); } catch(_){}
  }
})();

/* --- overlay.js --- */
// ============= TS Community Overlay =============
// Popup-only layout:
// A floating round launcher opens extension actions directly on lovable.dev.
// All actions run without Chrome sidepanel.

(function () {
  if (window.__tsOverlayInjected) return;
  window.__tsOverlayInjected = true;

  if (typeof window.TS_DEBUG === "undefined") window.TS_DEBUG = false;
  const tsDebug = (...args) => { if (window.TS_DEBUG) console.log(...args); };

  const ROOT_ID = "ts-community-overlay-root";
  const IFRAME_ID = "ts-community-overlay-iframe";
  const STYLE_ID = "ts-community-overlay-style";
  const LAUNCHER_ID = "ts-floating-launcher";
  const MENU_ID = "ts-floating-action-menu";
  const SUBMENU_ID = "ts-floating-submenu";
  const COMPOSER_WRAP_CLASS = "ts-native-composer-wrap";
  const TS_SIDEBAR_WIDTH = 380;

  // -------------------- Floating i18n (self-contained) --------------------
  // Reads chrome.storage.local.ts_locale and
  // updates floating menu labels + TS ACTIVE badge live without refresh.
  const TS_FLOAT_I18N = {
    'pt-BR': {
      'floating.removeWatermark': "Remover marca d'água",
      'floating.download': 'Baixar',
      'floating.optimize': 'Otimizar',
      'floating.readyPrompts': 'Prompts Prontos',
      'floating.tsActive': 'ATIVO'
    },
    'en': {
      'floating.removeWatermark': 'Remove watermark',
      'floating.download': 'Download',
      'floating.optimize': 'Optimize',
      'floating.readyPrompts': 'Ready Prompts',
      'floating.tsActive': 'ACTIVE'
    },
    'es': {
      'floating.removeWatermark': 'Quitar marca de agua',
      'floating.download': 'Descargar',
      'floating.optimize': 'Optimizar',
      'floating.readyPrompts': 'Prompts Listos',
      'floating.tsActive': 'ACTIVO'
    }
  };
  let tsFloatLocale = 'pt-BR';
  function tsFloatT(key) {
    const d = TS_FLOAT_I18N[tsFloatLocale] || TS_FLOAT_I18N['pt-BR'];
    return (d && d[key]) || TS_FLOAT_I18N['pt-BR'][key] || key;
  }
  function getTsActiveBadgeText() {
    const suffix = tsFloatT('floating.tsActive');
    let brand = '';
    try {
      const active = (typeof window !== 'undefined' && window.TS_ACTIVE_BRANDING) || null;
      const cfg = (typeof window !== 'undefined' && window.TS_BRANDING_CONFIG) || null;
      brand = (active && (active.brandName || active.extensionName)) ||
              (cfg && (cfg.brandName || cfg.extensionName)) || '';
      if (!brand && typeof window.tsBrandName === 'function') brand = window.tsBrandName() || '';
    } catch (_) {}
    brand = String(brand || '').replace(/[\r\n\t]+/g, ' ').trim();
    if (!brand || /^ts\s*community$/i.test(brand)) return suffix;
    return (brand + ' ' + suffix).toUpperCase();
  }
  function applyFloatingI18n() {
    try {
      const badge = document.getElementById('ts-native-badge');
      if (badge) badge.textContent = getTsActiveBadgeText();
      const menu = document.getElementById('ts-floating-action-menu');
      if (menu) {
        menu.querySelectorAll('[data-action]').forEach((btn) => {
          const action = btn.getAttribute('data-action');
          const map = {
            watermark: 'floating.removeWatermark',
            download: 'floating.download',
            optimize: 'floating.optimize',
            prompts: 'floating.readyPrompts'
          };
          const key = map[action];
          if (!key) return;
          const lbl = btn.querySelector('.ts-fab-label');
          if (lbl) lbl.textContent = tsFloatT(key);
        });
      }
    } catch (_) {}
  }
  try {
    if (chrome && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get(['ts_locale'], (r) => {
        if (r && r.ts_locale && TS_FLOAT_I18N[r.ts_locale]) tsFloatLocale = r.ts_locale;
        applyFloatingI18n();
      });
      chrome.storage.onChanged.addListener((ch, area) => {
        if (area !== 'local' || !ch.ts_locale) return;
        const nv = ch.ts_locale.newValue;
        if (nv && TS_FLOAT_I18N[nv]) tsFloatLocale = nv;
        applyFloatingI18n();
      });
    }
  } catch (_) {}

  function getLogoUrl() {
    try { return chrome.runtime.getURL("icons/icon128.png"); } catch (_) { return ""; }
  }

  function injectGlobalStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      :root {
        --ts-sidebar-width: 0px;
        --ts-brand-strong-base: var(--ts-brand-primary);
        --ts-brand-strong: var(--ts-brand-primary-hover);
        --ts-primary-gradient: var(--ts-brand-gradient);
        --ts-primary-border: rgba(var(--ts-brand-primary-rgb), 0.55);
        --ts-primary-border-soft: rgba(var(--ts-brand-primary-rgb), 0.32);
        --ts-primary-glow: 0 0 0 3px rgba(var(--ts-brand-primary-rgb), 0.18);
        --ts-primary-glow-strong: 0 8px 24px rgba(var(--ts-brand-primary-rgb), 0.35);
      }
      body.ts-sidebar-open {
        padding-right: var(--ts-sidebar-width) !important;
        transition: padding-right 280ms ease !important;
        box-sizing: border-box !important;
      }
      body:not(.ts-sidebar-open) {
        padding-right: 0 !important;
        transition: padding-right 280ms ease !important;
      }
      #${ROOT_ID} {
        position: fixed !important;
        top: 0 !important;
        right: 0 !important;
        width: ${TS_SIDEBAR_WIDTH}px !important;
        height: 100vh !important;
        z-index: 2147483647 !important;
        transition: transform 280ms ease !important;
        background: transparent !important;
        border: none !important;
        margin: 0 !important;
        padding: 0 !important;
        box-shadow: -2px 0 16px rgba(0,0,0,0.18) !important;
        pointer-events: auto !important;
      }
      #${ROOT_ID}.ts-sidebar-collapsed {
        transform: translateX(100%) !important;
        pointer-events: none !important;
      }
      #${ROOT_ID}.ts-popup-mode {
        width: 0 !important;
        height: 0 !important;
        pointer-events: none !important;
        box-shadow: none !important;
        transform: none !important;
        overflow: hidden !important;
      }
      #${ROOT_ID}.ts-popup-mode > #${IFRAME_ID} {
        position: absolute !important;
        left: -10000px !important;
        top: -10000px !important;
        width: 1px !important;
        height: 1px !important;
        opacity: 0 !important;
        pointer-events: none !important;
      }
      #${IFRAME_ID} {
        width: 100% !important;
        height: 100% !important;
        min-height: 480px !important;
        border: none !important;
        margin: 0 !important;
        padding: 0 !important;
        display: block !important;
        background: #ffffff !important;
      }

      /* ===== Floating launcher (popup mode) — TS style ===== */
      #${LAUNCHER_ID} {
        position: fixed !important;
        right: 24px !important;
        bottom: 24px !important;
        width: 64px !important;
        height: 72px !important;
        border-radius: 0 !important;
        cursor: grab !important;
        z-index: 2147483647 !important;
        display: grid !important;
        place-items: center !important;
        background: transparent !important;
        border: 0 !important;
        box-shadow: none !important;
        padding: 0 !important;
        transition: transform .18s ease !important;
        user-select: none !important;
        touch-action: none !important;
        overflow: visible !important;
        transform-origin: 50% 92% !important;
      }
      #${LAUNCHER_ID}::after { display:none!important; content:none!important; }
      #${LAUNCHER_ID}:hover { transform:translateY(-2px) scale(1.08)!important; box-shadow:none!important; }
      #${LAUNCHER_ID}.ts-launcher-dragging { cursor:grabbing!important; transition:none!important; }
      #${LAUNCHER_ID} img {
        width: 58px !important;
        height: 68px !important;
        object-fit: contain !important;
        pointer-events: none !important;
        border-radius: 0 !important;
        opacity: 1 !important;
        filter: drop-shadow(0 7px 12px rgba(255,72,0,.42)) drop-shadow(0 0 13px rgba(255,151,0,.22)) !important;
        animation: tsQyronFlame 1.55s ease-in-out infinite !important;
        transform-origin: 50% 92% !important;
      }
      #${LAUNCHER_ID}.ts-launcher-active { transform:translateY(-2px) scale(1.08)!important; box-shadow:none!important; }
      #${LAUNCHER_ID}.ts-launcher-recording img { animation:tsQyronFlame .62s ease-in-out infinite!important; }
      @keyframes tsQyronFlame {
        0%,100% { transform:translateY(0) scale(1,1) rotate(-1.4deg); filter:drop-shadow(0 7px 12px rgba(255,72,0,.42)) drop-shadow(0 0 11px rgba(255,151,0,.20)); }
        24% { transform:translateY(-2px) scale(1.035,.97) rotate(1.1deg); filter:drop-shadow(0 9px 15px rgba(255,72,0,.55)) drop-shadow(0 0 17px rgba(255,175,0,.34)); }
        52% { transform:translateY(1px) scale(.975,1.045) rotate(-.7deg); filter:drop-shadow(0 6px 11px rgba(255,72,0,.47)) drop-shadow(0 0 14px rgba(255,151,0,.27)); }
        76% { transform:translateY(-1px) scale(1.018,.985) rotate(1.5deg); filter:drop-shadow(0 8px 14px rgba(255,72,0,.52)) drop-shadow(0 0 16px rgba(255,189,0,.30)); }
      }

      /* ===== Native composer wrap outline (popup mode) ===== */
      body.ts-native-chat-active .${COMPOSER_WRAP_CLASS} {
        outline: 2px solid var(--ts-primary-border) !important;
        outline-offset: 2px !important;
        box-shadow: var(--ts-primary-glow), 0 0 24px rgba(var(--ts-brand-primary-rgb), 0.15) !important;
        border-radius: 18px !important;
        transition: outline-color 200ms ease, box-shadow 200ms ease !important;
        position: relative !important;
      }
      body.ts-native-chat-active form button[type="submit"]:not([id^="ts-"]):not([id^="ql-"]),
      body.ts-native-chat-active button[aria-label*="end" i]:not([id^="ts-"]):not([id^="ql-"]),
      body.ts-native-chat-active button[aria-label*="nviar" i]:not([id^="ts-"]):not([id^="ql-"]) {
        background: var(--ts-primary-gradient) !important;
        color: #fff !important;
        border-color: transparent !important;
      }
      #ts-native-badge {
        position: fixed !important;
        z-index: 2147483646 !important;
        display: inline-flex !important;
        align-items: center !important;
        gap: 6px !important;
        padding: 4px 10px !important;
        border-radius: 999px !important;
        background: var(--ts-primary-gradient) !important;
        color: #fff !important;
        font: 600 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
        box-shadow: var(--ts-primary-glow-strong) !important;
        pointer-events: none !important;
        letter-spacing: 0.04em !important;
      }
      #ts-native-badge::before {
        content: "" !important;
        width: 6px !important; height: 6px !important;
        border-radius: 999px !important;
        background: #fff !important;
        box-shadow: 0 0 6px #fff !important;
      }

      /* ===== TS-style launcher strip / expanded popup ===== */
      #${MENU_ID}, #${SUBMENU_ID} {
        position: fixed !important;
        z-index: 2147483647 !important;
        box-sizing: border-box !important;
        width: 54px !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        gap: 8px !important;
        padding: 10px 6px !important;
        max-height: calc(100vh - 96px) !important;
        overflow-y: auto !important;
        overscroll-behavior: contain !important;
        background: rgba(10,10,12,0.78) !important;
        border: 1px solid rgba(255,255,255,0.08) !important;
        border-radius: 30px !important;
        backdrop-filter: blur(14px) saturate(150%) !important;
        -webkit-backdrop-filter: blur(14px) saturate(150%) !important;
        box-shadow:
          0 10px 30px -10px rgba(0,0,0,0.6),
          inset 0 0 0 1px rgba(255,255,255,0.04) !important;
        transform: translateY(0) scale(1) !important;
        transform-origin: bottom center !important;
        transition:
          width .28s cubic-bezier(.22,1,.36,1),
          left 260ms cubic-bezier(0.22,1,0.36,1),
          right 260ms cubic-bezier(0.22,1,0.36,1),
          top 260ms cubic-bezier(0.22,1,0.36,1),
          bottom 260ms cubic-bezier(0.22,1,0.36,1),
          transform 220ms cubic-bezier(.2,.9,.3,1.2),
          opacity 180ms ease !important;
        pointer-events: auto !important;
        font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
        color: #e4e4e7 !important;
        margin: 0 !important;
        visibility: visible !important;
        opacity: 1 !important;
      }
      #${MENU_ID}, #${SUBMENU_ID} {
        scrollbar-width: none !important;
        -ms-overflow-style: none !important;
      }
      #${MENU_ID}::-webkit-scrollbar, #${SUBMENU_ID}::-webkit-scrollbar { width: 0 !important; height: 0 !important; display: none !important; }
      #${MENU_ID}.ts-floating-menu-open, #${SUBMENU_ID} { display: flex !important; }
      #${MENU_ID}:not(.ts-floating-menu-open) { display: none !important; }
      #${MENU_ID}[data-align="right"], #${SUBMENU_ID}[data-align="right"] { align-items: center !important; }
      #${MENU_ID}[data-align="left"],  #${SUBMENU_ID}[data-align="left"]  { align-items: center !important; }

      #${MENU_ID} .ts-fab-expand-toggle {
        position: relative !important;
        width: 28px !important;
        height: 22px !important;
        display: grid !important;
        place-items: center !important;
        border-radius: 8px !important;
        border: 1px solid transparent !important;
        background: transparent !important;
        color: rgba(255,255,255,0.55) !important;
        cursor: pointer !important;
        margin: 0 auto 4px !important;
        padding: 0 !important;
        transition: width .32s cubic-bezier(.2,.9,.3,1.3), color .2s ease, background .2s ease !important;
        box-shadow: none !important;
      }
      #${MENU_ID} .ts-fab-expand-toggle:hover {
        color: #fff !important;
        background: rgba(255,255,255,0.06) !important;
      }
      #${MENU_ID} .ts-fab-expand-ico {
        display: inline-flex !important;
        transition: transform .32s cubic-bezier(.2,.9,.3,1.3) !important;
      }
      #${MENU_ID} .ts-fab-expand-ico svg { width: 15px !important; height: 15px !important; stroke: currentColor !important; }
      #${MENU_ID} .ts-fab-expand-label { display: none !important; }

      #${MENU_ID} .ts-fab-brand-title {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        height: 0 !important;
        overflow: hidden !important;
        pointer-events: none !important;
      }
      #${MENU_ID}.ts-community-expanded .ts-fab-brand-title {
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        height: auto !important;
        overflow: hidden !important;
        pointer-events: auto !important;
        padding: 4px 14px 12px !important;
        margin: 0 -4px 8px !important;
        font-size: 10px !important;
        font-weight: 800 !important;
        letter-spacing: .28em !important;
        text-align: center !important;
        text-transform: uppercase !important;
        background: linear-gradient(90deg, rgba(255,255,255,.82) 0%, var(--ts-brand-strong-base, var(--ts-brand-primary,#8B5CF6)) 50%, rgba(255,255,255,.82) 100%) !important;
        background-size: 200% 100% !important;
        -webkit-background-clip: text !important;
        background-clip: text !important;
        -webkit-text-fill-color: transparent !important;
        text-shadow: 0 0 24px rgba(var(--ts-brand-primary-rgb,139,92,246),0.25) !important;
        border-bottom: 1px solid rgba(var(--ts-brand-primary-rgb,139,92,246),0.14) !important;
        animation: tsPopupExpIn .32s cubic-bezier(.2,.9,.3,1.3) .05s both, tsPopupHeadShine 4s ease-in-out .4s infinite !important;
        position: relative !important;
        z-index: 1 !important;
      }
      #${MENU_ID}:not(.ts-community-expanded) .ts-fab-brand-title,
      #${MENU_ID}:not(.ts-community-expanded) .ts-fab-brand-title * {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        width: 0 !important;
        height: 0 !important;
      }
      #${MENU_ID}.ts-community-expanded::before {
        content: "" !important;
        display: none !important;
      }

      #${MENU_ID} .ts-fab-item, #${SUBMENU_ID} .ts-fab-item {
        position: relative !important;
        width: 40px !important;
        height: 40px !important;
        min-height: 40px !important;
        display: grid !important;
        place-items: center !important;
        padding: 0 !important;
        border-radius: 50% !important;
        border: 1px solid rgba(255,255,255,0.08) !important;
        background: rgba(255,255,255,0.04) !important;
        color: #d4d4d8 !important;
        cursor: pointer !important;
        overflow: visible !important;
        white-space: nowrap !important;
        text-align: left !important;
        font: 600 12.5px/1.15 Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
        box-shadow: none !important;
        opacity: 1 !important;
        visibility: visible !important;
        animation: tsPopupExpIn .32s cubic-bezier(.2,.9,.3,1.3) both !important;
        transition: transform .15s ease, background .15s ease, color .15s ease, border-color .15s ease, box-shadow .15s ease !important;
      }
      #${MENU_ID} .ts-fab-item:hover, #${SUBMENU_ID} .ts-fab-item:hover {
        transform: translateY(-1px) !important;
        background: rgba(255,255,255,0.09) !important;
        color: #fff !important;
        border-color: rgba(255,255,255,0.18) !important;
      }
      #${MENU_ID} .ts-fab-circle, #${SUBMENU_ID} .ts-fab-circle {
        width: 100% !important;
        height: 100% !important;
        border-radius: 50% !important;
        display: grid !important;
        place-items: center !important;
        color: currentColor !important;
        background: transparent !important;
        border: 0 !important;
        box-shadow: none !important;
        flex: 0 0 auto !important;
      }
      #${MENU_ID} .ts-fab-circle svg, #${SUBMENU_ID} .ts-fab-circle svg {
        width: 17px !important;
        height: 17px !important;
        stroke: currentColor !important;
      }
      #${MENU_ID} .ts-fab-label, #${SUBMENU_ID} .ts-fab-label {
        display: none !important;
        color: #f4f4f5 !important;
        font-size: 12.5px !important;
        font-weight: 600 !important;
        letter-spacing: .005em !important;
        white-space: nowrap !important;
        text-overflow: ellipsis !important;
        overflow: hidden !important;
        opacity: 0 !important;
        transform: translateX(-6px) !important;
        transition: opacity .22s ease, transform .28s cubic-bezier(.2,.9,.3,1.3) !important;
      }
      #${MENU_ID} .ts-fab-chevron { display: none !important; }

      #${MENU_ID}.ts-community-expanded, #${SUBMENU_ID} {
        align-items: stretch !important;
        width: min(268px, calc(100vw - 24px)) !important;
        padding: 16px 12px 14px !important;
        border-radius: 22px !important;
        gap: 3px !important;
        max-height: calc(100vh - 24px) !important;
        background:
          radial-gradient(140% 70% at 50% -10%, rgba(var(--ts-brand-primary-rgb),0.22) 0%, rgba(var(--ts-brand-primary-rgb),0) 55%),
          radial-gradient(80% 40% at 100% 100%, rgba(var(--ts-brand-primary-rgb),0.10) 0%, rgba(0,0,0,0) 60%),
          linear-gradient(180deg, rgba(20,20,24,0.88), rgba(8,8,11,0.92)) !important;
        border: 1px solid rgba(255,255,255,0.06) !important;
        backdrop-filter: blur(22px) saturate(160%) !important;
        -webkit-backdrop-filter: blur(22px) saturate(160%) !important;
        box-shadow:
          0 40px 90px -28px rgba(0,0,0,0.92),
          0 0 0 1px rgba(var(--ts-brand-primary-rgb),0.12),
          0 0 80px -22px rgba(var(--ts-brand-primary-rgb),0.35),
          inset 0 1px 0 rgba(255,255,255,0.07),
          inset 0 -1px 0 rgba(var(--ts-brand-primary-rgb),0.06) !important;
        overflow: hidden auto !important;
        scrollbar-width: none !important;
        -ms-overflow-style: none !important;
      }
      #${MENU_ID}:not(.ts-community-expanded)::before {
        content: "" !important;
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        width: 0 !important;
        height: 0 !important;
        overflow: hidden !important;
      }
      #${MENU_ID}.ts-community-expanded::before {
        content: attr(data-brand-title) !important;
        display: block !important;
        padding: 4px 14px 12px !important;
        margin: 0 -4px 8px !important;
        font-size: 10px !important;
        font-weight: 800 !important;
        letter-spacing: .28em !important;
        text-align: center !important;
        text-transform: uppercase !important;
        background: linear-gradient(90deg, rgba(255,255,255,.82) 0%, var(--ts-brand-strong-base) 50%, rgba(255,255,255,.82) 100%) !important;
        background-size: 200% 100% !important;
        -webkit-background-clip: text !important;
        background-clip: text !important;
        -webkit-text-fill-color: transparent !important;
        text-shadow: 0 0 24px rgba(var(--ts-brand-primary-rgb),0.25) !important;
        border-bottom: 1px solid rgba(var(--ts-brand-primary-rgb),0.14) !important;
        opacity: 0 !important;
        animation: tsPopupExpIn .32s cubic-bezier(.2,.9,.3,1.3) .05s both, tsPopupHeadShine 4s ease-in-out .4s infinite !important;
        position: relative !important;
        z-index: 1 !important;
      }
      #${MENU_ID}.ts-community-expanded::after, #${SUBMENU_ID}::after {
        content: "" !important;
        position: absolute !important;
        inset: -1px !important;
        border-radius: 22px !important;
        padding: 1px !important;
        background: conic-gradient(from var(--ts-popup-angle,0deg), rgba(var(--ts-brand-primary-rgb),0) 0%, rgba(var(--ts-brand-primary-rgb),0.55) 25%, rgba(var(--ts-brand-primary-rgb),0) 50%, rgba(var(--ts-brand-primary-rgb),0.35) 75%, rgba(var(--ts-brand-primary-rgb),0) 100%) !important;
        -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0) !important;
        mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0) !important;
        -webkit-mask-composite: xor !important;
        mask-composite: exclude !important;
        pointer-events: none !important;
        animation: tsPopupBorderSpin 6s linear infinite !important;
        opacity: .9 !important;
      }
      #${MENU_ID}.ts-community-expanded .ts-fab-expand-toggle {
        order: -1 !important;
        align-self: flex-end !important;
        width: 30px !important;
        height: 30px !important;
        margin: 0 2px 4px 0 !important;
        border-radius: 9px !important;
        color: rgba(255,255,255,0.55) !important;
        background: rgba(255,255,255,0.03) !important;
        border: 1px solid rgba(255,255,255,0.05) !important;
        z-index: 2 !important;
      }
      #${MENU_ID}.ts-community-expanded .ts-fab-expand-ico { transform: rotate(180deg) !important; }
      #${MENU_ID}.ts-community-expanded .ts-fab-expand-toggle:hover {
        color: var(--ts-brand-strong-base) !important;
        background: rgba(var(--ts-brand-primary-rgb),0.12) !important;
        border-color: rgba(var(--ts-brand-primary-rgb),0.35) !important;
        box-shadow: 0 0 16px -4px rgba(var(--ts-brand-primary-rgb),0.5) !important;
      }
      #${MENU_ID}.ts-community-expanded .ts-fab-item, #${SUBMENU_ID} .ts-fab-item {
        width: 100% !important;
        height: 44px !important;
        min-height: 44px !important;
        display: flex !important;
        justify-content: flex-start !important;
        align-items: center !important;
        gap: 13px !important;
        padding: 0 14px 0 12px !important;
        border-radius: 13px !important;
        border: 1px solid rgba(255,255,255,0.03) !important;
        background: transparent !important;
        color: #e4e4e7 !important;
        overflow: hidden !important;
        animation: tsPopupExpIn .32s cubic-bezier(.2,.9,.3,1.3) both !important;
        transition: background .22s ease, border-color .22s ease, transform .25s cubic-bezier(.2,.9,.3,1.3), color .2s ease, box-shadow .25s ease, padding-left .25s cubic-bezier(.2,.9,.3,1.3) !important;
        z-index: 1 !important;
      }
      #${MENU_ID}.ts-community-expanded .ts-fab-item::before, #${SUBMENU_ID} .ts-fab-item::before {
        content: "" !important;
        position: absolute !important;
        left: 5px !important;
        top: 50% !important;
        width: 3px !important;
        height: 0 !important;
        border-radius: 2px !important;
        background: linear-gradient(180deg, var(--ts-brand-strong-base), var(--ts-brand-strong)) !important;
        transform: translateY(-50%) !important;
        transition: height .28s cubic-bezier(.2,.9,.3,1.3), opacity .2s ease !important;
        opacity: 0 !important;
        box-shadow: 0 0 14px rgba(var(--ts-brand-primary-rgb),0.85) !important;
      }
      #${MENU_ID}.ts-community-expanded .ts-fab-item::after, #${SUBMENU_ID} .ts-fab-item::after {
        content: "" !important;
        position: absolute !important;
        top: 0 !important;
        left: -60% !important;
        width: 50% !important;
        height: 100% !important;
        background: linear-gradient(100deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%) !important;
        transform: skewX(-18deg) !important;
        transition: left .55s cubic-bezier(.2,.9,.3,1.3) !important;
        pointer-events: none !important;
      }
      #${MENU_ID}.ts-community-expanded .ts-fab-item:hover, #${SUBMENU_ID} .ts-fab-item:hover {
        background: linear-gradient(90deg, rgba(var(--ts-brand-primary-rgb),0.18) 0%, rgba(var(--ts-brand-primary-rgb),0.04) 100%) !important;
        border-color: rgba(var(--ts-brand-primary-rgb),0.28) !important;
        color: #fff !important;
        transform: translateX(3px) !important;
        padding-left: 16px !important;
        box-shadow: 0 4px 20px -10px rgba(var(--ts-brand-primary-rgb),0.45), inset 0 1px 0 rgba(255,255,255,0.05) !important;
      }
      #${MENU_ID}.ts-community-expanded .ts-fab-item:hover::after, #${SUBMENU_ID} .ts-fab-item:hover::after { left: 120% !important; }
      #${MENU_ID}.ts-community-expanded .ts-fab-item:hover::before, #${SUBMENU_ID} .ts-fab-item:hover::before { height: 24px !important; opacity: 1 !important; }
      #${MENU_ID}.ts-community-expanded .ts-fab-circle, #${SUBMENU_ID} .ts-fab-circle {
        width: 26px !important;
        height: 26px !important;
        display: grid !important;
        place-items: center !important;
        flex-shrink: 0 !important;
        border-radius: 8px !important;
        background: rgba(255,255,255,0.03) !important;
        border: 1px solid rgba(255,255,255,0.05) !important;
        color: rgba(255,255,255,0.75) !important;
        transition: color .2s ease, transform .25s cubic-bezier(.2,.9,.3,1.3), background .2s ease, border-color .2s ease !important;
      }
      #${MENU_ID}.ts-community-expanded .ts-fab-item:hover .ts-fab-circle,
      #${SUBMENU_ID} .ts-fab-item:hover .ts-fab-circle {
        color: #fff !important;
        background: rgba(var(--ts-brand-primary-rgb),0.18) !important;
        border-color: rgba(var(--ts-brand-primary-rgb),0.4) !important;
        transform: scale(1.08) rotate(-4deg) !important;
      }
      #${MENU_ID}.ts-community-expanded .ts-fab-label, #${SUBMENU_ID} .ts-fab-label {
        display: inline-block !important;
        opacity: 1 !important;
        transform: translateX(0) !important;
        max-width: 175px !important;
        font-weight: 500 !important;
        font-size: 13px !important;
      }
      #${MENU_ID}.ts-community-expanded .ts-fab-prompts .ts-fab-chevron {
        display: inline-flex !important;
        margin-left: auto !important;
        opacity: .55 !important;
      }
      #${MENU_ID}.ts-community-expanded .ts-fab-prompts .ts-fab-chevron svg {
        width: 14px !important;
        height: 14px !important;
        stroke: currentColor !important;
      }
      #${MENU_ID} .ts-fab-item:nth-child(2){ animation-delay: .02s !important; }
      #${MENU_ID} .ts-fab-item:nth-child(3){ animation-delay: .05s !important; }
      #${MENU_ID} .ts-fab-item:nth-child(4){ animation-delay: .08s !important; }
      #${MENU_ID} .ts-fab-item:nth-child(5){ animation-delay: .11s !important; }
      #${MENU_ID} .ts-fab-item:nth-child(6){ animation-delay: .14s !important; }
      @keyframes tsPopupExpIn {
        0% { opacity: 0; transform: translateX(-14px) scale(.97); filter: blur(4px); }
        100% { opacity: 1; transform: translateX(0) scale(1); filter: blur(0); }
      }
      @keyframes tsPopupBorderSpin { to { --ts-popup-angle: 360deg; } }
      @keyframes tsPopupHeadShine {
        0%,100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
      }

      /* Logout item — visually separated, danger tone on hover */
      #${MENU_ID}.ts-community-expanded .ts-fab-item[data-action="logout"] {
        margin-top: 8px !important;
        border-top: 1px solid rgba(255,255,255,0.06) !important;
        border-radius: 0 0 13px 13px !important;
        padding-top: 10px !important;
        color: #f4a4a4 !important;
      }
      #${MENU_ID}.ts-community-expanded .ts-fab-item[data-action="logout"]:hover {
        background: linear-gradient(90deg, rgba(239,68,68,0.20) 0%, rgba(239,68,68,0.04) 100%) !important;
        border-color: rgba(239,68,68,0.35) !important;
        color: #fecaca !important;
        box-shadow: 0 4px 20px -10px rgba(239,68,68,0.55), inset 0 1px 0 rgba(255,255,255,0.05) !important;
      }
      #${MENU_ID}.ts-community-expanded .ts-fab-item[data-action="logout"]:hover .ts-fab-circle {
        background: rgba(239,68,68,0.18) !important;
        border-color: rgba(239,68,68,0.4) !important;
        color: #fff !important;
      }
      #${MENU_ID} .ts-fab-item[data-action="logout"] { color: #f4a4a4 !important; border-color: rgba(239,68,68,0.18) !important; }
      #${MENU_ID} .ts-fab-item[data-action="logout"]:hover { background: rgba(239,68,68,0.14) !important; border-color: rgba(239,68,68,0.45) !important; color: #fff !important; }


      #ts-action-toast {
        position: fixed !important;
        z-index: 2147483647 !important;
        padding: 8px 14px !important;
        border-radius: 999px !important;
        background: rgba(20, 20, 25, 0.72) !important;
        backdrop-filter: blur(12px) saturate(150%) !important;
        -webkit-backdrop-filter: blur(12px) saturate(150%) !important;
        color: #fff !important;
        font: 600 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
        border: 1px solid rgba(255,255,255,0.10) !important;
        box-shadow: 0 8px 24px rgba(0,0,0,0.35) !important;
        pointer-events: none !important;
        opacity: 0 !important;
        transform: translate(-50%, 8px) !important;
        transition: opacity 180ms ease, transform 180ms ease !important;
        max-width: 80vw !important;
        white-space: nowrap !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
      }
      #ts-action-toast.ts-visible {
        opacity: 1 !important;
        transform: translate(-50%, 0) !important;
      }
      #ts-action-toast.ts-toast-error { border-color: rgba(239,68,68,0.55) !important; color: #fecaca !important; }
      #ts-action-toast.ts-toast-success { border-color: rgba(34,197,94,0.55) !important; color: #bbf7d0 !important; }

    `;
    (document.head || document.documentElement).appendChild(style);
  }

  function buildOverlay() {
    if (document.getElementById(ROOT_ID)) return document.getElementById(ROOT_ID);
    injectGlobalStyles();
    const root = document.createElement("div");
    root.id = ROOT_ID;
    root.setAttribute("data-mode", "popup-main");
    document.body.appendChild(root);
    console.info("[TS Overlay] Popup principal ativo (modo exclusivo).");
    return root;
  }

  let currentLayoutMode = "popup"; // popup-only
  // Built-in fallback prompts — used if iframe templates not yet received.
  const DEFAULT_PROMPTS = [
    { label: "Corrigir Bug",        icon: "🐛", prompt: "Identifique e corrija o bug deste código, explicando a causa raiz e a solução." },
    { label: "Refatorar",           icon: "♻️", prompt: "Refatore este código mantendo o comportamento, melhorando legibilidade, modularidade e nomes." },
    { label: "Melhorar UI",         icon: "🎨", prompt: "Melhore a UI deste componente: hierarquia visual, espaçamento, tipografia e responsividade." },
    { label: "Explicar Código",     icon: "📖", prompt: "Explique este código passo a passo, incluindo o porquê de cada decisão." },
    { label: "Otimizar",            icon: "⚡", prompt: "Otimize este código quanto a performance, complexidade e uso de memória." },
    { label: "Segurança",           icon: "🛡️", prompt: "Faça uma revisão de segurança: validação de input, XSS, SQLi, autorização e secrets." },
    { label: "Criar Teste",         icon: "🧪", prompt: "Crie testes unitários cobrindo casos felizes, erros e edge cases." },
    { label: "Responsividade",      icon: "📱", prompt: "Torne este layout totalmente responsivo (mobile, tablet, desktop) sem quebrar a estética." },
    { label: "SEO",                 icon: "🔎", prompt: "Otimize SEO: title, meta description, headings, alt em imagens, schema/JSON-LD e canonical." },
    { label: "Copy & Marketing",    icon: "✍️", prompt: "Reescreva este conteúdo com tom persuasivo, claro e voltado a conversão." },
    { label: "Cards & Botões",      icon: "🧩", prompt: "Crie variações de cards e botões com estados (hover, active, disabled) consistentes ao design system." },
    { label: "Fix Error",           icon: "🚑", prompt: "Analise este erro e proponha a correção exata, explicando a causa raiz." },
    { label: "Migração",            icon: "🚚", prompt: "Faça a migração mantendo compatibilidade, com plano passo a passo e rollback." },
    { label: "Transição",           icon: "🎬", prompt: "Adicione transições e animações suaves, respeitando prefers-reduced-motion." },
  ];
  let promptTemplates = DEFAULT_PROMPTS.slice();

  // ===================== Skills source (shared with Sidepanel) =====================
  // Builtins are loaded from the Edge Function list-skills via background
  // (chrome.runtime.sendMessage({type:"ts:getSkills"})). User skills are read
  // from chrome.storage.local under "sp_user_skills", so the slash picker
  // and the Skills data share one source.
  let BUILTIN_SKILLS = [
    { id: "builtin_accessibility", builtin: true, icon: "♿", name: "Accessibility Review", description: "Audita acessibilidade (WCAG 2.1 AA)", prefix: "/skill:accessibility" },
    { id: "builtin_redesign",      builtin: true, icon: "🎨", name: "Redesign",              description: "Refina o design mantendo a funcionalidade", prefix: "/skill:redesign" },
    { id: "builtin_seo_review",    builtin: true, icon: "🔍", name: "SEO Review",            description: "Auditoria técnica e on-page de SEO", prefix: "/skill:seo-review" },
    { id: "builtin_video_creator", builtin: true, icon: "🎬", name: "Video Creator",         description: "Gera vídeos curtos para o projeto", prefix: "/skill:video-creator" },
    { id: "builtin_skill_creator", builtin: true, icon: "🧩", name: "Skill Creator",         description: "Cria uma nova skill reutilizável", prefix: "" }
  ];
  let userSkillsCache = [];
  function slugifySkill(name) {
    return String(name || "skill").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 32) || "skill";
  }
  function normalizeSkill(s) {
    if (!s) return null;
    const name = s.name || s.label || "Skill";
    const slug = s.slug || (s.builtin ? slugifySkill(name) : "");
    const prefix = s.prefix || (slug ? ("/skill:" + slug) : "");
    return {
      id: s.id || slug || prefix,
      slug: slug || "",
      label: name,
      name: name,
      icon: s.icon || "⚡",
      description: s.description || "",
      prefix: prefix,
      content: s.content || "",
      builtin: !!s.builtin
    };
  }
  function normalizeEdgeSkill(s) {
    if (!s) return null;
    const slug = s.slug || s.id || "";
    if (!slug) return null;
    return {
      id: slug,
      slug: slug,
      name: s.name || s.label || "Skill",
      icon: s.icon || "⚡",
      description: s.description || "",
      prefix: s.prefix || "",
      content: s.content || "",
      builtin: s.is_builtin !== undefined ? !!s.is_builtin : !!s.builtin
    };
  }
  function refreshBuiltinSkillsFromEdge() {
    try {
      chrome.runtime.sendMessage({ type: "ts:getSkills" }, (resp) => {
        if (chrome.runtime.lastError) return;
        if (resp && resp.ok && Array.isArray(resp.skills)) {
          BUILTIN_SKILLS = resp.skills.map(normalizeEdgeSkill).filter(Boolean);
          console.log("[TS Skills] loaded", BUILTIN_SKILLS.length);
          if (typeof slashState !== "undefined" && slashState && slashState.open) {
            slashState.items = filterSlashItems(slashState.query);
            try { renderSlashList(); } catch(_){}
          }
        }
      });
    } catch (_) {}
  }
  function getAvailableSkills() {
    const all = BUILTIN_SKILLS.concat(userSkillsCache || []);
    return all.map(normalizeSkill).filter(Boolean);
  }
  try {
    if (chrome && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get(["sp_user_skills"], (r) => {
        userSkillsCache = Array.isArray(r && r.sp_user_skills) ? r.sp_user_skills : [];
      });
      chrome.storage.onChanged.addListener((ch, area) => {
        if (area === "local" && ch.sp_user_skills) {
          userSkillsCache = Array.isArray(ch.sp_user_skills.newValue) ? ch.sp_user_skills.newValue : [];
          if (slashState && slashState.open) {
            slashState.items = filterSlashItems(slashState.query);
            renderSlashList();
          }
        }
      });
    }
  } catch (_) { /* noop */ }
  refreshBuiltinSkillsFromEdge();


  function setSidebarCollapsed(collapsed) {
    const sidebar = document.getElementById(ROOT_ID);
    if (sidebar) sidebar.classList.toggle("ts-sidebar-collapsed", Boolean(collapsed));
    if (!document.body) return;
    const isPopup = currentLayoutMode === "popup";
    if (collapsed || isPopup) {
      document.body.classList.remove("ts-sidebar-open");
      document.documentElement.style.setProperty("--ts-sidebar-width", "0px");
    } else {
      document.body.classList.add("ts-sidebar-open");
      document.documentElement.style.setProperty("--ts-sidebar-width", TS_SIDEBAR_WIDTH + "px");
    }
  }

  function applyCollapsedState(collapsed) { setSidebarCollapsed(Boolean(collapsed)); }

  function applyLayoutMode(mode) {
    // Popup-only: ignore legacy layout values.
    currentLayoutMode = "popup";
    const root = document.getElementById(ROOT_ID);
    const isPopup = true;
    if (root) root.classList.toggle("ts-popup-mode", isPopup);

    const canShowActivePopupUi = isPopup && !!window.__tsLicenseReadyForPopup;
    if (document.body) document.body.classList.toggle("ts-native-chat-active", canShowActivePopupUi);

    if (canShowActivePopupUi) {
      updateComposerWrapMark();
      updateNativeBadge();
      buildLauncher();
      installNativeButtonInterceptors();
    } else {
      removeLauncher();
      removeNativeBadge();
      clearComposerWrapMark();
      clearPopupSelectedSkill();
    }
    try {
      chrome.storage.local.get({ sidebarCollapsed: false }, (r) => {
        setSidebarCollapsed(Boolean(r && r.sidebarCollapsed));
      });
    } catch (_) {
      setSidebarCollapsed(false);
    }
  }

  // ===================== Popup launcher =====================
  const LAUNCHER_SIZE = 56;

  // Try to detect the white preview area on lovable.dev so the launcher and
  // menu never overlaps the chat/history area. Falls back to viewport.
  function getPreviewBounds() {
    const sels = [
      'iframe[src*="lovableproject.com"]',
      'iframe[src*="lovable.app"]',
      'iframe[title*="preview" i]',
      'iframe[title*="Preview" i]',
      '[data-preview-container]',
      'main iframe',
    ];
    let best = null, bestArea = 0;
    for (const s of sels) {
      document.querySelectorAll(s).forEach((el) => {
        if (el.id === IFRAME_ID) return;
        const r = el.getBoundingClientRect();
        const a = r.width * r.height;
        if (a > bestArea && r.width > 200 && r.height > 200) { best = r; bestArea = a; }
      });
      if (best) break;
    }
    if (best) {
      return { left: best.left, top: best.top, right: best.right, bottom: best.bottom };
    }
    // Fallback — full viewport in popup-only mode.
    return { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
  }

  function clampLauncherPosition(x, y) {
    const b = getPreviewBounds();
    const pad = 8;
    return {
      x: Math.max(b.left + pad, Math.min(b.right - LAUNCHER_SIZE - pad, x)),
      y: Math.max(b.top + pad, Math.min(b.bottom - LAUNCHER_SIZE - pad, y)),
    };
  }
  function applyLauncherPosition(btn, pos) {
    if (!btn || !pos) return;
    const { x, y } = clampLauncherPosition(pos.x, pos.y);
    btn.style.setProperty("left", x + "px", "important");
    btn.style.setProperty("top", y + "px", "important");
    btn.style.setProperty("right", "auto", "important");
    btn.style.setProperty("bottom", "auto", "important");
  }
  function saveLauncherPosition(pos) {
    try { chrome.storage.local.set({ tsFloatingLauncherPosition: pos }); } catch (_) {}
  }
  function attachLauncherDrag(btn) {
    let dragging = false, moved = false, startX = 0, startY = 0, origX = 0, origY = 0;
    btn.addEventListener("pointerdown", (e) => {
      if (e.button !== 0) return;
      dragging = true; moved = false;
      const rect = btn.getBoundingClientRect();
      origX = rect.left; origY = rect.top;
      startX = e.clientX; startY = e.clientY;
      btn.classList.add("ts-launcher-dragging");
      try { btn.setPointerCapture(e.pointerId); } catch (_) {}
    });
    btn.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      const dx = e.clientX - startX, dy = e.clientY - startY;
      if (!moved && (Math.abs(dx) > 3 || Math.abs(dy) > 3)) moved = true;
      if (moved) {
        applyLauncherPosition(btn, { x: origX + dx, y: origY + dy });
        // Menu/submenu follow drag in real time.
        const m = document.getElementById(MENU_ID);
        if (m) positionMenuRelativeToLauncher(m);
        const s = document.getElementById(SUBMENU_ID);
        if (s) positionSubmenuRelativeToMenu(s);
      }
    });
    const finish = (e) => {
      if (!dragging) return;
      dragging = false;

      btn.classList.remove("ts-launcher-dragging");
      try { btn.releasePointerCapture(e.pointerId); } catch (_) {}
      if (moved) {
        const rect = btn.getBoundingClientRect();
        const pos = clampLauncherPosition(rect.left, rect.top);
        applyLauncherPosition(btn, pos);
        saveLauncherPosition(pos);
        btn.dataset.tsJustDragged = "1";
        setTimeout(() => { delete btn.dataset.tsJustDragged; }, 50);
      }
    };
    btn.addEventListener("pointerup", finish);
    btn.addEventListener("pointercancel", finish);
  }
  function buildLauncher() {
    if (!window.__tsLicenseReadyForPopup) return;
    if (document.getElementById(LAUNCHER_ID)) return;
    const btn = document.createElement("button");
    btn.id = LAUNCHER_ID;
    btn.type = "button";
    btn.title = ((window.tsBrandName && window.tsBrandName()) || "TS Community") + " — clique para abrir o menu (arraste para mover)";
    const img = document.createElement("img");
    img.src = getLogoUrl();
    img.alt = "QYRON";
    btn.appendChild(img);
    document.body.appendChild(btn);
    try {
      chrome.storage.local.get({ tsFloatingLauncherPosition: null }, (r) => {
        if (r && r.tsFloatingLauncherPosition) applyLauncherPosition(btn, r.tsFloatingLauncherPosition);
      });
    } catch (_) {}
    attachLauncherDrag(btn);
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (btn.dataset.tsJustDragged) return;
      toggleMenu();
    });
  }

  function removeLauncher() {
    const b = document.getElementById(LAUNCHER_ID); if (b) b.remove();
    closeMenu();
  }

  // ===================== Native composer detection + wrap =====================
  function findNativeComposer() {
    const candidates = [
      'textarea[placeholder*="Ask"]',
      'textarea[placeholder*="ask"]',
      'textarea[placeholder*="prompt" i]',
      'textarea[placeholder*="message" i]',
      'div[contenteditable="true"][role="textbox"]',
      'form textarea',
      'textarea',
    ];
    for (const sel of candidates) {
      const els = document.querySelectorAll(sel);
      for (const el of els) {
        if (el.closest && (el.closest(`#${ROOT_ID}`) || el.closest(`#${MENU_ID}`) || el.closest(`#${SUBMENU_ID}`))) continue;
        if (el.offsetParent !== null) return el;
      }
    }
    return null;
  }

  function findNativeComposerWrap() {
    const composer = findNativeComposer();
    if (!composer) return null;
    // Prefer enclosing form; else walk up looking for a container that also holds buttons.
    const form = composer.closest("form");
    if (form) return form;
    let el = composer.parentElement;
    let hops = 0;
    while (el && hops < 6) {
      const hasBtn = el.querySelector("button");
      const rect = el.getBoundingClientRect();
      if (hasBtn && rect.width > 200 && rect.height > 40) return el;
      el = el.parentElement; hops++;
    }
    return composer.parentElement || composer;
  }

  function updateComposerWrapMark() {
    if (currentLayoutMode !== "popup") return clearComposerWrapMark();
    const wrap = findNativeComposerWrap();
    // Clear stale marks
    document.querySelectorAll("." + COMPOSER_WRAP_CLASS).forEach((el) => {
      if (el !== wrap) el.classList.remove(COMPOSER_WRAP_CLASS);
    });
    if (wrap) wrap.classList.add(COMPOSER_WRAP_CLASS);
  }
  function clearComposerWrapMark() {
    document.querySelectorAll("." + COMPOSER_WRAP_CLASS).forEach((el) => el.classList.remove(COMPOSER_WRAP_CLASS));
  }

  function updateNativeBadge() {
    const existing = document.getElementById("ts-native-badge");
    if (!window.__tsLicenseReadyForPopup) { if (existing) existing.remove(); return; }
    if (currentLayoutMode !== "popup") { if (existing) existing.remove(); return; }
    const composer = findNativeComposer();
    if (!composer) { if (existing) existing.remove(); return; }
    const badge = existing || document.createElement("div");
    if (!existing) { badge.id = "ts-native-badge"; document.body.appendChild(badge); }
    badge.textContent = getTsActiveBadgeText();
    const wrap = findNativeComposerWrap() || composer;
    const rect = wrap.getBoundingClientRect();
    // Anchor TS ATIVO to top-right so it doesn't overlap attachment chips on the left.
    const bw = badge.offsetWidth || 70;
    const right = Math.min(window.innerWidth - bw - 8, rect.right - bw - 8);
    badge.style.setProperty("left", Math.max(8, right) + "px", "important");
    badge.style.setProperty("top", Math.max(8, rect.top - 28) + "px", "important");
  }
  function removeNativeBadge() {
    const b = document.getElementById("ts-native-badge"); if (b) b.remove();
  }

  // ===================== Selected Skill Badge (popup mode) =====================
  // When the user picks a skill via the slash picker, we don't write the
  // "/skill:..." prefix into the native textarea. Instead we keep the picked
  // skill in memory and render a small badge above the native composer.
  // The prefix is only prepended to the prompt at send time (and the badge is
  // cleared after the send is fired).
  let popupSelectedSkill = null;
  const SKILL_BADGE_ID = "ts-skill-badge";
  const SKILL_BADGE_STYLE_ID = "ts-skill-badge-style";
  // Tracks the textarea we've padded so we can revert padding cleanly
  let _skillPaddedTextarea = null;
  let _skillPaddedOriginal = "";
  function injectSkillBadgeStyles() {
    if (document.getElementById(SKILL_BADGE_STYLE_ID)) return;
    const s = document.createElement("style");
    s.id = SKILL_BADGE_STYLE_ID;
    s.textContent = `
      #${SKILL_BADGE_ID} {
        position: fixed; z-index: 2147483645;
        display: inline-flex; align-items: center; gap: 6px;
        padding: 3px 6px 3px 6px; border-radius: 8px;
        background: var(--ts-brand-gradient);
        color: #fff; font-family: -apple-system, BlinkMacSystemFont, "Inter", system-ui, sans-serif;
        font-size: 11px; font-weight: 600; letter-spacing: 0.01em; line-height: 1;
        box-shadow: 0 2px 6px rgba(var(--ts-brand-primary-rgb),.35);
        opacity: 0; transform: translateY(-2px);
        transition: opacity .15s ease, transform .15s ease, left .15s ease, top .15s ease;
        pointer-events: auto; cursor: default; user-select: none;
        max-width: 240px; height: 22px;
      }
      #${SKILL_BADGE_ID}.ts-skill-open { opacity: 1; transform: translateY(0); }
      #${SKILL_BADGE_ID} .ts-skill-badge-icon {
        width: 14px; height: 14px; border-radius: 50%;
        background: rgba(255,255,255,.25);
        display: inline-flex; align-items: center; justify-content: center;
        font-size: 9px;
      }
      #${SKILL_BADGE_ID} .ts-skill-badge-name {
        max-width: 170px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      }
      #${SKILL_BADGE_ID} .ts-skill-badge-x {
        margin-left: 2px; width: 14px; height: 14px; border-radius: 50%;
        background: rgba(255,255,255,.22); color: #fff; border: none; cursor: pointer;
        font-size: 12px; line-height: 1; display: inline-flex; align-items: center; justify-content: center;
        padding: 0; transition: background .15s ease;
      }
      #${SKILL_BADGE_ID} .ts-skill-badge-x:hover { background: rgba(255,255,255,.4); }
    `;
    document.head.appendChild(s);
  }
  function clearTextareaSkillPadding() {
    if (_skillPaddedTextarea) {
      try { _skillPaddedTextarea.style.paddingTop = _skillPaddedOriginal || ""; } catch (_) {}
      _skillPaddedTextarea = null;
      _skillPaddedOriginal = "";
    }
  }
  function applyTextareaSkillPadding() {
    const composer = findNativeComposer();
    if (!composer) return;
    if (_skillPaddedTextarea !== composer) {
      clearTextareaSkillPadding();
      _skillPaddedTextarea = composer;
      _skillPaddedOriginal = composer.style.paddingTop || "";
    }
    try { composer.style.paddingTop = "32px"; } catch (_) {}
  }
  function renderPopupSkillBadge() {
    let badge = document.getElementById(SKILL_BADGE_ID);
    if (!popupSelectedSkill || currentLayoutMode !== "popup") {
      if (badge) badge.remove();
      clearTextareaSkillPadding();
      return;
    }
    injectSkillBadgeStyles();
    if (!badge) {
      badge = document.createElement("div");
      badge.id = SKILL_BADGE_ID;
      document.body.appendChild(badge);
    }
    const icon = String(popupSelectedSkill.icon || "⚡");
    const isSvg = icon.trim().startsWith("<svg");
    const iconHtml = isSvg ? icon : escapeHtml(icon);
    const name = escapeHtml(popupSelectedSkill.label || popupSelectedSkill.name || "Skill");
    badge.innerHTML =
      `<span class="ts-skill-badge-icon">${iconHtml}</span>` +
      `<span class="ts-skill-badge-name">${name}</span>` +
      `<button type="button" class="ts-skill-badge-x" aria-label="Remover skill">×</button>`;
    const x = badge.querySelector(".ts-skill-badge-x");
    if (x) x.addEventListener("click", (e) => {
      e.preventDefault(); e.stopPropagation();
      clearPopupSelectedSkill();
    });
    applyTextareaSkillPadding();
    positionPopupSkillBadge();
    requestAnimationFrame(() => badge.classList.add("ts-skill-open"));
  }
  function positionPopupSkillBadge() {
    const badge = document.getElementById(SKILL_BADGE_ID);
    if (!badge) return;
    const composer = findNativeComposer();
    if (!composer) { badge.remove(); clearTextareaSkillPadding(); return; }
    // Anchor inside the textarea, top-left corner
    const r = composer.getBoundingClientRect();
    const bw = badge.offsetWidth || 140;
    const top = r.top + 6;
    const left = Math.max(8, r.left + 8);
    badge.style.left = Math.min(left, window.innerWidth - bw - 8) + "px";
    badge.style.top = top + "px";
  }
  function setPopupSelectedSkill(skill) {
    popupSelectedSkill = skill || null;
    renderPopupSkillBadge();
  }
  function clearPopupSelectedSkill() {
    popupSelectedSkill = null;
    clearTextareaSkillPadding();
    renderPopupSkillBadge();
  }

  setInterval(() => {
    if (currentLayoutMode !== "popup") return;
    updateComposerWrapMark();
    updateNativeBadge();
    if (popupSelectedSkill) positionPopupSkillBadge();
    if (typeof popupAttachments !== "undefined" && popupAttachments.length) positionPopupAttachments();
    bindNativeButtonHandlers();
    bindNativeDropHandlers();
  }, 800);
  window.addEventListener("scroll", () => {
    if (currentLayoutMode !== "popup") return;
    updateNativeBadge();
    if (popupSelectedSkill) positionPopupSkillBadge();
    if (typeof popupAttachments !== "undefined" && popupAttachments.length) positionPopupAttachments();
  }, true);
  window.addEventListener("resize", () => {
    if (currentLayoutMode !== "popup") return;
    updateNativeBadge();
    if (popupSelectedSkill) positionPopupSkillBadge();
    if (typeof popupAttachments !== "undefined" && popupAttachments.length) positionPopupAttachments();
  });


  // ===================== Popup attachment previews =====================
  const POPUP_ATTACH_ID = "ts-popup-attach-preview";
  const POPUP_ATTACH_STYLE_ID = "ts-popup-attach-style";
  let popupAttachments = []; // [{ id, name, size, type, blobUrl, file }]

  function injectPopupAttachStyles() {
    if (document.getElementById(POPUP_ATTACH_STYLE_ID)) return;
    const s = document.createElement("style");
    s.id = POPUP_ATTACH_STYLE_ID;
    s.textContent = `
      #${POPUP_ATTACH_ID} {
        position: fixed; z-index: 2147483645;
        display: flex; flex-wrap: wrap; gap: 6px;
        max-width: 520px; pointer-events: auto;
        font-family: -apple-system, BlinkMacSystemFont, "Inter", system-ui, sans-serif;
      }
      #${POPUP_ATTACH_ID} .ts-att-item {
        display: inline-flex; align-items: center; gap: 6px;
        padding: 4px 6px 4px 4px; border-radius: 10px;
        background: rgba(var(--ts-brand-primary-rgb), 0.14);
        border: 1px solid rgba(var(--ts-brand-primary-rgb), 0.38);
        color: #f4f4f5; font-size: 11px; font-weight: 500;
        max-width: 220px;
        backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
        box-shadow: 0 2px 8px rgba(0,0,0,0.25);
      }
      #${POPUP_ATTACH_ID} .ts-att-thumb {
        width: 28px; height: 28px; border-radius: 6px; object-fit: cover;
        background: rgba(255,255,255,0.08);
        display: inline-flex; align-items: center; justify-content: center;
        font-size: 12px;
      }
      #${POPUP_ATTACH_ID} .ts-att-name {
        max-width: 130px; white-space: nowrap; overflow: hidden;
        text-overflow: ellipsis;
      }
      #${POPUP_ATTACH_ID} .ts-att-x {
        width: 16px; height: 16px; border-radius: 50%;
        background: rgba(255,255,255,0.20); color: #fff; border: none;
        cursor: pointer; font-size: 12px; line-height: 1;
        display: inline-flex; align-items: center; justify-content: center;
        padding: 0; transition: background .15s ease;
      }
      #${POPUP_ATTACH_ID} .ts-att-x:hover { background: rgba(255,255,255,0.4); }
    `;
    document.head.appendChild(s);
  }

  function renderPopupAttachments() {
    let host = document.getElementById(POPUP_ATTACH_ID);
    if (currentLayoutMode !== "popup" || !popupAttachments.length) {
      if (host) host.remove();
      return;
    }
    injectPopupAttachStyles();
    if (!host) {
      host = document.createElement("div");
      host.id = POPUP_ATTACH_ID;
      document.body.appendChild(host);
    }
    host.innerHTML = popupAttachments.map((a) => {
      const isImg = a.type && a.type.indexOf("image/") === 0;
      const thumb = isImg && a.blobUrl
        ? `<img class="ts-att-thumb" src="${a.blobUrl}" alt="">`
        : `<span class="ts-att-thumb">📄</span>`;
      const name = escapeHtml(a.name);
      let status = "";
      if (a.uploading) status = `<span class="ts-att-status" title="Enviando…">⏳</span>`;
      else if (a.uploadFailed) status = `<span class="ts-att-status" title="Falha no upload">⚠</span>`;
      else if (a.ready) status = `<span class="ts-att-status" title="Pronto">✓</span>`;
      return `<div class="ts-att-item" data-id="${a.id}">${thumb}<span class="ts-att-name" title="${name}">${name}</span>${status}<button type="button" class="ts-att-x" aria-label="Remover anexo" data-id="${a.id}">×</button></div>`;
    }).join("");
    host.querySelectorAll(".ts-att-x").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault(); e.stopPropagation();
        removePopupAttachment(btn.getAttribute("data-id"));
      });
    });
    positionPopupAttachments();
  }

  function positionPopupAttachments() {
    const host = document.getElementById(POPUP_ATTACH_ID);
    if (!host) return;
    const composer = findNativeComposerWrap() || findNativeComposer();
    if (!composer) { host.remove(); return; }
    const r = composer.getBoundingClientRect();
    host.style.left = Math.max(8, r.left + 4) + "px";
    const h = host.offsetHeight || 36;
    host.style.top = Math.max(8, r.top - h - 6) + "px";
    host.style.maxWidth = Math.min(r.width, 520) + "px";
  }

  function addPopupAttachments(files) {
    const arr = Array.from(files || []);
    for (const f of arr) {
      if (!f) continue;
      // Avoid duplicate if another extension context already broadcast this file
      const dup = popupAttachments.find(a => a.name === (f.name || "arquivo") && a.size === (f.size || 0));
      if (dup) continue;
      const id = "att_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8);
      let blobUrl = null;
      try { if (f.type && f.type.indexOf("image/") === 0) blobUrl = URL.createObjectURL(f); } catch (_) {}
      popupAttachments.push({
        id, name: f.name || "arquivo", size: f.size || 0,
        type: f.type || "", blobUrl, file: f,
        uploading: true, uploadFailed: false, ready: false,
      });
    }
    renderPopupAttachments();
  }

  function syncPopupAttachmentsFromSidepanel(items) {
    const keyOf = (x) => (x.name || "") + "::" + (x.size || 0);
    const incomingKeys = new Set(items.map(keyOf));
    const removed = popupAttachments.filter(a => !incomingKeys.has(keyOf(a)));
    for (const r of removed) { try { if (r.blobUrl) URL.revokeObjectURL(r.blobUrl); } catch(_){} }
    popupAttachments = popupAttachments.filter(a => incomingKeys.has(keyOf(a)));
    for (const it of items) {
      const existing = popupAttachments.find(a => keyOf(a) === keyOf(it));
      if (existing) {
        existing.uploading = !!it.uploading;
        existing.uploadFailed = !!it.uploadFailed;
        existing.ready = !!it.ready;
        existing.upload = it.upload || existing.upload || null;
        if (it.type) existing.type = it.type;
      } else {
        popupAttachments.push({
          id: "att_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8),
          name: it.name || "arquivo", size: it.size || 0, type: it.type || "",
          blobUrl: null, file: null,
          uploading: !!it.uploading, uploadFailed: !!it.uploadFailed, ready: !!it.ready,
          upload: it.upload || null,
        });
      }
    }
    // Expose a single source of truth for ready uploads
    try {
      window.TS_PENDING_ATTACHMENTS = popupAttachments
        .filter(a => a.ready && a.upload)
        .map(a => a.upload);
    } catch (_) {}
    renderPopupAttachments();
  }

  window.addEventListener("message", (ev) => {
    const d = ev && ev.data;
    if (!d || d.type !== "TS_OVERLAY_ATTACH_STATE") return;
    syncPopupAttachmentsFromSidepanel(Array.isArray(d.items) ? d.items : []);
  });

  // ===================== Native Lovable upload capture (popup) =====================
  // pageHook.js intercepts fetch/XHR responses from api.lovable.dev file endpoints
  // and posts TS_NATIVE_LOVABLE_FILE_UPLOADED with the native file metadata.
  // We collect those here so popup send can attach them as payload.files.
  window.__tsNativeLovableFiles = window.__tsNativeLovableFiles || [];
  window.__tsNativeUploadPending = window.__tsNativeUploadPending || false;

  function tsNormalizeNativeFile(f) {
    const type = f.type || f.content_type || f.mime_type || f.file_type || "application/octet-stream";
    const size = f.file_size_bytes || f.size || null;
    const url = f.url || f.file_url || f.download_url || "";
    return {
      file_id: f.file_id,
      file_name: f.file_name || f.name || "file",
      name: f.name || f.file_name || "file",
      type,
      file_type: type,
      content_type: type,
      file_size_bytes: size,
      original_file_name: f.original_file_name || f.file_name || f.name || "file",
      original_file_size_bytes: size,
      file_url: f.file_url || url || "",
      url: url,
      download_url: f.download_url || f.file_url || url || "",
      is_native_image: (type || "").indexOf("image/") === 0
    };
  }

  window.addEventListener("message", (ev) => {
    const d = ev && ev.data;
    if (d && d.source === "TS_LOVABLE_PAGE_HOOK" && d.type === "TS_NATIVE_LOVABLE_FILE_UPLOAD_STARTED") {
      window.__tsNativeUploadPending = true;
      try { tsDebug("[TS Popup] Native Lovable upload observed"); } catch (_) {}
      return;
    }
    if (!d || d.source !== "TS_LOVABLE_PAGE_HOOK" || d.type !== "TS_NATIVE_LOVABLE_FILE_UPLOADED") return;
    const raw = d.file || {};
    if (!raw.file_id) return;
    const arr = window.__tsNativeLovableFiles;
    if (arr.some(x => x.file_id === raw.file_id)) return;
    const norm = tsNormalizeNativeFile(raw);
    arr.push(norm);
    // Match to the oldest still-uploading popup preview and mark it ready.
    try {
      let matchIdx = -1;
      if (norm.file_name) {
        matchIdx = popupAttachments.findIndex(a => a.uploading && a.name === norm.file_name);
      }
      if (matchIdx < 0) matchIdx = popupAttachments.findIndex(a => a.uploading);
      if (matchIdx >= 0) {
        popupAttachments[matchIdx].uploading = false;
        popupAttachments[matchIdx].ready = true;
        popupAttachments[matchIdx].upload = norm;
      }
    } catch (_) {}
    window.__tsNativeUploadPending = popupAttachments.some(a => a.uploading);
    try { renderPopupAttachments(); } catch (_) {}
    tsDebug("[TS Popup] Native Lovable file captured", norm.file_id, norm.file_name);
  });

  function popupHasPendingUploads() {
    if (window.__tsNativeUploadPending) return true;
    return popupAttachments.some(a => a.uploading);
  }
  function popupHasFailedUploads() {
    return popupAttachments.some(a => a.uploadFailed);
  }
  function popupReadyUploads() {
    return (window.__tsNativeLovableFiles || [])
      .filter(f => f && f.file_id)
      .map(tsNormalizeNativeFile);
  }

  function removePopupAttachment(id) {
    const item = popupAttachments.find((a) => a.id === id);
    if (!item) return;
    popupAttachments = popupAttachments.filter((a) => a.id !== id);
    try { if (item.blobUrl) URL.revokeObjectURL(item.blobUrl); } catch (_) {}
    try {
      const uploadId = item && item.upload && item.upload.file_id;
      window.__tsNativeLovableFiles = (window.__tsNativeLovableFiles || []).filter((f) => {
        if (uploadId && f && f.file_id === uploadId) return false;
        return !(!uploadId && f && (f.file_name || f.name) === item.name);
      });
    } catch (_) {}
    renderPopupAttachments();
  }
  function clearPopupAttachments() {
    for (const a of popupAttachments) {
      try { if (a.blobUrl) URL.revokeObjectURL(a.blobUrl); } catch (_) {}
    }
    popupAttachments = [];
    renderPopupAttachments();

  }


  // ===================== FAB menu =====================
  let isFloatingMenuOpen = false;

  function closeMenu() {
    isFloatingMenuOpen = false;
    const m = document.getElementById(MENU_ID);
    if (m) { m.classList.remove("ts-floating-menu-open"); m.remove(); }
    closeSubmenu();
    const b = document.getElementById(LAUNCHER_ID);
    if (b) { b.classList.remove("ts-launcher-active"); b.classList.remove("ts-floating-menu-open"); }
    console.log("[TS Popup] Menu open:", isFloatingMenuOpen);
  }
  function closeSubmenu() {
    const s = document.getElementById(SUBMENU_ID); if (s) s.remove();
  }

  function toggleMenu() {
    console.log("[TS Popup] Launcher clicked");
    if (isFloatingMenuOpen || document.getElementById(MENU_ID)) { closeMenu(); return; }
    openMenu();
  }

  function escapeHtml(s) {
    return String(s || "").replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
  }

  // Lucide icon SVGs (stroke uses currentColor in CSS).
  const LICON = {
    badgeX:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/></svg>',
    download:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
    sparkles:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>',
    library:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m16 6 4 14"/><path d="M12 6v14"/><path d="M8 8v12"/><path d="M4 4v16"/></svg>',
    chevronR:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>',
    chevronL:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>',
    plus:       '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
    cloud:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19a4.5 4.5 0 1 0-1.4-8.78 6 6 0 0 0-11.6 2.03A4 4 0 0 0 6 19h11.5Z"/></svg>',
    gear:       '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
    clock:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    logout:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>',
  };


  function getMainItems() {
    return [
      { action: "license-settings", icon: LICON.gear,       label: "Configurações da Licença" },
      { action: "history",          icon: LICON.clock,      label: "Histórico" },
      { action: "create-project",   icon: LICON.plus,       label: "Novo Projeto" },
      { action: "migrate-cloud",    icon: LICON.cloud,      label: "Migrar Cloud" },
      { action: "watermark",        icon: LICON.badgeX,     label: tsFloatT('floating.removeWatermark') },
      { action: "download",         icon: LICON.download,   label: tsFloatT('floating.download') },
      { action: "optimize",         icon: LICON.sparkles,   label: tsFloatT('floating.optimize') },
      { action: "prompts",          icon: LICON.library,    label: tsFloatT('floating.readyPrompts'), isPrompts: true },
      { action: "logout",           icon: LICON.logout,     label: "Sair", isLogout: true },
    ];
  }


  // Determine which side of the preview the launcher is on, to align the
  // menu opposite of the closest edge.
  function getMenuAnchor() {
    const launcher = document.getElementById(LAUNCHER_ID);
    const bounds = getPreviewBounds();
    if (!launcher) return { hAlign: "right", vAlign: "up" };
    const r = launcher.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const midX = (bounds.left + bounds.right) / 2;
    const midY = (bounds.top + bounds.bottom) / 2;
    return {
      hAlign: cx >= midX ? "right" : "left", // launcher on right ⇒ items align right
      vAlign: cy >= midY ? "up" : "down",
    };
  }

  function positionMenuRelativeToLauncher(menu) {
    const launcher = document.getElementById(LAUNCHER_ID);
    const bounds = getPreviewBounds();
    const anchor = getMenuAnchor();
    menu.setAttribute("data-align", anchor.hAlign);
    // Reset position props
    ["left","right","top","bottom"].forEach((p) => menu.style.setProperty(p, "auto", "important"));
    if (!launcher) {
      menu.style.setProperty("right", "24px", "important");
      menu.style.setProperty("bottom", "90px", "important");
      return;
    }
    const rect = launcher.getBoundingClientRect();
    const gap = 12;
    if (anchor.hAlign === "right") {
      menu.style.setProperty("right", Math.max(8, window.innerWidth - rect.right) + "px", "important");
    } else {
      menu.style.setProperty("left", Math.max(8, rect.left) + "px", "important");
    }
    if (anchor.vAlign === "up") {
      menu.style.setProperty("bottom", Math.max(8, window.innerHeight - rect.top + gap) + "px", "important");
    } else {
      menu.style.setProperty("top", Math.max(8, rect.bottom + gap) + "px", "important");
    }
    // Constrain inside preview bounds
    menu.style.setProperty("max-width", Math.max(160, bounds.right - bounds.left - 16) + "px", "important");
  }

  function positionSubmenuRelativeToMenu(sub) {
    const menu = document.getElementById(MENU_ID);
    if (!menu) return;
    const anchor = getMenuAnchor();
    sub.setAttribute("data-align", anchor.hAlign);
    ["left","right","top","bottom"].forEach((p) => sub.style.setProperty(p, "auto", "important"));
    const mRect = menu.getBoundingClientRect();
    const gap = 10;
    if (anchor.hAlign === "right") {
      // Open to the LEFT of the main menu
      sub.style.setProperty("right", Math.max(8, window.innerWidth - mRect.left + gap) + "px", "important");
    } else {
      // Open to the RIGHT of the main menu
      sub.style.setProperty("left", Math.max(8, mRect.right + gap) + "px", "important");
    }
    sub.style.setProperty("bottom", Math.max(8, window.innerHeight - mRect.bottom) + "px", "important");
  }

  let hoverSubmenuTimer = null;

  function openMenu() {
    const existing = document.getElementById(MENU_ID);
    if (existing) existing.remove();
    closeSubmenu();

    const menu = document.createElement("div");
    menu.id = MENU_ID;
    menu.setAttribute("role", "menu");
    try {
      const brand = ((typeof window.tsBrandName === "function" && window.tsBrandName()) || "TS Community").replace(/[\r\n\t]+/g, " ").trim();
      menu.setAttribute("data-brand-title", "◆  " + String(brand || "TS Community").toUpperCase() + "  ◆");
    } catch (_) {
      menu.setAttribute("data-brand-title", "◆  TS COMMUNITY  ◆");
    }
    const expandToggle = `<button type="button" class="ts-fab-expand-toggle" aria-label="Expandir menu"><span class="ts-fab-expand-ico">${LICON.chevronL}</span><span class="ts-fab-expand-label">Expandir</span></button>`;
    let brandTitleHtml = "";
    try {
      const brandName = ((typeof window.tsBrandName === "function" && window.tsBrandName()) || "TS Community").replace(/[\r\n\t]+/g, " ").trim();
      brandTitleHtml = `<div class="ts-fab-brand-title" data-ts-brand="name">◆  ${escapeHtml(String(brandName || "TS Community").toUpperCase())}  ◆</div>`;
    } catch (_) {
      brandTitleHtml = `<div class="ts-fab-brand-title" data-ts-brand="name">◆  TS COMMUNITY  ◆</div>`;
    }
    menu.innerHTML = expandToggle + brandTitleHtml + getMainItems().map((it, i) => {
      const chev = it.isPrompts ? `<span class="ts-fab-chevron">${LICON.chevronL}</span>` : "";
      return `<button type="button" class="ts-fab-item ${it.isPrompts ? "ts-fab-prompts" : ""}" data-action="${it.action}" title="${escapeHtml(it.label)}" style="animation-delay:${i * 40}ms">` +
        `<span class="ts-fab-circle">${it.icon}</span>` +
        `<span class="ts-fab-label">${escapeHtml(it.label)}</span>` +
        chev +
      `</button>`;
    }).join("");
    document.body.appendChild(menu);
    menu.classList.add("ts-floating-menu-open");
    positionMenuRelativeToLauncher(menu);

    try {
      chrome.storage.local.get({ tsFloatingMenuExpanded: false }, (r) => {
        if (r && r.tsFloatingMenuExpanded) {
          menu.classList.add("ts-community-expanded");
          positionMenuRelativeToLauncher(menu);
        }
      });
    } catch (_) {}

    const expander = menu.querySelector(".ts-fab-expand-toggle");
    if (expander) {
      expander.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        menu.classList.toggle("ts-community-expanded");
        try { chrome.storage.local.set({ tsFloatingMenuExpanded: menu.classList.contains("ts-community-expanded") }); } catch (_) {}
        positionMenuRelativeToLauncher(menu);
        const s = document.getElementById(SUBMENU_ID);
        if (s) positionSubmenuRelativeToMenu(s);
      });
    }

    isFloatingMenuOpen = true;
    const b = document.getElementById(LAUNCHER_ID);
    if (b) { b.classList.add("ts-launcher-active"); b.classList.add("ts-floating-menu-open"); }

    console.log("[TS Popup] Menu open:", isFloatingMenuOpen);

    menu.querySelectorAll("[data-action]").forEach((btn) => {
      const action = btn.getAttribute("data-action");
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        handleMenuAction(action);
      });
      if (action === "prompts") {
        btn.addEventListener("mouseenter", () => {
          if (hoverSubmenuTimer) clearTimeout(hoverSubmenuTimer);
          if (!document.getElementById(SUBMENU_ID)) openPromptsSubmenu();
        });
        btn.addEventListener("mouseleave", () => {
          if (hoverSubmenuTimer) clearTimeout(hoverSubmenuTimer);
          hoverSubmenuTimer = setTimeout(() => {
            const sub = document.getElementById(SUBMENU_ID);
            if (sub && !sub.matches(":hover")) closeSubmenu();
          }, 220);
        });
      } else {
        btn.addEventListener("mouseenter", () => { closeSubmenu(); });
      }
    });

    const onDocClick = (ev) => {
      const launcher = document.getElementById(LAUNCHER_ID);
      const sub = document.getElementById(SUBMENU_ID);
      const m = document.getElementById(MENU_ID);
      if (m && m.contains(ev.target)) return;
      if (sub && sub.contains(ev.target)) return;
      if (launcher && launcher.contains(ev.target)) return;
      closeMenu();
      document.removeEventListener("click", onDocClick, true);
    };
    setTimeout(() => document.addEventListener("click", onDocClick, true), 0);

    const reposition = () => {
      if (!isFloatingMenuOpen) return;
      positionMenuRelativeToLauncher(menu);
      const s = document.getElementById(SUBMENU_ID);
      if (s) positionSubmenuRelativeToMenu(s);
    };
    window.addEventListener("resize", reposition);
    window.addEventListener("scroll", reposition, true);
  }

  function openPromptsSubmenu() {
    closeSubmenu();
    const menu = document.getElementById(MENU_ID);
    if (!menu) return;
    const sub = document.createElement("div");
    sub.id = SUBMENU_ID;
    sub.className = "ts-community-expanded";
    sub.setAttribute("role", "menu");
    const list = (promptTemplates && promptTemplates.length) ? promptTemplates : [];
    sub.innerHTML = list.length
      ? list.map((t, i) =>
          `<button class="ts-fab-item" data-prompt-index="${i}" style="animation-delay:${i * 25}ms" title="${escapeHtml(t.label)}">` +
            `<span class="ts-fab-circle">${escapeHtml(t.icon || "⚡")}</span>` +
            `<span class="ts-fab-label">${escapeHtml(t.label)}</span>` +
          `</button>`
        ).join("")
      : `<div class="ts-fab-item" style="cursor:default;opacity:1">Carregando prompts…</div>`;
    document.body.appendChild(sub);
    positionSubmenuRelativeToMenu(sub);

    sub.addEventListener("mouseenter", () => {
      if (hoverSubmenuTimer) clearTimeout(hoverSubmenuTimer);
    });
    sub.addEventListener("mouseleave", () => {
      if (hoverSubmenuTimer) clearTimeout(hoverSubmenuTimer);
      hoverSubmenuTimer = setTimeout(() => closeSubmenu(), 220);
    });

    sub.querySelectorAll("[data-prompt-index]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const idx = parseInt(btn.getAttribute("data-prompt-index"), 10);
        const t = promptTemplates[idx];
        if (!t) return;
        const ok = insertIntoNativeLovableTextarea(t.prompt);
        if (ok) {
          showStatus("✓ Prompt inserido — revise e envie", "success");
        } else {
          showStatus("✗ Composer nativo não encontrado", "error");
        }
        closeSubmenu();
      });
    });
  }


  function handleMenuAction(action) {
    if (action === "create-project") {
      closeMenu();
      showStatus("⏳ Criando novo projeto no Lovable…");
      try {
        chrome.runtime.sendMessage({
          action: "createLovableProjectInPage",
          projectName: "Projeto " + new Date().toLocaleString("pt-BR")
        }, (resp) => {
          if (chrome.runtime.lastError) {
            showStatus("✗ " + chrome.runtime.lastError.message, "error");
            return;
          }
          if (!resp || !resp.ok) {
            showStatus("✗ " + ((resp && resp.error) || "Falha ao criar projeto."), "error");
            return;
          }
          showStatus("✅ Projeto criado! Abrindo…", "success");
        });
      } catch (e) {
        showStatus("✗ " + (e && e.message || "Erro inesperado."), "error");
      }
    } else if (action === "license-settings") {
      closeMenu();
      try { window.tsOpenLicenseSettingsModal && window.tsOpenLicenseSettingsModal(); }
      catch (e) { showStatus("✗ " + (e && e.message || "Falha ao abrir Configurações."), "error"); }
    } else if (action === "history") {
      closeMenu();
      try { window.tsOpenPromptHistoryModal && window.tsOpenPromptHistoryModal(); }
      catch (e) { showStatus("✗ " + (e && e.message || "Falha ao abrir Histórico."), "error"); }
    } else if (action === "migrate-cloud") {
      closeMenu();
      openMigrateCloudModalOverlay();

    } else if (action === "watermark") {
      closeMenu();
      tsRemoveWatermarkFromPopup();
    } else if (action === "download") {
      closeMenu();
      tsDownloadCurrentLovableProjectFromPopup().catch(function(e){
        try { showStatus("✗ " + (e && e.message || "Falha no download."), "error"); } catch(_) {}
      });
    } else if (action === "optimize") {
      showStatus("🚧 Otimizar com IA estará disponível em breve.");
      closeMenu();



    } else if (action === "prompts") {
      if (document.getElementById(SUBMENU_ID)) { closeSubmenu(); return; }
      openPromptsSubmenu();
    } else if (action === "logout") {
      closeMenu();
      try {
        chrome.storage.local.remove(
          ["ql_license_valid","ql_license_key","ql_session_id","ql_user_name","ql_expires_at","ql_activated_at","ql_license_status","ql_license_type"],
          () => {
            try { showStatus("✓ Sessão encerrada. Faça login novamente.", "success"); } catch(_) {}
            try { chrome.runtime.sendMessage({ action: "logout" }, () => void chrome.runtime.lastError); } catch(_) {}
            setTimeout(() => { try { location.reload(); } catch(_) {} }, 600);
          }
        );
      } catch (e) {
        showStatus("✗ " + (e && e.message || "Falha ao sair."), "error");
      }
    }
  }

  let statusTimer = null;
  function showStatus(text, variant) {
    let el = document.getElementById("ts-action-toast");
    if (!el) {
      el = document.createElement("div");
      el.id = "ts-action-toast";
      document.body.appendChild(el);
    }
    el.textContent = text || "";
    el.classList.remove("ts-toast-error", "ts-toast-success");
    if (variant === "error") el.classList.add("ts-toast-error");
    if (variant === "success") el.classList.add("ts-toast-success");

    // Anchor above the active composer (native or extension)
    let anchorRect = null;
    try {
      const wrap = findNativeComposerWrap();
      if (wrap) anchorRect = wrap.getBoundingClientRect();
    } catch (_) {}
    if (!anchorRect) {
      const composer = findNativeComposer();
      if (composer) anchorRect = composer.getBoundingClientRect();
    }
    let centerX, bottomY;
    if (anchorRect && anchorRect.width > 0) {
      centerX = anchorRect.left + anchorRect.width / 2;
      bottomY = Math.max(8, window.innerHeight - anchorRect.top + 10);
    } else {
      centerX = window.innerWidth / 2;
      bottomY = 24;
    }
    el.style.setProperty("left", centerX + "px", "important");
    el.style.setProperty("right", "auto", "important");
    el.style.setProperty("top", "auto", "important");
    el.style.setProperty("bottom", bottomY + "px", "important");

    // Force reflow then show
    void el.offsetWidth;
    el.classList.add("ts-visible");

    if (statusTimer) clearTimeout(statusTimer);
    statusTimer = setTimeout(() => {
      try {
        el.classList.remove("ts-visible");
        setTimeout(() => { try { el.remove(); } catch (_) {} }, 220);
      } catch (_) {}
      statusTimer = null;
    }, 2000);
  }

  let tsRemoveWatermarkInFlight = false;
  async function tsRemoveWatermarkFromPopup() {
    if (tsRemoveWatermarkInFlight) {
      showStatus("⏳ Remoção já está em andamento…");
      return;
    }
    tsRemoveWatermarkInFlight = true;
    showStatus("⏳ Removendo marca d'água…");
    try {
      const storageData = await new Promise((resolve) => {
        chrome.storage.local.get(["lovable_projectId", "ql_license_key"], resolve);
      });
      const projectId = (storageData && storageData.lovable_projectId) || tsExtractLovableProjectIdFromUrl();
      const token = await tsResolveLovableToken({ forceRefresh: true });
      const licenseKey = (storageData && storageData.ql_license_key) || "";

      if (!projectId) throw new Error("Projeto não identificado.");
      if (!token) throw new Error("Token do Lovable não encontrado. Atualize a página e tente novamente.");
      if (!licenseKey) throw new Error("Licença não encontrada. Faça login novamente.");

      const result = await bgFetch(REMOVE_WATERMARK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "apikey": SUPABASE_ANON_KEY },
        body: JSON.stringify({
          license_key: licenseKey,
          token_lovable: token,
          project_id: projectId
        })
      });
      if (result && result.success === false) {
        throw new Error(result.error_display || result.message || "Falha ao remover marca d'água.");
      }
      showStatus("✓ Marca d'água removida com sucesso!", "success");
    } catch (err) {
      showStatus("✗ " + ((err && err.message) || "Falha ao remover marca d'água."), "error");
    } finally {
      tsRemoveWatermarkInFlight = false;
    }
  }

  // ===== Popup-only project download (no sidepanel required) =====
  function tsExtractLovableProjectIdFromUrl() {
    try {
      var m = String(location.pathname || "").match(/\/projects\/([^\/?#]+)/i);
      return m ? m[1] : "";
    } catch (_) { return ""; }
  }
  async function tsDownloadCurrentLovableProjectFromPopup() {
    var projectId = tsExtractLovableProjectIdFromUrl();
    if (!projectId) {
      try {
        var sd0 = await new Promise(function(r){ chrome.storage.local.get(['lovable_projectId'], r); });
        projectId = sd0 && sd0.lovable_projectId || "";
      } catch(_) {}
    }
    if (!projectId) { showStatus("✗ Projeto não identificado.", "error"); return; }

    showStatus("⏳ Preparando download…");
    var authToken = await tsResolveLovableToken({ forceRefresh: true });
    if (!authToken) {
      showStatus("✗ Token do Lovable não encontrado. Atualize a página e tente novamente.", "error");
      return;
    }

    showStatus("⏳ Buscando arquivos…");
    var dl = await new Promise(function(resolve){
      chrome.runtime.sendMessage({ action: "downloadProject", projectId: projectId, token: authToken }, function(resp){ resolve(resp); });
    });
    if (!dl || !dl.success || !Array.isArray(dl.files) || !dl.files.length) {
      showStatus("✗ " + ((dl && dl.error) || "Não foi possível baixar o projeto."), "error");
      return;
    }

    if (typeof JSZip === 'undefined') { showStatus("✗ JSZip não carregado.", "error"); return; }
    showStatus("⏳ Compactando projeto…");
    var zip = new JSZip();
    function isBin(name){ return /\.(png|jpe?g|gif|webp|svg|ico|bmp|tiff|pdf|woff2?|ttf|eot|mp4|webm|mp3|wav|zip)$/i.test(name||''); }
    var added = 0;
    for (var i = 0; i < dl.files.length; i++) {
      var f = dl.files[i];
      if (!f || !f.name || f.sizeExceeded) continue;
      if (f.contents && f.binary) { zip.file(f.name, f.contents, { base64: true, binary: true }); added++; }
      else if (!f.contents && isBin(f.name)) {
        try {
          var raw = await new Promise(function(resolve){
            chrome.runtime.sendMessage({ action: 'downloadProjectRawFile', projectId: projectId, path: f.name, token: authToken }, function(r){ resolve(r); });
          });
          if (raw && raw.success && Array.isArray(raw.data)) { zip.file(f.name, new Uint8Array(raw.data).buffer, { binary: true }); added++; }
          else if (f.contents) { zip.file(f.name, f.contents); added++; }
        } catch(_) { if (f.contents) { zip.file(f.name, f.contents); added++; } }
      } else if (f.contents) { zip.file(f.name, f.contents); added++; }
    }
    var blob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 9 } });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'lovable-project-' + projectId + '.zip';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(function(){ try { URL.revokeObjectURL(a.href); } catch(_) {} }, 1500);
    showStatus("✅ Download concluído (" + added + " arquivos).", "success");
  }
  try { window.tsDownloadCurrentLovableProjectFromPopup = tsDownloadCurrentLovableProjectFromPopup; } catch(_) {}


  // ===================== Composer read / write =====================
  function readComposerText(el) {
    if (!el) return "";
    if (el.tagName === "TEXTAREA" || el.tagName === "INPUT") return el.value || "";
    return el.innerText || el.textContent || "";
  }
  function clearComposer(el) {
    if (!el) return;
    if (el.tagName === "TEXTAREA" || el.tagName === "INPUT") {
      const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value") || Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value");
      if (setter && setter.set) setter.set.call(el, "");
      else el.value = "";
      el.dispatchEvent(new Event("input", { bubbles: true }));
    } else {
      el.innerHTML = "";
      el.dispatchEvent(new InputEvent("input", { bubbles: true }));
    }
  }

  // Reusable insert helper — used by prompt template menu.
  // Does NOT auto-send. If composer is non-empty, append with newline.
  function insertIntoNativeLovableTextarea(text) {
    const input = findNativeComposer();
    if (!input) {
      console.warn("[TS Popup] Native Lovable textarea not found");
      return false;
    }
    input.focus();
    const current = readComposerText(input);
    const next = current && current.trim()
      ? current.replace(/\s+$/, "") + "\n\n" + text
      : text;
    if (input.tagName === "TEXTAREA" || input.tagName === "INPUT") {
      const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value") || Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value");
      if (setter && setter.set) setter.set.call(input, next);
      else input.value = next;
      input.dispatchEvent(new Event("input", { bubbles: true }));
    } else if (input.isContentEditable || input.getAttribute("contenteditable") === "true") {
      input.textContent = next;
      input.dispatchEvent(new InputEvent("input", { bubbles: true }));
    }
    return true;
  }

  function sendPromptViaIframe(prompt, files) {
    tsDebug("[TS Native Send] files sent:", files || []);
    try {
      sendPromptNativeViaBackground(prompt, false, Array.isArray(files) ? files : []).then(async () => {
        try { showStatus("✓ Enviado pelo método da extensão", "success"); } catch (_) {}
        try {
          if (window.tsSavePopupPromptHistory) {
            var method = (window.tsGetSendMethod ? await window.tsGetSendMethod() : 'method_1');
            var pid = null;
            try { var m = location.pathname.match(/projects\/([^\/?#]+)/); if (m) pid = m[1]; } catch(_){}
            window.tsSavePopupPromptHistory(prompt, { projectId: pid, method: method, filesCount: (Array.isArray(files) ? files.length : 0) });
          }
        } catch(_){}
      }).catch((err) => {
        console.error("[TS Popup] envio direto falhou", err);
        try { showStatus("✗ " + ((err && err.message) || "Falha ao enviar."), "error"); } catch (_) {}
      });
      return true;
    } catch (err) {
      console.error("[TS Popup] envio direto indisponível", err);
      showStatus("✗ Falha ao enviar pelo método da extensão.", "error");
      return false;
    }
  }



  // ===== Unified popup native send handler =====
  // All paths (Enter on textarea, click on native send button, form submit)
  // must route through this single function. It NEVER falls back to Lovable's
  // own send — that would drop the extension's uploaded files[] from the payload.
  function handlePopupNativeSend() {
    tsDebug("[TS Popup] handlePopupNativeSend entered");
    const composer = findNativeComposer();
    const text = composer ? readComposerText(composer).trim() : "";
    const hasText = text.length > 0;
    const readyFiles = popupReadyUploads();
    const hasFiles = readyFiles.length > 0;
    tsDebug("[TS Popup] message:", text);
    tsDebug("[TS Popup] attachments before send:", popupAttachments);
    tsDebug("[TS Popup] ready files for payload:", readyFiles);

    if (popupHasPendingUploads()) {
      showStatus("⏳ Aguarde o upload da imagem finalizar antes de enviar.", "info");
      return false;
    }
    if (popupHasFailedUploads()) {
      showStatus("✗ Remova o anexo com falha antes de enviar.", "error");
      return false;
    }
    if (!hasText && !popupSelectedSkill && !hasFiles) {
      showStatus("⚠ Nada para enviar.", "error");
      return false;
    }

    if (composer) clearComposer(composer);
    let finalPrompt = text;
    if (popupSelectedSkill) {
      const pfx = popupSelectedSkill.prefix
        || (popupSelectedSkill.content ? popupSelectedSkill.content : "");
      finalPrompt = text ? (pfx + (pfx.endsWith(":") || pfx.endsWith(" ") ? "" : " ") + text) : pfx;
      clearPopupSelectedSkill();
    }
    const ok = sendPromptViaIframe(finalPrompt, readyFiles);
    if (ok === false && hasFiles) {
      showStatus("✗ Envio interceptado falhou. Verifique o console.", "error");
      return false;
    }
    // Limpa arquivos nativos capturados e previews do popup após despachar
    // o envio — evita reenviar a mesma imagem na próxima mensagem.
    try { window.__tsNativeLovableFiles = []; } catch (_) {}
    window.__tsNativeUploadPending = false;
    try { clearPopupAttachments(); } catch (_) {}
    showStatus("⏳ Enviando pelo método da extensão…");
    return true;
  }


  // Intercept Enter on the native composer in popup mode.
  document.addEventListener("keydown", (e) => {
    if (currentLayoutMode !== "popup") return;
    if (e.key !== "Enter" || e.shiftKey || e.isComposing) return;
    const target = e.target;
    if (!target || !(target.tagName === "TEXTAREA" || (target.getAttribute && target.getAttribute("contenteditable") === "true"))) return;
    if (target.closest && (target.closest(`#${ROOT_ID}`) || target.closest(`#${MENU_ID}`) || target.closest(`#${SUBMENU_ID}`))) return;
    const text = readComposerText(target).trim();
    if (!text && !popupSelectedSkill && !popupReadyUploads().length && !popupAttachments.length) return;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation?.();
    handlePopupNativeSend();
  }, true);

  // Intercept form submit in popup mode.
  document.addEventListener("submit", (e) => {
    if (currentLayoutMode !== "popup") return;
    const form = e.target;
    if (!form || !form.contains) return;
    const composer = findNativeComposer();
    if (!composer || !form.contains(composer)) return;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation?.();
    handlePopupNativeSend();
  }, true);





  // ===================== Native button interception =====================
  function findNativeMicButton() {
    const sels = [
      'button[aria-label*="mic" i]','button[aria-label*="voz" i]','button[aria-label*="voice" i]',
      'button[aria-label*="dicta" i]','button[aria-label*="speech" i]',
      'button[title*="mic" i]','button[title*="voz" i]',
    ];
    for (const s of sels) {
      for (const el of document.querySelectorAll(s)) {
        if (el.closest && el.closest(`#${ROOT_ID}`)) continue;
        if (el.offsetParent !== null) return el;
      }
    }
    return null;
  }
  function findNativeAttachButton() {
    // NOTE: we intentionally do NOT match the "+" / "Add" / "Plus" button anymore.
    // In the current Lovable UI, "+" opens a menu (Settings, History, …, Attach).
    // We let that menu open natively and intercept the "Attach" menu item instead
    // (see installNativeAttachMenuInterceptor). Only buttons whose label is
    // unambiguously about attaching files are bound here, for older UI variants.
    const sels = [
      'button[aria-label*="attach" i]','button[aria-label*="anexar" i]',
      'button[aria-label*="upload" i]','button[aria-label*="file" i]',
      'button[aria-label*="image" i]','button[aria-label*="imagem" i]',
      'button[title*="attach" i]','button[title*="anexar" i]',
      'button[title*="upload" i]','button[title*="image" i]',
      'label[for] input[type="file"]',
    ];
    for (const s of sels) {
      for (const raw of document.querySelectorAll(s)) {
        const el = raw.tagName === "INPUT" ? raw.closest("label") || raw : raw;
        if (!el) continue;
        if (el.closest && el.closest(`#${ROOT_ID}`)) continue;
        if (el.offsetParent !== null) return el;
      }
    }
    return null;
  }

  function findNativeSendButton() {
    const sels = [
      'button[aria-label*="send" i]','button[aria-label*="enviar" i]','button[aria-label*="submit" i]',
      'button[title*="send" i]','button[title*="enviar" i]','button[title*="submit" i]',
      'button[type="submit"]',
      'form button[type="submit"]',
    ];
    for (const s of sels) {
      for (const el of document.querySelectorAll(s)) {
        if (el.closest && el.closest(`#${ROOT_ID}`)) continue;
        if (el.offsetParent === null) continue;
        return el;
      }
    }
    // Heuristic: find icon-only button inside composer wrap with arrow/send svg.
    try {
      const wrap = findNativeComposerWrap();
      if (wrap) {
        const btns = wrap.querySelectorAll('button');
        for (const b of btns) {
          if (b.closest && b.closest(`#${ROOT_ID}`)) continue;
          if (b.offsetParent === null) continue;
          const txt = (b.innerText || b.textContent || "").trim();
          if (/^(➜|↑|→|send|enviar)$/i.test(txt)) return b;
          if (!txt) {
            const svg = b.querySelector('svg');
            if (svg) {
              const html = svg.outerHTML || "";
              if (/arrow-up|send|paper-plane|M12 19V5|M5 12l7-7|m5 12 7-7/i.test(html)) return b;
            }
          }
        }
      }
    } catch (_) {}
    return null;
  }


  function isPopupNativeModeActive() {
    return currentLayoutMode === "popup";
  }

  // Direct-bound interceptors (capture-phase) on the actual native buttons,
  // re-applied whenever DOM changes. This wins over Lovable's own handlers,
  // which sometimes open the file picker on pointerdown/mousedown.
  const TS_BOUND_FLAG = "__tsNativeBound";
  function bindNativeButtonHandlers() {
    if (!isPopupNativeModeActive()) return;
    // Do not bind or hijack Lovable's native attach button in popup mode.
    // Lovable must open its own file picker and perform its native upload flow.
    const mic = findNativeMicButton();
    if (mic && !mic[TS_BOUND_FLAG]) {
      mic[TS_BOUND_FLAG] = true;
      ["pointerdown","mousedown","click"].forEach((t) => {
        mic.addEventListener(t, (ev) => {
          if (!isPopupNativeModeActive()) return;
          ev.preventDefault();
          ev.stopPropagation();
          if (ev.stopImmediatePropagation) ev.stopImmediatePropagation();
          if (t === "click") togglePopupVoice();
        }, true);
      });
    }
    const send = findNativeSendButton();
    if (send && !send[TS_BOUND_FLAG]) {
      send[TS_BOUND_FLAG] = true;
      ["pointerdown","mousedown","click","keydown"].forEach((t) => {
        send.addEventListener(t, (ev) => {
          if (!isPopupNativeModeActive()) return;
          if (t === "keydown" && ev.key !== "Enter" && ev.key !== " ") return;
          ev.preventDefault();
          ev.stopPropagation();
          if (ev.stopImmediatePropagation) ev.stopImmediatePropagation();
          if (t === "click" || t === "keydown") handlePopupNativeSend();
        }, true);
      });
    }
  }


  let nativeInterceptorInstalled = false;
  function installNativeButtonInterceptors() {
    if (!nativeInterceptorInstalled) {
      nativeInterceptorInstalled = true;
      // Global capture-phase fallback for cases where direct binding misses
      // a re-rendered button (covers click/pointerdown/mousedown).
      ["pointerdown","mousedown","click"].forEach((t) => {
        document.addEventListener(t, (e) => {
          if (!isPopupNativeModeActive()) return;
          const target = e.target;
          if (!target || !target.closest) return;
          if (target.closest(`#${ROOT_ID}`) || target.closest(`#${MENU_ID}`) ||
              target.closest(`#${SUBMENU_ID}`) || target.closest(`#${LAUNCHER_ID}`)) return;
          const btn = target.closest("button, label");
          if (!btn) return;
          const mic = findNativeMicButton();
          const send = findNativeSendButton();
          if (mic && (btn === mic || mic.contains(btn))) {
            e.preventDefault(); e.stopPropagation();
            if (e.stopImmediatePropagation) e.stopImmediatePropagation();
            if (t === "click") togglePopupVoice();
            return;
          }
          if (send && (btn === send || send.contains(btn) || btn.contains(send))) {
            e.preventDefault(); e.stopPropagation();
            if (e.stopImmediatePropagation) e.stopImmediatePropagation();
            if (t === "click") handlePopupNativeSend();
            return;
          }

        }, true);
      });
    }
    bindNativeButtonHandlers();
    bindNativeDropHandlers();
    installNativeAttachMenuInterceptor();
  }

  // ===== Native "Attach" menu item interception (popup mode) =====
  // Lovable's "+" composer button opens a menu (Settings, History, Knowledge,
  // GitHub, Connectors, Take a screenshot, Add reference, Add skill, Attach…).
  // We let the menu open natively but hijack the "Attach" entry so the file
  // picker / upload flow runs through the extension instead of Lovable's.
  function closeNativeLovableMenuIfOpen() {
    try {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
      document.dispatchEvent(new KeyboardEvent("keyup",   { key: "Escape", bubbles: true }));
    } catch (_) {}
  }

  function isNativeAttachMenuItem(el) {
    if (!el || !el.closest) return false;
    if (el.closest(`#${ROOT_ID}`) || el.closest(`#${MENU_ID}`) ||
        el.closest(`#${SUBMENU_ID}`) || el.closest(`#${LAUNCHER_ID}`)) return false;
    const item = el.closest('[role="menuitem"], [role="option"], [cmdk-item], [data-radix-collection-item], li, button, div');
    if (!item) return false;
    // Must look like a menu entry — i.e. live inside a popover/menu/listbox/cmdk container.
    const inMenu = item.closest(
      '[role="menu"], [role="listbox"], [role="dialog"], [data-radix-popper-content-wrapper], [cmdk-root], [cmdk-list], [data-state="open"]'
    );
    if (!inMenu) return false;
    const txt = (item.innerText || item.textContent || "").trim().toLowerCase();
    if (!txt) return false;
    // Exact "attach" / "anexar" or short label starting with it. Avoid matching
    // long sentences like "attach a file to your message" inside tooltips.
    if (txt === "attach" || txt === "anexar") return true;
    if (txt.length <= 32 && (/^attach\b/.test(txt) || /^anexar\b/.test(txt))) return true;
    return false;
  }

  let nativeAttachMenuInterceptorInstalled = false;
  function installNativeAttachMenuInterceptor() {
    if (nativeAttachMenuInterceptorInstalled) return;
    nativeAttachMenuInterceptorInstalled = true;
    const handler = (ev) => {
      if (!isPopupNativeModeActive()) return;
      if (ev.type === "keydown" && ev.key !== "Enter" && ev.key !== " ") return;
      if (!isNativeAttachMenuItem(ev.target)) return;
      tsDebug("[TS Popup] Anexo nativo da Lovable liberado");
      return;
    };
    ["pointerdown","mousedown","click","keydown"].forEach((t) => {
      document.addEventListener(t, handler, true);
    });
  }


  // ===== Native drag-and-drop interception (popup mode) =====
  const ACCEPTED_DROP_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
  let __tsDropOverlayEl = null;
  let __tsGlobalDropBound = false;
  let __tsDragHideStyleInjected = false;

  function injectDragHideStyles() {
    if (__tsDragHideStyleInjected) return;
    __tsDragHideStyleInjected = true;
    const s = document.createElement("style");
    s.id = "ts-drag-hide-style";
    s.textContent = `
      html.ts-dragging-files [class*="dropzone" i],
      html.ts-dragging-files [class*="DropZone" i],
      html.ts-dragging-files [data-dropzone],
      html.ts-dragging-files [class*="drop-overlay" i],
      html.ts-dragging-files [class*="DropOverlay" i],
      html.ts-dragging-files [class*="file-drop" i] {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        pointer-events: none !important;
      }
    `;
    (document.head || document.documentElement).appendChild(s);
  }

  function hideLovableDropOverlays() {
    try {
      document.documentElement.classList.add("ts-dragging-files");
      // Hide any element whose visible text matches Lovable's drop overlay copy.
      const candidates = document.querySelectorAll("body *");
      const re = /(drop any files here|add files|add them to message)/i;
      for (const el of candidates) {
        if (el.id === "ts-drop-overlay") continue;
        if (el.closest("#" + ROOT_ID)) continue;
        const txt = (el.textContent || "").trim();
        if (txt.length > 0 && txt.length < 200 && re.test(txt)) {
          el.classList.add("ts-hide-lovable-drop-overlay");
          el.style.setProperty("display", "none", "important");
        }
      }
    } catch (_) {}
  }
  function unhideLovableDropOverlays() {
    try {
      document.documentElement.classList.remove("ts-dragging-files");
      document.querySelectorAll(".ts-hide-lovable-drop-overlay").forEach((el) => {
        el.classList.remove("ts-hide-lovable-drop-overlay");
        el.style.removeProperty("display");
      });
    } catch (_) {}
  }

  function ensureTsDropOverlay() {
    if (__tsDropOverlayEl && document.body.contains(__tsDropOverlayEl)) return __tsDropOverlayEl;
    const el = document.createElement("div");
    el.id = "ts-drop-overlay";
    el.style.cssText = [
      "position:fixed",
      "z-index:2147483646",
      "pointer-events:none",
      "display:none",
      "align-items:center",
      "justify-content:center",
      "border:2px dashed rgba(var(--ts-brand-primary-rgb), 0.9)",
      "background:rgba(var(--ts-brand-primary-rgb), 0.10)",
      "backdrop-filter:blur(2px)",
      "color:#fff",
      "font:600 14px/1.2 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif",
      "border-radius:14px",
      "box-shadow:0 8px 32px rgba(var(--ts-brand-primary-rgb), 0.35)",
    ].join(";");
    el.innerHTML = `<div style="background:rgba(20,20,28,0.85);padding:10px 16px;border-radius:10px;border:1px solid rgba(var(--ts-brand-primary-rgb), 0.6)">⬇ Solte para anexar imagem</div>`;
    document.body.appendChild(el);
    __tsDropOverlayEl = el;
    return el;
  }
  function showTsDropOverlay() {
    const el = ensureTsDropOverlay();
    const composer = findNativeComposerWrap() || findNativeComposer();
    if (composer) {
      const r = composer.getBoundingClientRect();
      const pad = 8;
      el.style.left = Math.max(8, r.left - pad) + "px";
      el.style.top = Math.max(8, r.top - pad) + "px";
      el.style.width = (r.width + pad * 2) + "px";
      el.style.height = (r.height + pad * 2) + "px";
    } else {
      el.style.left = "16px";
      el.style.top = "16px";
      el.style.width = (window.innerWidth - 32) + "px";
      el.style.height = (window.innerHeight - 32) + "px";
    }
    el.style.display = "flex";
    hideLovableDropOverlays();
  }
  function hideTsDropOverlay() {
    if (__tsDropOverlayEl) __tsDropOverlayEl.style.display = "none";
    unhideLovableDropOverlays();
  }

  let __tsDragLeaveTimer = null;
  function scheduleHideDropOverlay() {
    if (__tsDragLeaveTimer) clearTimeout(__tsDragLeaveTimer);
    __tsDragLeaveTimer = setTimeout(() => { hideTsDropOverlay(); }, 80);
  }
  function cancelHideDropOverlay() {
    if (__tsDragLeaveTimer) { clearTimeout(__tsDragLeaveTimer); __tsDragLeaveTimer = null; }
  }

  function eventHasFiles(ev) {
    try {
      const dt = ev.dataTransfer;
      if (!dt) return false;
      const types = Array.from(dt.types || []);
      return types.includes("Files") || types.includes("application/x-moz-file");
    } catch (_) { return false; }
  }

  function handleTsNativeDragDrop(ev) {
    if (!isPopupNativeModeActive()) return;
    if (!eventHasFiles(ev)) return;
    // Native popup mode must not intercept drag/drop. Let Lovable handle it.
    return;
  }

  function bindNativeDropHandlers() {
    if (__tsGlobalDropBound) return;
    __tsGlobalDropBound = true;
    injectDragHideStyles();
    const types = ["dragenter", "dragover", "dragleave", "drop"];
    const targets = [window, document, document.body].filter(Boolean);
    types.forEach((type) => {
      targets.forEach((t) => {
        try { t.addEventListener(type, handleTsNativeDragDrop, true); } catch (_) {}
      });
    });
    // End-of-drag cleanup safety net.
    window.addEventListener("dragend", () => { hideTsDropOverlay(); }, true);
  }
  // ===================== Init =====================
  function init() {
    if (!document.body) {
      document.addEventListener("DOMContentLoaded", init, { once: true });
      return;
    }
    injectGlobalStyles();
    buildOverlay();
    try {
      chrome.storage.local.get({ sidebarCollapsed: false, tsExtensionLayoutMode: "popup" }, (r) => {
        applyLayoutMode((r && r.tsExtensionLayoutMode) || "popup");
        applyCollapsedState(Boolean(r && r.sidebarCollapsed));
      });
    } catch (_) {
      applyLayoutMode("popup");
      applyCollapsedState(true);
    }
  }

  // Replace Lovable's "LOV 3" / "LOV3" / "Lov3.0" header label on chat
  // message cards generated by the extension (Synthetic Fix Error intent)
  // with the TS Community sender identity. We only touch leaf text nodes so
  // we never break Lovable's interactive controls.
  function getTsHeaderLabel() {
    function sanitize(v) {
      try {
        if (v === null || v === undefined) return "";
        var s = String(v).replace(/[\r\n\t]+/g, " ").trim();
        if (s.length > 40) s = s.slice(0, 40).trim();
        return s;
      } catch (_) { return ""; }
    }
    try {
      var cfg = (typeof window !== "undefined" && window.TS_BRANDING_CONFIG) || null;
      var active = (typeof window !== "undefined" && window.TS_ACTIVE_BRANDING) || null;
      var brand =
        sanitize(cfg && cfg.brandName) ||
        sanitize(cfg && cfg.extensionName) ||
        sanitize(active && active.brandName) ||
        sanitize(active && active.extensionName) ||
        (typeof window !== "undefined" && typeof window.tsBrandName === "function"
          ? sanitize(window.tsBrandName())
          : "") ||
        "TS Community";
      return "Enviado por ⚡ " + brand;
    } catch (_) {
      return "Enviado por ⚡ TS Community";
    }
  }
  // Pending-message queue: the extension posts TS_PENDING_SENT_MESSAGE via
  // background.js right before calling send-lovable-message. When Lovable
  // renders the resulting "Fix build error" card, we consume the queue entry
  // and decorate ONLY that card. Manual Fix Build Errors clicked in the
  // native UI don't produce a pending entry, so they're left untouched.
  try {
    if (!window.__TS_PENDING_SENT_MESSAGES__) window.__TS_PENDING_SENT_MESSAGES__ = [];
    if (!window.__TS_PENDING_LISTENER_INSTALLED__) {
      window.__TS_PENDING_LISTENER_INSTALLED__ = true;
      try {
        chrome.runtime.onMessage.addListener(function (msg) {
          if (!msg || msg.type !== "TS_PENDING_SENT_MESSAGE" || typeof msg.text !== "string") return;
          window.__TS_PENDING_SENT_MESSAGES__.push({
            text: msg.text, sentAt: msg.sentAt || Date.now(), consumed: false
          });
          try { console.log("[TS DECORATOR] pending message registered", { length: msg.text.length }); } catch (_) {}
          try { decorateTsSentMessages(document); } catch (_) {}
        });
      } catch (_) {}
    }
  } catch (_) {}

  const TS_HEADER_LABEL_RE = /^\s*(?:fix\s*build\s*error|fix\s*error)\s*$/i;

  function tsNormalize(v) {
    return String(v || "").replace(/\s+/g, " ").trim().toLowerCase();
  }

  function tsFindFixBuildLabelIn(root) {
    try {
      var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode: function (n) {
          var t = tsNormalize(n.nodeValue);
          return (t === "fix build error" || t === "fix error")
            ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
        }
      });
      return w.nextNode();
    } catch (_) { return null; }
  }

  function tsFindCardContainer(node) {
    var el = node && (node.nodeType === 1 ? node : node.parentElement);
    for (var i = 0; i < 20 && el; i++) {
      try {
        if (el.getAttribute) {
          if (el.getAttribute("data-message-id") || el.getAttribute("data-testid")) return el;
          if (el.tagName === "ARTICLE" || el.getAttribute("role") === "listitem") return el;
        }
      } catch (_) {}
      el = el.parentElement;
    }
    el = node && node.parentElement;
    for (var j = 0; j < 6 && el && el.parentElement; j++) el = el.parentElement;
    return el;
  }

  function tsGetNextPending() {
    var q = window.__TS_PENDING_SENT_MESSAGES__ || [];
    var now = Date.now();
    for (var i = 0; i < q.length; i++) {
      if (!q[i].consumed && (now - q[i].sentAt) <= 30000) return q[i];
    }
    return null;
  }

  function tsReplaceSyntheticBody(card, originalMessage) {
    try {
      var candidates = card.querySelectorAll("pre, code");
      for (var i = 0; i < candidates.length; i++) {
        var t = candidates[i].textContent || "";
        if (t.indexOf("Synthetic extension request.") !== -1 ||
            t.indexOf("For the code present") !== -1) {
          if (candidates[i].textContent !== originalMessage) {
            candidates[i].textContent = originalMessage;
          }
          return;
        }
      }
      var w = document.createTreeWalker(card, NodeFilter.SHOW_TEXT, null);
      var n;
      while ((n = w.nextNode())) {
        var v = n.nodeValue || "";
        if (v.indexOf("Synthetic extension request.") !== -1 ||
            v.indexOf("For the code present") !== -1) {
          n.nodeValue = originalMessage;
          return;
        }
      }
    } catch (_) {}
  }

  function decorateSpecialMessageLabel(card) {
    try {
      if (!card || !card.querySelectorAll) return;
      var nodes = card.querySelectorAll(".special-message");
      var HIDE_RE = /^(visual\s*edit|security\s*scan|scan\s*de\s*seguran[çc]a|security_scan|try\s*to\s*fix|fix\s*error)$/i;
      for (var i = 0; i < nodes.length; i++) {
        var el = nodes[i];
        if (el.dataset && el.dataset.tsLabelDecorated === "true") continue;
        var txt = (el.textContent || "").replace(/\s+/g, " ").trim();
        if (HIDE_RE.test(txt)) {
          el.textContent = "";
          el.style.display = "none";
          if (el.dataset) el.dataset.tsLabelDecorated = "true";
        }
      }
    } catch (_) {}
  }


  function ensureTsMessageDecoration(card) {
    if (!card || !card.dataset || card.dataset.tsExtensionMessage !== "true") return;
    var originalMessage = card.dataset.tsOriginalMessage || "";
    var expected = getTsHeaderLabel();
    try {
      var w = document.createTreeWalker(card, NodeFilter.SHOW_TEXT, {
        acceptNode: function (x) {
          return TS_HEADER_LABEL_RE.test(x.nodeValue || "")
            ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
        }
      });
      var h;
      while ((h = w.nextNode())) {
        if (h.nodeValue !== expected) h.nodeValue = expected;
      }
    } catch (_) {}
    if (originalMessage) tsReplaceSyntheticBody(card, originalMessage);
    decorateSpecialMessageLabel(card);
  }

  function decorateTsSentMessages(root) {
    try {
      var scope = (root && root.querySelectorAll) ? root : (document.body || document.documentElement);
      if (!scope) return;
      // 1) Re-apply decoration on cards Lovable re-rendered.
      var marked = scope.querySelectorAll ? scope.querySelectorAll('[data-ts-extension-message="true"]') : [];
      for (var i = 0; i < marked.length; i++) ensureTsMessageDecoration(marked[i]);

      // 2) Locate any un-decorated "Fix build error" card and associate it
      //    with the next pending entry in the queue.
      var scan = document.body || document.documentElement;
      if (!scan) return;
      var labelNode = tsFindFixBuildLabelIn(scan);
      var guard = 0;
      while (labelNode && guard++ < 8) {
        var card = tsFindCardContainer(labelNode);
        if (!card) break;
        if (card.dataset && card.dataset.tsExtensionMessage === "true") break;
        var pending = tsGetNextPending();
        if (!pending) return; // manual Fix Build Error → leave alone
        try { console.log("[TS DECORATOR] fix-build card found"); } catch (_) {}
        pending.consumed = true;
        try {
          card.dataset.tsExtensionMessage = "true";
          card.dataset.tsDecorated = "true";
          card.dataset.tsOriginalMessage = pending.text;
        } catch (_) {}
        ensureTsMessageDecoration(card);
        try { console.log("[TS DECORATOR] card decorated", { brand: "TS Community" }); } catch (_) {}
        break;
      }
    } catch (_) {}
  }

  // Back-compat alias so existing observer callsites keep working.
  var relabelLovHeaders = decorateTsSentMessages;

  // Single global observer for card re-renders / streamed text updates.
  try {
    if (!window.__TS_SENT_MESSAGE_OBSERVER__) {
      window.__TS_SENT_MESSAGE_OBSERVER__ = new MutationObserver(function () {
        decorateTsSentMessages(document);
      });
      var _tsStartObs = function () {
        try {
          window.__TS_SENT_MESSAGE_OBSERVER__.observe(document.documentElement, {
            childList: true, subtree: true, characterData: true
          });
        } catch (_) {}
      };
      if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", _tsStartObs);
      else _tsStartObs();
    }
  } catch (_) {}

  const observer = new MutationObserver(() => {
    if (!document.getElementById(STYLE_ID)) injectGlobalStyles();
    if (!document.getElementById(ROOT_ID)) {
      buildOverlay();
      try {
        chrome.storage.local.get({ sidebarCollapsed: false, tsExtensionLayoutMode: "popup" }, (r) => {
          applyLayoutMode((r && r.tsExtensionLayoutMode) || "popup");
          applyCollapsedState(Boolean(r && r.sidebarCollapsed));
        });
      } catch (_) {}
    }
    if (currentLayoutMode === "popup" && window.__tsLicenseReadyForPopup) {
      if (!document.getElementById(LAUNCHER_ID)) buildLauncher();
      updateComposerWrapMark();
      bindNativeButtonHandlers();
      bindNativeDropHandlers();
    } else if (!window.__tsLicenseReadyForPopup) {
      removeLauncher();
      removeNativeBadge();
      clearComposerWrapMark();
    }
    relabelLovHeaders(document.body);
  });
  try { observer.observe(document.documentElement, { childList: true, subtree: true }); } catch (_) {}
  try { relabelLovHeaders(document.body); } catch (_) {}

  try {
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area !== "local") return;
      if (changes.tsExtensionLayoutMode) applyLayoutMode(changes.tsExtensionLayoutMode.newValue || "popup");
      if (changes.sidebarCollapsed) applyCollapsedState(Boolean(changes.sidebarCollapsed.newValue));
    });
  } catch (_) {}

  try {
    window.addEventListener('TS_LICENSE_READY', () => {
      try {
        if (currentLayoutMode !== 'popup') return;
        buildLauncher();
        updateComposerWrapMark();
        bindNativeButtonHandlers();
        bindNativeDropHandlers();
        updateNativeBadge();
      } catch (_) {}
    });
  } catch (_) {}

  // ===================== Voice (popup native sink) =====================
  let recognition = null;
  let isRecording = false;
  let voiceSink = "iframe";
  let nativeVoiceBaseText = "";
  let nativeVoiceBuffer = "";

  function emitVoice(msg) {
    if (voiceSink === "native") {
      const composer = findNativeComposer();
      if (msg.type === "TS_VOICE_TRANSCRIPT" && composer) {
        nativeVoiceBuffer = msg.transcript || "";
        const baseText = nativeVoiceBaseText;
        const setter = composer.tagName === "TEXTAREA"
          ? Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value")
          : null;
        const newVal = baseText + (baseText && nativeVoiceBuffer ? " " : "") + nativeVoiceBuffer;
        if (setter && setter.set) setter.set.call(composer, newVal);
        else if (composer.tagName === "TEXTAREA") composer.value = newVal;
        else composer.innerText = newVal;
        composer.dispatchEvent(new Event("input", { bubbles: true }));
      } else if (msg.type === "TS_VOICE_STATUS") {
        const launcher = document.getElementById(LAUNCHER_ID);
        if (launcher) launcher.classList.toggle("ts-launcher-recording", Boolean(msg.listening));
        showStatus(msg.listening ? "🎙️ Ouvindo… (clique novamente para parar)" : "🎙️ Ditado finalizado");
      } else if (msg.type === "TS_VOICE_ERROR") {
        showStatus("✗ " + (msg.message || msg.error || "Erro no microfone"), "error");
        const launcher = document.getElementById(LAUNCHER_ID);
        if (launcher) launcher.classList.remove("ts-launcher-recording");
      }
      return;
    }
    // Popup-only build: voice output always targets the native Lovable composer.
    return;
  }

  function togglePopupVoice() {
    if (isRecording) { stopRecognition(); return; }
    const composer = findNativeComposer();
    if (!composer) { showStatus("✗ Composer nativo não encontrado.", "error"); return; }
    nativeVoiceBaseText = readComposerText(composer);
    nativeVoiceBuffer = "";
    voiceSink = "native";
    startRecognition();
  }
  function stopRecognition() {
    if (recognition) { try { recognition.stop(); } catch (_) {} }
  }
  async function startRecognition() {
    if (isRecording) return;
    const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Ctor) {
      emitVoice({ type: "TS_VOICE_ERROR", error: "unsupported", message: "Reconhecimento de voz não suportado." });
      return;
    }
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      emitVoice({ type: "TS_VOICE_ERROR", error: "no-mediadevices", message: "getUserMedia indisponível." });
      return;
    }
    let stream;
    try { stream = await navigator.mediaDevices.getUserMedia({ audio: true }); }
    catch (err) {
      emitVoice({ type: "TS_VOICE_ERROR", error: (err && err.name) || "unknown", message: (err && err.message) || "Falha ao acessar microfone." });
      return;
    }
    try { stream.getTracks().forEach((t) => t.stop()); } catch (_) {}
    try {
      const rec = new Ctor();
      rec.lang = "pt-BR";
      rec.continuous = true;
      rec.interimResults = true;
      rec.maxAlternatives = 1;
      let finalBuffer = "";
      rec.onstart = function () { isRecording = true; finalBuffer = ""; emitVoice({ type: "TS_VOICE_STATUS", listening: true }); };
      rec.onresult = function (event) {
        let interim = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const r = event.results[i];
          if (r.isFinal) finalBuffer += (finalBuffer ? " " : "") + r[0].transcript;
          else interim += r[0].transcript;
        }
        emitVoice({ type: "TS_VOICE_TRANSCRIPT", transcript: (finalBuffer + " " + interim).trim() });
      };
      rec.onerror = function (event) { emitVoice({ type: "TS_VOICE_ERROR", error: event.error || "unknown", message: String(event.error || "") }); };
      rec.onend = function () { isRecording = false; recognition = null; emitVoice({ type: "TS_VOICE_STATUS", listening: false }); };
      recognition = rec;
      rec.start();
    } catch (err) {
      isRecording = false; recognition = null;
      emitVoice({ type: "TS_VOICE_ERROR", error: (err && err.name) || "start-failed", message: (err && err.message) || "" });
    }
  }

  // ===================== Sidepanel -> Lovable native microphone bridge =====================
  let tsNativeDictationPolling = null;
  let tsNativeDictationLastText = "";

  function tsEmitNativeDictation(msg) {
    try { chrome.runtime.sendMessage(msg, () => void chrome.runtime.lastError); } catch (_) {}
  }

  function tsFindLovableNativeMicButton() {
    try {
      const all = Array.from(document.querySelectorAll('button, [role="button"], [aria-label], [title]'));
      return all.find((el) => {
        const idClass = `${el.id || ''} ${el.className || ''}`.toLowerCase();
        if (idClass.includes('ts-') || idClass.includes('ql-') || idClass.includes('sp-') || idClass.includes('extension')) return false;
        const label = [
          el.getAttribute && el.getAttribute('aria-label') || '',
          el.getAttribute && el.getAttribute('title') || '',
          el.textContent || ''
        ].join(' ').toLowerCase();
        return label.includes('microfone') || label.includes('microphone') || label.includes('mic') || label.includes('voz') || label.includes('voice') || label.includes('ditar') || label.includes('dictate');
      }) || null;
    } catch (_) { return null; }
  }

  function tsStartNativeDictationMirror() {
    const composer = findNativeComposer();
    tsNativeDictationLastText = composer ? readComposerText(composer) : '';
    tsEmitNativeDictation({ type: 'TS_NATIVE_DICTATION_STATUS', listening: true });
    if (tsNativeDictationPolling) clearInterval(tsNativeDictationPolling);
    const startedAt = Date.now();
    tsNativeDictationPolling = setInterval(() => {
      try {
        const c = findNativeComposer();
        const text = c ? readComposerText(c).trim() : '';
        if (text && text !== tsNativeDictationLastText) {
          tsNativeDictationLastText = text;
          tsEmitNativeDictation({ type: 'TS_NATIVE_DICTATION_TRANSCRIPT', transcript: text });
        }
        if (Date.now() - startedAt > 120000) tsStopNativeDictationMirror(false);
      } catch (_) {}
    }, 450);
  }

  function tsStopNativeDictationMirror(clickNative) {
    try { if (tsNativeDictationPolling) clearInterval(tsNativeDictationPolling); } catch (_) {}
    tsNativeDictationPolling = null;
    if (clickNative) {
      try { const btn = tsFindLovableNativeMicButton(); if (btn) btn.click(); } catch (_) {}
    }
    tsEmitNativeDictation({ type: 'TS_NATIVE_DICTATION_STATUS', listening: false });
  }

  function tsStartLovableNativeDictation() {
    const mic = tsFindLovableNativeMicButton();
    if (!mic) {
      tsEmitNativeDictation({ type: 'TS_NATIVE_DICTATION_ERROR', error: 'native-mic-not-found', message: 'Microfone nativo da Lovable não encontrado.' });
      return false;
    }
    try {
      mic.click();
      tsStartNativeDictationMirror();
      return true;
    } catch (err) {
      tsEmitNativeDictation({ type: 'TS_NATIVE_DICTATION_ERROR', error: 'click-failed', message: (err && err.message) || 'Falha ao acionar microfone nativo.' });
      return false;
    }
  }

  // ===================== postMessage handlers =====================
  window.addEventListener("message", (event) => {
    const data = event && event.data;
    if (!data || typeof data !== "object") return;
    if (data.type === "TS_VOICE_START") { voiceSink = "iframe"; startRecognition(); }
    else if (data.type === "TS_VOICE_STOP") { stopRecognition(); }
    else if (data.type === "TS_OVERLAY_SET_COLLAPSED") {
      applyCollapsedState(Boolean(data.collapsed));
      try { chrome.storage.local.set({ sidebarCollapsed: Boolean(data.collapsed) }); } catch (_) {}
    } else if (data.type === "TS_OVERLAY_SET_LAYOUT") {
      const mode = "popup";
      applyLayoutMode(mode);
      try { chrome.storage.local.set({ tsExtensionLayoutMode: mode }); } catch (_) {}
    } else if (data.type === "TS_OVERLAY_TEMPLATES") {
      if (Array.isArray(data.templates)) {
        promptTemplates = data.templates.slice(0, 24);
        if (document.getElementById(SUBMENU_ID)) openPromptsSubmenu();
      }
    } else if (data.type === "TS_POPUP_RESULT") {
      showStatus(data.message || (data.ok ? "✓ Concluído" : "✗ Falha"), data.ok ? "success" : "error");
    }
  });

  try {
    chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
      if (!msg) return;
      if (msg.type === "TS_TOGGLE_OVERLAY") {
        if (!window.__tsLicenseReadyForPopup) { try { showStatus && showStatus('Ative sua licença para usar o popup.', 'error'); } catch (_) {} return; }
        try { chrome.storage.local.set({ tsExtensionLayoutMode: "popup", sidebarCollapsed: true }); } catch (_) {}
        applyLayoutMode("popup");
        try {
          if (!document.getElementById(LAUNCHER_ID)) buildLauncher();
          toggleMenu();
        } catch (_) {}
      }
      if (msg.type === "TS_SHOW_FLOATING_LOGIN") {
        try { chrome.storage.local.set({ tsExtensionLayoutMode: "popup", sidebarCollapsed: true }); } catch (_) {}
        try { tsSetLicenseReadyState(false); } catch (_) {}
        try { removeLauncher(); removeNativeBadge(); clearComposerWrapMark(); } catch (_) {}
        try {
          const existing = document.getElementById("ql-floating");
          if (existing) showLicenseGate(existing);
          else _buildFloatingUI();
        } catch (_) {
          try { _buildFloatingUI(); } catch (_) {}
        }
      }
      if (msg.type === "TS_START_LOVABLE_NATIVE_DICTATION") {
        const ok = tsStartLovableNativeDictation();
        try { sendResponse && sendResponse({ ok: ok, error: ok ? null : 'native-mic-not-found' }); } catch (_) {}
        return true;
      }
      if (msg.type === "TS_STOP_LOVABLE_NATIVE_DICTATION") {
        tsStopNativeDictationMirror(true);
        try { sendResponse && sendResponse({ ok: true }); } catch (_) {}
        return true;
      }
    });
  } catch (_) {}

  // ===================== Slash Skills Picker (popup mode) =====================
  // Intercept "/" typed in the native Lovable composer (popup mode only),
  // suppress Lovable's native command menu, and render the extension's own
  // prompt picker anchored above the composer.
  const SLASH_ID = "ts-slash-skills";
  const SLASH_STYLE_ID = "ts-slash-skills-style";
  const SLASH_BODY_CLASS = "ts-slash-skills-active";
  let slashState = { open: false, query: "", items: [], index: 0, target: null };

  function injectSlashStyles() {
    if (document.getElementById(SLASH_STYLE_ID)) return;
    const s = document.createElement("style");
    s.id = SLASH_STYLE_ID;
    s.textContent = `
      body.${SLASH_BODY_CLASS} [role="listbox"]:not(#${SLASH_ID} *):not(#${SLASH_ID}),
      body.${SLASH_BODY_CLASS} [data-radix-popper-content-wrapper]:not(#${SLASH_ID} *),
      body.${SLASH_BODY_CLASS} [data-command]:not(#${SLASH_ID} *),
      body.${SLASH_BODY_CLASS} [data-radix-collection-item]:not(#${SLASH_ID} *),
      body.${SLASH_BODY_CLASS} [cmdk-root]:not(#${SLASH_ID} *),
      body.${SLASH_BODY_CLASS} [cmdk-list]:not(#${SLASH_ID} *),
      body.${SLASH_BODY_CLASS} [cmdk-item]:not(#${SLASH_ID} *) {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        pointer-events: none !important;
      }
      .ts-slash-skills-textarea-active {
        box-shadow:
          0 0 0 1px rgba(var(--ts-brand-primary-rgb), 0.55),
          0 0 18px rgba(var(--ts-brand-primary-rgb), 0.22) !important;
        border-radius: 12px !important;
        transition: box-shadow .18s ease !important;
      }
      #${SLASH_ID} {
        position: fixed;
        z-index: 2147483646;
        min-width: 320px;
        max-width: 460px;
        max-height: 340px;
        overflow: hidden;
        background: rgba(18, 18, 24, 0.96);
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
        border: 1px solid rgba(var(--ts-brand-primary-rgb), 0.45);
        border-radius: 14px;
        box-shadow: 0 18px 48px rgba(0,0,0,.45), 0 0 0 1px rgba(var(--ts-brand-primary-rgb), .25);
        color: #f5f5f7;
        font-family: -apple-system, BlinkMacSystemFont, "Inter", system-ui, sans-serif;
        font-size: 13px;
        opacity: 0;
        transform: translateY(6px);
        transition: opacity .14s ease, transform .14s ease;
        display: flex;
        flex-direction: column;
      }
      #${SLASH_ID}.ts-slash-open { opacity: 1; transform: translateY(0); }
      #${SLASH_ID} .ts-slash-head {
        display: flex; align-items: center; justify-content: space-between;
        padding: 8px 12px; border-bottom: 1px solid rgba(255,255,255,.06);
      }
      #${SLASH_ID} .ts-slash-title {
        display: flex; align-items: center; gap: 6px;
        font-size: 11px; letter-spacing: .08em; text-transform: uppercase;
        color: rgba(255,255,255,.65);
      }
      #${SLASH_ID} .ts-slash-badge {
        background: var(--ts-brand-gradient);
        color: #fff; padding: 2px 8px; border-radius: 999px;
        font-size: 10px; font-weight: 600; letter-spacing: .05em;
      }
      #${SLASH_ID} .ts-slash-hint { font-size: 10px; color: rgba(255,255,255,.4); }
      #${SLASH_ID} .ts-slash-list {
        list-style: none; margin: 0; padding: 6px;
        overflow-y: auto; max-height: 280px;
      }
      #${SLASH_ID} .ts-slash-item {
        display: flex; align-items: center; gap: 10px;
        padding: 8px 10px; border-radius: 8px; cursor: pointer;
        transition: background .12s ease;
      }
      #${SLASH_ID} .ts-slash-item:hover,
      #${SLASH_ID} .ts-slash-item.ts-active {
        background: rgba(var(--ts-brand-primary-rgb), 0.22);
      }
      #${SLASH_ID} .ts-slash-icon {
        width: 26px; height: 26px; border-radius: 8px;
        display: flex; align-items: center; justify-content: center;
        background: linear-gradient(135deg, rgba(var(--ts-brand-primary-rgb), .55), rgba(var(--ts-brand-primary-rgb), .45));
        font-size: 14px; flex-shrink: 0;
      }
      #${SLASH_ID} .ts-slash-label { flex: 1; font-weight: 500; color: #fff; }
      #${SLASH_ID} .ts-slash-preview {
        font-size: 11px; color: rgba(255,255,255,.45);
        overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        max-width: 180px;
      }
      #${SLASH_ID} .ts-slash-empty {
        padding: 18px; text-align: center; color: rgba(255,255,255,.5); font-size: 12px;
      }
    `;
    document.head.appendChild(s);
  }

  function isPopupSlashScopeActive() {
    return currentLayoutMode === "popup";
  }

  function isNativeComposerTarget(el) {
    if (!el) return false;
    if (el.closest && (el.closest(`#${ROOT_ID}`) || el.closest(`#${MENU_ID}`) || el.closest(`#${SUBMENU_ID}`) || el.closest(`#${SLASH_ID}`))) return false;
    if (el.tagName === "TEXTAREA") return true;
    if (el.getAttribute && el.getAttribute("contenteditable") === "true") return true;
    return false;
  }

  function parseSlashQuery(value) {
    if (typeof value !== "string") return null;
    const trimmed = value.replace(/^\s+/, "");
    if (!trimmed.startsWith("/")) return null;
    // Match "/" + optional word + optional space + rest
    const m = trimmed.match(/^\/([\p{L}\p{N}_-]*)(?:\s+([\s\S]*))?$/u);
    if (!m) return null;
    return { command: m[1] || "", rest: m[2] || "" };
  }

  function filterSlashItems(query) {
    const q = (query || "").toLowerCase().trim();
    const skills = getAvailableSkills();
    if (!q) return skills.slice(0, 50);
    return skills.filter((t) => {
      const lbl = String(t.label || "").toLowerCase();
      const pfx = String(t.prefix || "").toLowerCase();
      const dsc = String(t.description || "").toLowerCase();
      return lbl.includes(q) || pfx.includes(q) || dsc.includes(q);
    });
  }

  function ensureSlashPopover() {
    let pop = document.getElementById(SLASH_ID);
    if (pop) return pop;
    injectSlashStyles();
    pop = document.createElement("div");
    pop.id = SLASH_ID;
    pop.innerHTML = `
      <div class="ts-slash-head">
        <div class="ts-slash-title">
          <span class="ts-slash-badge">TS Skills</span>
        </div>
        <div class="ts-slash-hint">↑↓ navegar · Enter usar · Esc fechar</div>
      </div>
      <ul class="ts-slash-list" role="listbox"></ul>
    `;
    document.body.appendChild(pop);
    pop.addEventListener("mousedown", (e) => { e.preventDefault(); }); // prevent textarea blur
    return pop;
  }

  function positionSlashPopover() {
    const pop = document.getElementById(SLASH_ID);
    if (!pop || !slashState.target) return;
    const wrap = findNativeComposerWrap() || slashState.target;
    const r = wrap.getBoundingClientRect();
    const w = Math.min(460, Math.max(320, r.width));
    let left = r.left + (r.width - w) / 2;
    left = Math.max(8, Math.min(left, window.innerWidth - w - 8));
    pop.style.width = w + "px";
    pop.style.left = left + "px";
    // anchor above composer
    const popHeight = pop.offsetHeight || 280;
    let top = r.top - popHeight - 8;
    if (top < 8) top = r.bottom + 8;
    pop.style.top = top + "px";
  }

  function renderSlashList() {
    const pop = ensureSlashPopover();
    const list = pop.querySelector(".ts-slash-list");
    if (!list) return;
    const items = slashState.items;
    if (!items.length) {
      list.innerHTML = `<li class="ts-slash-empty">Nenhuma skill encontrada</li>`;
      return;
    }
    if (slashState.index >= items.length) slashState.index = 0;
    list.innerHTML = items.map((t, i) => {
      const active = i === slashState.index ? " ts-active" : "";
      const icon = String(t.icon || "⚡");
      const isSvg = icon.trim().startsWith("<svg");
      const iconHtml = isSvg ? icon : escapeHtml(icon);
      const preview = escapeHtml(String(t.prefix || t.description || "").slice(0, 80));
      return `<li class="ts-slash-item${active}" data-idx="${i}" role="option">
        <span class="ts-slash-icon">${iconHtml}</span>
        <span class="ts-slash-label">${escapeHtml(t.label || "")}</span>
        <span class="ts-slash-preview">${preview}</span>
      </li>`;
    }).join("");
    list.querySelectorAll(".ts-slash-item").forEach((li) => {
      li.addEventListener("mouseenter", () => {
        slashState.index = parseInt(li.getAttribute("data-idx"), 10) || 0;
        list.querySelectorAll(".ts-slash-item").forEach((x) => x.classList.toggle("ts-active", x === li));
      });
      li.addEventListener("click", (e) => {
        e.preventDefault(); e.stopPropagation();
        const idx = parseInt(li.getAttribute("data-idx"), 10) || 0;
        applySlashSelection(idx);
      });
    });
    const active = list.querySelector(".ts-slash-item.ts-active");
    if (active && active.scrollIntoView) active.scrollIntoView({ block: "nearest" });
  }

  function openSlashPicker(target, query) {
    refreshBuiltinSkillsFromEdge();
    slashState.target = target;
    slashState.query = query || "";
    slashState.items = filterSlashItems(slashState.query);
    slashState.index = 0;
    slashState.open = true;
    document.body.classList.add(SLASH_BODY_CLASS);
    const pop = ensureSlashPopover();
    renderSlashList();
    positionSlashPopover();
    requestAnimationFrame(() => { pop.classList.add("ts-slash-open"); positionSlashPopover(); });
    if (target && target.classList) target.classList.add("ts-slash-skills-textarea-active");
  }

  function updateSlashPicker(query) {
    if (!slashState.open) return;
    slashState.query = query || "";
    slashState.items = filterSlashItems(slashState.query);
    slashState.index = 0;
    renderSlashList();
    positionSlashPopover();
  }

  function closeSlashPicker() {
    slashState.open = false;
    document.body.classList.remove(SLASH_BODY_CLASS);
    const pop = document.getElementById(SLASH_ID);
    if (pop) pop.remove();
    if (slashState.target && slashState.target.classList) {
      slashState.target.classList.remove("ts-slash-skills-textarea-active");
    }
    slashState.target = null;
  }

  function applySlashSelection(idx) {
    const t = slashState.items[idx];
    const target = slashState.target;
    if (!t || !target) { closeSlashPicker(); return; }
    // Replace the "/query" portion with just the remaining text (no prefix in
    // the textarea). The picked skill is stored separately and rendered as a
    // badge above the composer; the prefix is added at send time.
    const currentVal = readComposerText(target);
    const parsed = parseSlashQuery(currentVal);
    const next = parsed && parsed.rest ? parsed.rest : "";
    if (target.tagName === "TEXTAREA" || target.tagName === "INPUT") {
      const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value")
        || Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value");
      if (setter && setter.set) setter.set.call(target, next);
      else target.value = next;
      target.dispatchEvent(new Event("input", { bubbles: true }));
    } else if (target.isContentEditable) {
      target.textContent = next;
      target.dispatchEvent(new InputEvent("input", { bubbles: true }));
    }
    setPopupSelectedSkill(t);
    target.focus();
    closeSlashPicker();
    try { showStatus("✓ Skill " + (t.label || t.name || "selecionada")); } catch (_) {}
  }

  // Capture-phase input handler: detect "/" at start of native composer
  function handleSlashInput(e) {
    if (!isPopupSlashScopeActive()) return;
    const target = e.target;
    if (!isNativeComposerTarget(target)) {
      if (slashState.open) closeSlashPicker();
      return;
    }
    const value = readComposerText(target);
    const parsed = parseSlashQuery(value);
    if (parsed) {
      if (!slashState.open) openSlashPicker(target, parsed.command);
      else updateSlashPicker(parsed.command);
    } else if (slashState.open) {
      closeSlashPicker();
    }
  }

  document.addEventListener("input", handleSlashInput, true);
  document.addEventListener("beforeinput", handleSlashInput, true);
  document.addEventListener("keyup", handleSlashInput, true);

  // Keyboard navigation within picker — must run before Lovable handlers (capture)
  document.addEventListener("keydown", (e) => {
    if (!slashState.open || !isPopupSlashScopeActive()) return;
    const target = e.target;
    if (!isNativeComposerTarget(target)) return;
    if (e.key === "ArrowDown") {
      e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation?.();
      slashState.index = Math.min(slashState.items.length - 1, slashState.index + 1);
      renderSlashList();
    } else if (e.key === "ArrowUp") {
      e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation?.();
      slashState.index = Math.max(0, slashState.index - 1);
      renderSlashList();
    } else if (e.key === "Enter" || e.key === "Tab") {
      if (e.shiftKey) return;
      e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation?.();
      applySlashSelection(slashState.index);
    } else if (e.key === "Escape") {
      e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation?.();
      closeSlashPicker();
    }
  }, true);

  // Close when clicking outside or composer loses focus
  document.addEventListener("focusout", (e) => {
    if (!slashState.open) return;
    setTimeout(() => {
      const ae = document.activeElement;
      if (slashState.open && !isNativeComposerTarget(ae) && !(ae && ae.closest && ae.closest(`#${SLASH_ID}`))) {
        closeSlashPicker();
      }
    }, 80);
  }, true);
  document.addEventListener("mousedown", (e) => {
    if (!slashState.open) return;
    const pop = document.getElementById(SLASH_ID);
    if (pop && pop.contains(e.target)) return;
    if (isNativeComposerTarget(e.target)) return;
    closeSlashPicker();
  }, true);
  window.addEventListener("resize", () => { if (slashState.open) positionSlashPopover(); });
  window.addEventListener("scroll", () => { if (slashState.open) positionSlashPopover(); }, true);

  // ============================================================
  // Migrar Cloud — modal + envio (reutiliza sendPromptViaIframe → security_scan)
  // ============================================================
  function ensureMigrateCloudStyles() {
    if (document.getElementById('ts-migrate-cloud-style')) return;
    const css = ''
      + '.ts-migrate-overlay{position:fixed;inset:0;background:rgba(6,8,14,0.72);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;z-index:2147483000;padding:16px;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;animation:tsMigFade .18s ease-out;}'
      + '@keyframes tsMigFade{from{opacity:0}to{opacity:1}}'
      + '.ts-migrate-modal{width:100%;max-width:640px;background:linear-gradient(180deg,rgba(22,24,32,0.98),rgba(14,16,22,0.98));border:1px solid rgba(255,255,255,0.08);border-radius:16px;box-shadow:0 30px 80px rgba(0,0,0,0.55);color:#e5e7eb;overflow:hidden;}'
      + '.ts-migrate-header{display:flex;align-items:center;gap:12px;padding:18px 18px 12px 18px;border-bottom:1px solid rgba(255,255,255,0.06);}'
      + '.ts-migrate-icon{width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px;background:linear-gradient(135deg,rgba(var(--ts-brand-primary-rgb),0.22),rgba(var(--ts-brand-primary-rgb),0.12));border:1px solid rgba(var(--ts-brand-primary-rgb),0.35);}'
      + '.ts-migrate-header h2{margin:0;font-size:15px;font-weight:600;color:#f3f4f6;}'
      + '.ts-migrate-header p{margin:2px 0 0 0;font-size:12px;color:#9ca3af;}'
      + '.ts-migrate-title-wrap{flex:1;min-width:0;}'
      + '.ts-migrate-close{margin-left:auto;background:transparent;border:1px solid rgba(255,255,255,0.08);color:#cbd5e1;width:30px;height:30px;border-radius:8px;cursor:pointer;font-size:16px;line-height:1;display:flex;align-items:center;justify-content:center;transition:all .15s;}'
      + '.ts-migrate-close:hover{background:rgba(255,255,255,0.06);color:#fff;}'
      + '.ts-migrate-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:16px;}'
      + '@media (max-width:560px){.ts-migrate-grid{grid-template-columns:1fr;}}'
      + '.ts-migrate-card{position:relative;text-align:left;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:14px 14px 44px 14px;cursor:pointer;color:#e5e7eb;transition:all .18s;display:flex;flex-direction:column;gap:6px;min-height:150px;font-family:inherit;}'
      + '.ts-migrate-card:hover{border-color:rgba(var(--ts-brand-primary-rgb),0.55);background:rgba(var(--ts-brand-primary-rgb),0.06);box-shadow:0 0 0 3px rgba(var(--ts-brand-primary-rgb),0.08);transform:translateY(-1px);}'
      + '.ts-migrate-card:disabled{opacity:.6;cursor:progress;}'
      + '.ts-migrate-card-icon{font-size:22px;line-height:1;}'
      + '.ts-migrate-card strong{font-size:13px;color:#f3f4f6;font-weight:600;}'
      + '.ts-migrate-card small{font-size:11.5px;line-height:1.4;color:#9ca3af;}'
      + '.ts-migrate-card em{position:absolute;bottom:12px;left:14px;font-style:normal;font-size:9.5px;font-weight:700;letter-spacing:.06em;color:var(--ts-brand-primary);background:rgba(var(--ts-brand-primary-rgb),0.14);border:1px solid rgba(var(--ts-brand-primary-rgb),0.35);padding:3px 7px;border-radius:999px;}'
      + '.ts-migrate-footer{padding:12px 18px 16px 18px;font-size:11.5px;color:#9ca3af;text-align:center;border-top:1px solid rgba(255,255,255,0.06);}';
    const s = document.createElement('style');
    s.id = 'ts-migrate-cloud-style';
    s.textContent = css;
    document.head.appendChild(s);
  }

  function closeMigrateCloudModalOverlay() {
    const el = document.getElementById('ts-migrate-cloud-overlay');
    if (el && el.parentNode) el.parentNode.removeChild(el);
  }

  function openMigrateCloudModalOverlay() {
    if (document.getElementById('ts-migrate-cloud-overlay')) return;
    ensureMigrateCloudStyles();
    const overlay = document.createElement('div');
    overlay.id = 'ts-migrate-cloud-overlay';
    overlay.className = 'ts-migrate-overlay';
    overlay.innerHTML = ''
      + '<div class="ts-migrate-modal" role="dialog" aria-modal="true" aria-labelledby="ts-migrate-title">'
      +   '<div class="ts-migrate-header">'
      +     '<div class="ts-migrate-icon">☁️</div>'
      +     '<div class="ts-migrate-title-wrap">'
      +       '<h2 id="ts-migrate-title">Migrar Cloud</h2>'
      +       '<p>Escolha uma ação para enviar automaticamente ao Lovable.</p>'
      +     '</div>'
      +     '<button type="button" class="ts-migrate-close" aria-label="Fechar">×</button>'
      +   '</div>'
      +   '<div class="ts-migrate-grid">'
      +     '<button type="button" class="ts-migrate-card" data-migrate-action="import-database">'
      +       '<span class="ts-migrate-card-icon">🗃️</span>'
      +       '<strong>Importar Banco de Dados</strong>'
      +       '<small>Gera um manual completo de instalação em /public com SQL, schema, buckets, RLS e passo a passo.</small>'
      +       '<em>MANUAL + SQL</em>'
      +     '</button>'
      +     '<button type="button" class="ts-migrate-card" data-migrate-action="connect-project">'
      +       '<span class="ts-migrate-card-icon">🔗</span>'
      +       '<strong>Conectar o Projeto</strong>'
      +       '<small>Remove a Supabase antiga e adapta o projeto para usar a Supabase conectada atualmente na Lovable.</small>'
      +       '<em>TROCAR SUPABASE</em>'
      +     '</button>'
      +   '</div>'
      +   '<div class="ts-migrate-footer">Revise as alterações geradas pelo Lovable antes de publicar.</div>'
      + '</div>';
    document.body.appendChild(overlay);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeMigrateCloudModalOverlay(); });
    const closeBtn = overlay.querySelector('.ts-migrate-close');
    if (closeBtn) closeBtn.addEventListener('click', closeMigrateCloudModalOverlay);
    const onKey = (e) => { if (e.key === 'Escape') { closeMigrateCloudModalOverlay(); document.removeEventListener('keydown', onKey); } };
    document.addEventListener('keydown', onKey);
    overlay.querySelectorAll('.ts-migrate-card').forEach((card) => {
      card.addEventListener('click', () => tsSendMigrateCloudPromptOverlay(card.getAttribute('data-migrate-action'), overlay));
    });
  }

  function tsSendMigrateCloudPromptOverlay(kind, overlayEl) {
    const prompt = kind === 'connect-project'
      ? (window.TS_MIGRATE_CONNECT_PROJECT_PROMPT || '')
      : (window.TS_MIGRATE_IMPORT_DATABASE_PROMPT || '');
    if (!prompt) return;

    // Precisa de projeto Lovable detectado
    let hasProject = false;
    try { hasProject = /\/projects\/[0-9a-fA-F-]{36}/i.test(location.pathname); } catch (_) {}
    if (!hasProject) {
      try { showStatus("Abra um projeto Lovable antes de usar o Migrar Cloud.", "error"); } catch (_) {}
      closeMigrateCloudModalOverlay();
      return;
    }

    try {
      overlayEl.querySelectorAll('.ts-migrate-card').forEach((c) => { c.disabled = true; });
    } catch (_) {}

    const ok = (typeof sendPromptViaIframe === 'function') ? sendPromptViaIframe(prompt) : false;
    if (ok) {
      try { showStatus("⏳ Enviando prompt de Migrar Cloud…"); } catch (_) {}
      closeMigrateCloudModalOverlay();
    } else {
      try { showStatus("Não foi possível enviar o prompt de migração. Tente novamente.", "error"); } catch (_) {}
      try { overlayEl.querySelectorAll('.ts-migrate-card').forEach((c) => { c.disabled = false; }); } catch (_) {}
    }
  }

  init();
})();

