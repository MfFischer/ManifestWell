import { NextResponse } from "next/server";

// Required for static export
export const dynamic = "force-static";

export async function GET() {
  return NextResponse.json({ message: "Hello, world!" });
}