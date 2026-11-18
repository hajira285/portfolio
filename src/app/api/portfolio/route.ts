
import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!);

    const result = await sql`
      SELECT content, updated_at
      FROM portfolio_content
      WHERE id = 1
    `;

    return NextResponse.json({
      success: true,
      content: result[0]?.content ?? {},
      updatedAt: result[0]?.updated_at ?? null,
    });
  } catch (error) {
    console.error("Portfolio fetch error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to load portfolio data" },
      { status: 500 }
    );
  }
}
