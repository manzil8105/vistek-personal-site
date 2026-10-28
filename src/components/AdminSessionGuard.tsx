"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminSessionGuard() {
  const router = useRouter();

  useEffect(() => {
    // 1. hide content on pagehide so bfcache snapshots never reveal sensitive content
    const handlePageHide = () => {
      const container = document.getElementById("admin-container");
      if (container) {
        container.style.visibility = "hidden";
      }
    };

    // 2. on pageshow, detect bfcache restoration (back/forward navigation)
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        // page was restored from bfcache after navigation!
        // immediately redirect to homepage to force server revalidation
        window.location.replace("/");
        return;
      }

      // if normal page load, verify session and show container
      verifySession();
    };

    // 3. verify session with server endpoint
    const verifySession = async () => {
      try {
        const res = await fetch("/api/admin/verify", {
          method: "GET",
          cache: "no-store",
        });

        if (!res.ok) {
          const container = document.getElementById("admin-container");
          if (container) {
            container.style.visibility = "hidden";
          }
          window.location.replace("/");
        } else {
          const container = document.getElementById("admin-container");
          if (container) {
            container.style.visibility = "visible";
          }
        }
      } catch {
        window.location.replace("/");
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        verifySession();
      }
    };

    const handleFocus = () => {
      verifySession();
    };

    const handlePopState = () => {
      verifySession();
    };

    window.addEventListener("pageshow", handlePageShow);
    window.addEventListener("pagehide", handlePageHide);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("popstate", handlePopState);

    // initial verification on component mount
    verifySession();

    return () => {
      window.removeEventListener("pageshow", handlePageShow);
      window.removeEventListener("pagehide", handlePageHide);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [router]);

  return null;
}

