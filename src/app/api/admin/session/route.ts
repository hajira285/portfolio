import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/adminAuth";

export async function GET(request: Request) {
  if (!verifyAdminSession(request)) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true });
}
