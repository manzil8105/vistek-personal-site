import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt, encrypt } from "@/lib/session";

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
  Pragma: "no-cache",
  Expires: "0",
};

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (path === "/gateway-override") {
    // if already authenticated as admin, redirect to admin dashboard
    const adminCookie = request.cookies.get("admin_session")?.value;
    const adminSession = adminCookie ? await decrypt(adminCookie) : null;
    if (adminSession?.adminId) {
      const redirectAdmin = NextResponse.redirect(new URL("/admin", request.url));
      Object.entries(NO_CACHE_HEADERS).forEach(([k, v]) => {
        redirectAdmin.headers.set(k, v);
      });
      return redirectAdmin;
    }

    const key = request.nextUrl.searchParams.get("key");

    // if key is provided in query params
    if (key) {
      if (key !== process.env.ADMIN_SECRET_KEY) {
        // invalid key: return 404
        return new NextResponse(null, { status: 404 });
      }

      // valid secret key: grant gateway session cookie and immediately redirect to clean URL
      const expires = new Date(Date.now() + 15 * 60 * 1000);
      const gatewayToken = await encrypt({ gateway: true, expires });

      const cleanUrl = new URL("/gateway-override", request.url);
      const errorParam = request.nextUrl.searchParams.get("error");
      if (errorParam) {
        cleanUrl.searchParams.set("error", errorParam);
      }

      const redirectClean = NextResponse.redirect(cleanUrl);
      redirectClean.cookies.set("gateway_auth", gatewayToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        expires: expires,
        sameSite: "lax",
        path: "/",
      });
      Object.entries(NO_CACHE_HEADERS).forEach(([k, v]) => {
        redirectClean.headers.set(k, v);
      });
      return redirectClean;
    }

    // if no key in URL, check for active gateway authorization cookie
    const gatewayCookie = request.cookies.get("gateway_auth")?.value;
    const gatewaySession = gatewayCookie ? await decrypt(gatewayCookie) : null;

    if (gatewaySession?.gateway) {
      const response = NextResponse.next();
      Object.entries(NO_CACHE_HEADERS).forEach(([k, v]) => {
        response.headers.set(k, v);
      });
      return response;
    }

    // no valid key and no active gateway session (e.g. after logout or direct navigation)
    // silently redirect to homepage so user can only roam around public feed
    const redirectHome = NextResponse.redirect(new URL("/", request.url));
    Object.entries(NO_CACHE_HEADERS).forEach(([k, v]) => {
      redirectHome.headers.set(k, v);
    });
    return redirectHome;
  }

  if (path.startsWith("/admin") || path.startsWith("/api/admin")) {
    const cookie = request.cookies.get("admin_session")?.value;
    const session = cookie ? await decrypt(cookie) : null;

    // if unauthenticated, prevent access and reject or redirect
    if (!session || !session.adminId) {
      if (path.startsWith("/api/")) {
        const unauthorizedResponse = NextResponse.json(
          { authenticated: false, error: "Unauthorized" },
          { status: 401 }
        );
        Object.entries(NO_CACHE_HEADERS).forEach(([k, v]) => {
          unauthorizedResponse.headers.set(k, v);
        });
        return unauthorizedResponse;
      }

      // if a random person guesses link or a logged-out admin navigates back, bounce them to the homepage.
      // this also hides the existence of the secret login route.
      const redirectResponse = NextResponse.redirect(new URL("/", request.url));
      Object.entries(NO_CACHE_HEADERS).forEach(([k, v]) => {
        redirectResponse.headers.set(k, v);
      });
      return redirectResponse;
    }

    // authenticated admin request: ensure sensitive responses are never cached by browsers
    const response = NextResponse.next();
    Object.entries(NO_CACHE_HEADERS).forEach(([k, v]) => {
      response.headers.set(k, v);
    });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/gateway-override"],
};

