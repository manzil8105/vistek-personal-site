"use server";

import { db } from "@/db";
import { admins } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { createSession, deleteSession, deleteGatewaySession, verifyGatewaySession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { redirect, RedirectType } from "next/navigation";

export async function loginAdmin(formData: FormData): Promise<void> {
  const isGatewayAuth = await verifyGatewaySession();
  const secretKey = formData.get("secretKey") as string;
  const isKeyValid = secretKey && secretKey === process.env.ADMIN_SECRET_KEY;

  // if neither gateway session nor valid secret key is provided, reject request
  if (!isGatewayAuth && !isKeyValid) {
    redirect("/");
  }

  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password) {
    redirect("/gateway-override?error=Missing_fields");
  }

  const adminUsers = await db
    .select()
    .from(admins)
    .where(eq(admins.username, username));
  const admin = adminUsers[0];

  if (!admin) {
    redirect("/gateway-override?error=Invalid_credentials");
  }

  const isValid = await bcrypt.compare(password, admin.passwordHash);
  if (!isValid) {
    redirect("/gateway-override?error=Invalid_credentials");
  }

  // make admin session and revoke temporary gateway authorization
  await createSession(admin.id);
  await deleteGatewaySession();
  redirect("/admin", RedirectType.replace);
}

export async function logoutAdmin(): Promise<void> {
  await deleteSession();
  await deleteGatewaySession();
  revalidatePath("/", "layout");
  revalidatePath("/admin", "layout");
  revalidatePath("/gateway-override", "layout");
  redirect("/", RedirectType.replace);
}

