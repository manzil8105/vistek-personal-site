"use client";

import { useEffect } from "react";

export default function GatewayAuthGuard() {
  useEffect(() => {
    // 1. immediately scrub the secret key from address bar and history if present
    if (window.location.search.includes("key=")) {
      const url = new URL(window.location.href);
      url.searchParams.delete("key");
      const cleanPath = url.pathname + (url.search ? url.search : "");
      window.history.replaceState({}, document.title, cleanPath);
    }

    // 2. hide container on pagehide so bfcache snapshots are blank
    const handlePageHide = () => {
      const container = document.getElementById("gateway-container");
      if (container) {
        container.style.visibility = "hidden";
      }
    };

    // 3. on pageshow, detect bfcache restoration (back/forward navigation)
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        // revived from bfcache after logout - redirect directly to homepage
        window.location.replace("/");
        return;
      }

      const container = document.getElementById("gateway-container");
      if (container) {
        container.style.visibility = "visible";
      }
    };

    window.addEventListener("pageshow", handlePageShow);
    window.addEventListener("pagehide", handlePageHide);

    return () => {
      window.removeEventListener("pageshow", handlePageShow);
      window.removeEventListener("pagehide", handlePageHide);
    };
  }, []);

  return null;
}

