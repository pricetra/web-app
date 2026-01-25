import { NextRequest, NextResponse } from "next/server";
import { AUTH_TOKEN_KEY } from "@/lib/cookies";
import { adminAuthorize, authorize } from "@/lib/roles";

const blockedAgents = ["bytedance", "bytespider"];

export default async function middleware(req: NextRequest) {
  const userAgent = req.headers.get("user-agent");
  if (userAgent) {
    const agent = userAgent.toLowerCase();
    if (blockedAgents.some((l) => agent.includes(l))) {
      return new NextResponse("Bot access forbidden", { status: 403 });
    }
  }

  const curPath = req.nextUrl.pathname;
  const authToken = req.cookies.get(AUTH_TOKEN_KEY)?.value;
  if (curPath.startsWith("/admin")) {
    const authUser = await adminAuthorize(authToken);
    if (!authUser) return NextResponse.redirect(new URL("/", req.url));
  }

  if (curPath.startsWith("/profile")) {
    const authUser = await authorize(authToken);
    if (!authUser) return NextResponse.redirect(new URL(`/auth/login?return=${curPath}`, req.url));
  }
}

export const config = {
  matcher: ["/:path*", "/admin/:path*", "/profile/:path*"],
};
