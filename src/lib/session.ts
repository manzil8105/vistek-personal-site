import { SignJWT, jwtVerify, JWTPayload } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const secretKey = process.env.JWT_SECRET;
const key = new TextEncoder().encode(secretKey);

export interface AdminSessionPayload extends JWTPayload {
  adminId?: string;
  gateway?: boolean;
  expires?: Date | string;
}

export async function encrypt(payload: AdminSessionPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d") // sessions last 7 days
    .sign(key);
}

export async function decrypt(input: string): Promise<AdminSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(input, key, { algorithms: ["HS256"] });
    return payload as AdminSessionPayload;
  } catch {
    return null;
  }
}

export async function createSession(adminId: string) {
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const session = await encrypt({ adminId, expires });

  const cookieStore = await cookies();
  cookieStore.set("admin_session", session, {
    httpOnly: true, // prevents XSS attacks
    secure: process.env.NODE_ENV === "production",
    expires: expires,
    sameSite: "lax",
    path: "/",
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  cookieStore.set("admin_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(0),
    maxAge: 0,
    sameSite: "lax",
    path: "/",
  });
  await deleteGatewaySession();
}

export async function createGatewaySession() {
  const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes window to authenticate
  const token = await encrypt({ gateway: true, expires });

  const cookieStore = await cookies();
  cookieStore.set("gateway_auth", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expires,
    sameSite: "lax",
    path: "/",
  });
}

export async function verifyGatewaySession(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("gateway_auth")?.value;
    if (!token) {
      return false;
    }
    const payload = await decrypt(token);
    return Boolean(payload?.gateway);
  } catch {
    return false;
  }
}

export async function deleteGatewaySession() {
  const cookieStore = await cookies();
  cookieStore.delete("gateway_auth");
  cookieStore.set("gateway_auth", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(0),
    maxAge: 0,
    sameSite: "lax",
    path: "/",
  });
}

export async function verifyAdminSession(): Promise<AdminSessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("admin_session")?.value;
    if (!sessionCookie) {
      return null;
    }
    const session = await decrypt(sessionCookie);
    if (!session || !session.adminId) {
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export async function requireAdminSession(): Promise<AdminSessionPayload> {
  const session = await verifyAdminSession();
  if (!session) {
    redirect("/");
  }
  return session;
}


