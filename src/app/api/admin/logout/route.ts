import { NextResponse } from "next/server";
import { deleteSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export async function POST() {
  await deleteSession();
  revalidatePath("/", "layout");
  revalidatePath("/admin", "layout");

  const response = NextResponse.json({ success: true });
  response.headers.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0"
  );
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");
  return response;
}

