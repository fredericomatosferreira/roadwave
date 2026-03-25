import { APP_URL } from "@/lib/config";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");
  if (!url) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  const match = url.match(/\/embed\/([a-zA-Z0-9_-]+)$/);
  if (!match) {
    return NextResponse.json({ error: "Invalid embed URL" }, { status: 400 });
  }

  // Reconstruct a safe URL from the validated slug to prevent XSS
  const slug = match[1];
  const safeUrl = `${APP_URL}/embed/${slug}`;

  return NextResponse.json({
    version: "1.0",
    type: "rich",
    provider_name: "RoadWave",
    provider_url: APP_URL,
    title: "RoadWave Roadmap",
    html: `<iframe src="${safeUrl}" width="100%" height="600" frameborder="0" style="border:0;"></iframe>`,
    width: 800,
    height: 600,
  });
}
