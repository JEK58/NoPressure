import { env } from "@/env.mjs";
import { type NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const authorization = req.headers.get("authorization");

  if (!(authorization === env.API_KEY)) {
    return new NextResponse(
      JSON.stringify({ success: false, message: "authentication failed" }),
      { status: 401, headers: { "content-type": "application/json" } },
    );
  }
}

export const config = {
  matcher: "/api/v1/:path*",
};
