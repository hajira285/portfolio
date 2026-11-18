
import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const result = await sql`SELECT NOW() AS time`;

    return NextResponse.json({
      success: true,
      message: "Neon database connected successfully!",
      time: result[0].time,
    });
  } catch (error) {
    console.error("Database error:", error);

    return NextResponse.json(
      { success: false, message: "Database connection failed" },
      { status: 500 }
    );
  }
}
