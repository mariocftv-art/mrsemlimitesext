(function(){
  "use strict";
  var BRAND = {
    extensionName: "MR Sem Limites",
    brandName: "MR Sem Limites",
    version: "17.2.9",
    buildId: "BUILD-17.2.9-Q7Y8R9N1",
    timestamp: "2026-08-08T08:00:50Z",
    uuid: "550e8400-e29b-41d4-a716-446655440001",
    primaryColor: "#00f2ff",
    hoverColor: "#00d8e6",
    logoUrl: "icon.png",
    headerLogoUrl: "icon.png",
    headerWidth: "180px",
    whatsappLinks: {
      sales: "https://wa.me/5518981868677",
      support: "https://wa.me/5518981868677",
      community: "https://wa.me/5518981868677"
    }
  };
  window.TS_BRANDING_CONFIG = BRAND;
  window.TS_ACTIVE_BRANDING = BRAND;
  window.tsBrandName = function() { return BRAND.brandName; };
  if(document.documentElement) {
    document.documentElement.style.setProperty("--ts-brand-primary", BRAND.primaryColor);
    document.documentElement.style.setProperty("--brand-color", BRAND.primaryColor);
  }
})();
