(function(){
  "use strict";
  var BRAND = {
    extensionName: "MR SEM LIMITES",
    brandName: "MR SEM LIMITES",
    primaryColor: "#3B82F6",
    hoverColor: "#2563EB",
    logoUrl: "images/logo_login_icon.png",
    headerLogoUrl: "images/logo_horizontal.png",
    headerWidth: "180px",
    whatsappLinks: {
      sales: "https://wa.me/5518981868677",
      support: "https://wa.me/5518981868677",
      community: "https://wa.me/5518981868677"
    }
  };

  function assetUrl(url) {
    if (!url || /^data:|^https?:|^chrome-extension:/i.test(url)) return url;
    try { if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.getURL) return chrome.runtime.getURL(url); } catch (_) {}
    return url;
  }

  function hexToRgb(hex) {
    var clean = String(hex || "").replace("#", "").trim();
    var value = parseInt(clean, 16);
    if (Number.isNaN(value)) return "59, 130, 246";
    return ((value >> 16) & 255) + ", " + ((value >> 8) & 255) + ", " + (value & 255);
  }

  var logo = assetUrl(BRAND.logoUrl),
      headerLogo = assetUrl(BRAND.headerLogoUrl),
      rgb = hexToRgb(BRAND.primaryColor);

  window.TS_BRANDING_CONFIG = {
    extensionName: BRAND.extensionName,
    brandName: BRAND.brandName,
    primaryColor: BRAND.primaryColor,
    defaultTheme: "dark",
    logoUrl: logo,
    logoExtendedUrl: headerLogo,
    whatsappLinks: BRAND.whatsappLinks,
    links: {
      sales: BRAND.whatsappLinks.sales,
      support: BRAND.whatsappLinks.support,
      community: BRAND.whatsappLinks.community,
      discord: BRAND.whatsappLinks.community
    }
  };
  window.TS_ACTIVE_BRANDING = window.TS_BRANDING_CONFIG;
  window.tsBrandName = function() { return BRAND.brandName; };

  function setVars() {
    if (!document || !document.documentElement) return;
    var s = document.documentElement.style;
    s.setProperty("--ts-brand-primary", BRAND.primaryColor);
    s.setProperty("--ts-brand-primary-rgb", rgb);
    s.setProperty("--ts-brand-primary-hover", BRAND.hoverColor);
    s.setProperty("--ts-brand-primary-soft", "rgba(" + rgb + ",0.14)");
    s.setProperty("--ts-brand-primary-border", "rgba(" + rgb + ",0.42)");
    s.setProperty("--ts-brand-primary-glow", "rgba(" + rgb + ",0.48)");
    s.setProperty("--ts-brand-gradient", "linear-gradient(135deg," + BRAND.primaryColor + "," + BRAND.hoverColor + ")");
    s.setProperty("--brand-color", BRAND.primaryColor);
    s.setProperty("--brand-color-rgb", rgb);
    s.setProperty("--brand-color-hover", BRAND.hoverColor);
  }

  setVars();
})();
