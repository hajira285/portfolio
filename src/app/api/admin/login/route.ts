
import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    const adminPassword = process.env.ADMIN_PASSWORD;
    const secret = process.env.ADMIN_SESSION_SECRET;

    if (!adminPassword || !secret) {
      return NextResponse.json(
        { success: false, message: "Server security is not configured." },
        { status: 500 }
      );
    }

    if (typeof password !== "string") {
      return NextResponse.json(
        { success: false, message: "Invalid password." },
        { status: 400 }
      );
    }

    const submitted = Buffer.from(password);
    const expected = Buffer.from(adminPassword);

    if (
      submitted.length !== expected.length ||
      !timingSafeEqual(submitted, expected)
    ) {
      return NextResponse.json(
        { success: false, message: "Incorrect password." },
        { status: 401 }
      );
    }

    const expires = Date.now() + 7 * 24 * 60 * 60 * 1000;
    const payload = Buffer.from(
      JSON.stringify({ expires })
    ).toString("base64url");

    const signature = createHmac("sha256", secret)
      .update(payload)
      .digest("base64url");

    const response = NextResponse.json({
      success: true,
      message: "Login successful.",
    });

    response.cookies.set("admin_session", `${payload}.${signature}`, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch {
    return NextResponse.json(
      { success: false, message: "Login failed." },
      { status: 500 }
    );
  }
}
