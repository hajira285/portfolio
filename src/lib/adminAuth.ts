
import { createHmac, timingSafeEqual } from "crypto";

export function verifyAdminSession(request: Request): boolean {
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!secret) return false;

  const cookieHeader = request.headers.get("cookie") || "";

  const sessionCookie = cookieHeader
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith("admin_session="));

  if (!sessionCookie) return false;

  const token = sessionCookie.slice("admin_session=".length);
  const [payload, signature] = token.split(".");

  if (!payload || !signature) return false;

  try {
    const expectedSignature = createHmac("sha256", secret)
      .update(payload)
      .digest("base64url");

    const actual = Buffer.from(signature);
    const expected = Buffer.from(expectedSignature);

    if (
      actual.length !== expected.length ||
      !timingSafeEqual(actual, expected)
    ) {
      return false;
    }

    const data = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8")
    );

    return (
      typeof data.expires === "number" &&
      data.expires > Date.now()
    );
  } catch {
    return false;
  }
}
