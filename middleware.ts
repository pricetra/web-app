import { NextRequest, NextResponse } from "next/server";
import { AUTH_TOKEN_KEY } from "@/lib/cookies";
import { adminAuthorize, authorize } from "@/lib/roles";

const blockedAgents = ["bytedance", "bytespider"];

export default async function middleware(req: NextRequest) {
  const reqHeaders = new Headers(req.headers);
  reqHeaders.set('x-url', req.url);

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

  // Stores
  if (curPath.startsWith("/stores")) {
    if (curPath.includes("/promotions/")) {
      if (curPath.includes("/edit")) {
        // TODO: Parse store slug and flyer uid from the URL and check if the user has access to that store and flyer. If not, return a 403 response.
        const authUser = await authorize(authToken);
        if (!authUser) return NextResponse.redirect(new URL(`/auth/login?return=${curPath}`, req.url));

        // Example of parsing the URL: /stores/:storeSlug/promotions/:flyerUid/edit
        const pathParts = curPath.split("/");
        const storeSlug = pathParts[2];
        const flyerUid = pathParts[4];
        if (pathParts[5] !== "edit") {
          return new NextResponse("Invalid URL", { status: 400 });
        }
      }
    }
  }

  return NextResponse.next({
    request: {
      headers: reqHeaders,
    }
  })
}

export const config = {
  matcher: ["/:path*", "/admin/:path*", "/profile/:path*"],
};
